
const useSelectTooth = (item, title) => {
  title.submitAble = true
  item.active = !item.active
  if (item.active) {
    title.toothCode.push(item.value + '')
    if (
      (item.value + '').startsWith('1') ||
      (item.value + '').startsWith('5')
    ) {
      title.topLeft.push({ value: item.label, sort: item.sort })
    }
    if (
      (item.value + '').startsWith('2') ||
      (item.value + '').startsWith('6')
    ) {
      title.topRight.push({ value: item.label, sort: item.sort })
    }
    if (
      (item.value + '').startsWith('4') ||
      (item.value + '').startsWith('8')
    ) {
      title.bottomLeft.push({ value: item.label, sort: item.sort })
    }
    if (
      (item.value + '').startsWith('3') ||
      (item.value + '').startsWith('7')
    ) {
      title.bottomRight.push({ value: item.label, sort: item.sort })
    }
    title.position.push([{ value: item.label, sort: item.sort }])
  } else {
    title.toothCode.splice(
      title.toothCode.findIndex((a) => a == item.value + ''),
      1
    )
    if (
      (item.value + '').startsWith('1') ||
      (item.value + '').startsWith('5')
    ) {
      title.topLeft.splice(
        title.topLeft.findIndex((a) => a.value == item.label),
        1
      )
    }
    if (
      (item.value + '').startsWith('2') ||
      (item.value + '').startsWith('6')
    ) {
      title.topRight.splice(
        title.topRight.findIndex((a) => a.value == item.label),
        1
      )
    }
    if (
      (item.value + '').startsWith('4') ||
      (item.value + '').startsWith('8')
    ) {
      title.bottomLeft.splice(
        title.bottomLeft.findIndex((a) => a.value == item.label),
        1
      )
    }
    if (
      (item.value + '').startsWith('3') ||
      (item.value + '').startsWith('7')
    ) {
      title.bottomRight.splice(
        title.bottomRight.findIndex((a) => a.value == item.label),
        1
      )
    }
    title.position.splice(
      title.position.findIndex((a) => a[0].value == item.label),
      1
    )
  }
}

export default useSelectTooth