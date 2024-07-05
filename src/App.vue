<template>
  <ElConfigProvider :locale="EleZhCn">
    123
    <nav>
      <router-link :to="{ name: 'about' }">Go to about</router-link>
      <router-link :to="{ name: 'user' }">Go to user</router-link>
      <router-link :to="{ name: 'index' }">Go to Home</router-link>
    </nav>
    <div class="container pt-12px pb-12px">
      <router-view v-slot="{ Component }">
        <Suspense>
          <component :is="Component" />
        </Suspense>
      </router-view>
    </div>
  </ElConfigProvider>
</template>
<script setup>
import { RouterView, useRoute } from 'vue-router'
import { ElConfigProvider } from 'element-plus'

// 国际中文

import EleZhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>
