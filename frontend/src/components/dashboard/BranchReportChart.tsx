import { FlexiblePieChart } from "@/components/FlexiblePieChart";
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
        revenue: item.revenue,
      }) as BranchSlice,
  );
}

export function BranchReportChart({ data }: BranchReportChartProps) {
  const slices = useMemo(() => getBranchReportSlices(data), [data]);
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
