import { getTransactions } from "@/api/transaction.api";
import { keys } from "@/api/query-keys";
import { Loader } from "@/components/Loader";
import { TransactionCard } from "@/components/transaction/TransactionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, ReceiptText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const TransactionsPage = () => {
  const {
    data = [],
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: keys.transactions.all,
    staleTime: 60 * 1000,
    queryFn: getTransactions,
  });

  const totals = data.reduce(
    (acc, txn) => {
      acc.amount += txn.totalAmount;
      acc.items += txn.transactionItem.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      acc.byType[txn.type] = (acc.byType[txn.type] ?? 0) + 1;
      return acc;
    },
    {
      amount: 0,
      items: 0,
      byType: {} as Record<string, number>,
    },
  );

  return (
    <div className="space-y-6 p-4">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#38bdf8,_transparent_45%),radial-gradient(circle_at_bottom_left,_#22c55e,_transparent_35%)]" />
        <div className="relative p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 lg:flex-1">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
                  <ReceiptText className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight">
                    Transactions
                  </h1>
                  <p className="text-sm text-white/70">
                    Review recent POS activity and refresh the latest entries.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="rounded-full border-white/15 bg-white/10 px-3 py-1 text-white hover:bg-white/10">
                  {data.length} Records
                </Badge>
                {Object.entries(totals.byType).map(([type, count]) => (
                  <Badge
                    key={type}
                    className="rounded-full border-white/15 bg-white/10 px-3 py-1 text-white hover:bg-white/10"
                  >
                    {type}: {count}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-auto lg:min-w-[320px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/10">
                  <p className="text-[10px] uppercase tracking-widest text-white/60">
                    Total Amount
                  </p>
                  <p className="mt-1 truncate text-lg font-bold leading-none">
                    PHP{" "}
                    {totals.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/10">
                  <p className="text-[10px] uppercase tracking-widest text-white/60">
                    Items Moved
                  </p>
                  <p className="mt-1 text-lg font-bold leading-none">
                    {totals.items}
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                className="mt-2 h-11 w-full justify-center gap-2"
                onClick={() => void refetch()}
                disabled={isFetching}
              >
                <RefreshCw
                  className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"}
                />
                {isFetching ? "Refreshing..." : "Refetch Transactions"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {isPending ? (
        <Card className="border-border/60 bg-background/80 p-8 shadow-sm">
          <Loader />
        </Card>
      ) : data.length === 0 ? (
        <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 p-10 text-center shadow-sm">
          <p className="text-base font-semibold">No transactions found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try refetching to load the latest transaction records.
          </p>
          <div className="mt-4">
            <Button onClick={() => void refetch()} disabled={isFetching}>
              {isFetching ? "Refreshing..." : "Refetch"}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.map((txn) => (
            <TransactionCard
              key={txn.id}
              transaction={txn}
              onViewReceipt={() => {}}
              onVoid={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};
