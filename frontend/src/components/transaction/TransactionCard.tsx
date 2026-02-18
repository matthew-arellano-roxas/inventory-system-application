import {
  MoreVertical,
  ReceiptText,
  Trash2,
  Calendar,
  Package,
  Tag,
} from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type TransactionResponse } from "@/types/api/response/transaction.response";

interface TransactionCardProps {
  transaction: TransactionResponse;
  onViewReceipt: (id: number) => void;
  onVoid: (id: number) => void;
}

export function TransactionCard({
  transaction,
  onViewReceipt,
  onVoid,
}: TransactionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardDescription className="flex items-center gap-1 font-mono uppercase tracking-tighter">
            #TXN-{transaction.id.toString().padStart(6, "0")}
          </CardDescription>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewReceipt(transaction.id)}>
                <ReceiptText className="mr-2 h-4 w-4" /> View Receipt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onVoid(transaction.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Void
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-xl font-bold">
          ₱
          {transaction.totalAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4">
        {/* Transaction Info Column */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Tag className="mr-1 h-3.5 w-3.5" />
              Type
            </div>
            <Badge variant="outline">{transaction.type}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              Date
            </div>
            <span>
              {format(new Date(transaction.createdAt), "MMM d, yyyy")}
            </span>
          </div>
        </div>

        {/* Items List Column */}
        <div className="space-y-2">
          <div className="flex items-center text-sm font-medium border-b pb-1">
            <Package className="mr-2 h-4 w-4 text-muted-foreground" />
            Items
          </div>
          <ul className="grid gap-1.5">
            {transaction.transactionItem.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between text-sm leading-tight"
              >
                <span className="text-muted-foreground truncate max-w-[180px]">
                  {item.productName}
                </span>
                <span className="font-medium whitespace-nowrap ml-2">
                  x{item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 px-6 py-3 text-[10px] text-muted-foreground flex justify-between">
        <span>Branch ID: {transaction.branchId}</span>
        <span>{format(new Date(transaction.createdAt), "HH:mm aa")}</span>
      </CardFooter>
    </Card>
  );
}
