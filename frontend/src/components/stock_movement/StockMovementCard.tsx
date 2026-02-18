import {
  ArrowUpRight,
  ArrowDownRight,
  History,
  Package,
  ClipboardList,
} from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type StockMovementResponse } from "@/types/api/response/stock.response";

interface StockMovementCardProps {
  movement: StockMovementResponse;
}

export function StockMovementCard({ movement }: StockMovementCardProps) {
  const isIn = movement.movementType === "IN";

  return (
    <Card className="w-full">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="flex items-center gap-1 font-mono text-[10px] uppercase">
            #MOV-{movement.id.toString().padStart(5, "0")}
          </CardDescription>
          <Badge
            variant={isIn ? "default" : "secondary"}
            className={cn(
              "text-[10px] font-bold px-2 py-0",
              isIn
                ? "bg-green-100 text-green-700 hover:bg-green-100"
                : "bg-red-100 text-red-700 hover:bg-red-100",
            )}
          >
            {isIn ? (
              <ArrowUpRight className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDownRight className="mr-1 h-3 w-3" />
            )}
            {movement.movementType}
          </Badge>
        </div>
        <CardTitle className="text-sm flex items-center gap-2 mt-1">
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
          Reason: {movement.movementReason}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        {/* The Quantity Change Row */}
        <div className="flex items-center justify-between py-2 border-y border-dashed">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">
              Quantity Changed
            </p>
            <p
              className={cn(
                "text-lg font-bold",
                isIn ? "text-green-600" : "text-red-600",
              )}
            >
              {isIn ? "+" : "-"}
              {movement.quantity}
            </p>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">
              Stock Level
            </p>
            <div className="flex items-center gap-2 justify-end">
              <span className="text-xs text-muted-foreground line-through">
                {movement.oldValue}
              </span>
              <span className="text-sm font-bold">→ {movement.newValue}</span>
            </div>
          </div>
        </div>

        {/* Footer info (Product ID & Date) */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Package className="h-3 w-3" />
            Product ID: {movement.productId}
          </div>
          <div className="flex items-center gap-1">
            <History className="h-3 w-3" />
            {format(new Date(movement.createdAt), "MMM d, h:mm a")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
