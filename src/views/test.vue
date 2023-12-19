<template>
  <a-button type="primary" @click="handleClick">Open Drawer</a-button>
  <a-drawer
    :width="340"
    v-model:visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    unmountOnClose
  >
    <template #title> Title </template>
    <div>
      You can customize modal body text by the current situation. This modal will be closed
      immediately once you press the OK button.
    </div>
  </a-drawer>
</template>

<script setup>
import CryptoJS from 'crypto-js'
import { ElButton } from 'element-plus'
import { ref } from 'vue'
const visible = ref(false)
const handleClick = () => {
  visible.value = true
}
const showDrawer = () => {
  visible.value = true
}
const encrypt = (data) => {
  const csrfToken = store.csrfToken
  const csrfKey = CryptoJS.MD5(csrfToken).toString()
  // 加密请求体
  const key = CryptoJS.enc.Utf8.parse(csrfKey)
  const iv = CryptoJS.enc.Utf8.parse(csrfKey.slice(0, 16))
  const src = CryptoJS.enc.Utf8.parse(JSON.stringify(data))
  const encrypted = CryptoJS.AES.encrypt(src, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  const body = CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  console.log(body)
  return body
}
const submit = () => {
  console.log(11)
  encrypt()
}
</script>
<style></style>
