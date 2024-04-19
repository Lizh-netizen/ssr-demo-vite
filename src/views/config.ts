export const columns_config_evaluate = [
  {
    prop: 'patientName',
    title: '患者姓名',
    type: 'text'
  },
  {
    prop: 'StartTime',
    title: '预约时间',
    type: 'text'
  },
  {
    prop: 'age',
    title: '年龄',
    type: 'leftIcon',
    iconOption: {
      name: 'success',
      prop: 'icon'
    },
    leftTagOption: {
      text: 'TAG',
      color: 'Alarm',
      prop: 'tag'
    },
    rightTagOption: {
      text: 'TAG',
      color: 'Alarm',
      prop: 'tag'
    }
  },
  {
    type: 'state',
    title: '快筛',
    stateOption: [
      { name: '未筛选', prop: 'filterStatus', color: 'Warning', value: 0 },
      { name: '矫正', prop: 'filterStatus', color: 'Alarm', value: 1 },
      { name: '不矫正', prop: 'filterStatus', color: 'Warning', value: 2 },
      { name: '进一步面评', prop: 'filterStatus', color: 'Neutral', value: 3 }
    ]
  },
  {
    type: 'popState',
    title: '完成情况',
    list: [],
    stateOption: [
      { name: 'success', prop: 'completStatus', color: 'Warning', value: 0 },
      { name: 'failed', prop: 'completStatus', color: 'Alarm', value: 1 },
      { name: 'halfComplete', prop: 'completStatus', color: 'Warning', value: 99 }
    ]
  },
  { title: '面评建议', prop: 'facialAdvise', slotName: 'facialAdvise' },
  {
    type: 'operation',
    title: '操作',
    fixed: 'right',
    width: '220px'
  }
]
export const columns_config_ortho = [
  {
    prop: 'StartTime',
    title: '预约时间',
    type: 'text'
  },
  {
    prop: 'patientName',
    title: '患者姓名',
    type: 'text'
  },
  {
    prop: 'age',
    title: '年龄',
    type: 'leftIcon',
    iconOption: {
      name: 'success',
      prop: 'icon'
    },
    leftTagOption: {
      text: 'TAG',
      color: 'Alarm',
      prop: 'tag'
    },
    rightTagOption: {
      text: 'TAG',
      color: 'Alarm',
      prop: 'tag'
    }
  },
  {
    type: 'popState',
    title: '完成情况',
    list: [],
    stateOption: [
      { name: 'success', prop: 'completStatus', color: 'Warning', value: 0 },
      { name: 'failed', prop: 'completStatus', color: 'Alarm', value: 1 },
      { name: 'halfComplete', prop: 'completStatus', color: 'Warning', value: 99 }
    ]
  },
  {
    type: 'state',
    title: '快筛',
    stateOption: [
      { name: '未筛选', prop: 'filterStatus', color: 'Warning', value: 0 },
      { name: '矫正', prop: 'filterStatus', color: 'Alarm', value: 1 },
      { name: '不矫正', prop: 'filterStatus', color: 'Warning', value: 2 },
      { name: '进一步面评', prop: 'filterStatus', color: 'Neutral', value: 3 }
    ]
  },
  { title: '面评建议', prop: 'facialAdvise', type: 'text' },
  {
    type: 'operation',
    title: '操作',
    fixed: 'right'
  }
]
export const columns_config_aptm = [
  {
    prop: 'patientName',
    title: '姓名',
    type: 'text',
    width: '80px'
  },

  {
    prop: 'age',
    title: '年龄',
    type: 'leftIcon',
    width: '80px'
  },

  {
    type: 'state',
    title: '快筛结果',
    width: '90px',
    stateOption: [
      // { name: '未筛选', prop: 'filterStatus', color: 'NoColor', value: 0 },
      { name: '矫正', prop: 'orth_status', color: 'Alarm', value: 1 },
      { name: '不矫正', prop: 'orth_status', color: 'Success', value: 2 },
      { name: '不确定', prop: 'orth_status', color: 'Neutral', value: 3 }
    ]
  },
  { title: '快筛备注', prop: 'voice_text', slotName: 'voice_text', width: '120px' },
  { title: '难度等级', prop: 'difficultyLevel', slotName: 'difficultyLevel', width: '90px' },
  { title: '预约医生', prop: 'toothDoctorName', type: 'text', width: '90px' },
  { title: '预约时间', prop: 'StartTime', type: 'text', width: '120px' },

  {
    title: '当天有正畸医生',
    type: 'icon',
    iconOption: {
      secondName: 'success',
      prop: 'isAttendence'
    },
    width: '130px'
  },
  { title: '正畸预约时间', prop: 'orthStartTime', type: 'text', width: '120px' },
  {
    title: '正畸预约医生',
    prop: 'orthDoctorName',
    slotName: 'orthDoctorName',
    width: '120px'
  },

  // { prop: 'toothDoctorName', title: '儿牙医生' },
  //  {prop: 'orthDoctorName', title: '正畸医生'},

  {
    title: '正畸责任医生',
    prop: 'responsibleDoctor',
    slotName: 'responsibleDoctor',
    width: '120px'
  },
  { title: '预约项目类型', prop: 'itemType', type: 'text', width: '120px' },
  { title: '正畸项目', prop: 'orthItemType', type: 'text', width: '90px' },
  { title: '备注', prop: 'notes', slotName: 'notes', width: '90px' },
  // { title: '备注测试', prop: 'note',slotName: 'note', type:'notes' },
  {
    type: 'operation',
    title: '操作',
    fixed: 'right',
    width: '110px'
  }
]
