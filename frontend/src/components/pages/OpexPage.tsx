import { Loader } from "@/components/Loader";
import { OpexCreateDialog } from "@/components/pages/opex/OpexCreateDialog";
import { OpexExpenseTableSection } from "@/components/pages/opex/OpexExpenseTableSection";
import { OpexPageHeader } from "@/components/pages/opex/OpexPageHeader";
import {
  initialOpexFormState,
  useOpexPageState,
} from "@/components/pages/opex/hooks/useOpexPageState";
import { Card } from "@/components/ui/card";
import type { ExpenseResponse } from "@/types/api/response/opex.reponse";

export function OpexPage() {
  const state = useOpexPageState();
  const handleDelete = (expense: ExpenseResponse) =>
    state.deleteExpense(expense.id);

  if (state.isInitialLoading) {
    return (
      <div className="p-4 lg:p-6">
        <Card className="border-border/70 bg-background/80 p-8 shadow-sm">
          <Loader />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5 overflow-x-hidden px-3 py-4 sm:px-4 lg:px-6">
      <OpexPageHeader
        activeBranchName={state.activeBranchName}
        summary={state.summary}
        isRefreshing={state.isRefreshing}
        onRefresh={() => void state.refreshAll()}
        onOpenCreate={() => state.setIsCreateOpen(true)}
        search={state.search}
        onSearchChange={state.setSearchAndReset}
        branches={state.branches}
        selectedBranchId={state.selectedBranchId}
        onBranchChange={state.setSelectedBranchAndReset}
        safePage={state.safePage}
        totalPages={state.totalPages}
      />

      <OpexExpenseTableSection
        filteredExpenses={state.filteredExpenses}
        paginatedExpenses={state.paginatedItems}
        safePage={state.safePage}
        totalPages={state.totalPages}
        onPrevPage={state.prevPage}
        onNextPage={state.nextPage}
        onDelete={handleDelete}
        isDeleting={state.deleteMutation.isPending}
        branchNameMap={state.branchNameMap}
      />

      <OpexCreateDialog
        open={state.isCreateOpen}
        onOpenChange={(open) => {
          state.setIsCreateOpen(open);
          if (!open) state.setForm(initialOpexFormState);
        }}
        form={state.form}
        onFormChange={state.setForm}
        branches={state.branches}
        onSubmit={() => void state.submitCreate()}
        isSubmitting={state.createMutation.isPending}
      />
    </div>
  );
}
