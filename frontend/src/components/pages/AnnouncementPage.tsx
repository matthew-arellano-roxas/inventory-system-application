import { useMemo, useState } from "react";
import { AnnouncementList } from "@/components/AnnouncementList";
import type { AnnouncementType } from "@/types/api/response/announcement.response";
import { Megaphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { keys } from "@/api/query-keys";
import { getAnnouncement } from "@/api/announcement.api";
import { Loader } from "@/components/Loader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AnnouncementPage() {
  const [filter, setFilter] = useState<AnnouncementType | "ALL">("ALL");

  const { data: announcements = [], isPending: isQueryPending } = useQuery({
    queryKey: keys.announcements.all,
    staleTime: 60000, // 1 minute as suggested
    queryFn: getAnnouncement,
  });

  const filtered = useMemo(() => {
    if (filter === "ALL") return announcements;
    return announcements.filter((a) => a.type === filter);
  }, [filter, announcements]);

  if (isQueryPending) return <Loader />;

  return (
    <div className="mx-auto max-w-screen-xl space-y-6 overflow-x-hidden px-4 py-1 md:px-6">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#f97316,_transparent_40%),radial-gradient(circle_at_bottom_left,_#22d3ee,_transparent_35%)]" />
        <div className="relative p-4 sm:p-6">
          <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-black tracking-tight uppercase break-words">
                    Announcements
                  </h1>
                  <p className="text-sm text-white/70 break-words">
                    Company-wide alerts, stock notices, and resource updates.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="rounded-full border-white/15 bg-white/10 px-3 py-1 text-white hover:bg-white/10">
                  {announcements.length} Total
                </Badge>
                <Badge className="rounded-full border-white/15 bg-white/10 px-3 py-1 text-white hover:bg-white/10">
                  {filtered.length} Showing
                </Badge>
              </div>
            </div>
            <div className="w-full rounded-xl bg-white/10 p-3 ring-1 ring-white/10 md:w-auto md:min-w-[160px]">
              <p className="text-[10px] uppercase tracking-widest text-white/60">
                Active Filter
              </p>
              <p className="mt-1 text-sm font-semibold">{filter}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 p-4 shadow-sm sm:p-5">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Filters
            </p>
            <p className="text-sm text-muted-foreground">
              Narrow announcements by type.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={filter === "ALL" ? "default" : "outline"}
              onClick={() => setFilter("ALL")}
              className="rounded-full"
            >
              All
            </Button>
            <Button
              type="button"
              variant={filter === "STOCK" ? "default" : "outline"}
              onClick={() => setFilter("STOCK")}
              className={
                filter === "STOCK"
                  ? "rounded-full bg-rose-600 text-white hover:bg-rose-700"
                  : "rounded-full"
              }
            >
              Stock
            </Button>
            <Button
              type="button"
              variant={filter === "RESOURCE" ? "default" : "outline"}
              onClick={() => setFilter("RESOURCE")}
              className={
                filter === "RESOURCE"
                  ? "rounded-full bg-sky-600 text-white hover:bg-sky-700"
                  : "rounded-full"
              }
            >
              Resource
            </Button>
          </div>
        </div>
      </Card>

      <Card className="border-border/60 bg-background/80 p-3 shadow-sm sm:p-4">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Feed
            </p>
            <p className="text-sm text-muted-foreground">
              Latest announcements based on your selected filter.
            </p>
          </div>
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
            {filtered.length} item{filtered.length === 1 ? "" : "s"}
          </Badge>
        </div>
        <div className="w-full overflow-hidden">
          <AnnouncementList data={filtered} />
        </div>
      </Card>
    </div>
  );
}
