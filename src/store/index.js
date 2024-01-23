import { createStore } from 'vuex'


  const store = createStore({
  state: {
    patientList: []
  },
  getters: {},
  mutations: {
    setPatientList(state, payload) {
      state.patientList = payload
    }
  },
  actions: {},
  modules: {}
  })
export default store
