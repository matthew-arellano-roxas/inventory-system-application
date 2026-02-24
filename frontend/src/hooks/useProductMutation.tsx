import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keys } from "@/api/query-keys";
import { toastApiError as onError } from "@/api/api-error-handler";
import { createProduct, deleteProduct, updateProduct } from "@/api/product.api";
import { toast } from "sonner";

export function useProductMutation() {
  const qc = useQueryClient();

  const remove = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.products.all });
      toast.success("Product deleted successfully.");
    },
  });

  const create = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.products.all });
      await qc.refetchQueries({
        queryKey: keys.products.all,
        type: "active",
      });
      toast.success("Product created successfully.");
    },
    onError,
  });   

  const update = useMutation({
    mutationFn: updateProduct,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.products.all });
      await qc.refetchQueries({
        queryKey: keys.products.all,
        type: "active",
      });
      toast.success("Product updated successfully.");
    },
    onError,
  });

  return { create, remove, update };
}
