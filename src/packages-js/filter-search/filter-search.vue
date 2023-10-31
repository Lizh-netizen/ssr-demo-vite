<template>
  <div class="filter-search">
    <div class="filter-input" ref="filterinput">
      <ArcoSpace wrap size="medium">
        <template v-for="(item, index) in list" :key="index">
          <template v-if="item.type === 'date'">
            <div class="date-time">
              <div class="title">{{ item.name }}</div>
              <ArcoRangePicker
                :allow-clear="false"
                v-model="modelVal[item.prop]"
                format="YYYY-MM-DD"
                shortcuts-position="left"
                :shortcuts="shortcuts"
              >
                <template #suffix-icon>
                  <SvgIcon name="date_time" size="16px" />
                </template>
              </ArcoRangePicker>
            </div>
          </template>
          <template v-if="item.type === 'select'">
            <div class="select" :data-multiple="item.multiple" :data-prop="item.prop">
              <div class="title">{{ item.name }}</div>
              <ArcoSelect
                placeholder="请选择"
                v-model="modelVal[item.prop]"
                :options="item.options"
                :multiple="item.multiple"
                :max-tag-count="1"
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
                    <span>{{ data.value }}</span>
                  </span>
                  <SvgIcon
                    name="check"
                    v-if="
                      modelVal[item.prop]?.includes(data.value) &&
                      item.multiple &&
                      item.selectType !== 'switch'
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
          <template v-if="item.type === 'search'">
            <div class="search">
              <ArcoInputSearch placeholder="请搜索" v-model="modelVal[item.prop]" />
            </div>
          </template>
          <template v-if="item.type === 'radio'">
            <div class="radio">
              <div class="title">{{ item.name }}</div>
              <div class="radio-select">
                <ArcoRadio />
                <ArcoRadio />
                <ArcoRadio />
              </div>
            </div>
          </template>
        </template>
      </ArcoSpace>
    </div>
    <div class="btn">
      <ArcoSpace size="medium">
        <ArcoButton @click="reset">重置</ArcoButton>
        <ArcoButton type="primary" @click="filter">查询</ArcoButton>
        <template v-if="isShowUnfold">
          <ArcoButton type="text" @click="isspread = !isspread">
            <span>展开</span>
            <icon-down v-show="!isspread" />
            <icon-up v-show="isspread" />
            <span class="total" v-if="!isspread && total !== 0">{{ total }}</span>
          </ArcoButton>
        </template>
      </ArcoSpace>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps, defineEmits } from 'vue'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)
dayjs.locale('zh-cn')
/**
 * @list 所包含的内容数组
 * @name 选择器title
 * @prop 选择器的key值 @注意 prop没一条请不要一样，否则多条绑定数据会只有一个
 * @type 组件类型
 * @options 下拉框option
 * @multiple 是否开启多选
 * @allowSearch 是否允许搜索 多选默认可以，单选默认不可以
 * @selectType 下拉框的类型
 */
const { list } = defineProps({
  list: {
    type: Array
  }
})
const emit = defineEmits()
// 展开
const isspread = ref(false)
// 筛选的响应式条件
const modelVal = ref(
  list.reduce((sum, item) => {
    sum[item.prop] = null
    return sum
  }, {})
)
// // 内容
const total = ref(0)
// // 是否展示展开按钮
const isShowUnfold = ref(false)
const totalVal = () => {
  const totalList = ref([])
  const htmlList = document.querySelectorAll('.filter-input .arco-space .arco-space-item')
  htmlList.forEach((item, index) => item.offsetTop > 438 && totalList.value.push(index))
  isShowUnfold.value = [...htmlList].some((item) => item.offsetTop > 438)
  total.value = Object.values(modelVal.value).filter((item, index) => {
    return item !== null && totalList.value.includes(index)
  }).length
}
// data变化时更新total
watch(modelVal, () => totalVal(), { deep: true })
// 视图变化时更新total
window.addEventListener('resize', () => totalVal())
// 监听元素宽度变化
watch(isspread, () => setStyle())
onMounted(() => {
  setStyle()
  totalVal()
})
const filterinput = ref(null)
const setStyle = () => {
  if (!isspread.value) {
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
    sum[item.prop] = null
    return sum
  }, {})
}
// 查询
const filter = () => {
  const filterData = {}
  for (const key in modelVal.value) {
    if (modelVal.value[key]) {
      filterData[key] = modelVal.value[key]
    }
  }
  emit('filter', filterData)
}
</script>

<style scoped lang="scss">
.isselect {
  color: $Neutral;
}
@import './index.module.scss';
</style>
<style lang="scss">
.Neutral {
  color: $Neutral !important;
}
.arco-select-dropdown {
  border-radius: 8px;
  .arco-select-option-active {
    background-color: $text;
  }
  .arco-checkbox-checked .arco-checkbox-label {
    color: $Neutral;
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
  background-color: $Alarm;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
</style>
