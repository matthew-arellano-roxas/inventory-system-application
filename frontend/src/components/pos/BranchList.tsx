import * as React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import type { BranchResponse } from "@/types/api/response/branch.response";
import { BranchCard } from "./BranchCard";

export function BranchList({
  branches,
  isLoading,
}: {
  branches: BranchResponse[];
  isLoading?: boolean;
}) {
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return branches;
    return branches.filter((b) => b.name.toLowerCase().includes(query));
  }, [branches, q]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search branches..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <ScrollArea className="h-[420px] rounded-md border p-3">
        {isLoading ? (
          <div className="grid gap-3">
            <Skeleton className="h-[110px] w-full" />
            <Skeleton className="h-[110px] w-full" />
            <Skeleton className="h-[110px] w-full" />
          </div>
        ) : filtered.length ? (
          <div className="grid gap-3">
            {filtered.map((branch) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                onView={(b) => console.log("view", b)}
                onRename={(b) => console.log("rename", b)}
                onDelete={(b) => console.log("delete", b)}
              />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No branches found.
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
