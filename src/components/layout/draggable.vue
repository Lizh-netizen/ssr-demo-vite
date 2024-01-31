<template>
  <div class="container">
    <draggable class="list-group" v-model="data" :move="onMove" :group="options" item-key="id">
      <template #item="{ element }">
        <div class="list-group-item">
          <img src="../../assets/layout/drag.svg" />
          <div class="list-group-item-name">{{ element.name }}</div>
          <span v-if="question" class="list-group-item-label">{{ element.label }}</span>
          <img
            class="deleteBtn"
            src="../../assets/svg/delete.svg"
            @click.stop="removeAt(index)"
            v-if="showDeleteBtn"
          />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { Container, Draggable } from 'vue-smooth-dnd'
import draggable from 'vuedraggable'
import { watch, defineProps, ref, defineEmits, nextTick, computed } from 'vue'
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
const removeAt = (index) => {
  data.value.splice(index, 1)
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
    background: #fde7e6;
    font-size: 12px;
    height: 20px;
  }
  .deleteBtn {
    position: absolute;
    right: 0;
    opacity: 0;
  }
  &:hover {
    .deleteBtn {
      opacity: 1;
    }
  }
}
</style>
