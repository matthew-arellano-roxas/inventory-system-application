import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Receipt, PlusCircle, Trash2 } from "lucide-react"; // Imported Trash2
import { Button } from "@/components/ui/button";

interface OpexItem {
  id?: number | string;
  name: string;
  value: number;
}

interface OpexCardProps {
  expenses: OpexItem[];
  onAddExpense?: () => void;
  onDeleteExpense?: (index: number) => void; // Added delete handler
}

export function OpexCard({
  expenses,
  onAddExpense,
  onDeleteExpense,
}: OpexCardProps) {
  const totalOpex = expenses.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-wrap gap-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Receipt className="h-5 w-5 text-muted-foreground" />
            Operating Expenses
          </CardTitle>
          <CardDescription>
            Fixed and variable costs for this period
          </CardDescription>
        </div>
        {onAddExpense && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddExpense}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Expense Name</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                {/* 1. Added Action Header */}
                <TableHead className="w-[50px] text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No expenses recorded.
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((item, index) => (
                  <TableRow key={item.id ?? index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right font-mono">
                      ₱
                      {item.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    {/* 2. Added Delete Button Cell */}
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDeleteExpense?.(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {expenses.length > 0 && (
              <TableFooter className="bg-muted/20">
                <TableRow className="font-bold">
                  <TableCell>Total Opex</TableCell>
                  <TableCell className="text-right text-destructive text-lg">
                    ₱
                    {totalOpex.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  {/* Empty cell for footer alignment */}
                  <TableCell />
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
