import { toZonedTime } from 'date-fns-tz';

const timeZone = 'Asia/Manila';

// Returns the current date/time as a Date object in PH time
export const nowPH = (): Date => {
  return toZonedTime(new Date(), timeZone);
};

// If you pass any date, this converts it to the PH equivalent Date object
export const getDatePH = (date: Date): Date => {
  return toZonedTime(date, timeZone);
};
