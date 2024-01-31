import { Post } from '../utils/request'
//
const useChangeOption = (optionId, title, appId, isShow, checkData) => {
  if (title.titleName == '关节弹响') {
    if (title.orthOptionsList.find((a) => a.id == optionId)?.optionName == '弹响') {
      isShow.value = true
      return
    }
    if (optionId == 10) {
      isShow.value = false
      title.otherContent = ''
      checkData.value.orthTitleList.forEach((title1) => {
        if (title1.titleName == '关节弹响') {
          title1.optionId = 10
          title1.text = ''
          title1.selectId = ''
        } else if (title1.titleName == '侧关节') {
          title1.optionId = []
          title1.text = ''
          title1.showInput = false
          title1.selectId1 = ''
          title1.selectId2 = ''
        }
      })

      const sideTitle = checkData.value.orthTitleList.find((title1) => title1.titleName == '侧关节')
      let obj1 = {
        apmtId: appId,
        titleId: sideTitle.id,
        optionsIdStr: [],
        otherContent: '',
        cephalometricsContent: '',
        fdiToothCode: '',
        showPosition: ''
      }
      // 把侧位片的也清空
      Post('/prod-api/business/optionsResult', obj1)
    }
  } else if (
    title.titleName == '骨龄' &&
    (title.orthOptionsList.find((a) => a.id == optionId)?.optionName == '骨龄超' ||
      title.orthOptionsList.find((a) => a.id == optionId)?.optionName == '骨龄晚')
  ) {
    title.orthOptionsList.forEach((option) => {
      if (option.id == optionId) {
        option.clicked = true
        option.visible = true
      } else {
        option.clicked = false
      }
    })
    return
  }
  if (title.type == 2) {
    // 无和别的选项互斥逻辑
    // type 2 多选
    if (title.optionId1.includes(10) && title.optionId1.length < title.optionId.length) {
      title.optionId1 = title.optionId.filter((o) => o !== 10)
      title.optionId = title.optionId1
    } else if (
      !title.optionId1.includes(10) &&
      title.optionId1.length < title.optionId.length &&
      title.optionId.includes(10)
    ) {
      title.optionId1 = [10]
      title.optionId = [10]
      title.otherContent = ''
    }
    title.orthOptionsList.forEach((option) => {
      if (!title.optionId.includes(option.id)) {
        option.choosen = false
      } else {
        option.choosen = true
      }
    })
  }
  if (title.type == 1) {
    // type 1 单选
    title.orthOptionsList.forEach((option) => {
      if (optionId !== option.id) {
        option.choosen = false
      } else {
        option.choosen = true
      }
    })
    if (
      (title.titleName == '面中三分之一' ||
        title.titleName == '面下三分之一' ||
        title.titleName == '正貌') &&
      title.aiFlag == '1'
    ) {
      title.aiFlag = '0'
    }
  }
}

export default useChangeOption