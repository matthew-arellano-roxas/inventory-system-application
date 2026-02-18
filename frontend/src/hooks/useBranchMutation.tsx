import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBranch, deleteBranch, updateBranch } from "@/api/branch.api";
import { keys } from "@/api/query-keys";
import { toastApiError as onError } from "@/api/api-error-handler";

export function useBranchMutation() {
  const qc = useQueryClient();

  const remove = useMutation({
    mutationFn: deleteBranch,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.branches.all });
    },
  });

  const create = useMutation({
    mutationFn: createBranch,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.branches.all });
      await qc.refetchQueries({
        queryKey: keys.branches.all,
        type: "active",
      });
    },
    onError,
  });

  const update = useMutation({
    mutationFn: updateBranch,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.branches.all });
      await qc.refetchQueries({
        queryKey: keys.branches.all,
        type: "active",
      });
    },
    onError,
  });

  return { create, remove, update };
}
