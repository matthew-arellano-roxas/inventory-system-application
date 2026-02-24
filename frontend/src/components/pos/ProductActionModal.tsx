import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Added Tabs
import {
  ShoppingCart,
  Plus,
  Minus,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { type Product } from "@/types/api/response/product.response";
import { cn } from "@/lib/utils";

// Define the types of transactions
type TransactionType = "SALE" | "DAMAGE" | "RETURN";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  // Updated handler to include the type
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
  const totalPrice = product.sellingPrice * numericQuantity;

  const handleConfirm = () => {
    if (numericQuantity <= 0) return;
    onSubmit(product, numericQuantity, type);
    setQuantity("1");
    setType("SALE"); // Reset to default
    onClose();
  };

  const adjustQuantity = (amount: number) => {
    setQuantity((prev) => {
      const val = (parseFloat(prev) || 0) + amount;
      return val > 0 ? val.toString() : "0";
    });
  };

  // Helper to determine button colors/icons based on type
  const getTheme = () => {
    switch (type) {
      case "DAMAGE":
        return {
          color: "destructive",
          icon: <AlertTriangle className="h-4 w-4" />,
          label: "Report Damage",
        };
      case "RETURN":
        return {
          color: "default",
          icon: <RotateCcw className="h-4 w-4" />,
          label: "Process Return",
        };
      default:
        return {
          color: "primary",
          icon: <ShoppingCart className="h-4 w-4" />,
          label: "Add to Cart",
        };
    }
  };

  const theme = getTheme();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
          <DialogDescription>
            Select transaction type and quantity
          </DialogDescription>
        </DialogHeader>

        {/* Transaction Type Selector */}
        <Tabs
          value={type}
          onValueChange={(val) => setType(val as TransactionType)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="SALE">Sale</TabsTrigger>
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
          {/* Price Preview - Only show for Sale/Return */}
          {type !== "DAMAGE" && (
            <div className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg border border-dashed">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Unit Price
                </p>
                <p className="text-lg font-bold">
                  ₱{product.sellingPrice.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  {type === "RETURN" ? "Refund Amount" : "Total Price"}
                </p>
                <p
                  className={cn(
                    "text-lg font-bold",
                    type === "RETURN" ? "text-orange-600" : "text-primary",
                  )}
                >
                  ₱
                  {totalPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Damage Warning */}
          {type === "DAMAGE" && (
            <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20 flex gap-3 items-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-xs text-destructive font-medium">
                Reporting damage will deduct {numericQuantity} {product.soldBy}
                (s) from current stock.
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
                className="text-center font-bold text-lg"
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
