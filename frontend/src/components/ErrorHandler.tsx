import { isRouteErrorResponse, useRouteError } from "react-router";
import { toast } from "sonner";

export function ErrorHandler() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.statusText || `Request failed (${error.status})`
    : error instanceof Error
      ? error.message
      : "Something went wrong";

  toast.warning(message);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          App Error
        </p>
        <h1 className="mt-2 text-xl font-bold text-slate-900">
          The page could not be loaded.
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        <button
          type="button"
          className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    </div>
  );
}
