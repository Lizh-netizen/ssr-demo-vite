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
    title: '快筛',
    slotName: 'filterStatus',
    prop: 'filterStatus'
    // stateOption: [
    //   { name: '未筛选', prop: 'filterStatus', color: 'Warning', value: 0 },
    //   { name: '矫正', prop: 'filterStatus', color: 'Alarm', value: 1 },
    //   { name: '不矫正', prop: 'filterStatus', color: 'Warning', value: 2 },
    //   { name: '进一步面评', prop: 'filterStatus', color: 'Neutral', value: 3 }
    // ]
  },
  {
    type: 'popState',
    title: '完成情况',
    list: [],
    stateOption: [
      { name: 'failed', prop: 'completeStatus', color: 'Warning', value: '0' },
      { name: 'failed', prop: 'completeStatus', color: 'Warning', value: null },
      { name: 'success', prop: 'completeStatus', color: 'Alarm', value: '1' },
      { name: 'halfComplete', prop: 'completeStatus', color: 'Warning', value: '99' }
    ],
    textAlign: 'center'
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
      { name: 'failed', prop: 'completeStatus', color: 'Warning', value: '0' },
      { name: 'failed', prop: 'completeStatus', color: 'Warning', value: null },
      { name: 'success', prop: 'completeStatus', color: 'Alarm', value: '1' },
      { name: 'halfComplete', prop: 'completeStatus', color: 'Warning', value: '99' }
    ],
    textAlign: 'center'
  },
  {
    title: '快筛',
    slotName: 'filterStatus',
    prop: 'filterStatus'
    // stateOption: [
    //   { name: '未筛选', prop: 'filterStatus', color: 'Warning', value: 0 },
    //   { name: '矫正', prop: 'filterStatus', color: 'Alarm', value: 1 },
    //   { name: '不矫正', prop: 'filterStatus', color: 'Warning', value: 2 },
    //   { name: '进一步面评', prop: 'filterStatus', color: 'Neutral', value: 3 }
    // ]
  },

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
    slotName: 'patientName',
    width: '80px'
  },

  {
    prop: 'patientAge',
    title: '年龄',
    type: 'leftIcon',
    width: '80px'
  },

  {
    title: '快筛/面评结果',
    width: '90px',
    prop: 'orthFilterORFacialResult',
    slotName: 'orthFilterORFacialResult'
  },
  {
    title: '正畸预约',
    prop: 'orthAppointmentStatus',
    slotName: 'orthAppointmentStatus',
    width: '120px'
  },
  { title: '儿牙预约日期', prop: 'pediAppointmentDate', type: 'text', width: '120px' },
  { prop: 'pediDentistName', title: '儿牙医生', type: 'text', width: '120px' },
  // { title: '快筛备注', prop: 'voice_text', slotName: 'voice_text', width: '120px' },
  // { title: '难度等级', prop: 'difficultyLevel', slotName: 'difficultyLevel', width: '90px' },
  // { title: '预约医生', prop: 'toothDoctorName', type: 'text', width: '90px' },
  // { title: '预约时间', prop: 'StartTime', type: 'text', width: '120px' },

  // {
  //   title: '当天有正畸医生',
  //   type: 'icon',
  //   iconOption: {
  //     secondName: 'success',
  //     prop: 'isAttendence'
  //   },
  //   width: '130px'
  // },

  // { prop: 'orthDoctorName', title: '正畸医生' },

  // {
  //   title: '正畸责任医生',
  //   prop: 'responsibleDoctor',
  //   slotName: 'responsibleDoctor',
  //   width: '120px'
  // },
  // { title: '预约项目类型', prop: 'itemType', type: 'text', width: '120px' },
  // { title: '正畸项目', prop: 'orthItemType', type: 'text', width: '90px' },
  {
    title: '儿牙预约备注',
    prop: 'pediAppointmentNotes',
    slotName: 'pediAppointmentNotes',
    width: '90px'
  },
  // { title: '备注测试', prop: 'note',slotName: 'note', type:'notes' },
  {
    type: 'operation',
    title: '操作',
    fixed: 'right',
    width: '110px',
    prop: 'operation',
    slotName: 'operation'
  }
]
export const columns_config_aptmNo = [
  {
    prop: 'patientName',
    title: '姓名',
    slotName: 'patientName',
    width: '70px'
  },

  {
    prop: 'patientAge',
    title: '年龄',
    type: 'leftIcon',
    width: '70px'
  },

  {
    title: '快筛/面评结果',
    width: '90px',
    prop: 'orthFilterORFacialResult',
    slotName: 'orthFilterORFacialResult'
  },
  {
    title: '正畸预约',
    prop: 'orthAppointmentStatus',
    slotName: 'orthAppointmentStatus',
    width: '120px'
  },
  { title: '末诊日期', prop: 'lastAdmissionTime', type: 'text', width: '120px' },
  { prop: 'lastDoctorName', title: '末诊医生', type: 'text', width: '80px' },
  // { title: '快筛备注', prop: 'voice_text', slotName: 'voice_text', width: '120px' },
  // { title: '难度等级', prop: 'difficultyLevel', slotName: 'difficultyLevel', width: '90px' },
  // { title: '预约医生', prop: 'toothDoctorName', type: 'text', width: '90px' },
  // { title: '预约时间', prop: 'StartTime', type: 'text', width: '120px' },

  // {
  //   title: '当天有正畸医生',
  //   type: 'icon',
  //   iconOption: {
  //     secondName: 'success',
  //     prop: 'isAttendence'
  //   },
  //   width: '130px'
  // },

  // { prop: 'orthDoctorName', title: '正畸医生' },

  // {
  //   title: '正畸责任医生',
  //   prop: 'responsibleDoctor',
  //   slotName: 'responsibleDoctor',
  //   width: '120px'
  // },
  // { title: '预约项目类型', prop: 'itemType', type: 'text', width: '120px' },
  // { title: '正畸项目', prop: 'orthItemType', type: 'text', width: '90px' },
  { title: '末次就诊备注', prop: 'lastAdmissionNote', slotName: 'lastAdmissionNote', width: '90px' },
  // { title: '备注测试', prop: 'note',slotName: 'note', type:'notes' },
  {
    type: 'operation',
    title: '操作',
    fixed: 'right',
    width: '110px',
    prop: 'operation',
    slotName: 'operation'
  }
]
