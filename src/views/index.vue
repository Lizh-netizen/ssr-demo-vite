<template>
  <div v-for="item in doctorList" :key="item.value" @click="handleClick">
    {{ item.label }}
  </div>
</template>

<script>
import { Post, Get } from '../utils/request'
import { useStore } from '../store'
import { createSSRRouter } from '../router'
export default defineComponent({
  name: 'index',
  async serverPrefetch() {},
  async setup() {
    const router = createSSRRouter()
    // 客户端完成事件的绑定
    const handleClick = () => {
      alert(1)
    }
    const doctorList = ref()
    const getDoctorLists = async () => {
      const res = await Get('prod-api/business/user/listNoPage?isRoot=false')
      doctorList.value = res.rows.map((item) => ({
        label: item.userName,
        value: item.ljProviderId
      }))
    }
    await getDoctorLists()
    const userStore = useStore()
    onServerPrefetch(async () => {
      await getDoctorLists()
      // await userStore.getList()
    })
    // 这里其实当服务端已经又了
    onMounted(async () => {
      // 这里是会再执行一遍的，
      // userStore.getList()
      await getDoctorLists()
    })
    return {
      userStore,
      handleClick,
      doctorList
    }
  }
})
</script>

<style lang="scss" scoped></style>
