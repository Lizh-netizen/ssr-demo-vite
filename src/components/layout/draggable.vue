<template>
  <div class="container">
    <draggable
      class="list-group"
      v-model="data"
      @start="drag = true"
      @end="drag = false"
      group="people"
      item-key="id"
    >
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
import { watch, defineProps, ref } from 'vue'
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})
const data = ref(props.list)

watch(
  props,
  (val) => {
    data.value = val.list
  },
  { deep: true }
)
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
  background: #ecedee;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-right: 8px;
}
</style>
