"use client";

import { useMemo } from "react";
import { LabelList, Pie, PieChart } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type PieDatum = Record<string, string | number>;

const DEFAULT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

export function FlexiblePieChart<T extends PieDatum>({
  title,
  description,
  data,
  valueKey,
  nameKey,
  showLabels = true,
}: {
  title: string;
  description?: string;
  data: T[];
  valueKey: keyof T;
  nameKey: keyof T;
  showLabels?: boolean;
}) {
  const normalized = useMemo(() => {
    return data.map((item, idx) => ({
      ...item,
      fill: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
    }));
  }, [data]);

  const config = useMemo(() => {
    const base: ChartConfig = {
      [String(valueKey)]: { label: String(valueKey) },
    };

    for (const item of data) {
      const name = String(item[nameKey]);
      base[name] = { label: name };
    }

    return base;
  }, [data, nameKey, valueKey]);

  // ---------- Footer Computations ----------
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + Number(item[valueKey]), 0);
  }, [data, valueKey]);

  const topItem = useMemo(() => {
    if (!data.length) return null;
    return [...data].sort(
      (a, b) => Number(b[valueKey]) - Number(a[valueKey]),
    )[0];
  }, [data, valueKey]);

  // fake trend example (optional)
  const trendUp = true;
  // ----------------------------------------

  return (
    <Card className="flex flex-col min-w-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="flex-1 pb-0 min-w-0">
        <ChartContainer
          config={config}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square w-full max-w-[380px] max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey={String(valueKey)} />}
            />

            <Pie
              data={normalized}
              dataKey={String(valueKey)}
              nameKey={String(nameKey)}
            >
              {showLabels && (
                <LabelList
                  dataKey={String(nameKey)}
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                />
              )}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      {/* ---------- Footer ---------- */}
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          {trendUp ? (
            <>
              Top: {String(topItem?.[nameKey])}{" "}
              <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Performance down <TrendingDown className="h-4 w-4" />
            </>
          )}
        </div>

        <div className="text-muted-foreground">
          Total {String(valueKey)}: {total.toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  );
}
