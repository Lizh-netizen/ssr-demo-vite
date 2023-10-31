import { Post } from '../utils/request'

async function useUpdateOption(optionId, title, otherContent, appId) {
  let obj
  if (title.type == 1) {
    obj = {
      apmtId: appId,
      titleId: title.id,
      optionsIdStr: [optionId],
      otherContent: otherContent || '',
      cephalometricsContent: '',
      fdiToothCode: '',
      showPosition: '',
      aiFlag: title.aiFlag
    }
  } else if (title.type == 2) {
    if (title.titleName === '矫治风险' && optionId.includes(237)) {
      const option = title.orthOptionsList.find((a) => a.id === 237)
      const option2 = title.orthOptionsList.find((a) => a.id === 236)
      obj = {
        apmtId: appId,
        titleId: title.id,
        optionsIdStr: optionId,
        otherContent: title.otherContent,
        cephalometricsContent: '',
        fdiToothCode: option2.fdiToothCode,
        showPosition: option2.showPosition,
        fdiToothCode1: option.fdiToothCode,
        showPosition1: option.showPosition
      }
    } else if (title.titleName === '矫治风险' && optionId.includes(236)) {
      const option = title.orthOptionsList.find((a) => a.id === 236)
      obj = {
        apmtId: appId,
        titleId: title.id,
        optionsIdStr: optionId,
        otherContent: title.otherContent,
        cephalometricsContent: '',
        fdiToothCode: option.fdiToothCode || '',
        showPosition: option.showPosition
      }
    } else {
      obj = {
        apmtId: appId,
        titleId: title.id,
        optionsIdStr: optionId,
        otherContent: title.otherContent,
        cephalometricsContent: '',
        fdiToothCode: '',
        showPosition: ''
      }
    }
  }
  const res = await Post('/prod-api/business/optionsResult', obj)
  return res
}
export default useUpdateOption
