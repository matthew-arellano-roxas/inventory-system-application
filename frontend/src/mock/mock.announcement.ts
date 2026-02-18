import type { AnnouncementResponse } from "@/types/api/response";

export const MOCK_ANNOUNCEMENTS: AnnouncementResponse[] = [
  {
    id: 1,
    type: "STOCK",
    title: "Low stock: Bottled Water 500ml",
    message: "Stock dropped below 30 units. Please restock today.",
    createdAt: "2026-02-10T09:15:00.000Z",
  },
  {
    id: 2,
    type: "RESOURCE",
    title: "System maintenance",
    message: "Scheduled maintenance tonight 10:00 PM – 11:30 PM.",
    createdAt: "2026-02-09T13:40:00.000Z",
  },
  {
    id: 3,
    type: "STOCK",
    title: "Critical stock: Bread Loaf",
    message: "Only 12 units left. Consider emergency replenishment.",
    createdAt: "2026-02-08T17:05:00.000Z",
  },
  {
    id: 4,
    type: "RESOURCE",
    title: "New report export available",
    message: "You can now export monthly reports in CSV format from Reports.",
    createdAt: "2026-02-07T08:10:00.000Z",
  },
];
