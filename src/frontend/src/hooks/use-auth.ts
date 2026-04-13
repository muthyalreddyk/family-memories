import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { identity, login, clear, loginStatus, isInitializing, isLoggingIn } =
    useInternetIdentity();

  const isAuthenticated = !!identity && loginStatus === "success";
  const isLoading = isInitializing || isLoggingIn;

  const principalText = identity?.getPrincipal()?.toText() ?? null;

  return {
    identity,
    isAuthenticated,
    isLoading,
    isInitializing,
    isLoggingIn,
    principalText,
    login,
    logout: clear,
  };
}
