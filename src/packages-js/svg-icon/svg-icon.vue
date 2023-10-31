<template>
  <svg aria-hidden="true" class="SvgIcon svg-icon" :style="{ fontSize: size }">
    <use :href="`#icon-${name}`"></use>
  </svg>
</template>

<script setup>
/**
 * name 是在src/assets 文件下的svg图路径
 * <svg-icon name='home-user' /> svg所处路径就是 src/assets/icons/home/user.svg
 * <svg-icon name='user' /> svg所处路径就是 src/assets/icons/user.svg
 */
const { name, size } = defineProps(['name', 'size'])
</script>

<style scoped lang="scss">
// 默认大小
.SvgIcon,
.svg-icon {
  width: 1em;
  height: 1em;
  &:focus {
    outline: none;
  }
}
</style>
