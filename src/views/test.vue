<template>
  <el-select v-model="value" value-key="id" placeholder="Select">
    <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item">
      <template #default>
        <div>
          <span>转{{ item.label }}</span>
        </div>
      </template>
    </el-option>
  </el-select>
</template>

<script setup>
import { ref, computed } from 'vue'
const value = ref(null)
const options = ref([
  { id: 1, label: '选项一' },
  { id: 2, label: '选项二' },
  { id: 3, label: '选项三' },
  { id: 4, label: '选项四' },
  { id: 5, label: '选项五' }
])
</script>
<style></style>
