import { getBranches } from "@/api/branch.api";
import { createOpex, deleteOpex, getOpexList } from "@/api/opex.api";
import { keys } from "@/api/query-keys";
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
      toast.error("Failed to create expense.");
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
      toast.error("Failed to delete expense.");
    },
  });

  const branches = useMemo(() => branchesQuery.data ?? [], [branchesQuery.data]);
  const expenses = useMemo(() => opexQuery.data ?? [], [opexQuery.data]);

  const branchNameMap = useMemo(
    () => new Map<number, string>(branches.map((b) => [b.id, b.name])),
    [branches],
  );

  const branchFilter = selectedBranchId === "all" ? null : Number(selectedBranchId);

  const filteredExpenses = useMemo(
    () =>
      expenses.filter((e) => {
        if (branchFilter != null && e.branchId !== branchFilter) return false;
        return containsSearch(search, e.id, e.name, e.branchId, e.amount);
      }),
    [branchFilter, expenses, search],
  );

  const summary = useMemo(() => {
    const total = filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const thisMonth = filteredExpenses.filter((e) => {
      const d = new Date(e.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return { total, count: filteredExpenses.length, thisMonth };
  }, [filteredExpenses]);

  const pagination = usePagination(filteredExpenses, 12);

  const isRefreshing = branchesQuery.isFetching || opexQuery.isFetching;
  const activeBranchName =
    branchFilter == null
      ? "All Branches"
      : branchNameMap.get(branchFilter) ?? `Branch #${branchFilter}`;

  const isInitialLoading =
    !branchesQuery.data &&
    !opexQuery.data &&
    (branchesQuery.isPending || opexQuery.isPending);

  const setSearchAndReset = (value: string) => {
    setSearch(value);
    pagination.resetPage();
  };

  const setSelectedBranchAndReset = (value: string) => {
    setSelectedBranchId(value);
    pagination.resetPage();
  };

  const refreshAll = async () => {
    await Promise.all([branchesQuery.refetch(), opexQuery.refetch()]);
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
