const appJson = require("./app.json");

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
const eduverseApiBaseUrl =
  process.env.EXPO_PUBLIC_EDUVERSE_API_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://eduverse-demo.vercel.app";

module.exports = {
  ...appJson.expo,
  extra: {
    ...(appJson.expo.extra ?? {}),
    eduverseApiBaseUrl,
    supabasePublishableKey,
    supabaseUrl
  }
};
