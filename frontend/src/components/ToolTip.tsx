import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TooltipProps = {
  children: React.ReactNode;
  description: string;
};

export function Tooltip({ children, description }: TooltipProps) {
  return (
    <TooltipPrimitive>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{description}</p>
      </TooltipContent>
    </TooltipPrimitive>
  );
}
