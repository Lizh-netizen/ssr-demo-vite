<template>
  <ElConfigProvider :locale="EleZhCn">
    <RouterView />
  </ElConfigProvider>
</template>
<script setup>
import { RouterView, useRoute } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
const route = useRoute()
const params = route.query
if (params.token) {
  sessionStorage.odos_token = params.token
}
// 国际中文

import EleZhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>
