<template>
  <div class="stepThree">
    <Header text="模型分析" backgroundColor="#f4f7fd" />
    <div class="content">
      <form-item
        :label="title.titleName"
        width="110px"
        v-for="(title, index) in modelData.orthTitleList.slice(0, 2)"
        :key="title.id"
      >
        <template v-if="index <= 1">
          <el-radio-group
            v-model="title.optionId"
            @change="handleChangeOption(title.optionId, title)"
          >
            <template v-for="option in title.orthOptionsList" :key="option.id">
              <el-radio-button
                :class="{
                  serious: option.serious == '1',
                  checked: option.choosen === true
                }"
                :label="option.id"
              >
                {{ option.optionName }}
              </el-radio-button>
            </template>
          </el-radio-group>
        </template>
      </form-item>

      <template v-if="dentitionType == '恒牙列'">
        <form-item
          :label="index <= 1 ? title.titleName.slice(0, 8) : ''"
          width="110px"
          :showMark="title.titleName === 'Bolton指数（前牙比）'"
          :content="title.prompt"
          v-for="(title, index) in modelData.orthTitleList.slice(2)"
          :key="title.id"
        >
          <ModelAnalysis
            :titleName="title.titleName"
            v-bind="title"
            @change="(val) => handleChange(val, title)"
          />
        </form-item>
      </template>
    </div>
  </div>
</template>

<script setup>
import ModelAnalysis from '@/components/list/modelAnalysis.vue'
import { ref, defineProps, defineExpose } from 'vue'
import Header from '@/components/list/header.vue'
import FormItem from '@/components/list/customFormItem.vue'
import { Get, Post } from '@/utils/request'
import { useRoute } from 'vue-router'
import useChangeOption from '@/effects/changeOption.js'
import useUpdateOption from '@/effects/updateOption.js'
const clicked = ref(false)
defineExpose({
  clicked
})
const props = defineProps({
  pdfId: String,
  dentitionType: String
})
// 获取数据
const route = useRoute()
const appId = route.params.appId
const modelData = ref({})
async function getOrthModelList() {
  const result = await Get(`/prod-api/business/orthClass/list/2/模型分析/${appId}`)
  const a = result.data[0].orthTitleList[2]
  result.data[0].orthTitleList.splice(2, 1)
  result.data[0].orthTitleList.splice(3, 0, a)
  modelData.value = result.data[0]

  modelData.value.orthTitleList.forEach((title, index) => {
    clicked.value = title.orthOptionsList.some((option) => option.choosen == true)
    title.hasVal = title.cephalometricsContent ? true : false
    if (index <= 1) {
      title.optionId = ''
      const choosenOptions = title.orthOptionsList.filter((option) => option.choosen === true)
      if (choosenOptions.length > 0) {
        title.optionId = choosenOptions[0].id
      }
    } else {
      title.value = +title.cephalometricsContent
      if (title.titleName == 'SPEE曲线') {
        title.min = '0mm'
        title.max = '2mm'
      } else {
        title.min = (title.orthOptionsList[0].optionName * 100).toFixed(2) + '%'
        title.max = (title.orthOptionsList[1].optionName * 100).toFixed(2) + '%'
      }

      title.placeholder = index == 2 ? '' : title.titleName.substr(-4).slice(0, 3)
      title.left = index == 2 ? '反曲' : '偏低'
      title.middle = '正常'
      title.right = index == 2 ? '过深' : '偏高'
      if (title.titleName == 'SPEE曲线') {
        title.minVal = 0
        title.maxVal = 2
        if (title.cephalometricsContent) {
          title.conclusion =
            +title.cephalometricsContent < 0
              ? title.left
              : +title.cephalometricsContent > 2
              ? title.right
              : title.middle
        } else {
          title.conclusion = ''
        }
      } else {
        let min = title.orthOptionsList[0].optionName
        let max = title.orthOptionsList[1].optionName
        if (title.cephalometricsContent) {
          if (+title.cephalometricsContent / 100 < min) {
            title.conclusion = title.left
          } else if (+title.cephalometricsContent / 100 > max) {
            title.conclusion = title.right
          } else {
            title.conclusion = title.middle
          }
        } else {
          title.conclusion = ''
        }
      }
    }
  })
}
getOrthModelList()

const handleChange = (val, title) => {
  title.value = +val
  if (title.value) {
    if (title.min.endsWith('m')) {
      title.conclusion =
        title.value < +title.min.slice(0, 1)
          ? title.left
          : title.value > +title.max.slice(0, 1)
          ? title.right
          : title.middle
    } else {
      title.conclusion =
        title.value < +title.min.slice(0, 5)
          ? title.left
          : title.value > +title.max.slice(0, 5)
          ? title.right
          : title.middle
    }
  }
  const obj = {
    apmtId: appId,
    titleId: title.id,
    optionsIdStr: [],
    otherContent: '',
    cephalometricsContent: val === '' ? '' : title.value + '',
    fdiToothCode: '',
    showPosition: ''
  }
  Post('/prod-api/business/optionsResult', obj)
}
const handleChangeOption = (optionId, title) => {
  clicked.value = true
  if (props.pdfId) {
    sessionStorage.removeItem(props.pdfId)
  }
  useChangeOption(optionId, title, appId)
  useUpdateOption(title.optionId, title, '', appId)
}
</script>

<style lang="scss" scoped>
.content {
  padding: 20px;
  padding-bottom: 0;

  :deep .el-checkbox-button__inner {
    height: 32px;
    img {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  :deep .el-checkbox-button__inner {
    img {
      display: none;
    }
  }
  :deep .el-checkbox-button.checked {
    background: #ffffff;
    --el-checkbox-button-checked-bg-color: none;
    --el-checkbox-button-checked-border-color: none;
    --el-checkbox-button-checked-text-color: none;
    box-shadow: none;
    img {
      display: block;
    }
    .el-checkbox-button__inner {
      border: 1px solid #2e6ce4;
      --el-border: none;
      color: #2e6ce4;
      box-shadow: none;
    }
    .el-checkbox-button {
      // border: 1px solid #2e6ce4;
      &.is-focus {
        border: none;
      }
    }
    &.serious {
      .el-checkbox-button__inner {
        border: 1px solid #f44c4c;
        --el-border: none;
        color: #f44c4c;
      }
    }
  }
}
:deep .el-input {
  width: auto;
  --el-border-radius-base: 8px;
  margin-left: 4px;
}
:deep .el-checkbox-button.is-checked .el-checkbox-button__inner {
  border-color: #dcdfe6;
  background-color: #fff;
  box-shadow: none;
  color: #606266;
}
:deep .el-radio-button__original-radio:checked + .el-radio-button__inner {
  color: #2e6ce4;
  background-color: #fff;
  border-color: #2e6ce4;
  --el-radio-button-checked-border-color: #2e6ce4;
}
:deep .el-radio-button.serious .el-radio-button__original-radio:checked + .el-radio-button__inner {
  color: red;
  background-color: #fff;
  border-color: red;
  --el-radio-button-checked-border-color: red;
}
.formItem__content {
  .content {
    padding: 0;
  }
}
.formItem__label {
  background: black;
  display: flex;
  width: auto;
  padding-right: 0;
}
</style>
