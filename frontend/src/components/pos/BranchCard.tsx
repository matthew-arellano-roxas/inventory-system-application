import { Store, MoreVertical, Calendar } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { BranchResponse } from "@/types/api/response/branch.response";

function formatDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

export function BranchCard({
  branch,
  onView,
  onRename,
  onDelete,
}: {
  branch: BranchResponse;
  onView?: (b: BranchResponse) => void;
  onRename?: (b: BranchResponse) => void;
  onDelete?: (b: BranchResponse) => void;
}) {
  return (
    <Card className="transition-colors hover:bg-muted/40">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="min-w-0">
          <CardTitle className="flex items-center gap-2 truncate text-base">
            <Store className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{branch.name}</span>
          </CardTitle>
          <CardDescription className="mt-1 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(branch.createdAt)}</span>
          </CardDescription>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(branch)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRename?.(branch)}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete?.(branch)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <Badge variant="secondary">ID: {branch.id}</Badge>
        <Button variant="outline" size="sm" onClick={() => onView?.(branch)}>
          Open
        </Button>
      </CardContent>
    </Card>
  );
}
