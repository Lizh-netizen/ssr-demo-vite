<template>
  <div class="stepFour">
    <Header text="问题列表" backgroundColor="#f4f7fd" />
    <template v-if="questionData.length > 0">
      <div class="content" :style="{ 'padding-top': '4px' }">
        <div class="questionItem" v-for="item in questionData" :key="item.id">
          <div class="questionItem__header">
            <img src="../../assets/svg/flag.svg" /><span class="questionItem__header__title">{{
              item.question_level_one
            }}</span>
          </div>
          <div class="questionItem__content content">
            <div class="singleQuestionItem" v-for="a in item.list1" :key="a.id">
              <div class="question_level_two">{{ a.question_level_two }}</div>
              <div class="itemContainer">
                <div class="item" v-for="item in a.list2" :key="item.title_name">
                  <span class="singleQuestionItem__label">{{ item.title_name }}</span>
                  <span class="singleQuestionItem__content">{{ item.option_names }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else
      ><div
        :style="{
          padding: '20px'
        }"
      >
        无
      </div></template
    >
    <Header text="诊断" backgroundColor="#f4f7fd" :style="{ 'margin-top': '20px' }" />
    <div class="content diagnose">
      <template v-for="item in diagnoseData" :key="item.id">
        <template v-for="title in item.orthTitleList" :key="title.id">
          <form-item :label="title.titleName" width="80px">
            <el-radio-group
              v-if="title.type == 1"
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
            <el-checkbox-group
              v-model="title.optionId"
              v-if="title.type == 2"
              @change="handleChangeOption(title.optionId, title)"
            >
              <el-checkbox-button
                :class="{
                  serious: option.serious == '1',
                  checked: option.choosen === true
                }"
                v-for="option in title.orthOptionsList"
                :key="option.id"
                :label="option.id"
              >
                {{ option.optionName }}
                <img src="../../assets/svg/checked.svg" v-if="option.serious == '0'" /><img
                  src="../../assets/svg/abnormalChecked.svg"
                  v-else
                />
              </el-checkbox-button>
            </el-checkbox-group>
          </form-item>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/list/header.vue'
import { ref, defineProps, defineExpose } from 'vue'
import FormItem from '@/components/list/formItem.vue'
import { Get } from '@/utils/request'
import { useRoute } from 'vue-router'
import useChangeOption from '@/effects/changeOption.js'
import useUpdateOption from '@/effects/updateOption.js'
const clicked = ref(false)
defineExpose({
  clicked
})
const props = defineProps({
  pdfId: String
})
// 获取问题列表数据
const route = useRoute()
const appId = route.params.appId
const questionData = ref([])
async function getOrthQuestionList() {
  const result = await Get(`/prod-api/business/orthClass/issuesList?apmtId=${appId}&serious=1`)
  if (result.data) {
    const acc = result.data.reduce((acc, cur) => {
      if (acc[cur.question_level_one]) {
        const found = acc[cur.question_level_one].list1.find(
          (item) => item.question_level_two === cur.question_level_two
        )
        if (found) {
          found.list2.push({
            title_name: cur.title_name,
            option_names: cur.option_names
          })
        } else {
          acc[cur.question_level_one].list1.push({
            question_level_two: cur.question_level_two,
            list2: [
              {
                title_name: cur.title_name,
                option_names: cur.option_names
              }
            ]
          })
        }
      } else {
        acc[cur.question_level_one] = cur
        acc[cur.question_level_one].list1 = []
        acc[cur.question_level_one].list1.push({
          question_level_two: cur.question_level_two,
          list2: [
            {
              title_name: cur.title_name,
              option_names: cur.option_names
            }
          ]
        })
      }
      return acc
    }, {})
    questionData.value = Object.values(acc)
    console.log(questionData.value)
  }
}
getOrthQuestionList()

// 获取诊断数据

const diagnoseData = ref([])
async function getOrthDiagnoseList() {
  const result = await Get(`/prod-api/business/orthClass/list/2/诊断/${appId}`)
  diagnoseData.value = result.data
  if (result.data[0].classFlag) {
    clicked.value = true
  }
  result.data.forEach((item) => item.orthTitleList.forEach((title) => (title.showInput = false)))
  result.data.forEach((item) => {
    item.orthTitleList.forEach((title) => {
      if (title.type == 1) {
        title.optionId = ''
        title.text = ''
        title.showInput = false
        const choosenOptions = title.orthOptionsList.filter((option) => option.choosen === true)
        if (choosenOptions.length > 0) {
          title.optionId = choosenOptions[0].id
        }
      } else if (title.type == 2) {
        title.optionId = []
        title.optionId1 = []
        title.text = ''
        title.showInput = false
        const choosenOptions = title.orthOptionsList.filter((option) => option.choosen === true)
        if (choosenOptions.length > 0) {
          title.optionId = choosenOptions.map((option) => option.id)
          title.optionId1 = title.optionId
        }
      }
    })
  })
}
getOrthDiagnoseList()
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
@import '../../style/mixins.scss';
.stepFour {
  .content {
    padding: 20px;
    padding-bottom: 0;
    .questionItem {
      &__header {
        display: flex;
        align-items: center;
        padding: 12px 0;

        &__title {
          margin-left: 9px;
          font-weight: 500;
          letter-spacing: 0em;

          /* 文字/1级 */
          color: #1d2129;
        }
      }
      &__content {
        padding: 20px;
        padding-bottom: 4px;
        .singleQuestionItem {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          padding-right: 20px;
          box-sizing: border-box;

          border-radius: 12px;
          opacity: 1;
          box-sizing: border-box;
          border: 1px solid #e5e6eb;
          padding: 37px 20px 0px 20px;
          &__label {
            color: #4e5969;
            margin-right: 16px;

            white-space: nowrap;
          }
          &__content {
            color: #1d2129;
          }
          .question_level_two {
            @include caption;
            top: 0;
            left: 0;
            background: #eaf0fc;
            color: #2e6ce4;
            font-size: 14px;
          }
          .itemContainer {
            display: flex;
            width: 100%;
            flex-wrap: wrap;
            .item {
              width: 25%;
              margin-bottom: 16px;
            }
          }
          &:last-child {
            margin-bottom: 4px;
          }
        }

        &.content {
          padding: 0;
        }
      }
    }
    :deep .el-checkbox-button__inner {
      height: 32px;
      img {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
    :deep .el-radio-button {
      svg {
        position: relative;
        left: 3px;
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
</style>
