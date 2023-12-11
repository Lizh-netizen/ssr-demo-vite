<template>
  <el-input></el-input>
  <el-input></el-input>
  <div @click="submit">提交</div>
</template>

<script setup>
import CryptoJS from 'crypto-js'
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
