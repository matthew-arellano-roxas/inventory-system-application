import { useQuery } from "@tanstack/react-query";
import { getBranches } from "@/api/branch.api";
import { getCategories } from "@/api/category.api";
import { getProductSnippets } from "@/api/product.api";
import { keys } from "@/api/query-keys";
import { cleanQuery } from "@/helpers/cleanQuery";
import type { ProductQuery } from "@/types/api/shared/search-params.types";

export function usePosCatalogQueries(filters?: ProductQuery) {
  const staleTime = 60 * 1000;
  const productFilters = cleanQuery(filters ?? {});

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
    queryKey: [...keys.products.filters(), productFilters],
    queryFn: () => getProductSnippets(productFilters),
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
    refetch: {
      branches: branches.refetch,
      categories: categories.refetch,
      products: products.refetch,
    },
  };
}
