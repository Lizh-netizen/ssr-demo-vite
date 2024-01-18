<template>
  <div class="table">
    <div class="set" v-if="showSet">
      <ElTooltip content="表格设置" placement="top">
        <div class="svg-icon" @click="isSet = !isSet">
          <svg data-v-207d329c="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path
              fill="currentColor"
              d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384zm0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256z"
            ></path>
          </svg>
        </div>
      </ElTooltip>
      <div class="list" ref="listRef" v-show="isSet">
        <template v-for="(item, index) in sortList" :key="index">
          <div class="list-item" :draggable="item.disabled ? 'false' : 'true'" :data-id="index">
            <div class="icon-item">
              <i class="svg-icon iconfont icon-drag" />
              <span class="span">{{ item?.title }}</span>
            </div>
            <ElSwitch v-model:model-value="item.switch" :disabled="item.disabled" />
          </div>
        </template>
      </div>
    </div>
    <ElTable :data="data" width="100%" @sort-change="sortMethod">
      <slot name="custom-table-item">
        <template v-for="(item, index) in columnsList" :key="index">
          <CustomTableItem
            :prop="item.prop"
            :title="item.title"
            :width="item.width"
            :fixed="item.fixed"
            :sortable="item.sortable"
            :type="item.type"
            :icon-option="item.iconOption"
            :left-tag-option="item.leftTagOption"
            :right-tag-option="item.rightTagOption"
            :state-option="item.stateOption"
            :state-icon="item.stateIcon"
            :edit-state-type="item.editStateType"
            @edit-state="(data) => emit(item.editStateEventName, data)"
            @change-note="changeNote"
          >
            <template #icon-click="row">
              <slot :name="item.slotName" :row="row" />
            </template>
            <template #operation="row">
              <slot :name="item.slotName || 'operation'" :row="row" />
            </template>
            <template #default="row">
              <slot :name="item.slotName" :row="row" />
            </template>
          </CustomTableItem>
        </template>
      </slot>
    </ElTable>
    <div class="pagination" v-if="pagination === '' || !!pagination">
      <ElPagination
        v-model:current-page="pages.page"
        :hideOnSinglePage="hideOnSinglePage"
        v-model:page-size="pages.pageSize"
        layout="prev, pager, next"
        background
        :total="total"
        @current-change="onChange"
      />
    </div>
  </div>
</template>

<script setup>
import { watch, ref, onMounted, watchEffect, onBeforeMount } from 'vue'
import { ElSwitch, ElTooltip, ElTable, ElPagination } from 'element-plus'
import CustomTableItem from '../custom-table-item/custom-table-item.vue'
// 接收
const {
  data,
  pagination = false,
  total,
  hideOnSinglePage = false,
  columns,
  pagesStorage,
  showSet
} = defineProps([
  'data',
  'pagination',
  'total',
  'pagesStorage',
  'hideOnSinglePage',
  'columns',
  'showSet'
])
watch(
  () => pagesStorage,
  (val) => {
    const page = JSON.parse(sessionStorage.getItem(pagesStorage))
    if (page !== null) {
      pages.value = page
    } else {
      pages.value = {}
    }
  }
)
onBeforeMount(() => {
  const page = JSON.parse(sessionStorage.getItem(pagesStorage))
  if (page !== null) {
    pages.value = page
  } else {
    pages.value = {}
  }
})
const defaultColumns = columns
// 做响应式数据排序和展示不展示
const columnsList = ref(columns)
// 拖动排序展示内容
const sortList = ref(
  columns?.map((it) => {
    return {
      title: it.title,
      switch: ref(true),
      disabled: !!it.fixed || it.title === '操作'
    }
  })
)
watch(
  () => sortList.value,
  () => {
    columnsList.value = defaultColumns?.filter((it, index) => {
      return sortList.value[index]?.switch || !!it.fixed || it.title === '操作'
    })
  },
  { deep: true }
)
watch(
  () => columns,
  (val) => {
    columnsList.value = val
  }
)
// 每页显示条数 & 当前页码
const pages = ref({
  page: 1,
  pageSize: 10
})
// 当前页码
const current = ref(1)
// 每页显示条数
const pageSize = ref(10)
const emit = defineEmits()
// enent changePage 切换page/pageSize
const onChange = (page) => {
  sessionStorage.setItem(pagesStorage, JSON.stringify(pages.value))
  pages.value.page = page
  emit('changePage', pages.value)
}
// 点击排序后的参数
const sortMethod = (e) => {
  emit('sortMethod', e)
}
// 修改备注
const changeNote = ({ row, note }) => {
  emit('changeNote', { row, note })
}

// 拖动排序
const flip = ref()
// 是否在设置表格
const isSet = ref(false)
// 可拖动区域的元素prient
const listRef = ref({})
// 当前正在拖动的是哪个元素
const sourceNode = ref({})
onMounted(() => {
  listRef.value.ondragstart = (e) => {
    const div = e.target
    setTimeout(() => div.classList.add('moving'))
    sourceNode.value = e.target
    e.dataTransfer.effectAllowed = 'move'
    flip.value = new Flip(listRef.value.children, 0.3)
  }
  listRef.value.ondragover = (e) => e.preventDefault()
  listRef.value.ondragenter = (e) => {
    e.preventDefault()
    const div = e.target
    if (div === listRef.value || div === sourceNode.value) return
    const children = Array.from(listRef.value.children)
    const sourceIndex = children.indexOf(sourceNode.value)
    const targetIndex = children.indexOf(div)
    if (sourceIndex < targetIndex) {
      if (div.nextElementSibling?.classList.contains('list-item')) {
        listRef.value.insertBefore(sourceNode.value, div.nextElementSibling)
      }
    } else {
      if (div.classList.contains('list-item')) {
        if (!div.draggable) return
        listRef.value.insertBefore(sourceNode.value, div)
      }
    }
    flip.value.play()
  }
  listRef.value.ondragend = (e) => {
    const div = e.target
    div.classList.remove('moving')
    const list = ref([])
    ;[...listRef.value.children].forEach((it) => {
      list.value.push(defaultColumns[it.dataset.id])
    })
    columnsList.value = list.value
  }
})
// 是否点击的是list以外的区域
document.addEventListener('click', (e) => {
  const list = [
    'list',
    'list-item',
    'span',
    'el-switch__core',
    'el-switch__action',
    '[object SVGAnimatedString]'
  ]
  if (list.includes(e.target.className.toString())) return
  isSet.value = false
})
</script>
<style scoped lang="scss">
@import './index.module.scss';
</style>
<style lang="scss">
:where(.css-dev-only-do-not-override-kqecok).ant-select-dropdown
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
  background-color: #f2f3f5;
}
.el-popper {
  span {
    font-size: 16px;
  }
}
</style>
