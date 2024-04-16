import { computed } from 'vue';
<template>
  <div class="image-viewer" v-if="showViewer">
    <div class="overlay" @click="closeViewer"></div>
    <!-- <div class="modal"> -->
    <img :src="imageUrl" :style="viewerStyle" @click.stop class="modal" />
    <div class="rotate-buttons">
      <div class="flex justify-center">
        <div @click="rotateLeft" class="mr-[24px]">
          <img src="../../assets/svg/leftRotate.svg" />
        </div>
        <div @click="rotateRight"><img src="../../assets/svg/leftRotate.svg" /></div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script setup>
const props = defineProps(['imageUrl', 'showViewer'])
const emit = defineEmits(['closeViewer'])
const rotation = ref(0)

const openViewer = () => {
  showOverlay.value = true
}

const closeViewer = () => {
  emit('closeViewer')
}

const rotateLeft = () => {
  rotation.value -= 90
}
const viewerStyle = computed(() => {
  return {
    transform: `translate(-50%, -50%) rotate(${rotation.value}deg)`
  }
})
const rotateRight = () => {
  rotation.value += 90
}
</script>

<style lang="scss" scoped>
.image-viewer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;

  height: 80%;
  border-radius: 5px;
}

.rotate-buttons {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  bottom: -10px;
}

.rotate-buttons button {
  margin-right: 10px;
}
</style>
