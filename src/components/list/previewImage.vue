<template>
  <div class="image-viewer" v-if="showViewer">
    <div class="overlay" @click="closeViewer"></div>
    <div class="position-absolute className">{{ className }}</div>
    <img
      class="position-absolute top-[10px] right-[10px] height-[24px]"
      src="./../../assets/svg/cancelDarkMode.svg"
      alt="close"
      @click="closeViewer"
    />
    <!-- <div class="modal"> -->
    <div class="photo" :style="viewerStyle">
      <img :src="imageUrl" @click.stop class="image" />
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
  const rotate = (rotation.value / 90) % 2
  return {
    transform: `rotate(${rotation.value}deg)`,
    width: rotate == 0 ? `90vh !important` : `80vh`
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
  left: 0;
  width: 100%;
  height: 100%;

  display: grid;
  place-items: center;

  .className {
    position: absolute;
    top: 10px;
    color: #ffffff;
    left: 10px;
    font-weight: bold;
    font-size: 16px;
  }

  .photo {
    height: 80vh;
    width: 90vw;
    border-radius: 5px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.89);
  z-index: -1;
}

// .image {
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   height: 80vh;
//   width: 90vw;
//   border-radius: 5px;
// }

.rotate-buttons {
  position: absolute;
  z-index: 5;
  // left: 50%;
  // transform: translateX(-50%);
  // bottom: 6px;
}

.rotate-buttons button {
  margin-right: 10px;
}
</style>
