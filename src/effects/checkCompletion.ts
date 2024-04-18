function checkChoosen(optionsList: any) {
  return optionsList.some((item: any) => item.choosen)
}
function checkFugaiOptions(jsonData: any) {
  let isChosen = true

  // 遍历数据
  jsonData.forEach((item: any) => {
    if (item.className == '正面咬合') {
      item.orthTitleList.forEach((title: any) => {
        // 如果是前牙覆合并且选择了前牙反覆合
        if (title.titleName === '前牙覆合') {
          if (
            title.orthOptionsList.some(
              (option: any) => option.optionName === '前牙反覆合' && option.choosen
            )
          ) {
            // 检查反覆合程度是否被选中
            const reverseOverbiteDegree = item.orthTitleList.find(
              (title: any) => title.titleName === '反覆合程度'
            )
            if (!reverseOverbiteDegree.orthOptionsList.some((option: any) => option.choosen)) {
              isChosen = false
              return false
            }
            // 检查反覆盖程度是否被选中
            const reverseOverjetDegree = item.orthTitleList.find(
              (title: any) => title.titleName === '反覆盖程度'
            )
            if (!reverseOverjetDegree.orthOptionsList.some((option: any) => option.choosen)) {
              isChosen = false
              return false
            }
            const aoMianXing = item.orthTitleList.find(
              (title: any) => title.titleName === '凹面型表现'
            )
            if (!aoMianXing.orthOptionsList.some((option: any) => option.choosen)) {
              isChosen = false
              return false
            }
          } else {
            isChosen = isChosen && title.orthOptionsList.some((option: any) => option.choosen)
          }
        } else {
          const tempTitleList = item.orthTitleList.filter(
            (title: any) =>
              title.titleName !== '反覆合程度' &&
              title.titleName !== '反覆盖程度' &&
              title.titleName !== '凹面型表现'
          )

          isChosen =
            isChosen &&
            tempTitleList.every((title: any) =>
              title.orthOptionsList.some((option: any) => option.choosen)
            )
        }
      })
    } else if (item.className !== '前牙覆盖') {
      isChosen =
        isChosen &&
        item.orthTitleList.every((title: any) =>
          title.orthOptionsList.some((option: any) => option.choosen)
        )
    }
  })
  return isChosen
}
function checkOrthOptions(data: any) {
  return data.every((item: any) =>
    item.orthTitleList.every((title: any) => checkChoosen(title.orthOptionsList))
  )
}
const imageList = [
  '正面像',

  '90度侧面像',

  '尖牙(左侧)',

  '尖牙(右侧)',

  '磨牙关系（左侧）',

  '磨牙关系（右侧）',
  '正面咬合',
  '前牙覆盖',
  '上颌',
  '下颌',
  '全景片'
]
async function checkImageUpload(classifiedImageList: any) {
  imageList.forEach((image) =>
    classifiedImageList.value.forEach((item: any) => {
      if (item.imageType == image && !item.imageUrl) {
        return false
      }
    })
  )
  return true
}
function checkPanoOptions(data: any) {
  data[0].orthTitleList.forEach((item: any) => {
    if (
      item.orthOptionsList.length > 0 &&
      !item.orthOptionsList.some((option: any) => option.choosen)
    ) {
      return false
    }
    if (!item.orthOptionsList.length && !item.fdiToothCode) {
      return false
    }
  })
  return true
}
