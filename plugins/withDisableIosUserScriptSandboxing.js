const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const SANDBOX_BUILD_SETTING = "ENABLE_USER_SCRIPT_SANDBOXING";

const PODFILE_PATCH = `
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['${SANDBOX_BUILD_SETTING}'] = 'NO'
      end
    end
`;

function withDisableIosUserScriptSandboxing(config) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, "Podfile");
      let contents = await fs.promises.readFile(podfilePath, "utf8");

      if (contents.includes(SANDBOX_BUILD_SETTING)) {
        return config;
      }

      const postInstallCall =
        /    react_native_post_install\(\n      installer,\n      config\[:reactNativePath\],\n      :mac_catalyst_enabled => false,\n      :ccache_enabled => ccache_enabled\?\(podfile_properties\),\n    \)\n/;

      if (!postInstallCall.test(contents)) {
        throw new Error("Could not patch the iOS Podfile post_install hook.");
      }

      contents = contents.replace(postInstallCall, (match) => `${match}${PODFILE_PATCH}`);
      await fs.promises.writeFile(podfilePath, contents);

      return config;
    }
  ]);
}

module.exports = withDisableIosUserScriptSandboxing;
