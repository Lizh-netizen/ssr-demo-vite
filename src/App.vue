<template>
  <ElConfigProvider :locale="EleZhCn">
    <RouterView />
  </ElConfigProvider>
</template>
<script setup>
  import { nextTick } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { ElConfigProvider } from 'element-plus'

// 国际中文

import EleZhCn from 'element-plus/dist/locale/zh-cn.mjs'
nextTick(() => {
  window.addEventListener('scroll', () => {
    console.log('scrol')
  })
})

</script>
