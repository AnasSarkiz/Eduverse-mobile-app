import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";

type LiveKitNativeModule = typeof import("@livekit/react-native");
type LiveKitClientModule = typeof import("livekit-client");

type LiveKitNativeBundle = {
  client: LiveKitClientModule;
  native: LiveKitNativeModule;
};

let cachedBundle: LiveKitNativeBundle | null = null;
let cachedError: Error | null = null;
let registeredGlobals = false;

export function loadLiveKitNative() {
  if (Platform.OS === "web") return null;
  if (isExpoGoRuntime()) {
    cachedError = new Error("LiveKit requires an Expo development build. Expo Go does not include the native WebRTC module.");
    return null;
  }
  if (cachedBundle) return cachedBundle;
  if (cachedError) return null;

  try {
    const native = require("@livekit/react-native") as LiveKitNativeModule;
    const client = require("livekit-client") as LiveKitClientModule;

    if (!registeredGlobals) {
      native.registerGlobals();
      registeredGlobals = true;
    }

    cachedBundle = { client, native };
    return cachedBundle;
  } catch (error) {
    cachedError = error instanceof Error ? error : new Error("LiveKit native modules are unavailable.");
    return null;
  }
}

export function liveKitNativeError() {
  return cachedError;
}

function isExpoGoRuntime() {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient || Constants.appOwnership === "expo";
}
