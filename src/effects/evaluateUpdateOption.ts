import { Post } from '../utils/request'
// 发送请求
async function updateOption(
  optionId: any,
  title: any,
  appId: number,
  classId: number,
  owningModule: string,
  option?: any
) {
  console.log(' update', optionId, title, appId, classId, owningModule, option)
  // 区分了一下 选项和标题
  let obj = {
    aptmId: appId,
    titleId: title.id,
    optionsIdStr:
      title.type == 1 && optionId ? [optionId] : title.type == 1 && !optionId ? [] : optionId,
    otherContent: title.otherContent,
    cephalometricsContent: title.cephalometricsContent,
    fdiToothCode: option ? option.toothCode.join() : title.toothCode ? title.toothCode.join() : '',
    showPosition: option
      ? JSON.stringify(option.position)
      : title.showPosition
        ? title.showPosition
        : '',
    optionSuffix: option?.optionSuffix,
    classId: classId,
    owningModule: owningModule
  }

  await Post('/prod-api/emr/facialAssessment/addFacialResult', obj)
}
export default updateOption
