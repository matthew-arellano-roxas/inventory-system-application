import { format } from 'date-fns-tz';
const timeZone = 'Asia/Manila';
const now = new Date();

export const formatDatePH = (date: Date) => {
  return format(date, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'Asia/Manila' });
};

export const nowPH = format(now, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone });
