import { createStore } from 'vuex'

const store = createStore({
  state: {
    patientInfo: {}
  },
  getters: {},
  mutations: {
    setPatientInfo(state, payload) {
      state.patientInfo = payload
    }
  },
  actions: {},
  modules: {}
})
export default store
