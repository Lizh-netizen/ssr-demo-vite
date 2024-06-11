import { toRefs } from 'vue'
import { Post } from '../utils/request'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

// 发送请求
async function updateOption(
  optionId: any,
  title: any,
  appId: number,
  classId: number,
  owningModule: string,
  option?: any,
  mouthData?: any,
  store?: any
) {
  // 区分了一下 选项和标题
  let toothCodeInfo: any = {}
  // if (title.type == 2 && mouthData) {
  //   const optionId = title.optionId
  //   optionId.forEach((id: any) => {
  //     const filtered = mouthData.filter(
  //       (item: any) => item.className == '磨牙关系（左侧）' || item.className == '磨牙关系（右侧）'
  //     )
  //     filtered.forEach((item: any) =>
  //       item.orthTitleList.forEach((t: any) => {
  //         t.orthOptionsList.forEach((option: any) => {
  //           if (option.id == id && t.id == title.id) {
  //             toothCodeInfo[option.id] = {
  //               fdiToothCode: option.toothCode?.join(),
  //               showPosition: JSON.stringify(option.position)
  //             }
  //           }
  //         })
  //       })
  //     )
  //   })
  // }

  if (title.type == 2 && mouthData && option) {
    if (!store.state.molarData[0]) {
      const filtered = mouthData.filter(
        (item: any) => item.className == '磨牙关系（左侧）' || item.className == '磨牙关系（右侧）'
      )
      // 存储title
      store.commit('setMolarData', filtered)
    }
    // 将option存到对应的title中
    store.commit('setMolarData', option)
    const molarData = store.state.molarData
    const idArr = title.optionId
    idArr.forEach((id: number) => {
      molarData.forEach((it: any) => {
        it.orthTitleList.forEach((item: any) => {
          item.orthOptionsList.forEach((tooth: any) => {
            if (tooth.id == id) {
              toothCodeInfo[tooth.id] = {
                fdiToothCode: tooth.toothCode?.join(),
                showPosition: JSON.stringify(tooth.position)
              }
            }
          })
        })
      })
    })
  }

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
    owningModule: owningModule,
    toothCodeInfo: toothCodeInfo
  }

  const res = (await Post('/prod-api/emr/facialAssessment/addFacialResult', obj)) as any
  if (res.code == 200 && obj.fdiToothCode !== '') {
    ElMessage.success('牙位保存成功')
  }
}
export default updateOption
