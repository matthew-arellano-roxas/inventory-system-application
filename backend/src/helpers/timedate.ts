import { format } from 'date-fns-tz';

const timeZone = 'Asia/Manila';

export const formatDatePH = (date: Date): string => {
  return format(date, 'yyyy-MM-dd HH:mm:ss', { timeZone });
};

export const nowPH = (): string => {
  const now = new Date();
  return format(now, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone });
};
