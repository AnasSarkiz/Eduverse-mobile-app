import { describe, expect, test } from "bun:test";

import { eduverseApiUrl, getEduverseApiBaseUrl, getSupabaseConfig, normalizeEduverseBaseUrl } from "@/config/env";

describe("environment config", () => {
  test("prefers Expo Supabase env names", () => {
    const config = getSupabaseConfig(
      {
        EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "expo-key",
        EXPO_PUBLIC_SUPABASE_URL: "https://expo.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "next-key",
        NEXT_PUBLIC_SUPABASE_URL: "https://next.supabase.co"
      },
      {}
    );

    expect(config).toEqual({
      publishableKey: "expo-key",
      url: "https://expo.supabase.co"
    });
  });

  test("falls back to web app Supabase env names", () => {
    const config = getSupabaseConfig(
      {
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "next-key",
        NEXT_PUBLIC_SUPABASE_URL: "https://next.supabase.co"
      },
      {}
    );

    expect(config).toEqual({
      publishableKey: "next-key",
      url: "https://next.supabase.co"
    });
  });

  test("reads Supabase config from Expo runtime extra", () => {
    const config = getSupabaseConfig(
      {},
      {
        supabasePublishableKey: "bridged-key",
        supabaseUrl: "https://bridged.supabase.co"
      }
    );

    expect(config).toEqual({
      publishableKey: "bridged-key",
      url: "https://bridged.supabase.co"
    });
  });

  test("normalizes the deployed auth URL to the app origin", () => {
    expect(normalizeEduverseBaseUrl("https://eduverse-demo.vercel.app/auth")).toBe("https://eduverse-demo.vercel.app");
  });

  test("builds absolute API URLs from the configured base", () => {
    const env = {
      EXPO_PUBLIC_EDUVERSE_API_BASE_URL: "https://eduverse-demo.vercel.app/auth"
    };

    expect(getEduverseApiBaseUrl(env, {})).toBe("https://eduverse-demo.vercel.app");
    expect(eduverseApiUrl("/api/notifications", env, {})).toBe("https://eduverse-demo.vercel.app/api/notifications");
  });

  test("reads API base URL from Expo runtime extra", () => {
    const extra = {
      eduverseApiBaseUrl: "https://eduverse-demo.vercel.app/auth"
    };

    expect(getEduverseApiBaseUrl({}, extra)).toBe("https://eduverse-demo.vercel.app");
    expect(eduverseApiUrl("api/classes", {}, extra)).toBe("https://eduverse-demo.vercel.app/api/classes");
  });
});
