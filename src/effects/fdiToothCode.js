export default function useFdiToothCodeEffect(a) {
  a.topLeft = []
  a.topRight = []
  a.bottomLeft = []
  a.bottomRight = []
  const arr = JSON.parse(a.showPosition)

  if (a.fdiToothCode) {
    a.toothCode = a.fdiToothCode.split(',')
    a.fdiToothCode.split(',').forEach((code, index) => {
      if (code.startsWith('1') || code.startsWith('5')) {
        a.topLeft.push(arr[+index][0])
      } else if (code.startsWith('2') || code.startsWith('6')) {
        a.topRight.push(arr[+index][0])
      } else if (code.startsWith('4') || code.startsWith('8')) {
        a.bottomLeft.push(arr[+index][0])
      } else if (code.startsWith('3') || code.startsWith('7')) {
        a.bottomRight.push(arr[+index][0])
      }
    })
  } else {
    a.toothCode = []
  }
  a.position = arr || []
  a.submitAble = false
}
