import { Post, Get } from '../utils/request'

export function checkFugaiOptions(jsonData: any) {
  let isChosen = 0
  let count = 0
  // 遍历数据
  let found
  let itemChoosen = false
  jsonData.forEach((item: any) => {
    if (item.className == '正面咬合') {
      found = item.orthTitleList.find((title: any) => title.titleName == '前牙覆合')
      itemChoosen = found.orthOptionsList.some(
        (option: any) => option.optionName === '前牙反覆合' && option.choosen
      )

      item.orthTitleList.forEach((title: any) => {
        if (title.orthOptionsList.some((option: any) => option.choosen)) {
          isChosen++
        }
        count++
      })
    } else {
      item.orthTitleList.forEach((title: any) => {
        if (title.orthOptionsList.some((option: any) => option.choosen)) {
          isChosen++
        }
        count++
      })
    }
  })

  if (itemChoosen) {
    return isChosen == 0 ? '0' : isChosen == 17 ? '1' : '9'
  } else {
    return isChosen == 0 ? '0' : isChosen == 14 ? '1' : '9'
  }
}
export function checkOrthOptions(data: any) {
  let allChoosen = 0
  let count = 0
  data.forEach((item: any) =>
    item.orthTitleList.forEach((title: any) => {
      if (title.orthOptionsList.some((item: any) => item.choosen)) {
        allChoosen++
      }
      count++
    })
  )
  return allChoosen === 0 ? '0' : allChoosen === count ? '1' : '9'
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
  let allImageChoosen = 0
  let count = 0
  evaluateImageList.forEach((image) => {
    if (classifiedImageList.value.find((item: any) => item.imageType == image)) {
      allImageChoosen++
    }
    count++
  })
  return allImageChoosen === 0 ? '0' : allImageChoosen === count ? '1' : '9'
}
// 检查正常的选项是否完成
export function checkOptions(data: any) {
  let allChoosen = 0
  let count = 0
  data[0].orthTitleList.forEach((item: any) => {
    if (
      item.orthOptionsList &&
      item.orthOptionsList.length > 0 &&
      item.orthOptionsList.some((option: any) => option.choosen)
    ) {
      allChoosen++
    }
    count++
  })

  return allChoosen === 0 ? '0' : allChoosen === count ? '1' : '9'
}
export function checkPanoOptions(data: any) {
  let allChoosen = 0
  let count = 0
  data[0].orthTitleList.forEach((item: any) => {
    if (item.titleName == '多生牙') {
      if (item.fdiToothCode) {
        allChoosen++
      }
    }
    if (
      item.orthOptionsList &&
      item.orthOptionsList.length > 0 &&
      item.orthOptionsList.some((option: any) => option.choosen)
    ) {
      allChoosen++
    }
    count++
    console.log(count, allChoosen)
  })
  return allChoosen === 0 ? '0' : allChoosen === 8 ? '1' : '9'
}

export function checkInquiry(inquiryData: any) {
  let allChoosen = 0
  let count = 0
  const filtered = inquiryData.forEach((item: any) => {})
  inquiryData.forEach((item: any) => {
    item.orthTitleList.forEach((title: any) => {
      // 有没选中的，
      if (
        title.orthOptionsList &&
        title.orthOptionsList.length > 0 &&
        title.orthOptionsList.some((option: any) => option.choosen)
      ) {
        allChoosen++
      } else if (title.orthOptionsList.length == 0) {
        if (title.cephalometricsContent) {
          allChoosen++
        }
      }
      count++
    })
  })

  return allChoosen === 0 ? '0' : allChoosen === count ? '1' : '9'
}
// 矫正中的临床检查
export function checkOrthoCheck(data: any) {
  let allChoosen = 0
  let count = 0
  data[0].orthTitleList.forEach((title: any) => {
    if (title.titleName == '关节弹响' || title.titleName == '侧关节') {
      if (title.titleName == '关节弹响') {
        if (title.orthOptionsList && title.orthOptionsList.length > 0) {
          const choosen = title.orthOptionsList.find((option: any) => option.choosen)

          if (choosen) {
            allChoosen++
            if (choosen.optionName == '弹响') {
              const title = data[0].orthTitleList.find((item: any) => item.titleName == '侧关节')

              if (
                title.orthOptionsList &&
                title.orthOptionsList.length > 0 &&
                title.orthOptionsList.some((option: any) => option.choosen)
              ) {
                allChoosen++
              }
            } else {
              allChoosen++
            }
          }
        }
      }
    } else {
      if (
        title.orthOptionsList &&
        title.orthOptionsList.length > 0 &&
        title.orthOptionsList.some((option: any) => option.choosen)
      ) {
        allChoosen++
      }
    }
    count++
  })
  return allChoosen === 0 ? '0' : allChoosen === count ? '1' : '9'
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
  let allImageChoosen = 0
  let count = 0
  orthImageList.forEach((image) => {
    if (classifiedImageList.value.find((item: any) => item.imageType == image)) {
      allImageChoosen++
      return allImageChoosen
    }
    count++
  })
  return allImageChoosen == 0 ? '0' : allImageChoosen == 16 ? '1' : '9'
}
export function checkOrthFace(data: any) {
  let allChoosen = 0
  let count = 0
  let chooseItem = false
  data.forEach((item: any) => {
    if (item.className !== '90度侧面像') {
      item.orthTitleList.forEach((title: any) => {
        if (
          title.orthOptionsList &&
          title.orthOptionsList.length > 0 &&
          title.orthOptionsList.some((option: any) => option.choosen)
        ) {
          allChoosen++
        }
        count++
      })
    } else {
      item.orthTitleList.forEach((title: any) => {
        if (title.titleName == '侧貌') {
          const choosen = title.orthOptionsList.find((option: any) => option.choosen)

          if (choosen) {
            allChoosen++
            if (choosen.optionName == '凸面型' || choosen.optionName == '凹面型') {
              chooseItem = true
            }
            if (choosen.optionName == '凸面型') {
              // 看凸面型表现是否被选中
              const title1 = item.orthTitleList.find(
                (title: any) => title.titleName == '凸面型表现'
              )
              if (title1.orthOptionsList.some((option: any) => option.choosen)) {
                allChoosen++
              }
            }
            if (choosen.optionName == '凹面型') {
              // 看凸面型表现是否被选中
              const title1 = item.orthTitleList.find(
                (title: any) => title.titleName == '凹面型表现'
              )
              if (title1.orthOptionsList.some((option: any) => option.choosen)) {
                allChoosen++
              }
            }
          }

          // 排除掉这两个
        } else if (title.titleName !== '凹面型表现' && title.titleName !== '凸面型表现') {
          if (
            title.orthOptionsList &&
            title.orthOptionsList.length > 0 &&
            title.orthOptionsList.some((option: any) => option.choosen)
          ) {
            allChoosen++
          }
        }
        count++
      })
    }
  })
  if (chooseItem) {
    return allChoosen == 0 ? '0' : allChoosen == 14 ? '1' : '9'
  } else {
    return allChoosen == 0 ? '0' : allChoosen == 13 ? '1' : '9'
  }
}

export function checkModelOptions(data: any) {
  let allChoosen = 0
  let count = 0
  data[0].orthTitleList.slice(0, 2).forEach((item: any) => {
    if (
      item.orthOptionsList &&
      item.orthOptionsList.length > 0 &&
      item.orthOptionsList.some((option: any) => option.choosen)
    ) {
      allChoosen++
    }
    count++
  })
  // console.log(count, allChoosen)
  return allChoosen === 0 ? '0' : allChoosen === count ? '1' : '9'
}
