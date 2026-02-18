import type { AnnouncementType } from "@/types/api/response/announcement.response";

export function typeBadgeClass(type: AnnouncementType) {
  return type === "STOCK"
    ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/25"
    : "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/25";
}

export function typeLabel(type: AnnouncementType) {
  return type === "STOCK" ? "Stock" : "Resource";
}
