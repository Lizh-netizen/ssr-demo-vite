<template>
  <div class="container">
    <draggable class="list-group" v-model="data" @start="drag = true" group="people" item-key="id">
      <template #item="{ element }">
        <div class="list-group-item">
          <img src="../../assets/layout/drag.svg" />

          <div class="list-group-item-name">{{ element.name }}</div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import { watch, defineProps, ref, defineEmits } from 'vue'
const props = defineProps({
  list: {
    type: Array,
    default: () => []
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
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
}
.list-group {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
}
.list-group-item {
  width: 294px;
  height: 40px;
  line-height: 40px;
  border-radius: 8px;
  /* background: #E3EBFA; */
  background: #fff;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-right: 8px;
  img {
    margin-right: 10px;
    margin-left: 10px;
  }
}
</style>
