import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keys } from "@/api/query-keys";
import { toastApiError as onError } from "@/api/api-error-handler";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/api/category.api";

export function useCategoryMutation() {
  const qc = useQueryClient();

  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.categories.all });
    },
  });

  const create = useMutation({
    mutationFn: createCategory,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.categories.all });
      await qc.refetchQueries({
        queryKey: keys.categories.all,
        type: "active",
      });
    },
    onError,
  });

  const update = useMutation({
    mutationFn: updateCategory,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.categories.all });
      await qc.refetchQueries({
        queryKey: keys.categories.all,
        type: "active",
      });
    },
    onError,
  });

  return { create, remove, update };
}
