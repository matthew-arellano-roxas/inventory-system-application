import { TransactionCard } from "@/components/transaction/TransactionCard";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { keys } from "@/api/query-keys";
import { getTransactions } from "@/api/transaction.api";
import { Loader } from "@/components/Loader";

export const TransactionsPage = () => {
  const { data = [], isPending } = useQuery({
    queryKey: keys.transactions.all,
    staleTime: 60 * 1000,
    queryFn: getTransactions,
  });

  return (
    <>
      <Label className="text-lg font-semibold">Recent Transactions</Label>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isPending ? (
          <Loader />
        ) : (
          data.map((txn) => (
            <TransactionCard
              key={txn.id}
              transaction={txn}
              onViewReceipt={() => {}}
              onVoid={() => {}}
            />
          ))
        )}
      </div>

      {data.length === 0 && !isPending && (
        <div className="text-center text-muted-foreground">
          No transactions found
        </div>
      )}
    </>
  );
};
