export function formatDateTime (
  dateTime, dateSeparator, timeSeparator,
  includeSeconds, valueWhenNull
) {
  if (valueWhenNull === undefined) valueWhenNull = ''
  if (dateTime === null || dateTime === undefined || dateTime === '') {
    return valueWhenNull
  }
  if (dateSeparator === undefined) dateSeparator = '/'
  if (timeSeparator === undefined) timeSeparator = ':'
  if (includeSeconds === undefined) includeSeconds = false

  const dateTimeObj = new Date(dateTime)
  let formattedDateTime = (
    dateTimeObj.getFullYear() + dateSeparator +
    (dateTimeObj.getMonth() + 1).toString().padStart(2, '0') + dateSeparator +
    dateTimeObj.getDate().toString().padStart(2, '0') + ' ' +
    dateTimeObj.getHours().toString().padStart(2, '0') + timeSeparator +
    dateTimeObj.getMinutes().toString().padStart(2, '0')
  )
  if (includeSeconds) {
    formattedDateTime += (timeSeparator + dateTimeObj.getSeconds())
  }
  return formattedDateTime
}

export function formatTimestamp (
  timestamp, dateSeparator, timeSeparator,
  includeSeconds, valueWhenNull
) {
  timestamp *= 1000
  const date = new Date(timestamp)
  return formatDateTime(date, dateSeparator, timeSeparator, includeSeconds, valueWhenNull)
}
