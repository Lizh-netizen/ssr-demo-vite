<template>
  <div>
    <video id="video" autoplay :style="{ display: 'none' }"></video>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  const video = document.getElementById('video')
  const canvas = document.getElementById('canvas')
  const context = canvas.getContext('2d')

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream

      // 当视频元数据加载完成后获取视频的宽度和高度
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        // 开始播放视频
        video.play()

        // 在每一帧绘制视频帧到 canvas，并抽帧发送给后端
        function captureAndSendFrame() {
          context.drawImage(video, 0, 0, canvas.width, canvas.height)
          canvas.toBlob(
            (blob) => {
              // 在这里可以将 blob 传递给后端，通过 WebSocket 发送
              sendFrameToBackend(blob)
            },

            'image/jpeg',
            0.95
          ) // 指定图像格式和压缩质量
        }

        setInterval(captureAndSendFrame, 0)
      }
    })
    .catch((error) => {
      console.error('Error accessing webcam:', error)
    })

  const socket = new WebSocket('ws://your-backend-server')

  socket.onopen = () => {
    console.log('WebSocket connection opened')
  }

  socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event)
  }

  function sendFrameToBackend(blob) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(blob)
    }
  }
})
</script>
<style scoped></style>
