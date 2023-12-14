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
  { title: '面评建议', prop: 'facialAdvise', type: 'text' },
  {
    type: 'operation',
    title: '操作',
    fixed: 'right',
    width: '360px'
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
    type: 'state',
    title: '快筛',
    stateOption: [
      // { name: '未筛选', prop: 'filterStatus', color: 'NoColor', value: 0 },
      { name: '矫正', prop: 'filterStatus', color: 'Alarm', value: 1 },
      { name: '不矫正', prop: 'filterStatus', color: 'NoColor', value: 2 },
      { name: '进一步面评', prop: 'filterStatus', color: 'Neutral', value: 3 }
    ]
  },
  { title: '面评建议', prop: 'facialAdvise', type: 'text' },
  {
    type: 'operation',
    title: '操作',
    fixed: 'right',
    width: '360px'
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

      { name: '面评', prop: 'orth_status', color: 'Neutral', value: 3 }
    ]
  },
  { title: '快筛备注', prop: 'voice_text', slotName: 'voice_text' },
   { title: '难度等级', prop: 'difficultyLevel', slotName: 'difficultyLevel' },
    { title: '预约医生', prop: 'toothDoctorName', type: 'text',width: '90px', },
  { title: '预约时间', prop: 'StartTime', type: 'text',width: '110px', },
   
    {
    title: '当天有正畸医生',
    type: 'icon',
    iconOption: {
      secondName: 'success',
      prop: 'isAttendence'
      },
    width: '130px'
  },
  { title: '正畸预约时间', prop: 'orthStartTime', type: 'text',width: '110px', },
  {
    title: '正畸预约医生',
    prop: 'orthDoctorName',
    slotName: 'orthDoctorName',
    width: '110px',
  },
  
  
  // { prop: 'toothDoctorName', title: '儿牙医生' },
  //  {prop: 'orthDoctorName', title: '正畸医生'},

  { title: '正畸责任医生', prop: 'responsibleDoctor', slotName: 'responsibleDoctor', width: '110px', },
  { title: '预约项目类型', prop: 'itemType', type: 'text' },
   { title: '正畸项目',  prop: 'orthItemType',type: 'text' },
  { title: '备注', type: 'notes', prop: 'note',slotName: 'note' },
 
  {
    type: 'operation',
    title: '操作',
    fixed: 'right',
    width: '100px'
  },
 
]
