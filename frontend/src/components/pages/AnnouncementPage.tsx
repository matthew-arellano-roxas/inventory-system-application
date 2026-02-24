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
    staleTime: 60000, // 1 minute as suggested
    queryFn: getAnnouncement,
  });

  const filtered = useMemo(() => {
    if (filter === "ALL") return announcements;
    return announcements.filter((a) => a.type === filter);
  }, [filter, announcements]);

  if (isQueryPending) return <Loader />;

  return (
    // 1. Added max-w-screen-xl and overflow-hidden to prevent horizontal scroll
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-screen-xl overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-col gap-1 border-b pb-6 w-full">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
            <Megaphone className="h-5 w-5" />
          </div>
          {/* 2. Added truncate/break-words to prevent long text from stretching the header */}
          <h1 className="text-xl lg:text-2xl font-black tracking-tight text-slate-900 truncate">
            ANNOUNCEMENTS
          </h1>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* 3. Added flex-wrap and gap-2 to allow buttons to stack on small screens */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`rounded-md px-4 py-2 text-sm border transition-colors whitespace-nowrap ${
              filter === "ALL"
                ? "bg-foreground text-background"
                : "hover:bg-muted"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("STOCK")}
            className={`rounded-md px-4 py-2 text-sm border transition-colors whitespace-nowrap ${
              filter === "STOCK"
                ? "bg-rose-600 text-white border-rose-600"
                : "hover:bg-muted"
            }`}
          >
            Stock
          </button>
          <button
            onClick={() => setFilter("RESOURCE")}
            className={`rounded-md px-4 py-2 text-sm border transition-colors whitespace-nowrap ${
              filter === "RESOURCE"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "hover:bg-muted"
            }`}
          >
            Resource
          </button>
        </div>
      </div>

      {/* 4. Ensure the list container itself doesn't overflow */}
      <div className="w-full overflow-hidden">
        <AnnouncementList data={filtered} />
      </div>
    </div>
  );
}
