import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "@/api/transaction.api";
import { keys } from "@/api/query-keys";

export function useTransactionMutations() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: createTransaction,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.transactions.all });
    },
  });
  return { create };
}
