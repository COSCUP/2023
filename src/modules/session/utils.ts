import type { PartsOfDate } from './types'

export const html = String.raw

/**
 * Return a time zone fixed Date object.
 *
 * @param {Date | string} date Source Date object
 * @param {number} timeZoneOffsetMinutes The time zone difference, in minutes, from current locale (host system settings) to UTC.
 * @returns {Date} Time zone fixed Date object
 */
export function fixedTimeZoneDate (date: Date | string, timeZoneOffsetMinutes: number): Date {
  date = new Date(date)
  date.setMinutes(date.getMinutes() - timeZoneOffsetMinutes + (date.getTimezoneOffset()))
  return date
}

export function getPartsOfDate (date: Date): PartsOfDate {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    day: date.getDay(),
    hour: date.getHours(),
    minute: date.getMinutes()
  }
}

export function padNumberStart2WithZero (number: number) {
  return number.toString().padStart(2, '0')
}

export function formatDateString (dataObj: Date, joinChar = '') {
  const { year, month, date } = getPartsOfDate(dataObj)
  return [year, month, date]
    .map(padNumberStart2WithZero).join(joinChar)
}

export function formatTimeString (dateObj: Date, joinChar = '') {
  const { hour, minute } = getPartsOfDate(dateObj)
  return [hour, minute]
    .map(padNumberStart2WithZero).join(joinChar)
}
