import { startOfMonth, endOfMonth } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Manila';

export const getStartOfMonthPH = (): Date => {
  const now = new Date();
  const nowPH = toZonedTime(now, TIMEZONE);
  return fromZonedTime(startOfMonth(nowPH), TIMEZONE);
};

export const getEndOfMonthPH = (): Date => {
  const now = new Date();
  const nowPH = toZonedTime(now, TIMEZONE);
  return fromZonedTime(endOfMonth(nowPH), TIMEZONE);
};

export const getNowPH = (): Date => {
  const now = new Date();
  return toZonedTime(now, TIMEZONE);
};
