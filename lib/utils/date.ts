import { addDays, endOfWeek, format, parse, startOfWeek } from 'date-fns';
import { de } from 'date-fns/locale';

export const formatDate = (date: Date | string, formatStr: string = 'dd.MM.yyyy'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr, { locale: de });
};

export const formatTime = (time: string): string => {
  return time;
};

export const parseTime = (time: string): Date => {
  return parse(time, 'HH:mm', new Date());
};

export const getWeekDates = (startDate: Date): Date[] => {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(addDays(startDate, i));
  }
  return dates;
};

export const getWeekStart = (date: Date = new Date()): Date => {
  return startOfWeek(date, { weekStartsOn: 1 }); // Monday
};

export const getWeekEnd = (date: Date = new Date()): Date => {
  return endOfWeek(date, { weekStartsOn: 1 });
};

export const isTimeInRange = (time: string, start: string, end: string): boolean => {
  const [h, m] = time.split(':').map(Number);
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  
  const minutes = h * 60 + m;
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  
  return minutes >= startMinutes && minutes <= endMinutes;
};

export const addMinutesToTime = (time: string, minutesToAdd: number): string => {
  const [h, m] = time.split(':').map(Number);
  const totalMinutes = h * 60 + m + minutesToAdd;
  const newH = Math.floor(totalMinutes / 60) % 24;
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
};

export const getTimeDifferenceInMinutes = (start: string, end: string): number => {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  return endMinutes - startMinutes;
};

export const getDayName = (date: Date): string => {
  return format(date, 'EEEE', { locale: de });
};

export const getShortDayName = (date: Date): string => {
  return format(date, 'EEE', { locale: de });
};

