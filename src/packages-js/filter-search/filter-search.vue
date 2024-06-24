<template>
  <div class="filter-search">
    <div class="filter-input" ref="filterinput">
      <ArcoSpace wrap size="medium">
        <template v-for="(item, index) in list" :key="index">
          <!-- 日期选中 -->
          <template v-if="item.type === 'date'">
            <div class="date-time">
              <div class="title">{{ item.name }}</div>
              <template v-if="item.dateType === 'date' || item.dateType === undefined">
                <ArcoDatePicker
                  :defaultValue="item.defaultDate"
                  :allow-clear="false"
                  v-model="modelVal[item.prop]"
                  format="YYYY-MM-DD"
                  position="bottom"
                >
                  <template #suffix-icon>
                    <i class="svg-icon iconfont icon-date_time" />
                  </template>
                </ArcoDatePicker>
                <div class="dateBtn" v-if="item?.showBtn">
                  <ElButton color="#E5E6EB" @click="preNextDate('pre', item.prop)">
                    <template #default>
                      <div class="svg-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                          <path fill="currentColor" d="M672 192 288 511.936 672 832z"></path>
                        </svg>
                      </div>
                    </template>
                  </ElButton>
                  <ElButton color="#E5E6EB" @click="preNextDate('next', item.prop)">
                    <template #default>
                      <div class="svg-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                          <path fill="currentColor" d="M384 192v640l384-320.064z"></path>
                        </svg>
                      </div>
                    </template>
                  </ElButton>
                </div>
              </template>
              <template v-if="item.dateType === 'range'">
                <ArcoRangePicker
                  :defaultValue="item.defaultDate"
                  :allow-clear="false"
                  v-model="modelVal[item.prop]"
                  format="YYYY-MM-DD"
                  shortcuts-position="left"
                  :shortcuts="shortcuts"
                >
                  <template #suffix-icon>
                    <i class="svg-icon iconfont icon-date_time" />
                  </template>
                </ArcoRangePicker>
              </template>
            </div>
          </template>
          <template v-else-if="item.type === 'select'">
            <div class="select" :data-multiple="item.multiple" :data-prop="item.prop">
              <div class="title" :class="{ 'w-[120px]!': item.name == '快筛/面评结果' }">
                {{ item.name }}
              </div>
              <ArcoSelect
                :class="{ 'pl-[122px]!': item.name == '快筛/面评结果' }"
                placeholder="请选择"
                v-model="modelVal[item.prop]"
                :options="item.options"
                :multiple="item.multiple"
                :max-tag-count="1"
                allow-clear
                :allow-search="item.allowSearch"
              >
                <template #option="{ data }">
                  <span
                    :class="{
                      statusSelect: item.selectType === 'status',
                      Neutral: data.value === modelVal[item.prop]
                    }"
                    :style="{
                      color: item.multiple && item.selectType === 'switch' ? '#1d2129' : ''
                    }"
                  >
                    <span>{{ data.label }}</span>
                  </span>
                  <i
                    class="svg-icon iconfont icon-check"
                    v-if="
                      item.multiple &&
                      item.selectType !== 'switch' &&
                      modelVal[item.prop]?.includes(data.value)
                    "
                  />
                  <ArcoSwitch
                    size="small"
                    class="switch"
                    :model-value="modelVal[item.prop]?.includes(data.value) || false"
                    v-if="item.multiple && item.selectType === 'switch'"
                  />
                </template>
              </ArcoSelect>
            </div>
          </template>
          <template v-else-if="item.type === 'search'">
            <div class="search">
              <ArcoInputSearch
                :placeholder="item.placeholder || '请搜索'"
                v-model="modelVal[item.prop]"
              />
            </div>
          </template>
          <template v-else-if="item.type === 'radio'">
            <div class="radio">
              <div class="title">{{ item.name }}</div>
              <div class="radio-select">
                <ArcoRadioGroup v-model="modelVal[item.prop]">
                  <ArcoRadio
                    :value="radio.value"
                    v-for="radio in item.radioOptions"
                    :disabled="false || radio.disabled"
                  >
                    <template #radio="{ checked }">
                      <div class="radio-item" :class="{ 'radio-item-checked': checked }">
                        {{ radio.label }}
                      </div>
                    </template>
                  </ArcoRadio>
                </ArcoRadioGroup>
              </div>
            </div>
          </template>
          <template v-else-if="item.type === 'checkbox'">
            <div class="checkbox">
              <div class="title">{{ item.name }}</div>
              <div class="checkbox-select">
                <ArcoCheckboxGroup v-model="modelVal[item.prop]">
                  <ArcoCheckbox
                    :value="checkbox.value"
                    v-for="checkbox in item.checkboxOptions"
                    :disabled="false || checkbox.disabled"
                  >
                    <template #checkbox="{ checked }">
                      <div class="checkbox-item" :class="{ 'checkbox-item-checked': checked }">
                        {{ checkbox.label }}
                        <i class="svg-icon iconfont icon-select-checkbox" v-show="checked" />
                      </div>
                    </template>
                  </ArcoCheckbox>
                </ArcoCheckboxGroup>
              </div>
            </div>
          </template>
          <template v-else-if="item.type === 'tab'">
            <div class="tab">
              <ArcoRadioGroup v-model="modelVal[item.prop]" type="button">
                <ArcoRadio
                  v-for="tab in item.tabOptions"
                  :value="tab.value"
                  :disabled="false || tab.disabled"
                >
                  {{ tab.label }}
                </ArcoRadio>
              </ArcoRadioGroup>
            </div>
          </template>
        </template>
      </ArcoSpace>
    </div>
    <div class="btn" v-if="true">
      <ArcoSpace size="medium">
        <template v-if="isShowUnfold">
          <div @click="isspread = !isspread" class="position-relative">
            <img src="../../assets/png/Fold.png" class="w-[20px]" v-if="isspread" />
            <img src="../../assets/png/Unfold@3x.png" class="w-[20px]" v-else />
            <span class="total" v-if="!isspread && total !== 0">{{ total }}</span>
          </div>
        </template>
        <img src="../../assets/png/button 1@3x.png" class="w-[34px]" @click="reset"/>
        <ArcoButton type="primary" @click="filter">查询</ArcoButton>
      </ArcoSpace>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, watchEffect, onBeforeMount } from 'vue'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import {
  Space as ArcoSpace,
  Button as ArcoButton,
  InputSearch as ArcoInputSearch,
  DatePicker as ArcoDatePicker,
  CheckboxGroup as ArcoCheckboxGroup,
  Checkbox as ArcoCheckbox,
  Radio as ArcoRadio,
  RadioGroup as ArcoRadioGroup,
  RangePicker as ArcoRangePicker,
  Select as ArcoSelect,
  Switch as ArcoSwitch
} from '@arco-design/web-vue'
import { ElButton } from 'element-plus'
dayjs.extend(weekday)
dayjs.locale('zh-cn')
// 接收
const {
  list,
  showFilterBtn = true,
  storageName,
  updateProp
} = defineProps(['list', 'showFilterBtn', 'storageName', 'updateProp'])
const emit = defineEmits()
// 展开
const isspread = ref(false)
let storageObj = ref({})
onBeforeMount(() => {
  storageObj.value = {}
  if (storageName) {
    if (!storageObj.value[storageName]) {
      storageObj.value[storageName] = 1
    } else {
      storageObj.value[storageName] = storageObj.value[storageName] + 1
    }
    const storageList = JSON.parse(sessionStorage.getItem(storageName))
    // 刚开始只是传递一个name，并没有缓存
    if (storageList) {
      // 有缓存直接用缓存，没有的话最开始初始化一个新的
      modelVal.value = storageList
      // emit('setInitialState', storageName)
    } else {
      modelVal.value = list.reduce((sum, item) => {
        if (item.type === 'date' && item.defaultDate) {
          if (item.dateType === 'range') {
            sum[item.prop] = item.defaultDate.map((item) => dayjs(item).format('YYYY-MM-DD'))
          } else {
            sum[item.prop] = dayjs(item.defaultDate).format('YYYY-MM-DD')
          }
        } else if (item.type === 'tab') {
          sum[item.prop] = item.tabOptions[0].value
        } else {
          sum[item.prop] = null
        }
        return sum
      }, {})
      // modelVal.value.officeId = JSON.parse(sessionStorage.getItem('jc_odos_user'))?.ljOfficeId
      // modelVal.value.doctorId = JSON.parse(sessionStorage.getItem('jc_odos_user'))?.ljProviderId
      // emit('setInitialState', storageName)
    }
  } else {
    modelVal.value = list.reduce((sum, item) => {
      if (item.type === 'date' && item.defaultDate) {
        if (item.dateType === 'range') {
          sum[item.prop] = item.defaultDate.map((item) => dayjs(item).format('YYYY-MM-DD'))
        } else {
          sum[item.prop] = dayjs(item.defaultDate).format('YYYY-MM-DD')
        }
      } else if (item.type === 'tab') {
        sum[item.prop] = item.tabOptions[0].value
      } else {
        sum[item.prop] = null
      }
      return sum
    }, {})
  }
})
// 筛选的响应式条件
const modelVal = ref()

watch(
  () => storageName,
  () => {
    if (storageName) {
      if (!storageObj.value[storageName]) {
        storageObj.value[storageName] = 1
      } else {
        storageObj.value[storageName] = storageObj.value[storageName] + 1
      }
      const storageList = JSON.parse(sessionStorage.getItem(storageName))
      // 刚开始只是传递一个name，并没有缓存
      if (storageList) {
        // 有缓存直接用缓存，没有的话最开始初始化一个新的
        modelVal.value = storageList
        emit('setInitialState', storageName)
      } else {
        modelVal.value = list.reduce((sum, item) => {
          if (item.type === 'date' && item.defaultDate) {
            if (item.dateType === 'range') {
              sum[item.prop] = item.defaultDate.map((item) => dayjs(item).format('YYYY-MM-DD'))
            } else {
              sum[item.prop] = dayjs(item.defaultDate).format('YYYY-MM-DD')
            }
          } else if (item.type === 'tab') {
            sum[item.prop] = item.tabOptions[0].value
          } else {
            sum[item.prop] = null
          }
          return sum
        }, {})
        modelVal.value.officeId = JSON.parse(sessionStorage.getItem('jc_odos_user'))?.ljOfficeId
        modelVal.value.doctorId = JSON.parse(sessionStorage.getItem('jc_odos_user'))?.ljProviderId
        emit('setInitialState', storageName)
      }
    } else {
      modelVal.value = list.reduce((sum, item) => {
        if (item.type === 'date' && item.defaultDate) {
          if (item.dateType === 'range') {
            sum[item.prop] = item.defaultDate.map((item) => dayjs(item).format('YYYY-MM-DD'))
          } else {
            sum[item.prop] = dayjs(item.defaultDate).format('YYYY-MM-DD')
          }
        } else if (item.type === 'tab') {
          sum[item.prop] = item.tabOptions[0].value
        } else {
          sum[item.prop] = null
        }
        return sum
      }, {})
    }
  }
)
// 当options为空数组，对应的当前选项清除
watchEffect(() => {
  if (!updateProp) return
  list.forEach((item) => {
    if (item.type === 'select' && updateProp.includes(item.prop)) {
      if (item.options && item.options?.length <= 0) {
        modelVal.value[item.prop] = null
      }
    }
  })
})
// 内容
const total = ref(0)
// 是否展示展开按钮
const isShowUnfold = ref(false)
// 防抖
const timeId = ref()
const totalVal = () => {
  clearTimeout(timeId.value)
  timeId.value = setTimeout(() => {
    const totalList = ref([])
    const p = document.querySelector('.filter-search')
    const htmlList = document.querySelectorAll('.filter-input .arco-space .arco-space-item')
    htmlList.forEach((item) => {
      item.offsetTop > p.offsetTop + 16 &&
        item.children[0].dataset.prop &&
        totalList.value.push(item.children[0].dataset.prop)
    })
    isShowUnfold.value = [...htmlList].some((item) => item.offsetTop > p.offsetTop + 16)
    isShowUnfold.value &&
      (total.value = totalList.value.filter((item) => {
        console.log(total.value, 'total')
        return modelVal.value[item] && JSON.stringify(modelVal.value[item]) !== '[]'
      }).length)
  }, 300)
}
// data变化时更新total
watch(modelVal, () => totalVal(), { deep: true, immediate: true })
// 视图变化时更新total
window.addEventListener('resize', () => totalVal())
// 监听元素宽度变化
watch(isspread, () => setStyle())
onMounted(() => {
  setStyle()
  totalVal()
})
const filterinput = ref()
const setStyle = () => {
  if (!isspread.value && showFilterBtn) {
    filterinput.value.style.height = '56px'
  } else {
    filterinput.value.style.height = 'auto'
  }
}
// 日期期间快速选择
const shortcuts = [
  {
    label: '上周',
    value: () => [
      dayjs().add(-1, 'week').weekday(1),
      dayjs().add(-1, 'week').weekday(1).add(1, 'week')
    ]
  },
  {
    label: '本周',
    value: () => [dayjs().weekday(1), dayjs().weekday(1).add(1, 'week')]
  },
  {
    label: '下周',
    value: () => [
      dayjs().add(1, 'week').weekday(1),
      dayjs().add(1, 'week').weekday(1).add(1, 'week')
    ]
  },

  {
    label: '一周',
    value: () => [dayjs(), dayjs().add(1, 'week')]
  }
]

// 重置

const reset = () => {
  // 数据恢复初始化 全部null
  modelVal.value = list.reduce((sum, item) => {
    // 过滤掉officeId
    if (item.type === 'date' && item.defaultDate) {
      sum[item.prop] = item.defaultDate
    } else {
      sum[item.prop] = null
    }
    return sum
  }, {})
  emit('reset')
}
// 查询
const filterData = ref({})
const filter = () => {
  for (const key in modelVal.value) {
    if (modelVal.value[key]) {
      filterData.value[key] = modelVal.value[key]
    } else {
      delete filterData.value[key]
    }
  }
  emit('filter', filterData.value)
}

watch(
  () => modelVal.value,
  (val) => {
    if (val) {
      sessionStorage.setItem(storageName, JSON.stringify(modelVal.value))
    }
    emit('changeData', filterData.value)
  },
  { deep: true, immediate: true }
)
// 前进/后退天数
const date = ref()
const preNextDate = (str, prop) => {
  if (str === 'pre') {
    if (!modelVal.value[prop]) {
      date.value = new Date()
    } else {
      date.value = new Date(modelVal.value[prop])
      // 上一天
      date.value.setDate(date.value.getDate() - 1)
    }
  } else if (str === 'next') {
    if (!modelVal.value[prop]) {
      date.value = new Date()
    } else {
      date.value = new Date(modelVal.value[prop])
      // 下一天
      date.value.setDate(date.value.getDate() + 1)
    }
  }
  modelVal.value[prop] = dayjs(date.value).format('YYYY-MM-DD')
}
</script>

<style scoped lang="scss">
.isselect {
  color: rgba(46, 108, 228, 1);
}
@import './index.module.scss';
</style>
<style lang="scss" scoped>
.Neutral {
  color: rgba(46, 108, 228, 1) !important;
}
.arco-select-dropdown {
  border-radius: 8px;
  .arco-select-option-active {
    background-color: #ffffff;
  }
  .arco-checkbox-checked .arco-checkbox-label {
    color: rgba(46, 108, 228, 1);
  }
  .arco-icon-hover {
    display: none;
  }
  .arco-select-option {
    .switch {
      position: absolute;
      right: 20px;
    }
    .arco-checkbox,
    .arco-checkbox .arco-checkbox-label,
    .arco-select-option-content {
      display: flex;
      align-items: center;
      position: static;
      overflow: initial;
      .svg-icon {
        position: absolute;
        right: 20px;
      }
    }
    .arco-select-option-content {
      padding-left: 12px;
    }
  }
}
.statusSelect {
  position: relative;
  padding-left: 14px;
  display: flex;
  align-items: center;
  &::after {
    content: '';
    display: block;
    position: absolute;
    z-index: 9;
    left: -8px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ddffe5;
  }
  &::before {
    content: '';
    display: block;
    position: absolute;
    z-index: 10;
    left: -5px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #66bf7b;
  }
}

.el-badge__content--danger {
  background-color: rgba(247, 101, 96, 1);
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.arco-trigger-popup {
  .arco-trigger-popup-wrapper {
    .arco-trigger-content {
      .arco-picker-container {
        .arco-picker-panel-wrapper {
          .arco-panel-date {
            .arco-panel-date-inner {
              .arco-picker-header {
                .arco-picker-header-icon {
                  .arco-icon.arco-icon-double-left {
                    display: none;
                  }
                  .arco-icon.arco-icon-double-right {
                    display: none;
                  }
                }
              }
            }
          }
          .arco-picker-footer {
            display: none;
          }
        }
      }
    }
  }
}
</style>
