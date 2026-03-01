import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTransaction,
  rollbackSaleTransaction,
} from "@/api/transaction.api";
import { toastApiError as onError } from "@/api/api-error-handler";
import { keys } from "@/api/query-keys";
import { toast } from "sonner";

export function useTransactionMutations() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: createTransaction,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.transactions.all });
    },
  });

  const rollback = useMutation({
    mutationFn: rollbackSaleTransaction,
    onSuccess: async () => {
      toast.success("Sale transaction rolled back.");
      await qc.invalidateQueries({ queryKey: keys.transactions.all });
    },
    onError,
  });

  return { create, rollback };
}
