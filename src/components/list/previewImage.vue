<template>
  <div class="image-viewer" v-if="showViewer">
    <div class="overlay" @click="closeViewer">
      <div class="position-absolute className">{{ className }}</div>
      <div>
        <img
          src="./../../assets/svg/cancelDarkMode.svg"
          class="position-absolute top-[10px] right-[10px] height-[24px]"
          alt="close"
          @click="closeViewer"
        />
      </div>
      <div class="modal">
        <img :src="imageUrl" :style="viewerStyle" @click.stop class="image" />
      </div>

      <div
        class="rotate-buttons px-[24px] py-[24px]"
        v-if="showBtn"
        @click="
          () => {
            return false
          }
        "
      >
        <div class="flex justify-center">
          <div @click="rotateLeft" class="mr-[24px]">
            <img src="../../assets/svg/leftRotate.svg" />
          </div>
          <div @click="rotateRight"><img src="../../assets/svg/rightRotate.svg" /></div>
        </div>
      </div>
    </div>

    <!-- </div> -->
  </div>
</template>

<script setup>
import { Get } from '../../utils/request'
const props = defineProps(['imageUrl', 'showViewer', 'id', 'degree', 'owningModule', 'className'])
const emit = defineEmits(['closeViewer'])
const rotation = ref(props.degree || 0)
const showBtn = ref(false)
watch(props, (newVal) => {
  if (newVal.degree) {
    rotation.value = +newVal.degree
  }
  if (newVal.owningModule == '口内照') {
    showBtn.value = true
  } else {
    showBtn.value = false
  }
})

const openViewer = () => {
  showOverlay.value = true
}

const closeViewer = () => {
  emit('closeViewer')
}

const rotateLeft = async () => {
  rotation.value += 90
  await Get(
    `/prod-api/emr/orthCommon/updateOrthImageById?id=${props.id}&imageRotationDegree=${rotation.value}`
  )
}
const viewerStyle = computed(() => {
  return {
    transform: `translate(-50%, -50%) rotate(${rotation.value}deg)`
  }
})
const rotateRight = async () => {
  rotation.value -= 90
  await Get(
    `/prod-api/emr/orthCommon/updateOrthImageById?id=${props.id}&imageRotationDegree=${rotation.value}`
  )
}
</script>

<style lang="scss" scoped>
.image-viewer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .className {
    position: absolute;
    top: 10px;
    color: #ffffff;
    left: 10px;
    font-weight: bold;
    font-size: 16px;
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.89);
}

.image {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 80vh;
  width: 90vw;
  border-radius: 5px;
}

.rotate-buttons {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 6px;
}

.rotate-buttons button {
  margin-right: 10px;
}
</style>
