import { createStore } from 'vuex'

const store = createStore({
  state: {
    patientList: [],
    planList: [
      {
        name: '方案一',
        checked: false,
        difficultyLevel: '',
        meritIds: [],
        effectIds: [],
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
    setAlignerList(state, payload) {
      state.alignerList = payload
    },
    setOrthQuestionList(state, payload) {
      state.questionList = payload
    },
    setDifficultyLevel(state, payload) {
      const planList = store.state.planList
      const plan = planList.find((item) => item.name == payload.name)
      plan!.difficultyLevel = payload.difficultyLevel
    },
    setFeatureMeritList(state, payload) {
      const planList = store.state.planList
      const plan = planList.find((item) => item.name == payload.name)
      plan!.meritIds = payload.featureList
    },
    setFeatureEffectList(state, payload) {
      const planList = store.state.planList
      const plan = planList.find((item) => item.name == payload.name)
      plan!.effectIds = payload.featureList
    },
    setPrimaryApplianceId(state, payload) {
      const planList = store.state.planList
      const plan = planList.find((item) => item.name == payload.name)
      plan!.primaryApplianceId = payload.primaryApplianceId
    },
    addStage(state, payload) {
      const planList = store.state.planList
      const plan = planList.find((item) => item.name == payload)
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      const finalStage = plan.stageList[plan.stageList.length - 1].stageName
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      const stage = +finalStage.match(/(\d+)/)[0] + 3
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      plan.stageList.push({
        stageName: stage + '个月',
        targetIds: []
      })
    },
    addPlan(state, payload) {
      const planList = store.state.planList
      const name = planList[planList.length - 1].name
      if (planList.length == 1) {
        state.planList.push({
          name: '方案二',
          checked: false,
          difficultyLevel: '',
          meritIds: [],
          effectIds: [],
          primaryApplianceId: '',
          stageList: [
            {
              bottomLeft: [],
              bottomRight: [],
              fdiToothCode: null,
              position: [],
              showPosition: '',
              stageName: '3个月',
              submitAble: false,
              targetIds: [],
              toolIds: [],
              toothCode: [],
              topLeft: [],
              topRight: []
            },
            {
              bottomLeft: [],
              bottomRight: [],
              fdiToothCode: null,
              position: [],
              showPosition: '',
              stageName: '6个月',
              submitAble: false,
              targetIds: [],
              toolIds: [],
              toothCode: [],
              topLeft: [],
              topRight: []
            },
            {
              bottomLeft: [],
              bottomRight: [],
              fdiToothCode: null,
              position: [],
              showPosition: '',
              stageName: '9个月',
              submitAble: false,
              targetIds: [],
              toolIds: [],
              toothCode: [],
              topLeft: [],
              topRight: []
            },
            {
              bottomLeft: [],
              bottomRight: [],
              fdiToothCode: null,
              position: [],
              showPosition: '',
              stageName: '12个月',
              submitAble: false,
              targetIds: [],
              toolIds: [],
              toothCode: [],
              topLeft: [],
              topRight: []
            }
          ]
        })
      } else if (planList.length == 2) {
        state.planList.push({
          name: '方案三',
          checked: false,
          difficultyLevel: '',
          meritIds: [],
          effectIds: [],
          primaryApplianceId: '',

          stageList: [
            {
              bottomLeft: [],
              bottomRight: [],
              fdiToothCode: null,
              position: [],
              showPosition: '',
              stageName: '12个月',
              submitAble: false,
              targetIds: [],
              toolIds: [],
              toothCode: [],
              topLeft: [],
              topRight: []
            },
            {
              bottomLeft: [],
              bottomRight: [],
              fdiToothCode: null,
              position: [],
              showPosition: '',
              stageName: '6个月',
              submitAble: false,
              targetIds: [],
              toolIds: [],
              toothCode: [],
              topLeft: [],
              topRight: []
            },
            {
              bottomLeft: [],
              bottomRight: [],
              fdiToothCode: null,
              position: [],
              showPosition: '',
              stageName: '9个月',
              submitAble: false,
              targetIds: [],
              toolIds: [],
              toothCode: [],
              topLeft: [],
              topRight: []
            },
            {
              bottomLeft: [],
              bottomRight: [],
              fdiToothCode: null,
              position: [],
              showPosition: '',
              stageName: '12个月',
              submitAble: false,
              targetIds: [],
              toolIds: [],
              toothCode: [],
              topLeft: [],
              topRight: []
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
