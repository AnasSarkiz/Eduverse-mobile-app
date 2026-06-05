import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GraduationCap } from "lucide-react-native";
import { useState } from "react";

import { FormInput } from "@/components/common/FormInput";
import { Segment } from "@/components/common/Segment";
import type { AuthMode } from "@/types/navigation";

type AuthScreenProps = {
  authMode: AuthMode;
  contentPadding: number;
  errorMessage: string | null;
  isCompact: boolean;
  onForgotPassword: (email: string) => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, displayName: string) => Promise<void>;
  setAuthMode: (mode: AuthMode) => void;
};

export function AuthScreen({
  authMode,
  contentPadding,
  errorMessage,
  isCompact,
  onForgotPassword,
  onSignIn,
  onSignUp,
  setAuthMode
}: AuthScreenProps) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  async function submit() {
    setFeedback(null);
    setLocalError(null);
    setIsPending(true);

    try {
      if (authMode === "login") {
        await onSignIn(email, password);
        return;
      }

      if (authMode === "signup") {
        await onSignUp(email, password, displayName);
        setFeedback("Account created. Check your email if confirmation is enabled.");
        return;
      }

      await onForgotPassword(email);
      setFeedback("Password reset email sent.");
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          alignSelf: "center",
          maxWidth: 560,
          minHeight: "100%",
          padding: contentPadding,
          width: "100%"
        }}
      >
        <View className="flex-1 justify-center py-8">
          <View className="mb-8">
            <View className="mb-5 flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-card dark:bg-dark-card">
                <GraduationCap color="#4f46e5" size={22} strokeWidth={2.4} />
              </View>
              <Text className="text-base font-bold text-white">Eduverse</Text>
            </View>
            <Text className="text-sm font-bold uppercase text-indigo-100">Learning workspace</Text>
            <Text className={`${isCompact ? "text-3xl" : "text-4xl"} mt-3 font-bold leading-tight text-white`}>
              Start with your organizations.
            </Text>
            <Text className="mt-3 text-base leading-6 text-indigo-100">
              Sign in first, then use the right mobile workspace for your organization role.
            </Text>
          </View>

          <View className="rounded-xl bg-card dark:bg-dark-card p-5 shadow-sm">
            <View className="mb-5 flex-row rounded-md bg-muted dark:bg-dark-muted p-1">
              <Segment label="Login" isActive={authMode === "login"} onPress={() => setAuthMode("login")} />
              <Segment label="Signup" isActive={authMode === "signup"} onPress={() => setAuthMode("signup")} />
              <Segment label="Forgot" isActive={authMode === "forgot"} onPress={() => setAuthMode("forgot")} />
            </View>

            {authMode === "signup" ? <FormInput label="Full name" onChangeText={setDisplayName} value={displayName} /> : null}
            <FormInput label="Email" onChangeText={setEmail} value={email} />
            {authMode !== "forgot" ? <FormInput label="Password" onChangeText={setPassword} secure value={password} /> : null}

            {localError || errorMessage ? (
              <Text className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                {localError ?? errorMessage}
              </Text>
            ) : null}

            {feedback ? (
              <Text className="mt-2 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {feedback}
              </Text>
            ) : null}

            <Pressable className="mt-5 rounded-md bg-brand-500 px-4 py-4" disabled={isPending} onPress={submit}>
              <Text className="text-center text-base font-bold text-white">
                {isPending
                  ? "Please wait..."
                  : authMode === "login"
                    ? "Open Eduverse"
                    : authMode === "signup"
                      ? "Create account"
                      : "Send reset link"}
              </Text>
            </Pressable>

            <Text className="mt-4 text-center text-xs leading-5 text-muted-foreground dark:text-dark-muted-foreground">
              Supabase auth, organization selection, and role-based access match the web app flow.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
