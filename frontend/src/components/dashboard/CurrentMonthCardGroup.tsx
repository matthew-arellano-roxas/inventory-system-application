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
      iconColor: "text-emerald-600 dark:text-emerald-300",
      bgColor: "bg-emerald-500/10 dark:bg-emerald-400/10",
      cardClassName:
        "border-emerald-200/70 bg-gradient-to-b from-emerald-50/80 to-background dark:from-emerald-400/8 dark:to-card dark:border-emerald-900/40",
      trend: data.revenue !== null && data.revenue > 0 ? "up" : null,
    },
    {
      title: "Profit",
      value: data.profit,
      icon: TrendingUp,
      iconColor: "text-primary dark:text-primary",
      bgColor: "bg-primary/10 dark:bg-primary/15",
      cardClassName:
        "border-primary/20 bg-gradient-to-b from-primary/5 to-background dark:from-primary/10 dark:to-card dark:border-primary/25",
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
      iconColor: "text-rose-600 dark:text-rose-300",
      bgColor: "bg-rose-500/10 dark:bg-rose-400/10",
      cardClassName:
        "border-rose-200/70 bg-gradient-to-b from-rose-50/80 to-background dark:from-rose-400/8 dark:to-card dark:border-rose-900/40",
      trend: null,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className={`overflow-hidden shadow-sm ${card.cardClassName}`}
          >
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
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                  {card.trend === "up" ? (
                    <>
                      <TrendingUp className="mr-1 h-3 w-3 text-emerald-600 dark:text-emerald-300" />
                      <span className="text-emerald-600 dark:text-emerald-300">
                        Positive
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="mr-1 h-3 w-3 text-rose-600 dark:text-rose-300" />
                      <span className="text-rose-600 dark:text-rose-300">
                        Negative
                      </span>
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
