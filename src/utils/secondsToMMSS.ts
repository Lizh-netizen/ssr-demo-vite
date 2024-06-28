// 时间换算
export const secondsToMMSS = (seconds: number) => {
  // 计算分钟
  const minutes = Math.floor(seconds / 60)
  let second = 0
  // 计算秒数
  if (minutes > 0) {
    const minute = minutes * 60
    second = seconds - minute
  } else {
    second = seconds
  }
  return `${minutes.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
}
