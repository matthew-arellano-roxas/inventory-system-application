import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/helpers/formatCurrency";
import type { ExpenseResponse } from "@/types/api/response/opex.reponse";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

type OpexExpenseTableSectionProps = {
  filteredExpenses: ExpenseResponse[];
  paginatedExpenses: ExpenseResponse[];
  safePage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onDelete: (expense: ExpenseResponse) => void;
  isDeleting: boolean;
  branchNameMap: Map<number, string>;
};

export function OpexExpenseTableSection({
  filteredExpenses,
  paginatedExpenses,
  safePage,
  totalPages,
  onPrevPage,
  onNextPage,
  onDelete,
  isDeleting,
  branchNameMap,
}: OpexExpenseTableSectionProps) {
  return (
    <Card className="border-border/70 bg-background shadow-sm">
      <div className="border-b p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Expense Table
            </p>
            <p className="text-sm text-muted-foreground">
              Use create and delete to maintain expense entries.
            </p>
          </div>
          {filteredExpenses.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={onPrevPage}
                disabled={safePage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={onNextPage}
                disabled={safePage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="flex min-h-[220px] items-center justify-center p-6 text-center">
          <div>
            <p className="font-semibold">No expenses found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing the search or branch filter, or create a new expense.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-3 p-4 md:hidden">
            {paginatedExpenses.map((expense) => (
              <Card
                key={expense.id}
                className="border-border/70 bg-background/80 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{expense.name}</p>
                    <p className="text-xs text-muted-foreground">#{expense.id}</p>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {branchNameMap.get(expense.branchId) ?? `#${expense.branchId}`}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <OpexMiniTile
                    label="Amount"
                    value={formatCurrency(Number(expense.amount) || 0)}
                  />
                  <OpexMiniTile
                    label="Date"
                    value={format(new Date(expense.createdAt), "MMM d, yyyy")}
                  />
                </div>
                <Button
                  variant="ghost"
                  className="mt-3 w-full text-destructive hover:text-destructive"
                  onClick={() => onDelete(expense)}
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </Card>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-mono text-xs">#{expense.id}</TableCell>
                    <TableCell className="font-medium">{expense.name}</TableCell>
                    <TableCell>
                      {branchNameMap.get(expense.branchId) ?? `Branch #${expense.branchId}`}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-rose-600">
                      {formatCurrency(Number(expense.amount) || 0)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {format(new Date(expense.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(expense)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </Card>
  );
}

function OpexMiniTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background p-3 shadow-sm">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold">{value}</p>
    </div>
  );
}
