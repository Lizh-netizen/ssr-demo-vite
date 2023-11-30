<template>
  <svg
    aria-hidden="true"
    class="SvgIcon svg-icon"
    :style="{ width: props.size, height: props.size }"
  >
    <use :href="`#icon-${props.name}`"></use>
  </svg>
</template>

<script setup>
const props = defineProps(['name', 'size'])
</script>

<style scoped lang="scss">
// 默认大小
.SvgIcon,
.svg-icon {
  width: 1em;
  height: 1em;
}
</style>
