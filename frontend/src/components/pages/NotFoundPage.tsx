import { MoveLeft, Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router"; // or 'next/navigation' if using Next.js

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon & Error Code */}
        <div className="space-y-2">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl shadow-slate-200/50 mb-4 border border-slate-100">
            <AlertCircle className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-8xl font-black tracking-tighter text-slate-900 leading-none">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">
            Page Not Found
          </h2>
          <p className="text-muted-foreground font-medium">
            We couldn't find the page you're looking for. It might have been
            moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            className="w-full sm:w-auto h-12 px-6 font-bold rounded-xl border-slate-200 hover:bg-white hover:shadow-md transition-all"
            onClick={() => navigate(-1)}
          >
            <MoveLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <Button
            className="w-full sm:w-auto h-12 px-6 font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </div>

        {/* Bottom Support Text */}
        <p className="text-xs text-muted-foreground pt-8 uppercase tracking-widest font-bold opacity-50">
          Inventory Management System
        </p>
      </div>
    </div>
  );
}
