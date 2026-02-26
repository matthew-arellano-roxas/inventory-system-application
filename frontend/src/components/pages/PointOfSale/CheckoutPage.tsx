import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toastApiError } from "@/api/api-error-handler";
import { createTransaction } from "@/api/transaction.api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/helpers/formatCurrency";
import { usePosCartStore } from "@/stores/usePosCartStore";
import { TransactionType } from "@/types/api/payload";
import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { branchId: branchIdParam } = useParams();
  const branchId =
    branchIdParam && !Number.isNaN(Number(branchIdParam))
      ? Number(branchIdParam)
      : null;

  const ensureBranchScope = usePosCartStore((state) => state.ensureBranchScope);
  const items = usePosCartStore((state) => state.items);
  const setQty = usePosCartStore((state) => state.setQty);
  const removeItem = usePosCartStore((state) => state.removeItem);
  const clearCart = usePosCartStore((state) => state.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    ensureBranchScope(branchId);
  }, [branchId, ensureBranchScope]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) =>
      total + Math.max(item.unitPrice * item.quantity - (item.discount ?? 0), 0),
    0,
  );

  const handleQuantityInput = (productId: number, value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    setQty(productId, parsed);
  };

  const handleCheckoutSubmit = async () => {
    if (branchId == null) {
      toast.error("Invalid branch.");
      return;
    }

    if (items.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTransaction({
        type: TransactionType.SALE,
        branchId,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          discount: item.discount ?? 0,
        })),
      });

      clearCart();
      toast.success("Checkout completed successfully.");
      navigate(`/pos/${branchId}`);
    } catch (error) {
      console.error("Failed to submit checkout transaction", error);
      toastApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (branchId === null) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">
          Invalid branch. Go back and select a branch first.
        </p>
        <Button className="mt-4 w-fit" onClick={() => navigate("/pos")}>
          Back to POS
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#38bdf8,_transparent_45%),radial-gradient(circle_at_bottom_left,_#f59e0b,_transparent_35%)]" />
        <div className="relative p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
                <ShoppingBasket className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight uppercase">
                  Checkout
                </h1>
                <p className="text-sm text-white/70">
                  Review cart items and adjust quantity before checkout.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:min-w-[260px]">
              <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/10">
                <p className="text-[10px] uppercase tracking-widest text-white/60">
                  Items
                </p>
                <p className="mt-1 text-lg font-bold leading-none">{itemCount}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/10">
                <p className="text-[10px] uppercase tracking-widest text-white/60">
                  Subtotal
                </p>
                <p className="mt-1 truncate text-lg font-bold leading-none">
                  {formatCurrency(subtotal)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" asChild>
              <Link to={`/pos/${branchId}`}>Back to Products</Link>
            </Button>
            <Button
              variant="ghost"
              onClick={clearCart}
              disabled={items.length === 0 || isSubmitting}
              className="text-white hover:bg-white/10 hover:text-white"
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </Card>

      <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Cart Details
            </p>
            <p className="text-sm text-muted-foreground">
              Edit quantities, remove items, and confirm totals.
            </p>
          </div>
          <div className="rounded-xl border bg-background/80 px-3 py-2 text-sm shadow-sm">
            <span className="text-muted-foreground">Branch </span>
            <span className="font-semibold">#{branchId}</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-background/70 py-14 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <ShoppingBasket className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-semibold">Your cart is empty</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Add products from the POS catalog to continue.
            </p>
            <Button asChild>
              <Link to={`/pos/${branchId}`}>Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3 md:hidden">
              {items.map((item) => (
                <Card
                  key={item.productId}
                  className="overflow-hidden border-border/70 bg-background/90 p-0 shadow-sm"
                >
                  <div className="border-b bg-muted/40 px-3 py-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold leading-tight">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Unit Price: {formatCurrency(item.unitPrice)}
                        </p>
                        {(item.discount ?? 0) > 0 && (
                          <p className="mt-1 text-xs text-emerald-600">
                            Discount: {formatCurrency(item.discount ?? 0)}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
                        className="shrink-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setQty(
                            item.productId,
                            Number((item.quantity - 1).toFixed(2)),
                          )
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={String(item.quantity)}
                        onChange={(e) =>
                          handleQuantityInput(item.productId, e.target.value)
                        }
                        className="flex-1 border-muted-foreground/20 text-center font-semibold"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setQty(
                            item.productId,
                            Number((item.quantity + 1).toFixed(2)),
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                      <span className="text-muted-foreground">Line Total</span>
                      <span className="font-semibold">
                        {formatCurrency(
                          Math.max(
                            item.unitPrice * item.quantity - (item.discount ?? 0),
                            0,
                          ),
                        )}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="hidden md:block">
              <div className="rounded-2xl border bg-background/80 p-2 shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="px-3">Product</TableHead>
                      <TableHead className="px-3 text-right">Unit Price</TableHead>
                      <TableHead className="px-3 text-center">Qty</TableHead>
                      <TableHead className="px-3 text-right">Total</TableHead>
                      <TableHead className="px-3 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell className="px-3 font-medium">{item.name}</TableCell>
                        <TableCell className="px-3 text-right">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="px-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                setQty(
                                  item.productId,
                                  Number((item.quantity - 1).toFixed(2)),
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={String(item.quantity)}
                              onChange={(e) =>
                                handleQuantityInput(item.productId, e.target.value)
                              }
                              className="w-24 text-center font-semibold"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                setQty(
                                  item.productId,
                                  Number((item.quantity + 1).toFixed(2)),
                                )
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 text-right font-semibold">
                          <div>
                            <p>
                              {formatCurrency(
                                Math.max(
                                  item.unitPrice * item.quantity -
                                    (item.discount ?? 0),
                                  0,
                                ),
                              )}
                            </p>
                            {(item.discount ?? 0) > 0 && (
                              <p className="text-xs font-normal text-emerald-600">
                                -{formatCurrency(item.discount ?? 0)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-3 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.productId)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="sticky bottom-3 z-10 rounded-2xl border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  {itemCount} item{itemCount === 1 ? "" : "s"} in cart
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Subtotal
                  </p>
                  <p className="text-2xl font-black tracking-tight">
                    {formatCurrency(subtotal)}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                <Button variant="outline" asChild className="h-12">
                  <Link to={`/pos/${branchId}`}>Continue Shopping</Link>
                </Button>
                <Button
                  className="h-12 px-6"
                  onClick={() => void handleCheckoutSubmit()}
                  disabled={items.length === 0 || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Proceed to Checkout"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
