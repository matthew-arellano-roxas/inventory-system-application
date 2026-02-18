import {
  TrendingUp,
  TrendingDown,
  PhilippinePeso,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/helpers/formatCurrency";
import { type CurrentMonthReportResponse } from "@/types/api/response";
// Mock data
interface CurrentMonthCardsProps {
  data?: CurrentMonthReportResponse;
}

export function CurrentMonthCardGroup({
  data = {
    damage: 0,
    profit: 0,
    revenue: 0,
  },
}: CurrentMonthCardsProps) {
  const cards = [
    {
      title: "Revenue",
      value: data.revenue,
      icon: PhilippinePeso,
      iconColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      trend: data.revenue !== null && data.revenue > 0 ? "up" : null,
    },
    {
      title: "Profit",
      value: data.profit,
      icon: TrendingUp,
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      trend:
        data.profit !== null && data.profit > 0
          ? "up"
          : data.profit !== null && data.profit < 0
            ? "down"
            : null,
    },
    {
      title: "Damage",
      value: data.damage,
      icon: AlertTriangle,
      iconColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      trend: null,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(card.value)}
              </div>
              {card.trend && (
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {card.trend === "up" ? (
                    <>
                      <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                      <span className="text-green-600">Positive</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                      <span className="text-red-600">Negative</span>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
