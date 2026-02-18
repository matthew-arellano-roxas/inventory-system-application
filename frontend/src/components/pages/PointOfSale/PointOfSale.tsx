import { BranchCard } from "../../pos/BranchCard";
import { Store, Plus } from "lucide-react"; // 1. Added Plus icon
import { useQuery } from "@tanstack/react-query";
import { keys } from "@/api/query-keys";
import { getBranches } from "@/api/branch.api";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button"; // 2. Assuming you use shadcn/ui
import { InputModal } from "@/components/InputModal";
import { usePOSBranchManager } from "@/hooks/usePOSBranchManager";

export const PointOfSalePage = () => {
  const {
    handleBranchView,
    handleBranchDelete,
    handleBranchRename,
    handleOnModalSubmit,
    handleOnModalClose,
    handleAddBranch,
    modal,
  } = usePOSBranchManager();
  const { data: branchData = [], isPending: isBranchDataPending } = useQuery({
    queryKey: keys.branches.all,
    staleTime: 60 * 1000,
    queryFn: getBranches,
  });

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
      {/* 1. HEADER WITH ADD BUTTON */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Store className="h-5 w-5" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tighter uppercase text-slate-900">
              Point of Sale
            </h1>
          </div>
          <p className="text-sm font-medium text-muted-foreground pl-[52px]">
            Select a branch to begin processing transactions.
          </p>
        </div>

        {/* 3. ADD BRANCH BUTTON */}
        <Button
          onClick={handleAddBranch} // Adjust path based on your routes
          className="font-bold uppercase tracking-tight gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Branch
        </Button>
      </header>

      {/* 2. BRANCH GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {isBranchDataPending ? (
          <Loader />
        ) : Array.isArray(branchData) ? ( // 4. SAFETY CHECK: Prevents .map crash
          branchData.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              onView={handleBranchView}
              onDelete={handleBranchDelete}
              onRename={handleBranchRename}
            />
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-muted-foreground border-2 border-dashed rounded-xl">
            No branch data found.
          </div>
        )}
      </div>
      <InputModal
        key={modal.editing ? `edit-${modal.branchId}` : "add-branch"}
        isOpen={modal.isOpen}
        onClose={handleOnModalClose}
        onSubmit={handleOnModalSubmit}
        defaultValue={modal.defaultValue}
        title={modal.title}
        label="Branch Name"
        placeholder="Enter branch name..."
      />
    </div>
  );
};
