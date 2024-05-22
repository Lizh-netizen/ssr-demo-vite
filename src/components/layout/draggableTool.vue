<template>
  <div class="container">
    <template v-for="(item, index) in data" :key="index">
      <div class="color-#3D3D3D font-size-[14px] font-500 mt-[16px]">{{ item.label }}</div>
      <draggable
        class="list-group"
        v-model="item.list"
        :move="onMove"
        :group="elements"
        item-key="id"
      >
        <template #item="{ element }">
          <div class="list-group-item">
            <img class="drag" src="../../assets/layout/drag.svg" />
            <div class="list-group-item-name">
              {{ element.name }}
            </div>
          </div>
        </template>
      </draggable>
    </template>

    <div class="mask" v-if="toothFlag"></div>
  </div>
</template>

<script setup>
import { Container, Draggable } from 'vue-smooth-dnd'
import draggable from 'vuedraggable'
import ChooseTooth from './layoutChooseTooth.vue'
import { watch, defineProps, ref, defineEmits, nextTick, computed, onMounted } from 'vue'
import { averageThreeCourts } from '../../utils/calculate'
import { GetSymptom } from '../../utils/tooth'
import cloneDeep from 'lodash/cloneDeep'
import { Put } from '@/utils/request'
import { ElMessage } from 'element-plus'
const props = defineProps({
  // 列表数据
  list: {
    type: Array,
    default: () => []
  }
})
const data = ref(props.list)
// popover要有初始值
if (data.value.length > 0) {
  data.value?.forEach((item) => (item.visible = false))
}

const emit = defineEmits(['update', 'changeState'])
// data可以监听到props的变化
watch(
  props,
  (val) => {
    // 深拷贝是因为从左侧拖到右侧时改变右侧区域左侧区域会被同步更改
    data.value = JSON.parse(JSON.stringify(val.list))
  },

  { deep: true }
)
watch(data, (val) => {
  data.value = val
})

// 控制哪些可以拖拽，哪些不可以
const onMove = (e, originalEvent) => {
  if (
    (e.draggedContext.element.id,
    e.relatedContext.list.some((item) => item.id === e.draggedContext.element.id))
  ) {
    return false
  }
  return true
}
const flag = ref(false)

const put = ref(true)

const elements = ref({
  name: 'people',
  pull: 'clone',
  put(to, from, e) {
    if ([...to.el.parentElement.classList].includes(from.el.parentElement.classList[1])) {
      return true
    } else {
      return false
    }
  }
})
watch(elements, (newVal) => {
  put.value = newVal.put
  elements.value = newVal
})

let item = ref({ changeStatus: false })

const getItem = (val) => {
  item.value = val
}
const showMask = ref(false)
const handleClickMask = (e) => {
  ElMessage({
    message: '请先选择牙位',
    type: 'warning'
  })
  e.stopPropagation()
}
let toothFlag = ref(false)
</script>

<style lang="scss" scoped>
.mask {
  z-index: 2000;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  left: 0;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.container {
  width: 100%;
  overflow: auto;
}
.list-group {
  margin-top: 16px;
  flex-wrap: wrap;
}
.list-group-item {
  height: 40px;
  border-radius: 8px;
  /* background: #E3EBFA; */
  background: #fff;
  display: flex;
  position: relative;
  align-items: center;
  margin-bottom: 8px;
  margin-right: 8px;
  &-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 20px;
  }
  &.InActive {
    border: 1px solid #c9cdd4;
    background-image: url('../../assets/layout/dragBackground.svg');
    .drag,
    .list-group-item-label,
    .list-group-item-name {
      opacity: 0.2;
    }
    .list-group-item-label {
      background: #e5e6eb;
    }
  }
  img {
    margin-right: 10px;
    margin-left: 10px;
  }
  &-label {
    position: absolute;
    margin-left: 10px;
    right: 0;
    top: 0;
    border-radius: 0px 0px 0px 8px;
    padding: 2px 12px;
    background: #eaf1ff;
    font-size: 12px;
    height: 20px;
  }
  .deleteBtn {
    position: absolute;
    right: 0;
    opacity: 0;
    top: 12px;
  }
  .remove,
  .cancel {
    position: absolute;
    left: 50%;
    opacity: 0;
    z-index: 100;
    cursor: pointer;
  }
  &.question {
    .list-group-item-label {
      color: #2e6ce4;
    }
    &:hover {
      /* 设置样式 */
      .drag,
      .list-group-item-label,
      .list-group-item-name {
        opacity: 0.2;
      }
      .list-group-item-label {
        background: #e5e6eb;
      }

      .remove,
      .cancel {
        opacity: 1;
      }
    }
  }
  &.planTarget,
  &.planTool {
    &:hover {
      .deleteBtn {
        opacity: 1;
        z-index: 100;
      }
      border: 1px solid #c9cdd4;
    }
  }
  &.border {
    border: 1px solid #c9cdd4;
  }
  &.dragOver {
    background-color: #e5e6eb;
    // box-shadow: 2px 2px 2px 2px #f2f3f5;
  }
}
</style>
