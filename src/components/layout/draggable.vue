<template>
  <div class="container">
    <draggable
      class="list-group"
      v-model="data"
      :move="onMove"
      :group="elements"
      item-key="id"
      @change="onChange"
    >
      <template #item="{ element }">
        <template v-if="question || unmutable || !element.position">
          <div
            class="list-group-item"
            :class="{
              InActive: question && !element.active,
              question: question == true,
              planTarget: planTarget == true,
              planTool: planTool == true
            }"
          >
            <img class="drag" src="../../assets/layout/drag.svg" />
            <div class="list-group-item-name">
              {{ question ? element.title_name + ' ' + element.name : element.name }}
            </div>
            <span v-if="question" class="list-group-item-label">{{ element.label }}</span>
            <img
              class="deleteBtn"
              src="../../assets/svg/delete.svg"
              v-if="showDeleteBtn"
              @click.stop="deleteAt(element)"
            />

            <el-tooltip
              :visible="element.active && element.showRemoveIcon"
              class="box-item"
              effect="dark"
              content="本期矫正不考虑该问题"
              placement="top"
            >
              <img
                class="remove"
                src="../../assets/layout/remove.svg"
                @click.stop="handleRemove(element)"
                v-if="question && element.active"
              />
            </el-tooltip>
            <el-tooltip
              :visible="!element.active && element.showCancelIcon"
              class="box-item"
              effect="dark"
              content="撤销"
              placement="top"
            >
              <img
                class="cancel"
                src="../../assets/layout/cancel.svg"
                @click.stop="handleCancel(element)"
                v-if="question && !element.active"
              />
            </el-tooltip></div
        ></template>

        <template v-else>
          <!-- 刚开始没有牙齿，点击之后悬浮 -->
          <template v-if="element.visible">
            <el-popover
              popper-class="myPopper1"
              placement="right"
              :visible="element.visible"
              :width="490"
              @after-leave="handleSaveTooth(element, title, classId)"
            >
              <template #reference>
                <!-- 这里是浮上去的时候改变图标的颜色 -->
                <div
                  class="list-group-item"
                  :class="{
                    InActive: question && !element.active,
                    question: question == true,
                    planTarget: planTarget == true,
                    planTool: planTool == true,
                    border: element.visible
                  }"
                >
                  <img class="drag" src="../../assets/layout/drag.svg" />
                  <div class="list-group-item-name">{{ element.name }}</div>
                  <span v-if="question" class="list-group-item-label">{{ element.label }}</span>
                  <img
                    class="deleteBtn"
                    src="../../assets/svg/delete.svg"
                    v-if="showDeleteBtn"
                    @click.stop="deleteAt(element)"
                  />
                </div>
              </template>
              <!-- 从目标拖到计划，是拖的目标的数据 -->
              <ChooseTooth
                :option="element"
                :arrange="true"
                :symptomList="symptomList"
                @getItem="getItem"
              ></ChooseTooth>
            </el-popover>
          </template>
          <template v-else>
            <el-popover
              popper-class="myPopper"
              :popper-style="{ width: 'auto', 'min-width': '100px' }"
              placement="top-start"
              trigger="click"
              @before-enter="handleBeforeEnterPopover(element)"
              :width="490"
            >
              <!-- 有牙齿的情况下悬浮显示选中牙位 -->
              <template #reference>
                <div
                  class="list-group-item truncate"
                  :class="{
                    InActive: question && !element.active,
                    question: question == true,
                    planTarget: planTarget == true,
                    planTool: planTool == true
                  }"
                >
                  <img class="drag" src="../../assets/layout/drag.svg" />
                  <div class="list-group-item-name">{{ element.name }}</div>
                  <span v-if="question" class="list-group-item-label">{{ element.label }}</span>
                  <img
                    class="deleteBtn"
                    src="../../assets/svg/delete.svg"
                    v-if="showDeleteBtn"
                    @click.stop="deleteAt(element)"
                  />
                </div>
              </template>
              <ChooseTooth
                :option="element"
                :arrange="true"
                :symptomList="symptomList"
              ></ChooseTooth>
            </el-popover>
          </template>
        </template>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { Container, Draggable } from 'vue-smooth-dnd'
import draggable from 'vuedraggable'
import ChooseTooth from './chooseTooth.vue'
import { watch, defineProps, ref, defineEmits, nextTick, computed } from 'vue'
import { averageThreeCourts } from '../../utils/calculate'
import { GetSymptom } from '../../utils/tooth'
import cloneDeep from 'lodash/cloneDeep'
import { Put } from '@/utils/request'
import { ElMessage } from 'element-plus'
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  question: {
    type: Boolean,
    default: false
  },
  unmutable: {
    type: Boolean,
    default: false
  },
  showDeleteBtn: {
    type: Boolean,
    default: false
  },
  planTarget: {
    type: Boolean,
    default: false
  },
  planTool: {
    type: Boolean,
    default: false
  },
  planIndex: {
    type: Number,
    default: -1
  },
  stageIndex: {
    type: Number,
    default: -1
  }
})
const data = ref(props.list)

const emit = defineEmits(['update', 'changeState'])
// data可以监听到props的变化
watch(
  props,
  (val) => {
    // 深拷贝是因为从左侧拖到右侧时改变右侧区域左侧区域会被同步更改
    data.value = JSON.parse(JSON.stringify(val.list))
  },

  { deep: true }
)
watch(data, (val) => {
  data.value = val
})
let toothItem = ref(null)
const onChange = (event) => {
  if (event.added && event.added.element) {
    const newItem = JSON.parse(JSON.stringify(event.added.element))

    if (newItem.name == '拔牙') {
      toothItem.value = newItem
      flag.value = true
      // 刚开始显示十字牙位时update一次，控制visible的显示
      emit('update', {
        data: data.value,
        flag: flag.value,
        planIndex: props.planIndex,
        stageIndex: props.stageIndex
      })
      flag.value = false
      return
    }
  }
  emit('update', { data: data.value })
}
// 删除
const deleteAt = (element) => {
  emit('update', {
    element: element,
    data: data.value,
    planIndex: props.planIndex,
    stageIndex: props.stageIndex,
    delete: true
  })
  // 删除的时候需要把每个都取消active，handleBeforeEnterPopover没触发
  symptomList.value.forEach((row) => {
    row.forEach((a) => {
      a.active = false
    })
  })
  // 从store中删除
}
// 从问题移除
const handleRemove = (element) => {
  Put('/prod-api/business/optionsResult', [
    {
      id: element.option_result_id,
      active: '0'
    }
  ])
  emit('changeState', { element: element, flag: false })
  element.showDeleteIcon = false
}
const handleCancel = (element) => {
  Put('/prod-api/business/optionsResult', [
    {
      id: element.option_result_id,
      active: '1'
    }
  ])
  emit('changeState', { element: element, flag: true })
  element.showCancelIcon = false
}
// 控制哪些可以拖拽，哪些不可以
const onMove = (e, originalEvent) => {
  if (
    (e.draggedContext.element.id,
    e.relatedContext.list.some((item) => item.id === e.draggedContext.element.id))
  ) {
    return false
  }
  return true
}
const flag = ref(false)

const put = ref(true)

const elements = ref({
  name: 'people',
  pull: props.unmutable ? 'clone' : true,
  put(to, from, e) {
    if ([...to.el.parentElement.classList].includes(from.el.parentElement.classList[1])) {
      return true
    } else {
      return false
    }
  }
})
watch(elements, (newVal) => {
  put.value = newVal.put
  elements.value = newVal
})
// 先存起来之后下一步的提交
const handleSaveTooth = (option, title, classId) => {
  useSelectTooth(item, title)
}
const symptomList = ref([])
symptomList.value = GetSymptom()
const handleBeforeEnterPopover = (title) => {
  symptomList.value.forEach((row) => {
    row.forEach((a) => {
      a.active = false
      if (title.toothCode?.includes(a.value + '')) {
        a.active = true
      }
    })
  })
}
let item = ref()
const getItem = (val) => {
  item.value = val
}
let hasTooth = false
window.addEventListener('click', (e) => {
  // 点击空白处，弹窗消失
  const popover = document.querySelector('.el-popper.el-popover.myPopper1')
  // 当点击非popover元素时，弹窗消失，数据中的visible为false
  // 并且将对应的target这一项放回到store中

  if (popover) {
    if (e.target !== popover && !popover.contains(e.target)) {
      if (data.value.length > 0 && props.planTarget) {
        hasTooth = data.value.some((element) => element.toothCode?.length > 0)
        // 有item并且有牙齿才可以提交
        if (item.value && hasTooth) {
          emit('update', {
            data: data.value,
            planIndex: props.planIndex,
            stageIndex: props.stageIndex
          })

          data.value.forEach((element) => {
            element.visible = false
          })
          item.value = null
        } else if (item.value || !hasTooth) {
          ElMessage({
            message: '请先选择牙位',
            type: 'warning'
          })
        }

        // data.value.forEach((element) => {
        //   if (element.name.includes('拔牙')) {
        //     console.log('🚀 ~ data.value.forEach ~ element:', element)

        // if (element.toothCode?.length == 0) {
        //   ElMessage({
        //     message: '请先选择牙位',
        //     type: 'warning'
        //   })
        //     } else if (element.toothCode?.length > 0) {
        // emit('update', {
        //   data: data.value,
        //   planIndex: props.planIndex,
        //   stageIndex: props.stageIndex
        // })
        // // 弹窗消失时再update一次，存储牙位信息到planList中
        // element.visible = false
        //     }
        //   }
        // })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  overflow: auto;
}
.list-group {
  margin-top: 16px;
  flex-wrap: wrap;
}
.list-group-item {
  height: 40px;
  border-radius: 8px;
  /* background: #E3EBFA; */
  background: #fff;
  display: flex;
  position: relative;
  align-items: center;
  margin-bottom: 8px;
  margin-right: 8px;
  &-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 20px;
  }
  &.InActive {
    border: 1px solid #c9cdd4;
    background-image: url('../../assets/layout/dragBackground.svg');
    .drag,
    .list-group-item-label,
    .list-group-item-name {
      opacity: 0.2;
    }
    .list-group-item-label {
      background: #e5e6eb;
    }
  }
  img {
    margin-right: 10px;
    margin-left: 10px;
  }
  &-label {
    position: absolute;
    margin-left: 10px;
    right: 0;
    top: 0;
    border-radius: 0px 0px 0px 8px;
    padding: 2px 12px;
    background: #eaf1ff;
    font-size: 12px;
    height: 20px;
  }
  .deleteBtn {
    position: absolute;
    right: 0;
    opacity: 0;
    top: 12px;
  }
  .remove,
  .cancel {
    position: absolute;
    left: 50%;
    opacity: 0;
    z-index: 100;
    cursor: pointer;
  }
  &.question {
    .list-group-item-label {
      color: #2e6ce4;
    }
    &:hover {
      /* 设置样式 */
      .drag,
      .list-group-item-label,
      .list-group-item-name {
        opacity: 0.2;
      }
      .list-group-item-label {
        background: #e5e6eb;
      }

      .remove,
      .cancel {
        opacity: 1;
      }
    }
  }
  &.planTarget,
  &.planTool {
    &:hover {
      .deleteBtn {
        opacity: 1;
      }
      border: 1px solid #c9cdd4;
    }
  }
  &.border {
    border: 1px solid #c9cdd4;
  }
}
</style>
