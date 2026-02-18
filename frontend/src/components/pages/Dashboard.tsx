import { ProductReportRanking } from "@/components/dashboard/ProductReportRanking";
import { CurrentMonthCardGroup } from "@/components/dashboard/CurrentMonthCardGroup";
import { MonthlyReportChart } from "@/components/dashboard/MonthlyReportChart";
import { BranchReportChart } from "@/components/dashboard/BranchReportChart";
import {
  Activity,
  Calendar,
  ChartArea,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getBranchReport,
  getCurrentMonthData,
  getMonthlyReport,
  getProductReport,
} from "@/api/report.api";
import { keys } from "@/api/query-keys";
import { Loader } from "../Loader";
import { toPHString } from "@/helpers/formatToPh";

export function Dashboard() {
  const [date] = useState(() => toPHString(new Date()));
  // Fetch Current Month Metrics
  const { data: currentMonthData, isPending: isCurrentMonthPending } = useQuery(
    {
      queryKey: keys.reports.currentMonth(),
      staleTime: 60 * 1000,
      queryFn: getCurrentMonthData,
    },
  );
  // Fetch Monthly Trends
  const { data: monthlyData = [], isPending: isMonthlyPending } = useQuery({
    queryKey: keys.reports.monthly(),
    staleTime: 60 * 1000,
    queryFn: getMonthlyReport,
  });

  const { data: branchData = [], isPending: isBranchDataPending } = useQuery({
    queryKey: keys.reports.branch(),
    staleTime: 60 * 1000,
    queryFn: getBranchReport,
  });

  const { data: productData = [], isPending: isProductDataPending } = useQuery({
    queryKey: keys.reports.product(),
    staleTime: 60 * 1000,
    queryFn: getProductReport,
  });

  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-12">
      {/* 1. HEADER */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl shrink-0">
            <Calendar className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Updated: {date}
            </p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="bg-emerald-50 text-emerald-700 border-emerald-200"
        >
          <Activity className="h-3 w-3 mr-2" /> Live System
        </Badge>
      </section>

      {/* 2. STATS */}
      <section className="block w-full">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold uppercase tracking-tight">
            Key Metrics
          </h2>
        </div>
        {isCurrentMonthPending ? (
          <Loader />
        ) : (
          <CurrentMonthCardGroup data={currentMonthData} />
        )}
      </section>

      {/* 3. CHARTS SECTION */}
      <section className="w-full clear-both">
        <div className="flex items-center gap-2 mb-8">
          <ChartArea className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-bold uppercase tracking-tight">
            Analytics Trends
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {" "}
          {/* Increased gap to 12 */}
          {/* Wrap EACH chart in a div with a fixed min-height */}
          <div className="flex flex-col min-w-0 min-h-[400px]">
            {" "}
            {/* Added min-h */}
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Monthly Revenue
              </span>
            </div>
            <div className="flex-1 w-full relative">
              {isMonthlyPending ? (
                <Loader />
              ) : (
                <MonthlyReportChart data={monthlyData} />
              )}
            </div>
          </div>
          <div className="flex flex-col min-w-0 min-h-[400px]">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Branch Performance
              </span>
            </div>
            <div className="flex-1 w-full relative">
              {isBranchDataPending ? (
                <Loader />
              ) : (
                <BranchReportChart data={branchData} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. RANKINGS SECTION - Added margin top to push it away from charts */}
      <section className="w-full mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-bold uppercase tracking-tight">
            Top Products
          </h2>
        </div>
        <div className="w-full overflow-hidden">
          {isProductDataPending ? (
            <Loader />
          ) : (
            <ProductReportRanking data={productData} />
          )}
        </div>
      </section>
    </div>
  );
}
