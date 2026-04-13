import { Toaster } from "@/components/ui/sonner";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { LoginPrompt } from "./pages/LoginPrompt";
import { MemoriesPage } from "./pages/MemoriesPage";
import { MemoryDetailPage } from "./pages/MemoryDetailPage";
import { UploadPage } from "./pages/UploadPage";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  // Only consider authenticated if the identity is non-anonymous.
  // This correctly handles both fresh logins and restored sessions.
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  // Wait for the auth client to finish loading stored credentials
  // before deciding whether to show the login page or the app.
  if (isInitializing) return null;

  if (!isAuthenticated)
    return (
      <Layout>
        <LoginPrompt />
      </Layout>
    );
  return <>{children}</>;
}

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="bottom-right" />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <AuthGate>
      <Layout>
        <MemoriesPage />
      </Layout>
    </AuthGate>
  ),
});

const memoryDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/memory/$memoryId",
  component: () => (
    <AuthGate>
      <MemoryDetailPage />
    </AuthGate>
  ),
});

function UploadRoute() {
  const navigate = useNavigate();
  return (
    <AuthGate>
      <Layout>
        <UploadPage onSuccess={() => navigate({ to: "/" })} />
      </Layout>
    </AuthGate>
  );
}

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upload",
  component: UploadRoute,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  memoryDetailRoute,
  uploadRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
