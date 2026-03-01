import { useAuth0 } from "@auth0/auth0-react";
import { ArrowRight, Boxes, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { environment } from "@/config";

function GoogleIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function LoginPage() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
    await loginWithRedirect({
      authorizationParams: {
        connection: "google-oauth2",
        audience: environment.VITE_AUTH0_AUDIENCE,
        scope: environment.VITE_AUTH0_SCOPE,
      },
      appState: {
        returnTo: sessionStorage.getItem("redirectAfterLogin") || "/",
      },
    });
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#e0f2fe,transparent_45%),radial-gradient(circle_at_80%_15%,#fde68a,transparent_40%),linear-gradient(180deg,#f8fafc,#eef2ff)]">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(15,23,42,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,.06)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative flex min-h-screen items-center justify-center p-6">
          <Card className="w-full max-w-sm border-white/60 bg-white/80 shadow-2xl backdrop-blur">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-sky-300/40" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Boxes className="h-6 w-6" />
                </div>
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">
                  Preparing secure login
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Checking your session...
                </p>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-1/2 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-slate-900" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_15%,#bae6fd,transparent_40%),radial-gradient(circle_at_85%_20%,#fde68a,transparent_35%),radial-gradient(circle_at_50%_100%,#bbf7d0,transparent_35%),linear-gradient(180deg,#f8fafc,#eef2ff)]">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(15,23,42,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,.06)_1px,transparent_1px)] [background-size:30px_30px]" />
      <div className="absolute -left-16 top-16 h-40 w-40 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="absolute -right-16 bottom-20 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-4 py-8 md:grid-cols-[1.05fr_.95fr] md:px-6">
        <section className="order-2 md:order-1">
          <div className="mx-auto max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Inventory Platform
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Fast inventory operations,
              <span className="block text-slate-600">from stock-in to sale.</span>
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600 sm:text-base">
              Sign in to manage products, monitor transactions, and keep branch
              inventory accurate in real time.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Boxes className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Product + Stock Control
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Track stock additions, returns, and damages across branches.
                </p>
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Secure Access
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Google sign-in via Auth0 for centralized authentication.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="order-1 md:order-2">
          <Card className="mx-auto w-full max-w-md overflow-hidden border-white/70 bg-white/80 shadow-2xl backdrop-blur-xl">
            <div className="h-2 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400" />
            <CardHeader className="space-y-3 pb-4 text-center">
              <div className="mx-auto mt-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                <Boxes className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                  Inventory System
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-slate-600">
                  Continue with Google to access your workspace
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              <Button
                onClick={handleGoogleLogin}
                className="h-12 w-full justify-between rounded-xl bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                size="lg"
                variant="ghost"
              >
                <span className="flex items-center gap-3">
                  <GoogleIcon />
                  <span className="font-semibold">Continue with Google</span>
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </Button>

              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs leading-5 text-slate-600">
                Access is protected. Your sign-in is handled by Auth0 using your
                Google account.
              </div>

              <p className="text-center text-xs text-muted-foreground">
                By continuing, you will be redirected to the secure login provider.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
