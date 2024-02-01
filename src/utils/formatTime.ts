export default function formatTime() {
  const today = new Date()
  let year = today.getFullYear()
  let month = today.getMonth() + 1
  // @ts-expect-error TS(2322): Type 'string | number' is not assignable to type '... Remove this comment to see the full error message
  month = month < 10 ? `0${month}` : month // 确保月份是两位数
  let day = today.getDate()
  console.log('🚀 ~ formatTime ~  month:', typeof month)
  // @ts-expect-error TS(2322): Type 'string | number' is not assignable to type '... Remove this comment to see the full error message
  day = day < 10 ? `0${day}` : day // 确保日期是两位数
  let lastMonth = today.getMonth() + 0
  // @ts-expect-error TS(2322): Type 'string | number' is not assignable to type '... Remove this comment to see the full error message
  lastMonth = lastMonth < 10 ? `0${lastMonth}` : lastMonth

  if (lastMonth == 0) {
    lastMonth = 12
  }
  if (lastMonth === 12) {
    year = year - 1
  }
  let firstDate = `${year}-${lastMonth}-01`
  const formattedToday = `${year}-${month}-${day}`
  return { firstDate, formattedToday }
}
