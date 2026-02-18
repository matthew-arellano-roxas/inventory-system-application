import { useRouteError } from "react-router";
import { toast } from "sonner";

export function ErrorHandler() {
  const error = useRouteError();

  // Type narrowing
  if (error instanceof Error) {
    toast.warning(error.message);
  } else {
    toast.warning("Something went wrong");
  }

  return null;
}
