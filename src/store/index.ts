import { createStore } from 'vuex'

const store = createStore({
  state: {
    patientList: [],
    planList: [
      {
        name: '方案一',
        checked: false,
        difficultyLevel: '',
        featureTagIds: [],
        primaryApplianceId: '',
        stageList: [
          {
            stageName: '3个月',
            targetIds: [],
            toolIds: [],
            topLeft: [],
            topRight: [],
            bottomLeft: [],
            bottomRight: [],
            toothCode: [],
            position: [],
            submitAble: false,
            fdiToothCode: null,
            showPosition: ''
          },
          {
            stageName: '6个月',
            targetIds: [],
            toolIds: [],
            topLeft: [],
            topRight: [],
            bottomLeft: [],
            bottomRight: [],
            toothCode: [],
            position: [],
            submitAble: false,
            fdiToothCode: null,
            showPosition: ''
          },
          {
            stageName: '9个月',
            targetIds: [],
            toolIds: [],
            topLeft: [],
            topRight: [],
            bottomLeft: [],
            bottomRight: [],
            toothCode: [],
            position: [],
            submitAble: false,
            fdiToothCode: null,
            showPosition: ''
          },
          {
            stageName: '12个月',
            targetIds: [],
            toolIds: [],
            topLeft: [],
            topRight: [],
            bottomLeft: [],
            bottomRight: [],
            toothCode: [],
            position: [],
            submitAble: false,
            fdiToothCode: null,
            showPosition: ''
          }
        ]
      }
    ],
    goalList: [],
    toolList: [],
    alignerList: [],
    questionList: []
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {}
})
export default store
