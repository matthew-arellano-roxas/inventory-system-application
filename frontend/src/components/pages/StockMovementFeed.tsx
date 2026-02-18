import { useState } from "react";
import { Search, ArrowUpRight, ArrowDownRight, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { type StockMovementResponse } from "@/types/api/response/stock.response";

export function StockMovementFeed({
  movements,
}: {
  movements: StockMovementResponse[];
}) {
  const [search, setSearch] = useState("");

  const filtered = movements.filter(
    (m) =>
      m.productId.toString().includes(search) ||
      m.movementReason.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full bg-background border rounded-lg overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b bg-muted/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Product ID or Reason..."
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Timeline List */}
      <ScrollArea className="flex-1 h-[600px]">
        <div className="p-4 space-y-6 relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[27px] top-6 bottom-6 w-px bg-border" />

          {filtered.map((m) => {
            const isIn = m.movementType === "IN";
            return (
              <div key={m.id} className="relative flex gap-4 items-start group">
                {/* Status Icon Indicator */}
                <div
                  className={cn(
                    "z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm",
                    isIn
                      ? "text-green-600 border-green-200"
                      : "text-red-600 border-red-200",
                  )}
                >
                  {isIn ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {m.movementReason}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {format(new Date(m.createdAt), "HH:mm aa")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Package className="h-3 w-3" />
                    <span>Product #{m.productId}</span>
                    <span className="text-border">|</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-4 px-1 font-normal"
                    >
                      ID: {m.id}
                    </Badge>
                  </div>

                  <div className="mt-1 flex items-center justify-between bg-muted/30 rounded-md p-2 border border-transparent group-hover:border-border transition-colors">
                    <div className="text-sm">
                      <span
                        className={cn(
                          "font-bold",
                          isIn ? "text-green-600" : "text-red-600",
                        )}
                      >
                        {isIn ? "+" : "-"}
                        {m.quantity} units
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground font-medium">
                      {m.oldValue} <span className="mx-1">→</span>{" "}
                      <span className="text-foreground font-bold">
                        {m.newValue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground text-sm italic">
              No movement history found.
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Meta */}
      <div className="p-3 bg-muted/10 border-t text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
          End of history
        </p>
      </div>
    </div>
  );
}
