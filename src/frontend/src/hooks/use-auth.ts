import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { identity, login, clear, loginStatus, isInitializing, isLoggingIn } =
    useInternetIdentity();

  // A user is authenticated if they have a valid (non-anonymous) identity.
  // This covers both:
  //   1. A returning user whose identity was restored from storage (loginStatus = "idle")
  //   2. A user who just completed the II login flow (loginStatus = "success")
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const isLoading = isInitializing || isLoggingIn;

  const principalText = isAuthenticated
    ? (identity?.getPrincipal()?.toText() ?? null)
    : null;

  return {
    identity,
    isAuthenticated,
    isLoading,
    isInitializing,
    isLoggingIn,
    loginStatus,
    principalText,
    login,
    logout: clear,
  };
}
