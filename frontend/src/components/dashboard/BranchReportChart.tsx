import { FlexiblePieChart } from "@/components/FlexiblePieChart";
import { EmptyMini } from "@/components/pages/inventory/inventory-page.shared";
import type { BranchReportResponse } from "@/types/api/response/report.response";
import { useMemo } from "react";

type BranchSlice = {
  branchName: string;
  revenue: number;
};
type BranchReportChartProps = {
  data: BranchReportResponse[];
};

function getBranchReportSlices(data: BranchReportResponse[]): BranchSlice[] {
  return data.map(
    (item) =>
      ({
        branchName: item.branchName,
        revenue: Number(item.revenue) || 0,
      }) as BranchSlice,
  );
}

export function BranchReportChart({ data }: BranchReportChartProps) {
  const slices = useMemo(() => getBranchReportSlices(data), [data]);
  const hasRevenue = useMemo(
    () => slices.some((slice) => Number(slice.revenue) > 0),
    [slices],
  );

  if (!hasRevenue) {
    return <EmptyMini text="No branch revenue available yet." />;
  }

  return (
    <FlexiblePieChart
      title="Branch Revenue Share"
      description="This year"
      data={slices}
      nameKey="branchName"
      valueKey="revenue"
    />
  );
}
