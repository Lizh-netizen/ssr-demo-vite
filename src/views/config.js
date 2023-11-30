export const columns_config_evaluate = [
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
    type: 'state',
    title: '快筛',
    stateOption: [
      // { name: '未筛选', prop: 'filterStatus', color: 'NoColor', value: 0 },
      { name: '矫正', prop: 'filterStatus', color: 'Alarm', value: 1 },
      { name: '不矫正', prop: 'filterStatus', color: 'NoColor', value: 2 },
      { name: '进一步面评', prop: 'filterStatus', color: 'Neutral', value: 3 }
    ]
  },
  { title: '面评建议', prop: 'facialAdvise',type: 'text' },
  {
    type: 'operation',
    title: '操作',
    fixed: 'right',
    width: '360px'
  },
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
    type: 'state',
    title: '快筛',
    stateOption: [
      // { name: '未筛选', prop: 'filterStatus', color: 'NoColor', value: 0 },
      { name: '矫正', prop: 'filterStatus', color: 'Alarm', value: 1 },
      { name: '不矫正', prop: 'filterStatus', color: 'NoColor', value: 2 },
      { name: '进一步面评', prop: 'filterStatus', color: 'Neutral', value: 3 }
    ]
  },
  { title: '面评建议', prop: 'facialAdvise',type: 'text' },
  {
    type: 'operation',
    title: '操作',
    fixed: 'right',
    width: '360px'
  },
]
export const columns_config_aptm = [
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
    type: 'state',
    title: '快筛',
    stateOption: [
      // { name: '未筛选', prop: 'filterStatus', color: 'NoColor', value: 0 },
      { name: '矫正', prop: 'filterStatus', color: 'Alarm', value: 1 },
      { name: '不矫正', prop: 'filterStatus', color: 'NoColor', value: 2 },
      { name: '进一步面评', prop: 'filterStatus', color: 'Neutral', value: 3 }
    ]
  },
  { title: '面评建议', prop: 'facialAdvise',type: 'text' },
  {
    type: 'operation',
    title: '操作',
    fixed: 'right',
    width: '360px'
  },
  { title: '快筛语音备注', prop: 'filterRemark',slotName: 'filterRemark'},
  { title: '面评正畸责任人', prop: 'responsibleDoctor', slotName: 'responsibleDoctor' },
  {title: '备注',type: 'notes', prop: 'note' },
]
