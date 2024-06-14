<template>
  <div class="audio-vue">
    <audio :src="props.src" ref="audioRef" />
    <div class="audio" :class="{ Mobile: type === 'Mobile' }">
      <SvgIcon name="audio-play" v-show="!isPlay" @click="audioPlay" />
      <SvgIcon name="audio-pause" v-show="isPlay" @click="audioPause" />
      <div class="audio-Slider">
        <ElSlider
          v-model="process"
          @change="currentTimeChange"
          :show-tooltip="false"
          size="small"
        />
        <div class="time" v-show="!isPlay">{{ secondsToMMSS(audioData.duration as number) }}</div>
        <div class="time" v-show="isPlay">{{ secondsToMMSS(audioData.currentTime as number) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { secondsToMMSS } from '../../utils/secondsToMMSS'
import { ElSlider } from 'element-plus'
import { onMounted, reactive, ref, watch } from 'vue'

const props = defineProps<{
  src: string
  type?: 'Mobile' | 'PC'
  isAutoPlay?: boolean
  isShow?: boolean
}>()
// 是否在播放
const isPlay = ref(false)
// 进度
const process = ref(0)
// 音频时长
const audioData: {
  // 总时长
  duration: number
  // 播放时间
  currentTime: number
} = reactive({
  duration: 0,
  currentTime: 0
})

const audioRef = ref({} as HTMLAudioElement)
onMounted(() => {
  if (props.isAutoPlay) {
    document.querySelector('body')?.click()
    isPlay.value = true
    audioRef.value.play()
  }
  // 侦听总时长
  audioRef.value.addEventListener('loadedmetadata', () => {
    audioData.duration = Math.floor(audioRef.value.duration)
  })
  // 音频时长
  audioRef.value.addEventListener('canplay', () => {
    audioData.duration = Math.floor(audioRef.value.duration)
  })
  // 播放时间
  audioRef.value.addEventListener('timeupdate', () => {
    audioData.currentTime = Math.floor(audioRef.value.currentTime)
  })
  // 播放结束
  audioRef.value.addEventListener('ended', () => {
    isPlay.value = false
  })
})

watch(
  () => audioData.currentTime,
  () => {
    process.value = Math.floor((audioData.currentTime / audioData.duration) * 100)
  }
)
watch(
  () => props.isShow,
  (val) => {
    if (val) {
      isPlay.value = true
      audioRef.value.play()
    } else {
      isPlay.value = false
      audioRef.value.pause()
    }
  }
)
// 播放
const audioPlay = () => {
  isPlay.value = true
  audioRef.value.play()
}
// 暂停
const audioPause = () => {
  isPlay.value = false
  audioRef.value.pause()
}
// 改变播放时间
const currentTimeChange = () => {
  audioRef.value.load()
  audioRef.value.currentTime = (process.value / 100) * audioData.duration
  if (isPlay.value) {
    audioRef.value.play()
  } else {
    audioRef.value.pause()
  }
}
</script>

<style scoped lang="scss">
.audio-vue {
  .audio {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 352px;
    height: 23px;
    .svg-icon {
      cursor: pointer;
    }
    :deep .el-slider {
      width: 276px;
      height: 5px;
      .el-slider__runway {
        height: 5px;
      }
      .el-slider__bar {
        height: 5px;
        background: #4e5969;
      }
      .el-slider__button {
        width: 14px;
        height: 14px;
        background: #4e5969;
        border: 2px solid #fff;
      }
    }
    .audio-Slider {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      .time {
        display: flex;
        align-items: center;
        margin-left: 8px;
        width: 40px;
        height: 23px;
        color: #4e5969;
      }
    }
    &.Mobile {
      display: flex;
      flex-direction: column-reverse;
      .svg-icon {
        margin-top: 40px;
        width: 48px;
        height: 48px;
        cursor: pointer;
      }
    }
  }
}
</style>
