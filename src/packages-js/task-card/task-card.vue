<template>
  <div class="task-card">
    <renderTabBar />
    <renderTaskCardContent />
  </div>
</template>

<script setup lang="jsx">
import { useSlots, ref, onMounted, defineAsyncComponent, watchEffect } from 'vue'
import elementResizeDetectorMaker from 'element-resize-detector'
import style from './index.module.scss'
// tsx没有识别到vue组件，单独引入
// 待开发戳章
import devalop from '../../assets/imgs/develop.png'
import { ElProgress } from 'element-plus'
const SvgIcon = defineAsyncComponent(() => import('../svg-icon/svg-icon.vue'))
// 接收
const props = defineProps({
  default: {
    type: String
  }
})
const emit = defineEmits()
// slot实例
const slots = useSlots()
// 当前选中的tab
const currntTab = ref()
watchEffect(() => (currntTab.value = props.default))
// 插槽内容长度
const slotLen = slots.default && (slots.default()[0].children || slots.default()).length
// 监听元素宽度变化
onMounted(() => {
  emit('changeTab', props.default)
  const erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementsByClassName(style.taskCardItem), ele => {
    if (ele.offsetWidth < 334) isSmall.value = true
    else isSmall.value = false
  })
})
// 每一项
const isSmall = ref(false)
const renderTaskCardItem = data => {
  const taskCardItem = {
    marginRight: slotLen < 3 || data.index !== slotLen - 1 ? '20px' : '0'
  }
  const isBefor = data.index !== slotLen - 1 || data.index < 2

  return (
    <div
      class={
        currntTab.value === data.name
          ? style.taskCardItemActive
          : !isSmall.value
          ? style.taskCardItem
          : style.taskCardItemSmall
      }
      style={{ ...taskCardItem, justifyContent: data.num ? 'space-evenly' : 'space-between' }}
      onClick={() => {
        currntTab.value = data.name
        emit('changeTab', data.name)
      }}
    >
      {/* 显示title */}
      <div class="title">{data.name}</div>
      {/* 图片和数量 */}
      <div class="image">
        <SvgIcon name={data.svg_name} />
        <span class="num" v-show={data.num}>
          {data.num}
        </span>
        {!data.num && (
          <>
            <span class="left_num">{data.left_num}</span>
            <span class="right_num">/ {data.right_num}</span>
          </>
        )}
      </div>
      {/* 被选中的进度条 */}
      {!data.num && (
        <>
          <div class="progress">
            <ElProgress
              percentage={
                data.right_num == 0 ? 0 : Math.floor((data.left_num / data.right_num) * 100)
              }
            />
            <div class="span">
              <span>{data.left_text}</span>
              <span>{data.right_text}</span>
            </div>
          </div>
        </>
      )}
      {currntTab.value === data.name && (
        <>
          {data.index !== 0 && (
            <>
              <div class="after">
                <span />
              </div>
            </>
          )}
          {isBefor && (
            <>
              <div class="befor">
                <span />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

// tab拦
const renderTabBar = () => {
  const list = slots.default && (slots.default()[0].children || slots.default())
  const createElement = n => {
    const elements = []
    for (var i = 0; i < n; i++) {
      elements.push(
        <div class={style.taskCardItemDesable} style={{ marginRight: '20px' }}>
          {/* 待开发 */}
          <img src={devalop} />
        </div>
      )
    }
    return elements
  }
  return (
    <div class="task-card-tabbar">
      {list?.map((it, index) => {
        return renderTaskCardItem({ ...it.props, index })
      })}
      {slotLen - 3 < 0 && createElement(3 - slotLen)}
    </div>
  )
}
// 内容渲染
const renderTaskCardContent = () => {
  return (slots.default && (slots.default()[0].children || slots.default())).find(it => {
    return it.props?.name === currntTab.value
  })
}
</script>

<style scoped lang="scss">
.task-card {
  width: 100%;
  padding: 16px 20px;
}
.task-card-tabbar {
  height: 194px;
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid transparent;
  background-image: linear-gradient(#fff, #fff),
    linear-gradient(
      270deg,
      rgba(46, 108, 228, 0.09) 0%,
      rgba(46, 108, 228, 1) 31%,
      rgba(46, 108, 228, 1) 72%,
      rgba(46, 108, 228, 0.06) 98%
    );
  background-origin: border-box;
  background-clip: content-box, border-box;
}
</style>
