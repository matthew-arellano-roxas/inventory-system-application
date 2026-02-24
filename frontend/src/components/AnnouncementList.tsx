import { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "./ui/card";
import { typeBadgeClass, typeLabel } from "@/helpers/announcement";
import { formatDateTime } from "@/helpers/formatToPh";
import type { AnnouncementResponse } from "@/types/api/response/announcement.response";

export function AnnouncementList({
  data,
}: {
  data: AnnouncementResponse[] | null | undefined;
}) {
  const sorted = useMemo(() => {
    return [...(data ?? [])].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [data]);

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>Failed to load announcements</CardDescription>
        </CardHeader>
        <CardContent className="py-10 text-center text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    );
  }

  if (sorted.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>All caught up</CardDescription>
        </CardHeader>
        <CardContent className="py-10 text-center text-muted-foreground">
          No announcements to show
        </CardContent>
      </Card>
    );
  }

  return (
    <CardContent className="space-y-3 p-0 sm:p-1">
      {sorted.map((a) => (
        <div
          key={a.id}
          className="rounded-xl border p-3 sm:p-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${typeBadgeClass(
                    a.type,
                  )}`}
                >
                  {typeLabel(a.type)}
                </span>

                <span className="text-xs text-muted-foreground break-words">
                  {formatDateTime(a.createdAt)}
                </span>
              </div>

              <h3 className="mt-2 font-semibold text-foreground leading-tight break-words">
                {a.title}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground leading-relaxed break-words">
                {a.message}
              </p>
            </div>
          </div>
        </div>
      ))}
    </CardContent>
  );
}
