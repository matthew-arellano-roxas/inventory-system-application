import { ok } from '@/helpers';
import { StatusCodes } from 'http-status-codes';
import { Controller } from '@/types/controller.type';
import { getAnnouncements as getPersistingAnnouncements } from '@/services/announcement/announcement.service';

export const getAnnoucements: Controller = async (req, res, _next) => {
  const announcement = await getPersistingAnnouncements();
  res.status(StatusCodes.OK).json(ok(announcement, 'Announcement retrieved'));
};

export const announcementController = {
  getAnnoucements,
};
