import { Post, Get } from '../utils/request'
export function checkChoosen(optionsList: any) {
  return optionsList.some((item: any) => item.choosen)
}
export function checkFugaiOptions(jsonData: any) {
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
export function checkOrthOptions(data: any) {
  return data.every((item: any) =>
    item.orthTitleList.every((title: any) => checkChoosen(title.orthOptionsList))
  )
}

const evaluateImageList = [
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
export async function checkImageUpload(classifiedImageList: any) {
  let allImageChoosen = true
  evaluateImageList.forEach((image) => {
    if (!classifiedImageList.value.find((item: any) => item.imageType == image)) {
      allImageChoosen = false
      return allImageChoosen
    }
  })
  return allImageChoosen
}
// 检查正常的选项是否完成
export function checkOptions(data: any) {
  let allChoosen = true
  data[0].orthTitleList.forEach((item: any) => {
    if (
      item.orthOptionsList &&
      item.orthOptionsList.length > 0 &&
      !item.orthOptionsList.some((option: any) => option.choosen)
    ) {
      allChoosen = false
    }
  })

  return allChoosen
}
export function checkPanoOptions(data: any) {
  let allChoosen = true
  data[0].orthTitleList.forEach((item: any) => {
    if (item.titleName == '多生牙') {
      if (!item.fdiToothCode) {
        allChoosen = false
      }
    }
    if (
      item.orthOptionsList &&
      item.orthOptionsList.length > 0 &&
      !item.orthOptionsList.some((option: any) => option.choosen)
    ) {
      allChoosen = false
    }
  })

  return allChoosen
}

export function checkInquiry(inquiryData: any) {
  let allChoosen = true
  inquiryData.forEach((item: any) => {
    item.orthTitleList.forEach((title: any) => {
      if (
        title.orthOptionsList &&
        title.orthOptionsList.length > 0 &&
        !title.orthOptionsList.some((option: any) => option.choosen)
      ) {
        allChoosen = false
      } else if (title.orthOptionsList.length == 0) {
        if (!title.cephalometricsContent) {
          allChoosen = allChoosen && false
        }
      }
    })
  })
  return allChoosen
}
// 矫正中的临床检查
export function checkOrthoCheck(data: any) {
  let allChoosen = true
  data[0].orthTitleList.forEach((title: any) => {
    if (title.titleName == '关节弹响' || title.titleName == '侧关节') {
      if (title.titleName == '关节弹响') {
        if (title.orthOptionsList && title.orthOptionsList.length > 0) {
          const choosen = title.orthOptionsList.find((option: any) => option.choosen)

          if (!choosen) {
            allChoosen = false
          } else {
            if (choosen.optionName == '弹响') {
              const title = data[0].orthTitleList.find((item: any) => item.titleName == '侧关节')

              if (
                title.orthOptionsList &&
                title.orthOptionsList.length > 0 &&
                !title.orthOptionsList.some((option: any) => option.choosen)
              ) {
                allChoosen = false
              }
            }
          }
        }
      }
    } else {
      if (
        title.orthOptionsList &&
        title.orthOptionsList.length > 0 &&
        !title.orthOptionsList.some((option: any) => option.choosen)
      ) {
        allChoosen = false
      }
    }
  })
  return allChoosen
}
const orthImageList = [
  '正面像',
  '正面微笑像',
  '90度侧面像',
  '90度侧面微笑像',
  '45度侧面像',
  '45度侧面微笑像',
  '口内照（左侧）',
  '口内照（右侧）',
  '磨牙关系（左侧）',
  '磨牙关系（右侧）',
  '正面咬合',
  '前牙覆盖',
  '上颌',
  '下颌',
  '全景片',
  '侧位片'
]
// 矫正中的图像分析
export function checkOrthImageUpload(classifiedImageList: any) {
  let allImageChoosen = true
  orthImageList.forEach((image) => {
    if (!classifiedImageList.value.find((item: any) => item.imageType == image)) {
      allImageChoosen = false
      return allImageChoosen
    }
  })
  return allImageChoosen
}
export function checkOrthFace(data: any) {
  let allChoosen = true
  data.forEach((item: any) => {
    if (item.className !== '90度侧面像') {
      item.orthTitleList.forEach((title: any) => {
        if (
          title.orthOptionsList &&
          title.orthOptionsList.length > 0 &&
          !title.orthOptionsList.some((option: any) => option.choosen)
        ) {
          allChoosen = false
        }
      })
    } else {
      item.orthTitleList.forEach((title: any) => {
        if (title.titleName == '侧貌') {
          const choosen = title.orthOptionsList.find((option: any) => option.choosen)
          if (!choosen) {
            allChoosen = allChoosen && false
          } else {
            if (choosen.optionName == '凸面型') {
              // 看凸面型表现是否被选中
              const title1 = item.orthTitleList.find(
                (title: any) => title.titleName == '凸面型表现'
              )
              if (!title1.orthOptionsList.some((option: any) => option.choosen)) {
                allChoosen = allChoosen && false
              }
            }
            if (choosen.optionName == '凹面型') {
              // 看凸面型表现是否被选中
              const title1 = item.orthTitleList.find(
                (title: any) => title.titleName == '凹面型表现'
              )
              if (!title1.orthOptionsList.some((option: any) => option.choosen)) {
                allChoosen = allChoosen && false
              }
            }
          }
          // 排除掉这两个
        } else if (title.titleName !== '凹面型表现' && title.titleName !== '凸面型表现') {
          if (
            title.orthOptionsList &&
            title.orthOptionsList.length > 0 &&
            !title.orthOptionsList.some((option: any) => option.choosen)
          ) {
            allChoosen = false
          }
        }
      })
    }
  })
  return allChoosen
}

export function checkModelOptions(data: any) {
  console.log('🚀 ~ checkModelOptions ~ data:', data)
  let allChoosen = true
  data[0].orthTitleList.slice(0, 2).forEach((item: any) => {
    if (
      item.orthOptionsList &&
      item.orthOptionsList.length > 0 &&
      !item.orthOptionsList.some((option: any) => option.choosen)
    ) {
      allChoosen = false
    }
  })

  return allChoosen
}
