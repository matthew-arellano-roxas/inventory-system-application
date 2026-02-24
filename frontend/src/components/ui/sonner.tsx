import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useThemeStore } from "@/stores/useThemeStore";

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "rgb(240 253 244)",
          "--success-border": "rgb(187 247 208)",
          "--success-text": "rgb(22 101 52)",
          "--info-bg": "rgb(239 246 255)",
          "--info-border": "rgb(191 219 254)",
          "--info-text": "rgb(30 64 175)",
          "--warning-bg": "rgb(255 251 235)",
          "--warning-border": "rgb(253 230 138)",
          "--warning-text": "rgb(146 64 14)",
          "--error-bg": "rgb(254 242 242)",
          "--error-border": "rgb(254 202 202)",
          "--error-text": "rgb(153 27 27)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
