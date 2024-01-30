import { createStore } from 'vuex'

const store = createStore({
  state: {
    patientList: [],
    planList: [
      {
        name: '方案一',
        checked: false,
        difficultyLevel: '',
        stageList: [
          {
            stageName: '3个月',
            targetIds: []
          },
          {
            stageName: '6个月',
            targetIds: []
          },
          {
            stageName: '9个月',
            targetIds: []
          },
          {
            stageName: '12个月',
            targetIds: []
          }
        ]
      }
    ],
    goalList: [],
    toolList: []
  },
  getters: {},
  mutations: {
    setPatientList(state, payload) {
      state.patientList = payload
    },
    updatePlanList(state, payload) {
      state.planList = payload
    },
    setOrthGoalList(state, payload) {
      state.goalList = payload
    },
    setOrthToolList(state, payload) {
      state.toolList = payload
    },
    addStage(state, payload) {
      const planList = store.state.planList
      const plan = planList.find((item) => item.name == payload)
      const finalStage = plan.stageList[plan.stageList.length - 1].stageName
      const stage = +finalStage.match(/(\d+)/)[0] + 3
      plan.stageList.push({
        stageName: stage + '个月',
        targetIds: []
      })
    },
    addPlan(state, payload) {
      const planList = store.state.planList
      const name = planList[planList.length - 1].name
      if (name.endsWith('一')) {
        state.planList.push({
          name: '方案二',
          checked: false,
          difficultyLevel: '',
          stageList: [
            {
              stageName: '3个月',
              targetIds: [],
              toolIds: []

            },
            {
              stageName: '6个月',
              targetIds: [],
              toolIds: []
            },
            {
              stageName: '9个月',
              targetIds: [],
              toolIds: []
            },
            {
              stageName: '12个月',
              targetIds: [],
              toolIds: []
            }
          ]
        })
      } else if (name.endsWith('二')) {
        state.planList.push({
          name: '方案三',
          checked: false,
          difficultyLevel: '',
          stageList: [
            {
              stageName: '3个月',
              targetIds: []
            },
            {
              stageName: '6个月',
              targetIds: []
            },
            {
              stageName: '9个月',
              targetIds: []
            },
            {
              stageName: '12个月',
              targetIds: []
            }
          ]
        })
      }
    }
  },
  actions: {},
  modules: {}
})
export default store
