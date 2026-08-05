import moment from 'moment-timezone';

export function toUserTZ(dateStr?: string, tz?: string) {
  if (!dateStr) return null;
  try {
    // Parse as UTC then convert to user's timezone (or provided tz)
    const m = moment.utc(dateStr);
    const target = tz || moment.tz.guess();
    return m.tz(target);
  } catch (e) {
    return null;
  }
}

export function formatDate(dateStr?: string, fmt = 'dddd MMM D YYYY') {
  const m = toUserTZ(dateStr);
  return m ? m.format(fmt) : '';
}

export function formatTime(dateStr?: string, fmt = 'h:mm a') {
  const m = toUserTZ(dateStr);
  return m ? m.format(fmt) : '';
}

export function tzAbbr(dateStr?: string) {
  const m = toUserTZ(dateStr);
  return m ? m.format('z') : '';
}

export function formatEventRange(start?: string, end?: string) {
  const s = toUserTZ(start);
  const e = toUserTZ(end);
  if (!s) return '';
  const date = s.format('dddd MMM D YYYY');
  const startTime = s.format('h:mm a');
  const endTime = e ? e.format('h:mm a') : '';
  const abbr = s.format('z');
  return `${date} | ${startTime} - ${endTime} ${abbr}`;
}
