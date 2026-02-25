import { getBranches } from "@/api/branch.api";
import { getCategories } from "@/api/category.api";
import { getOpexList } from "@/api/opex.api";
import { getProducts } from "@/api/product.api";
import { keys } from "@/api/query-keys";
import { getProductReport } from "@/api/report.api";
import { getStockMovementList } from "@/api/stock.api";
import {
  type InventoryProduct,
  containsSearch,
  getReportProductName,
  normalizeProduct,
} from "@/components/pages/inventory/inventory-page.shared";
import { usePagination } from "@/hooks/usePagination";
import type {
  ProductReportQuery,
  ProductReportResponse,
} from "@/types/api/response";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export function useInventoryPageState() {
  const [selectedBranchId, setSelectedBranchId] = useState("all");
  const [search, setSearch] = useState("");
  const branchIdFilter = selectedBranchId === "all" ? null : Number(selectedBranchId);

  const branchesQuery = useQuery({
    queryKey: keys.branches.all,
    queryFn: getBranches,
    staleTime: 60 * 1000,
  });

  const categoriesQuery = useQuery({
    queryKey: keys.categories.all,
    queryFn: getCategories,
    staleTime: 60 * 1000,
  });

  const productsQuery = useQuery({
    queryKey: [...keys.products.all, "inventory-details"],
    queryFn: () => getProducts({ details: true }),
    staleTime: 60 * 1000,
  });

  const productReportsQuery = useQuery({
    queryKey: [
      ...keys.reports.product(),
      { branchId: branchIdFilter ?? null, search: search.trim() || null },
    ],
    queryFn: () => {
      const query: ProductReportQuery = {
        ...(branchIdFilter != null ? { branchId: branchIdFilter } : {}),
        ...(search.trim() ? { search: search.trim() } : {}),
      };
      return getProductReport(query);
    },
    staleTime: 60 * 1000,
  });

  const stockMovementsQuery = useQuery({
    queryKey: ["stock-movements"],
    queryFn: getStockMovementList,
    staleTime: 30 * 1000,
  });

  const opexQuery = useQuery({
    queryKey: ["expenses"],
    queryFn: getOpexList,
    staleTime: 60 * 1000,
  });

  const branches = useMemo(() => branchesQuery.data ?? [], [branchesQuery.data]);
  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);
  const rawProducts = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);
  const productReports = useMemo(
    () => productReportsQuery.data ?? [],
    [productReportsQuery.data],
  );
  const stockMovements = useMemo(
    () => stockMovementsQuery.data ?? [],
    [stockMovementsQuery.data],
  );
  const opexList = useMemo(() => opexQuery.data ?? [], [opexQuery.data]);

  const products = useMemo(
    () => rawProducts.map(normalizeProduct).filter((p): p is InventoryProduct => p != null),
    [rawProducts],
  );

  const branchNameMap = useMemo(
    () => new Map<number, string>(branches.map((b) => [b.id, b.name])),
    [branches],
  );

  const categoryNameMap = useMemo(
    () => new Map<number, string>(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  const productMap = useMemo(
    () =>
      new Map<number, InventoryProduct>(
        products
          .filter((p) => p.id != null)
          .map((p) => [p.id as number, p]),
      ),
    [products],
  );

  const reportMap = useMemo(
    () => new Map<number, ProductReportResponse>(productReports.map((r) => [r.productId, r])),
    [productReports],
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        if (branchIdFilter != null && p.branchId !== branchIdFilter) return false;
        return containsSearch(search, p.name, p.id, p.branchId, p.categoryId, p.soldBy);
      }),
    [branchIdFilter, products, search],
  );

  const filteredReports = useMemo(
    () =>
      productReports.filter((r) => {
        const reportBranchId = r.branchId ?? productMap.get(r.productId)?.branchId ?? null;
        if (branchIdFilter != null && reportBranchId !== branchIdFilter) return false;
        return containsSearch(search, getReportProductName(r, productMap), r.productId);
      }),
    [branchIdFilter, productMap, productReports, search],
  );

  const filteredMovements = useMemo(
    () =>
      stockMovements.filter((m) => {
        const product = productMap.get(m.productId);
        if (branchIdFilter != null && product?.branchId !== branchIdFilter) return false;
        return containsSearch(search, m.productId, m.movementReason, product?.name);
      }),
    [branchIdFilter, productMap, search, stockMovements],
  );

  const filteredOpex = useMemo(
    () =>
      opexList.filter((e) => {
        if (branchIdFilter != null && e.branchId !== branchIdFilter) return false;
        return containsSearch(search, e.id, e.name, e.branchId, e.amount);
      }),
    [branchIdFilter, opexList, search],
  );

  const summary = useMemo(() => {
    const totalStock = filteredReports.reduce((sum, r) => sum + (Number(r.stock) || 0), 0);
    const totalRevenue = filteredReports.reduce((sum, r) => sum + (Number(r.revenue) || 0), 0);
    const totalProfit = filteredReports.reduce((sum, r) => sum + (Number(r.profit) || 0), 0);
    const totalOpex = filteredOpex.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    return {
      totalStock,
      totalRevenue,
      totalProfit,
      totalOpex,
      net: totalProfit - totalOpex,
      lowStockCount: filteredReports.filter((r) => (Number(r.stock) || 0) <= 10).length,
    };
  }, [filteredOpex, filteredReports]);

  const topRevenueReports = useMemo(
    () =>
      [...filteredReports]
        .sort((a, b) => (Number(b.revenue) || 0) - (Number(a.revenue) || 0))
        .slice(0, 5),
    [filteredReports],
  );

  const lowStockReports = useMemo(
    () =>
      [...filteredReports]
        .filter((r) => (Number(r.stock) || 0) <= 10)
        .sort((a, b) => (Number(a.stock) || 0) - (Number(b.stock) || 0))
        .slice(0, 5),
    [filteredReports],
  );

  const pageSize = 10;
  const pagination = usePagination(filteredProducts, pageSize);

  const isRefreshing =
    branchesQuery.isFetching ||
    categoriesQuery.isFetching ||
    productsQuery.isFetching ||
    productReportsQuery.isFetching ||
    stockMovementsQuery.isFetching ||
    opexQuery.isFetching;

  const isInitialLoading =
    !branchesQuery.data &&
    !categoriesQuery.data &&
    !productsQuery.data &&
    !productReportsQuery.data &&
    !stockMovementsQuery.data &&
    !opexQuery.data &&
    (branchesQuery.isPending ||
      categoriesQuery.isPending ||
      productsQuery.isPending ||
      productReportsQuery.isPending ||
      stockMovementsQuery.isPending ||
      opexQuery.isPending);

  const activeBranchName =
    branchIdFilter == null
      ? "All Branches"
      : branchNameMap.get(branchIdFilter) ?? `Branch #${branchIdFilter}`;

  const setSearchAndReset = (value: string) => {
    setSearch(value);
    pagination.resetPage();
  };

  const setSelectedBranchAndReset = (value: string) => {
    setSelectedBranchId(value);
    pagination.resetPage();
  };

  const refreshAll = async () => {
    await Promise.all([
      branchesQuery.refetch(),
      categoriesQuery.refetch(),
      productsQuery.refetch(),
      productReportsQuery.refetch(),
      stockMovementsQuery.refetch(),
      opexQuery.refetch(),
    ]);
  };

  return {
    search,
    selectedBranchId,
    branches,
    categories,
    products,
    productReports,
    stockMovements,
    opexList,
    branchNameMap,
    categoryNameMap,
    productMap,
    reportMap,
    filteredProducts,
    filteredReports,
    filteredMovements,
    filteredOpex,
    summary,
    topRevenueReports,
    lowStockReports,
    pageSize,
    ...pagination,
    isRefreshing,
    isInitialLoading,
    activeBranchName,
    setSearchAndReset,
    setSelectedBranchAndReset,
    refreshAll,
  };
}
