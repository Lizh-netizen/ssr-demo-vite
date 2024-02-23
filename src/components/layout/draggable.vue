<template>
  <div class="container">
    <draggable class="list-group" v-model="data" :move="onMove" :group="options" item-key="id">
      <template #item="{ element }">
        <div
          class="list-group-item"
          :class="{ InActive: question && !element.active, question: question == true }"
        >
          <img class="drag" src="../../assets/layout/drag.svg" />
          <div class="list-group-item-name">{{ element.name }}</div>
          <span v-if="question" class="list-group-item-label">{{ element.label }}</span>
          <img
            class="deleteBtn"
            src="../../assets/svg/delete.svg"
            @click.stop="deleteAt(index)"
            v-if="showDeleteBtn"
          />
          <el-tooltip
            :visible="element.active && element.showRemoveIcon"
            class="box-item"
            effect="dark"
            content="本期矫正不考虑该问题"
            placement="top"
          >
            <img
              class="remove"
              src="../../assets/layout/remove.svg"
              @click.stop="handleRemove(element)"
              v-if="question && element.active"
            />
          </el-tooltip>
          <el-tooltip
            :visible="!element.active && element.showCancelIcon"
            class="box-item"
            effect="dark"
            content="撤销"
            placement="top"
          >
            <img
              class="cancel"
              src="../../assets/layout/cancel.svg"
              @click.stop="handleCancel(element)"
              v-if="question && !element.active"
            />
          </el-tooltip>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { Container, Draggable } from 'vue-smooth-dnd'
import draggable from 'vuedraggable'
import { watch, defineProps, ref, defineEmits, nextTick, computed } from 'vue'
import { averageThreeCourts } from '../../utils/calculate'
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  question: {
    type: Boolean,
    default: false
  },
  unmutable: {
    type: Boolean,
    default: false
  },
  showDeleteBtn: {
    type: Boolean,
    default: false
  }
})
const data = ref(props.list)

const emit = defineEmits(['update'])
watch(
  props,
  (val) => {
    data.value = val.list
  },
  { deep: true }
)
watch(data, (val) => {
  emit('update', val)
})
// 删除
const deleteAt = (index) => {
  console.log('delete', index)
  // data.value.splice(index, 1)
}
// 从问题移除
const handleRemove = (element) => {
  element.active = false
  element.showDeleteIcon = false
}
const handleCancel = (element) => {
  element.active = true
  element.showCancelIcon = false
}
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
const put = ref(true)

const options = ref({
  name: 'people',
  pull: props.unmutable ? 'clone' : '',
  put(to, from, e) {
    if ([...to.el.parentElement.classList].includes(from.el.parentElement.classList[1])) {
      return true
    } else {
      return false
    }
  }
})
watch(options, (newVal) => {
  put.value = newVal.put
  options.value = newVal
})
</script>

<style lang="scss" scoped>
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

      .deleteBtn {
        opacity: 1;
      }
      .remove,
      .cancel {
        opacity: 1;
      }
    }
  }
}
</style>
