<template>
  <ElConfigProvider :locale="EleZhCn">
    <RouterView />
  </ElConfigProvider>
</template>
<script setup>
import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'

// 国际中文

import EleZhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>
