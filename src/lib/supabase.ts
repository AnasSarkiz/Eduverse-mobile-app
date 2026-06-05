import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "@/config/env";

const { publishableKey: supabasePublishableKey, url: supabaseUrl } = getSupabaseConfig();

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn("Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or EXPO_PUBLIC_* equivalents.");
}

let client: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (client) return client;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing Supabase configuration. Restart Expo after adding NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or EXPO_PUBLIC_* equivalents."
    );
  }

  client = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: AsyncStorage
    }
  });

  return client;
}
