import { createStore } from 'vuex'

const store = createStore({
  state: {
    patientInfo: {},
    molarData: [] as any
  },
  getters: {},
  mutations: {
    setPatientInfo(state, payload) {
      state.patientInfo = payload
    },

    setMolarData(state, key) {
      if (key[0]) {
        state.molarData = JSON.parse(JSON.stringify(key))
      } else {
        let arr = state.molarData.map((it: any) => {
          return {
            ...it,
            orthTitleList: it.orthTitleList.map((item: any) => {
              return {
                ...item,
                orthOptionsList: item.orthOptionsList.map((ele: any) => {
                  if (ele.id === key.id) {
                    return { ...key } // 这里使用对象展开运算符来复制key对象
                  }
                  return ele // 这里返回原始元素
                })
              }
            })
          }
        })
        state.molarData = arr
      }
    }
  },
  actions: {},
  modules: {}
})
export default store
