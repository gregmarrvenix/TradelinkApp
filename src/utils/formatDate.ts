import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

export function formatDate(date: string | Date, format = 'DD MMM YYYY'): string {
  return dayjs(date).format(format);
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('DD MMM YYYY, h:mm A');
}

export function formatRelative(date: string | Date): string {
  return dayjs(date).fromNow();
}

export function formatRelativeDate(date: string | Date): string {
  const d = dayjs(date);
  if (d.isToday()) return 'Today';
  if (d.isYesterday()) return 'Yesterday';
  return d.fromNow();
}

export function formatTime(date: string | Date): string {
  return dayjs(date).format('h:mma');
}
