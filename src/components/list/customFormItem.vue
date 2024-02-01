<template>
  <div class="formItem">
    <div class="formItem__label" :style="{ width: width }">
      {{ label
      }}<el-tooltip class="box-item" effect="light" placement="top-start" v-if="showMark">
        <template #content> {{ content }} </template>
        <img
          @mouseenter="enterTool"
          @mouseleave="leaveTool"
          src="../../assets/svg/questionMark.svg"
          :style="{ cursor: 'pointer' }"
        />
      </el-tooltip>
    </div>
    <div class="formItem__content"><slot></slot></div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  width: String,
  showMark: Boolean
})
</script>

<style lang="scss" scoped>
.formItem {
  * {
    box-sizing: border-box;
  }
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  &__label {
    flex: 0 0 auto;
    align-items: center;
    /* flex-direction: row; */
    /* flex-wrap: wrap; */
    justify-content: flex-end;
    padding-right: 16px;
    min-width: 50px;
    color: #4e5969;
    text-align: right;
    display: flex;
    img {
      margin-left: 3px;
    }
  }
  &__content {
    flex: 1;
    display: flex;
    input {
      width: 100px;
      height: 32px;
      opacity: 1;

      /* 自动布局 */
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 8px 12px;
      gap: 5px;
      flex-grow: 1;
      align-self: stretch;
    }
  }
}
</style>
