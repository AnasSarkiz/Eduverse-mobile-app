import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Building2, GraduationCap, ShieldCheck, Sparkles } from "lucide-react-native";
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
  const steps = [
    { description: "Supabase email and password.", icon: ShieldCheck, title: "Auth" },
    { description: "Choose your organization.", icon: Building2, title: "Org hub" },
    { description: "Open the right role view.", icon: Sparkles, title: "Workspace" }
  ];
  const titleSizeClass = isCompact ? "text-4xl" : "text-5xl";

  function changeMode(mode: AuthMode) {
    setFeedback(null);
    setLocalError(null);
    setAuthMode(mode);
  }

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
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView
          automaticallyAdjustKeyboardInsets
          className="flex-1"
          contentContainerStyle={{
            alignSelf: "center",
            flexGrow: 1,
            maxWidth: 560,
            paddingBottom: contentPadding + 48,
            paddingHorizontal: contentPadding,
            paddingTop: isCompact ? 24 : 38,
            width: "100%"
          }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center">
            <View className="mb-7">
              <View className="mb-7 flex-row items-center self-start rounded-full border border-white/10 bg-white/10 px-3 py-2">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-sky-400">
                  <GraduationCap color="#020617" size={20} strokeWidth={2.6} />
                </View>
                <Text className="px-2 text-sm font-bold text-sky-50">Eduverse</Text>
              </View>
              <Text className="text-xs font-bold uppercase tracking-widest text-sky-200">Learning workspace</Text>
              <Text className={`${titleSizeClass} mt-3 font-black leading-tight text-white`}>
                Start with your organizations.
              </Text>
              <Text className="mt-4 text-base leading-7 text-slate-300">
                Sign in first, then choose which organization to enter. Owners, admins, teachers, and students each get the right mobile workspace.
              </Text>
            </View>

            <View className="mb-4 flex-row gap-2">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <View key={step.title} className="flex-1 rounded-xl border border-white/10 bg-white/10 p-3">
                    <View className="mb-3 h-8 w-8 items-center justify-center rounded-full bg-sky-400/20">
                      <Icon color="#7dd3fc" size={16} strokeWidth={2.5} />
                    </View>
                    <Text className="text-xs font-black text-white">{step.title}</Text>
                    <Text className="mt-1 text-xs leading-4 text-slate-300">{step.description}</Text>
                  </View>
                );
              })}
            </View>

            <View className="rounded-3xl border border-white/10 bg-dark-card p-6 shadow-sm">
              <View className="mb-5 flex-row rounded-full bg-slate-950 p-1">
                <Segment label="Login" isActive={authMode === "login" || authMode === "forgot"} onPress={() => changeMode("login")} />
                <Segment label="Signup" isActive={authMode === "signup"} onPress={() => changeMode("signup")} />
              </View>

              <View className="mb-5">
                <Text className="text-2xl font-black text-white">
                  {authMode === "login" ? "Welcome back" : authMode === "signup" ? "Create your account" : "Reset access"}
                </Text>
                <Text className="mt-2 text-sm leading-6 text-slate-400">
                  {authMode === "login"
                    ? "Enter your credentials to open the organization hub."
                    : authMode === "signup"
                      ? "Create your Eduverse account. Your profile will sync with the web app."
                      : "Send a reset link to your Eduverse email."}
                </Text>
              </View>

              {authMode === "signup" ? <FormInput label="Full name" onChangeText={setDisplayName} surface="dark" value={displayName} /> : null}
              <FormInput label="Email" onChangeText={setEmail} surface="dark" value={email} />
              {authMode !== "forgot" ? <FormInput label="Password" onChangeText={setPassword} secure surface="dark" value={password} /> : null}

              {authMode === "login" ? (
                <Pressable className="self-end py-1" onPress={() => changeMode("forgot")}>
                  <Text className="text-sm font-bold text-sky-300">Forgot password?</Text>
                </Pressable>
              ) : null}

              {authMode === "forgot" ? (
                <Pressable className="self-start py-1" onPress={() => changeMode("login")}>
                  <Text className="text-sm font-bold text-sky-300">Back to login</Text>
                </Pressable>
              ) : null}

              {localError || errorMessage ? (
                <Text className="mt-2 rounded-2xl border border-red-900 bg-red-950 px-4 py-3 text-sm font-semibold text-red-300">
                  {localError ?? errorMessage}
                </Text>
              ) : null}

              {feedback ? (
                <Text className="mt-2 rounded-2xl border border-emerald-900 bg-emerald-950 px-4 py-3 text-sm font-semibold text-emerald-300">
                  {feedback}
                </Text>
              ) : null}

              <Pressable className="mt-5 rounded-2xl bg-sky-500 px-4 py-4" disabled={isPending} onPress={submit}>
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

              <Text className="mt-4 text-center text-xs leading-5 text-slate-400">
                Supabase auth, organization selection, and role-based access match the web app flow.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
