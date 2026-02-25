import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Minus,
  PackagePlus,
  Plus,
  RotateCcw,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Product } from "@/types/api/response/product.response";

type TransactionType = "SALE" | "PURCHASE" | "DAMAGE" | "RETURN";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Product, quantity: number, type: TransactionType) => void;
}

export function ProductActionModal({
  product,
  isOpen,
  onClose,
  onSubmit,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState<string>("1");
  const [type, setType] = useState<TransactionType>("SALE");

  if (!product) return null;

  const numericQuantity = parseFloat(quantity) || 0;
  const totalSalePrice = product.sellingPrice * numericQuantity;
  const totalPurchaseCost = product.costPerUnit * numericQuantity;

  const handleConfirm = () => {
    if (numericQuantity <= 0) return;
    onSubmit(product, numericQuantity, type);
    setQuantity("1");
    setType("SALE");
    onClose();
  };

  const adjustQuantity = (amount: number) => {
    setQuantity((prev) => {
      const nextValue = (parseFloat(prev) || 0) + amount;
      return nextValue > 0 ? nextValue.toString() : "0";
    });
  };

  const getTheme = () => {
    switch (type) {
      case "DAMAGE":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          label: "Report Damage",
        };
      case "RETURN":
        return {
          icon: <RotateCcw className="h-4 w-4" />,
          label: "Process Return",
        };
      case "PURCHASE":
        return {
          icon: <PackagePlus className="h-4 w-4" />,
          label: "Add Stock",
        };
      default:
        return {
          icon: <ShoppingCart className="h-4 w-4" />,
          label: "Add to Cart",
        };
    }
  };

  const theme = getTheme();
  const unitAmount = type === "PURCHASE" ? product.costPerUnit : product.sellingPrice;
  const totalAmount = type === "PURCHASE" ? totalPurchaseCost : totalSalePrice;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
          <DialogDescription>
            Select transaction type and quantity
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={type}
          onValueChange={(value) => setType(value as TransactionType)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="SALE">Sale</TabsTrigger>
            <TabsTrigger value="PURCHASE">Purchase</TabsTrigger>
            <TabsTrigger value="RETURN">Return</TabsTrigger>
            <TabsTrigger
              value="DAMAGE"
              className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground"
            >
              Damage
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-6 py-4">
          {type !== "DAMAGE" && (
            <div className="flex items-center justify-between rounded-lg border border-dashed bg-secondary/50 p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {type === "PURCHASE" ? "Unit Cost" : "Unit Price"}
                </p>
                <p className="text-lg font-bold">PHP {unitAmount.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {type === "RETURN"
                    ? "Refund Amount"
                    : type === "PURCHASE"
                      ? "Total Cost"
                      : "Total Price"}
                </p>
                <p
                  className={cn(
                    "text-lg font-bold",
                    type === "RETURN"
                      ? "text-orange-600"
                      : type === "PURCHASE"
                        ? "text-emerald-600"
                        : "text-primary",
                  )}
                >
                  PHP{" "}
                  {totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          )}

          {type === "DAMAGE" && (
            <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-xs font-medium text-destructive">
                Reporting damage will deduct {numericQuantity} {product.soldBy}
                (s) from current stock.
              </p>
            </div>
          )}

          {type === "PURCHASE" && (
            <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
              <PackagePlus className="h-5 w-5 text-emerald-600" />
              <p className="text-xs font-medium text-emerald-700">
                Purchasing stock will add {numericQuantity} {product.soldBy}(s) to
                current inventory.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="quantity">
              Quantity to {type.toLowerCase()} ({product.soldBy})
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustQuantity(-1)}
                disabled={numericQuantity <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>

              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="text-center text-lg font-bold"
              />

              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustQuantity(1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant={type === "DAMAGE" ? "destructive" : "default"}
            onClick={handleConfirm}
            className="flex-[2] gap-2"
            disabled={numericQuantity <= 0}
          >
            {theme.icon}
            {theme.label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
