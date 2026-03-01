import { ReusableSelect } from "@/components/ReusableSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/helpers/formatCurrency";
import type { BranchResponse } from "@/types/api/response";
import {
  LayoutGrid,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  ShoppingBasket,
} from "lucide-react";
import { Link } from "react-router";

type OpexPageHeaderProps = {
  activeBranchName: string;
  summary: {
    total: number;
    grossProfit: number;
    netProfit: number;
    count: number;
    thisMonth: number;
  };
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenCreate: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  branches: BranchResponse[];
  selectedBranchId: string;
  onBranchChange: (value: string) => void;
  safePage: number;
  totalPages: number;
};

export function OpexPageHeader(props: OpexPageHeaderProps) {
  const {
    activeBranchName,
    summary,
    isRefreshing,
    onRefresh,
    onOpenCreate,
    search,
    onSearchChange,
    branches,
    selectedBranchId,
    onBranchChange,
    safePage,
    totalPages,
  } = props;

  return (
    <>
      <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-rose-50 via-background to-orange-50 shadow-sm">
        <div className="border-b border-border/60 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white">
                  <Receipt className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                    Operating Expenses
                  </h1>
                  <p className="text-sm text-slate-600">
                    Manage expense entries and monitor branch spending.
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {activeBranchName}
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {summary.count} entries
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  This month: {summary.thisMonth}
                </Badge>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button
                variant="outline"
                className="gap-2"
                onClick={onRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={isRefreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                Refresh
              </Button>
              <Button className="gap-2" onClick={onOpenCreate}>
                <Plus className="h-4 w-4" />
                Create OPEX
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-5">
          <HeaderTile label="Total OPEX" value={formatCurrency(summary.total)} />
          <HeaderTile label="Gross Profit" value={formatCurrency(summary.grossProfit)} />
          <HeaderTile label="Net Profit" value={formatCurrency(summary.netProfit)} />
          <HeaderTile label="Filtered Rows" value={String(summary.count)} />
          <HeaderTile label="Active Branch" value={activeBranchName} />
        </div>
      </Card>

      <Card className="border-border/70 bg-background p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Navigation
            </p>
            <p className="text-sm text-muted-foreground">
              Jump between inventory and POS while managing expenses.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/inventory">
                <LayoutGrid className="h-4 w-4" />
                Inventory
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/pos">
                <ShoppingBasket className="h-4 w-4" />
                POS
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <Card className="sticky top-2 z-10 overflow-hidden border-border/70 bg-background/90 p-4 shadow-sm backdrop-blur">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px_auto]">
          <div className="min-w-0">
            <p className="mb-2 ml-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Search Expenses
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
                placeholder="Search by name, id, amount..."
              />
            </div>
          </div>

          <div className="min-w-0">
            <ReusableSelect<BranchResponse>
              label="Branch"
              items={branches}
              value={selectedBranchId}
              onValueChange={onBranchChange}
              itemKey="id"
              itemLabel="name"
              placeholder="Select Branch"
              showAllOption={true}
            />
          </div>

          <div className="flex items-end">
            <div className="w-full rounded-xl border bg-muted/20 px-3 py-2 text-sm lg:w-auto">
              Page {safePage}/{totalPages}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

function HeaderTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background p-3 shadow-sm">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold">{value}</p>
    </div>
  );
}
