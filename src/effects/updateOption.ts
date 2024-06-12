import { Post } from '../utils/request'
// 发送请求
async function useUpdateOption(
  optionId: any,
  title: any,
  appId: any,
  classId: any,
  owningModule: any,
  otherContent: any
) {
  let obj
  if (title.type == 1) {
    obj = {
      aptmId: appId,
      titleId: title.id,
      optionsIdStr: optionId ? [optionId] : [],
      otherContent: title.otherContent || otherContent,
      cephalometricsContent: '',
      fdiToothCode: '',
      showPosition: '',
      aiFlag: title.aiFlag,
      classId: classId,
      owningModule: owningModule
    }
    if (title.titleName == '骨龄') {
      if (title.optionId !== 73 && title.optionId !== 74) {
        obj.otherContent = ''
      }
    }
  } else if (title.type == 2) {
    if (title.titleName === '矫治风险' && optionId.includes(237)) {
      const option = title.orthOptionsList.find((a: any) => a.id === 237)
      const option2 = title.orthOptionsList.find((a: any) => a.id === 236)
      obj = {
        aptmId: appId,
        titleId: title.id,
        optionsIdStr: optionId,
        otherContent: title.otherContent,
        cephalometricsContent: '',
        fdiToothCode: option2.fdiToothCode,
        showPosition: option2.showPosition,
        fdiToothCode1: option.fdiToothCode,
        showPosition1: option.showPosition,
        classId: classId,
        owningModule: owningModule,
        optionSuffix: '牙位图'
      }
    } else if (title.titleName === '矫治风险' && optionId.includes(236)) {
      const option = title.orthOptionsList.find((a: any) => a.id === 236)
      obj = {
        aptmId: appId,
        titleId: title.id,
        optionsIdStr: optionId,
        otherContent: title.otherContent,
        cephalometricsContent: '',
        fdiToothCode: option.fdiToothCode || '',
        showPosition: option.showPosition,
        classId: classId,
        owningModule: owningModule,
        optionSuffix: '牙位图'
      }
    } else {
      obj = {
        aptmId: appId,
        titleId: title.id,
        optionsIdStr: optionId,
        otherContent: title.otherContent,
        cephalometricsContent: '',
        fdiToothCode: '',
        showPosition: '',
        classId: classId,
        owningModule: owningModule
      }
    }
    // 全景片的其他的提交
  } else if (owningModule == '全景片') {
    obj = {
      aptmId: appId,
      titleId: title.id,
      optionsIdStr: [],
      otherContent: title.otherContent,
      cephalometricsContent: '',
      fdiToothCode: '',
      showPosition: '',
      classId: classId,
      owningModule: owningModule
    }
  }
  const res = await Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj)
  return res
}
export default useUpdateOption
