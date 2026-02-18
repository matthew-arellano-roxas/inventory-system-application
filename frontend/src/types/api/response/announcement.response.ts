export const AnnouncementType = {
  STOCK: "STOCK",
  RESOURCE: "RESOURCE",
} as const;

export type AnnouncementType =
  (typeof AnnouncementType)[keyof typeof AnnouncementType];

export interface AnnouncementResponse {
  id: number;
  type: AnnouncementType;
  title: string;
  message: string;
  createdAt: string;
}
