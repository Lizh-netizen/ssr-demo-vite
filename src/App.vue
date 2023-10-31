<template>
  <ConfigProvider :locale="AntdZhCN">
    <ElConfigProvider :locale="EleZhCn">
      <RouterView />
    </ElConfigProvider>
  </ConfigProvider>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import { ConfigProvider } from 'ant-design-vue'
// 国际中文
import AntdZhCN from 'ant-design-vue/es/locale/zh_CN'
import EleZhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>
