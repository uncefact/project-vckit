import { format, utcToZonedTime } from "date-fns-tz";
import enGB from "date-fns/locale/en-GB";

export const formatTime = (time: string, dateFormat: string, timeZoneSg = "Asia/Singapore"): string => {
  const dateTimeSg = utcToZonedTime(time, timeZoneSg);
  return format(dateTimeSg, dateFormat, { timeZone: timeZoneSg, locale: enGB });
};
