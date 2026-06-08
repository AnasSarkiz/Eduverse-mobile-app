function parseLocationFromScriptUrl(scriptUrl) {
  const match = typeof scriptUrl === "string" ? scriptUrl.match(/^(https?):\/\/([^/]+)/) : null;

  if (!match) {
    return null;
  }

  const [, protocolWithoutColon, host] = match;
  const [hostname, port = ""] = host.split(":");
  const protocol = `${protocolWithoutColon}:`;
  const origin = `${protocol}//${host}`;

  return {
    host,
    hostname,
    href: `${origin}/`,
    origin,
    port,
    protocol,
    reload() {}
  };
}

function readMetroLocation() {
  try {
    const { NativeModules } = require("react-native");
    return parseLocationFromScriptUrl(NativeModules?.SourceCode?.scriptURL);
  } catch {
    return null;
  }
}

const globalObject = globalThis;
const nativeLocation =
  readMetroLocation() ??
  parseLocationFromScriptUrl(process.env.EXPO_PUBLIC_METRO_URL) ??
  parseLocationFromScriptUrl("http://localhost:8081");

globalObject.window = globalObject.window ?? globalObject;
globalObject.window.location = globalObject.window.location ?? nativeLocation;
globalObject.location = globalObject.location ?? globalObject.window.location;

if (!("document" in globalObject)) {
  globalObject.document = undefined;
}

