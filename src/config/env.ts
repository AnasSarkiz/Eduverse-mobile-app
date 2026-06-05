type EnvMap = Record<string, string | undefined>;

type RuntimeExtra = {
  eduverseApiBaseUrl?: string;
  supabasePublishableKey?: string;
  supabaseUrl?: string;
};

type ExpoConstantsModule = {
  default?: ExpoConstantsModule;
  expoConfig?: {
    extra?: RuntimeExtra;
  };
  manifest?: {
    extra?: RuntimeExtra;
  };
};

const DEFAULT_EDUVERSE_API_BASE_URL = "https://eduverse-demo.vercel.app";

function getRuntimeExtra(): RuntimeExtra {
  try {
    const constantsModule = require("expo-constants") as ExpoConstantsModule;
    const constants = constantsModule.default ?? constantsModule;

    return constants.expoConfig?.extra ?? constants.manifest?.extra ?? {};
  } catch {
    return {};
  }
}

export function getSupabaseConfig(env: EnvMap = process.env, extra: RuntimeExtra = getRuntimeExtra()) {
  return {
    publishableKey:
      env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? extra.supabasePublishableKey ?? env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
    url: env.EXPO_PUBLIC_SUPABASE_URL ?? extra.supabaseUrl ?? env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  };
}

export function getEduverseApiBaseUrl(env: EnvMap = process.env, extra: RuntimeExtra = getRuntimeExtra()) {
  return normalizeEduverseBaseUrl(
    env.EXPO_PUBLIC_EDUVERSE_API_BASE_URL ?? extra.eduverseApiBaseUrl ?? env.NEXT_PUBLIC_APP_URL ?? DEFAULT_EDUVERSE_API_BASE_URL
  );
}

export function eduverseApiUrl(path: string, env: EnvMap = process.env, extra: RuntimeExtra = getRuntimeExtra()) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getEduverseApiBaseUrl(env, extra)}${normalizedPath}`;
}

export function normalizeEduverseBaseUrl(value: string) {
  const trimmed = value.trim();
  const parsed = new URL(trimmed || DEFAULT_EDUVERSE_API_BASE_URL);

  if (parsed.pathname === "/auth") {
    parsed.pathname = "/";
  }

  parsed.hash = "";
  parsed.search = "";

  return parsed.toString().replace(/\/$/, "");
}
