<template>
  <div class="table">
    <div class="set">
      <ElTooltip content="表格设置" placement="top">
        <ElIcon size="20px" @click="isSet = true"><Setting /></ElIcon>
      </ElTooltip>
      <div class="list" ref="listRef" v-show="isSet">
        <template v-for="(item, index) in sortList" :key="index">
          <div class="list-item" :draggable="item.disabled ? 'false' : 'true'" :data-id="index">
            <div class="icon-item">
              <HolderOutlined />
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
            <template #icon-hover="row">
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
    <div class="pagination" v-if="pagination">
      <APagination
        v-model:current="current"
        :hideOnSinglePage="hideOnSinglePage"
        :total="total"
        @change="onChange"
      />
    </div>
  </div>
</template>

<script setup lang="jsx">
import { watch, ref, onMounted } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { HolderOutlined } from '@ant-design/icons-vue'
import { Pagination as APagination } from 'ant-design-vue'
import { ElSwitch, ElTooltip, ElTable, ElIcon } from 'element-plus'
/**
 * @data 表格数据
 * @pagination 是否显示分页器，默认是false
 * @defaultPage 初始页面，默认是1
 * // paginationOptions 分页器配置
 * @total 总条数
 * @hideOnSinglePage 只有一页时是否隐藏分页器
 * // method
 * @sortMethod 指定数据按照哪个属性进行排序，仅当sortable设置为true的时候有效。
 */
const {
  data,
  pagination = false,
  total,
  hideOnSinglePage = false,
  columns
} = defineProps(['data', 'pagination', 'total', 'hideOnSinglePage', 'columns'])
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
const current = ref(1)
const emit = defineEmits()
// enent changePage 切换page/pageSize
const onChange = (page, pageSize) => {
  emit('changePage', { page, pageSize })
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
