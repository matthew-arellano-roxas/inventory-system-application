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
import { Card } from "../ui/card";
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
    queryFn: () => getProductReport(),
  });

  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-12 bg-muted">
      {/* 1. HEADER */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#22d3ee,_transparent_40%),radial-gradient(circle_at_bottom_left,_#f59e0b,_transparent_35%)]" />
        <div className="relative p-4 sm:p-6">
          <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-black tracking-tight uppercase break-words">
                    Dashboard
                  </h1>
                  <p className="text-sm text-white/70 break-words">
                    Business metrics, revenue trends, and top product
                    performance.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="rounded-full border-white/15 bg-white/10 px-3 py-1 text-white hover:bg-white/10">
                  {productData.length} Ranked Products
                </Badge>
                <Badge className="rounded-full border-white/15 bg-white/10 px-3 py-1 text-white hover:bg-white/10">
                  Updated {date}
                </Badge>
              </div>
            </div>
            <div className="w-full rounded-xl bg-white/10 p-3 ring-1 ring-white/10 md:w-auto md:min-w-[170px]">
              <p className="text-[10px] uppercase tracking-widest text-white/60">
                System Status
              </p>
              <p className="mt-1 flex items-center text-sm font-semibold">
                <Activity className="mr-2 h-3.5 w-3.5 text-emerald-300" />
                Live System
              </p>
            </div>
          </div>
        </div>
      </Card>

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
