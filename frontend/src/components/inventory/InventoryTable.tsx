import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "../ui/button";

interface ProductInfo {
  id: number;
  name: string;
  branchId: number;
  categoryId: number;
  costPerUnit: number;
  soldBy: string;
  sellingPrice: number;
  addedBy: string;
  createdAt: string;
}

interface ProductReport {
  id: number;
  name: string;
  stock: number;
  opex: number;
  sales: number;
  profit: number;
}

interface Props {
  infoData: ProductInfo[];
  reportData: ProductReport[];
  className?: string;
}

export function InventoryTable({ infoData, reportData, className }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. Filter Data
  const filteredInfo = useMemo(
    () =>
      infoData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [infoData, searchTerm],
  );

  const filteredReport = useMemo(
    () =>
      reportData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [reportData, searchTerm],
  );

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredInfo.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedInfo = filteredInfo.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const paginatedReport = filteredReport.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const totals = filteredReport.reduce(
    (acc, curr) => ({
      sales: acc.sales + curr.sales,
      profit: acc.profit + curr.profit,
      opex: acc.opex + curr.opex,
      net: acc.net + (curr.profit - curr.opex),
    }),
    { sales: 0, profit: 0, opex: 0, net: 0 },
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* --- SEARCH & PAGINATION (Original Style) --- */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground mr-2">
            Page {currentPage} of {totalPages || 1}
          </p>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" onValueChange={() => setCurrentPage(1)}>
        <TabsList className="flex w-full justify-start bg-muted p-1 overflow-scroll md:overflow-auto border border-border">
          <TabsTrigger value="info">Product Info</TabsTrigger>
          <TabsTrigger value="report">Product Report</TabsTrigger>
          <TabsTrigger value="opex">Operating Expense</TabsTrigger>
        </TabsList>

        {/* --- TAB 1 & 2 remain exactly as you had them --- */}
        <TabsContent value="info">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInfo.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs">
                          #{item.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>Cat-{item.categoryId}</TableCell>
                        <TableCell>₱{item.costPerUnit.toFixed(2)}</TableCell>
                        <TableCell className="font-semibold text-primary">
                          ₱{item.sellingPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                          {format(new Date(item.createdAt), "MM/dd/yy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">Stock</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead className="text-right">Net Profit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReport.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.stock}
                        </TableCell>
                        <TableCell>₱{item.sales.toLocaleString()}</TableCell>
                        <TableCell
                          className={`text-right font-bold ${item.profit - item.opex < 0 ? "text-destructive" : "text-green-600"}`}
                        >
                          ₱{(item.profit - item.opex).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell colSpan={2}>Grand Total (Filtered)</TableCell>
                      <TableCell>₱{totals.sales.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600">
                        ₱{totals.net.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- RESTORED OPEX TAB WITH ACTIONS --- */}
        <TabsContent value="opex">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Gross Profit</TableHead>
                      <TableHead>Operating Expense</TableHead>
                      <TableHead>Net Result</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReport.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>₱{item.profit.toLocaleString()}</TableCell>
                        <TableCell className="text-destructive">
                          ₱{item.opex.toLocaleString()}
                        </TableCell>
                        <TableCell
                          className={`font-bold ${item.profit - item.opex < 0 ? "text-destructive" : "text-green-600"}`}
                        >
                          ₱{(item.profit - item.opex).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary"
                              onClick={() => console.log("Edit Opex", item.id)}
                            >
                              Update
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() =>
                                console.log("Delete Opex", item.id)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell colSpan={2}>Total Operating Expense</TableCell>
                      <TableCell className="text-destructive text-lg">
                        ₱{totals.opex.toLocaleString()}
                      </TableCell>
                      <TableCell colSpan={2} className="text-right">
                        Filtered View
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
