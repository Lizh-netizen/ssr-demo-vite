<template>
  <el-radio-group
    v-if="title.type == 1"
    v-model="title.optionId"
    @change="handleChangeOption(title.optionId, title)"
    @dblclick="handleEmptyRadio(title.optionId, title, 'inquiry')"
  >
    <el-radio-button
      :class="{
        serious: option.serious == '1',
        checked: option.choosen === true
      }"
      v-for="option in title.orthOptionsList"
      :key="option.id"
      :label="option.id"
    >
      {{ option.optionName }}
    </el-radio-button>
  </el-radio-group>
</template>

<script setup>
import useChangeOption from '@/effects/changeOption.ts'
import useUpdateOption from '@/effects/updateOption.ts'
import emptyRadio from '@/effects/emptyRadio.ts'

const props = defineProps({
  title: {
    type: Object,
    default: () => {}
  },
  pdfId: {
    type: String,
    default: ''
  },
  appId: {
    type: String,
    default: ''
  },
  isShow: {
    type: Boolean,
    default: false
  },
  checkData: {
    type: Object,
    default: () => {}
  }
})
async function handleEmptyRadio(optionId, title, owningModule) {
  if (
    title.orthOptionsList.some((option) => option.choosen == true) &&
    title.type == 1 &&
    title.optionId == optionId
  ) {
    emptyRadio(optionId, title)
    useUpdateOption(null, title, '', props.appId)
    if (owningModule == 'inquiry') {
      // getOrthInquiryList()
    } else {
      // getOrthCheckList()
    }
    // 重新请求数据
  }
}
async function handleChangeOption(optionId, title) {
  // clicked.value = true
  if (props.pdfId) {
    sessionStorage.removeItem(props.pdfId)
  }

  useChangeOption(optionId, title, props.appId, props.isShow, props.checkData)
  await useUpdateOption(title.optionId, title, '', props.appId)
  // if ((res.code == 200) & (title.titleName == '骨龄')) {
  //   // getOrthCheckList()
  // }
}
</script>

<style scoped></style>
