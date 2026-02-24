import { BranchCard } from "../../pos/BranchCard";
import { Store, Plus } from "lucide-react"; // 1. Added Plus icon
import { useQuery } from "@tanstack/react-query";
import { keys } from "@/api/query-keys";
import { getBranches } from "@/api/branch.api";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button"; // 2. Assuming you use shadcn/ui
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const branchCount = Array.isArray(branchData) ? branchData.length : 0;

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 pb-8 sm:px-6 lg:px-8">
      <Card className="relative mb-6 overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#22d3ee,_transparent_45%),radial-gradient(circle_at_bottom_left,_#f59e0b,_transparent_35%)]" />
        <div className="relative p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
                  <Store className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-black tracking-tighter uppercase text-white sm:text-3xl break-words">
                    Point of Sale
                  </h1>
                  <p className="text-sm font-medium text-white/70">
                    Select a branch to begin processing transactions.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="rounded-full border-white/15 bg-white/10 px-3 py-1 text-white hover:bg-white/10">
                  Branch Selector
                </Badge>
                <Badge className="rounded-full border-white/15 bg-white/10 px-3 py-1 text-white hover:bg-white/10">
                  POS Ready
                </Badge>
              </div>
            </div>

            <div className="grid w-full max-w-full grid-cols-2 gap-2 lg:w-auto lg:min-w-[300px]">
              <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/10">
                <p className="text-[10px] uppercase tracking-widest text-white/60">
                  Branches
                </p>
                <p className="mt-1 text-lg font-bold leading-none">
                  {isBranchDataPending ? "..." : branchCount}
                </p>
              </div>
              <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/10">
                <p className="text-[10px] uppercase tracking-widest text-white/60">
                  Status
                </p>
                <p className="mt-1 text-sm font-semibold leading-none">
                  {isBranchDataPending ? "Loading" : "Online"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 p-4 shadow-sm sm:p-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Branch Directory
            </p>
            <h2 className="text-xl font-black tracking-tight">Choose a Branch</h2>
            <p className="text-sm text-muted-foreground">
              Open a branch to start selling, or create a new branch for another location.
            </p>
          </div>

          <Button
            onClick={handleAddBranch}
            className="font-bold uppercase tracking-tight gap-2 rounded-xl shadow-md"
          >
            <Plus className="h-4 w-4" />
            Add Branch
          </Button>
        </header>
      </Card>

      <Card className="mt-6 border-border/60 bg-background/80 p-3 shadow-sm sm:p-4">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Available Branches
            </p>
            <p className="text-sm text-muted-foreground">
              Select a branch card to manage products and process transactions.
            </p>
          </div>
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
            {isBranchDataPending ? "Loading..." : `${branchCount} Branches`}
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isBranchDataPending ? (
            <div className="col-span-full flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed bg-muted/20">
              <Loader />
            </div>
          ) : Array.isArray(branchData) ? (
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
            <div className="col-span-full rounded-2xl border-2 border-dashed py-12 text-center text-muted-foreground">
              No branch data found.
            </div>
          )}
        </div>
      </Card>
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
