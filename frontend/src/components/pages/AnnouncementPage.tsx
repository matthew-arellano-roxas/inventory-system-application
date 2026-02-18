import { useMemo, useState } from "react";
import { AnnouncementList } from "@/components/AnnouncementList";
import type { AnnouncementType } from "@/types/api/response/announcement.response";
import { Megaphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { keys } from "@/api/query-keys";
import { getAnnouncement } from "@/api/announcement.api";
import { Loader } from "@/components/Loader";

export function AnnouncementPage() {
  const [filter, setFilter] = useState<AnnouncementType | "ALL">("ALL");

  const { data: announcements = [], isPending: isQueryPending } = useQuery({
    queryKey: keys.announcements.all,
    staleTime: 0, // Suggestion: don't use 0, use at least 1 min
    queryFn: getAnnouncement,
  });

  const filtered = useMemo(() => {
    // 4. FIX: Use 'announcements' (your real data), not MOCK_ANNOUNCEMENTS
    if (filter === "ALL") return announcements;
    return announcements.filter((a) => a.type === filter);
  }, [filter, announcements]);

  // 5. Show loader if Auth is still checking OR Query is fetching
  if (isQueryPending) return <Loader />;

  return (
    <div className="container mx-auto p-6 space-y-4">
      {/* ... Header and Buttons stay the same ... */}
      <div className="flex flex-col gap-1 border-b pb-6 w-full">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Megaphone className="h-5 w-5" />
          </div>
          <h1 className="text-xl lg:text-2xl font-black tracking-tight text-slate-900">
            ANNOUNCEMENTS
          </h1>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`rounded-md px-3 py-2 text-sm border transition-colors ${
              filter === "ALL"
                ? "bg-foreground text-background"
                : "hover:bg-muted"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("STOCK")}
            className={`rounded-md px-3 py-2 text-sm border transition-colors ${
              filter === "STOCK"
                ? "bg-rose-600 text-white border-rose-600"
                : "hover:bg-muted"
            }`}
          >
            Stock
          </button>
          <button
            onClick={() => setFilter("RESOURCE")}
            className={`rounded-md px-3 py-2 text-sm border transition-colors ${
              filter === "RESOURCE"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "hover:bg-muted"
            }`}
          >
            Resource
          </button>
        </div>
      </div>

      <AnnouncementList data={filtered} />
    </div>
  );
}
