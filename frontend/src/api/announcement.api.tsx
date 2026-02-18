import { api } from "@/config/axios";
import type { AnnouncementResponse } from "@/types/api/response";
import type { ApiResponse } from "@/types/api/shared/api-response";

export const getAnnouncement = async () => {
  const response =
    await api.get<ApiResponse<AnnouncementResponse[]>>("/api/announcement");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
