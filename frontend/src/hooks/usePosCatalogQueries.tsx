import { useQuery } from "@tanstack/react-query";
import { getBranches } from "@/api/branch.api";
import { getCategories } from "@/api/category.api";
import { getProductSnippets } from "@/api/product.api";
import { keys } from "@/api/query-keys";

export function usePosCatalogQueries() {
  const staleTime = 60 * 1000;

  const branches = useQuery({
    queryKey: keys.branches.all,
    queryFn: getBranches,
    staleTime,
  });

  const categories = useQuery({
    queryKey: keys.categories.all,
    queryFn: getCategories,
    staleTime,
  });

  const products = useQuery({
    queryKey: keys.products.filters(),
    queryFn: () => getProductSnippets(),
    staleTime,
  });

  return {
    branchList: branches.data ?? [],
    categoryList: categories.data ?? [],
    productList: products.data ?? [],
    isPending: {
      branches: branches.isPending,
      categories: categories.isPending,
      products: products.isPending,
    },
  };
}
