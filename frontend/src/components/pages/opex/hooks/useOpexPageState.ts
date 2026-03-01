import { getBranches } from "@/api/branch.api";
import { createOpex, deleteOpex, getOpexList } from "@/api/opex.api";
import { parseApiError } from "@/api/api-error-handler";
import { keys } from "@/api/query-keys";
import {
  getFinancialReportByBranchId,
  getFinancialReportList,
} from "@/api/report.api";
import { usePagination } from "@/hooks/usePagination";
import type { ExpensePayload } from "@/types/api/payload";
import type { ExpenseResponse } from "@/types/api/response/opex.reponse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { OpexFormState } from "../OpexCreateDialog";

function containsSearch(
  search: string,
  ...parts: Array<string | number | null | undefined>
) {
  if (!search.trim()) return true;
  const needle = search.toLowerCase();
  return parts.some((part) => String(part ?? "").toLowerCase().includes(needle));
}

export const initialOpexFormState: OpexFormState = {
  name: "",
  branchId: "",
  amount: "",
};

export function useOpexPageState() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState<OpexFormState>(initialOpexFormState);
  const branchFilter = selectedBranchId === "all" ? null : Number(selectedBranchId);

  const branchesQuery = useQuery({
    queryKey: keys.branches.all,
    queryFn: getBranches,
    staleTime: 60 * 1000,
  });

  const opexQuery = useQuery({
    queryKey: ["expenses"],
    queryFn: getOpexList,
    staleTime: 30 * 1000,
  });

  const financialReportListQuery = useQuery({
    queryKey: keys.reports.branchFinancialList(),
    queryFn: getFinancialReportList,
    staleTime: 60 * 1000,
  });

  const financialReportByBranchQuery = useQuery({
    queryKey: keys.reports.branchFinancialById(branchFilter ?? 0),
    queryFn: () => getFinancialReportByBranchId(branchFilter as number),
    enabled: branchFilter != null,
    staleTime: 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: createOpex,
    onSuccess: async (createdExpense) => {
      if (createdExpense) {
        qc.setQueryData<ExpenseResponse[]>(["expenses"], (prev) =>
          prev ? [createdExpense, ...prev] : [createdExpense],
        );
      }
      await qc.invalidateQueries({ queryKey: ["expenses"] });
      await opexQuery.refetch();
      toast.success("Expense created successfully.");
      setIsCreateOpen(false);
      setForm(initialOpexFormState);
    },
    onError: (error) => {
      console.error("Failed to create expense", error);
      const parsed = parseApiError(error);
      toast.error(
        parsed.message && parsed.message !== "Request failed"
          ? parsed.message
          : "Failed to create expense.",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOpex,
    onSuccess: async (deletedExpense) => {
      if (deletedExpense) {
        qc.setQueryData<ExpenseResponse[]>(["expenses"], (prev) =>
          prev?.filter((expense) => expense.id !== deletedExpense.id) ?? prev,
        );
      }
      await qc.invalidateQueries({ queryKey: ["expenses"] });
      await opexQuery.refetch();
      toast.success("Expense deleted.");
    },
    onError: (error) => {
      console.error("Failed to delete expense", error);
      const parsed = parseApiError(error);
      toast.error(
        parsed.message && parsed.message !== "Request failed"
          ? parsed.message
          : "Failed to delete expense.",
      );
    },
  });

  const branches = useMemo(() => branchesQuery.data ?? [], [branchesQuery.data]);
  const expenses = useMemo(() => opexQuery.data ?? [], [opexQuery.data]);

  const branchNameMap = useMemo(
    () => new Map<number, string>(branches.map((b) => [b.id, b.name])),
    [branches],
  );

  const filteredExpenses = useMemo(
    () =>
      expenses.filter((e) => {
        if (branchFilter != null && e.branchId !== branchFilter) return false;
        return containsSearch(search, e.id, e.name, e.branchId, e.amount);
      }),
    [branchFilter, expenses, search],
  );

  const summary = useMemo(() => {
    const currentFinancial =
      branchFilter != null ? financialReportByBranchQuery.data : undefined;

    const totalsFromFinancial = currentFinancial
      ? {
          total: Number(currentFinancial.operationExpenses) || 0,
          grossProfit: Number(currentFinancial.profit) || 0,
          netProfit: Number(currentFinancial.netProfit) || 0,
        }
      : (financialReportListQuery.data ?? []).reduce(
          (acc, report) => ({
            total: acc.total + (Number(report.operationExpenses) || 0),
            grossProfit: acc.grossProfit + (Number(report.profit) || 0),
            netProfit: acc.netProfit + (Number(report.netProfit) || 0),
          }),
          { total: 0, grossProfit: 0, netProfit: 0 },
        );

    const thisMonth = filteredExpenses.filter((e) => {
      const d = new Date(e.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return {
      total: totalsFromFinancial.total,
      grossProfit: totalsFromFinancial.grossProfit,
      netProfit: totalsFromFinancial.netProfit,
      count: filteredExpenses.length,
      thisMonth,
    };
  }, [branchFilter, filteredExpenses, financialReportByBranchQuery.data, financialReportListQuery.data]);

  const pagination = usePagination(filteredExpenses, 12);

  const isRefreshing =
    branchesQuery.isFetching ||
    opexQuery.isFetching ||
    financialReportListQuery.isFetching ||
    financialReportByBranchQuery.isFetching;
  const activeBranchName =
    branchFilter == null
      ? "All Branches"
      : branchNameMap.get(branchFilter) ?? `Branch #${branchFilter}`;

  const isInitialLoading =
    !branchesQuery.data &&
    !opexQuery.data &&
    !financialReportListQuery.data &&
    (branchFilter == null || !financialReportByBranchQuery.data) &&
    (branchesQuery.isPending ||
      opexQuery.isPending ||
      financialReportListQuery.isPending ||
      (branchFilter != null && financialReportByBranchQuery.isPending));

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
      opexQuery.refetch(),
      financialReportListQuery.refetch(),
      ...(branchFilter != null ? [financialReportByBranchQuery.refetch()] : []),
    ]);
  };

  const submitCreate = async () => {
    const payload: ExpensePayload = {
      name: form.name.trim(),
      branchId: Number(form.branchId),
      amount: Number(form.amount),
    };

    if (!payload.name) {
      toast.error("Expense name is required.");
      return;
    }
    if (!Number.isFinite(payload.branchId) || payload.branchId <= 0) {
      toast.error("Select a valid branch.");
      return;
    }
    if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }

    await createMutation.mutateAsync(payload);
  };

  const deleteExpense = (id: number) => {
    deleteMutation.mutate(id);
  };

  return {
    search,
    setSearchAndReset,
    selectedBranchId,
    setSelectedBranchAndReset,
    isCreateOpen,
    setIsCreateOpen,
    form,
    setForm,
    branches,
    branchNameMap,
    filteredExpenses,
    summary,
    ...pagination,
    isRefreshing,
    activeBranchName,
    isInitialLoading,
    refreshAll,
    submitCreate,
    deleteExpense,
    createMutation,
    deleteMutation,
  };
}
