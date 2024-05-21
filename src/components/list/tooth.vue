<!-- 点击十字牙位出现牙位图 -->
<template>
  <el-popover
    :width="490"
    :visible="title.popVisible"
    @show="handleBeforeEnterPopover(title)"
    @after-leave="handleSubmitTooth(title)"
  >
    <template #reference>
      <div class="diagramWrapper" @click.stop="handleClick(title, data)">
        <div class="diagram">
          <div class="diagramBox">
            <div class="toothItem1">
              {{
                title.topLeft
                  ?.sort((a, b) => a.sort - b.sort)
                  .map((a) => a.value)
                  .join('')
              }}
            </div>
            <div class="toothItem2">
              {{
                title.topRight
                  ?.sort((a, b) => a.sort - b.sort)
                  .map((a) => a.value)
                  .join('')
              }}
            </div>
          </div>
          <div class="diagramBox">
            <div class="toothItem3">
              {{
                title.bottomLeft
                  ?.sort((a, b) => a.sort - b.sort)
                  .map((a) => a.value)
                  .join('')
              }}
            </div>
            <div class="toothItem4">
              {{
                title.bottomRight
                  ?.sort((a, b) => a.sort - b.sort)
                  .map((a) => a.value)
                  .join('')
              }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="selectContainer" id="selectContainer">
      <div class="container">
        <template v-for="(row, rowindex) in symptomList" :key="rowindex">
          <div
            class="symptomBox"
            :class="{
              itemAlignRight: rowindex === 2 || rowindex === 4 || rowindex === 0 || rowindex === 6,
              marginTop: rowindex == 4 || rowindex == 5,
              marginBottom: rowindex == 2 || rowindex == 3,
              marginRight: rowindex === 2 || rowindex === 4 || rowindex === 0 || rowindex === 6,
              marginLeft: rowindex === 1 || rowindex === 3 || rowindex === 5 || rowindex === 7
            }"
          >
            <div
              class="symptomItem"
              :class="{ selected: item.active === true }"
              :id="item.value"
              v-for="(item, index) in row"
              :key="index"
              @click.stop="handleSelectTooth(item, title)"
            >
              {{ item.label }}
            </div>
          </div>
        </template>
      </div>
      <div class="left">右</div>
      <div class="right">左</div>
    </div>
  </el-popover>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { GetSymptom } from '@/utils/tooth'
import useSelectTooth from '@/effects/selectTooth.ts'
import { Post } from '@/utils/request'
const props = defineProps(['title', 'appId', 'data', 'step', 'module', 'classId', 'owningModule'])
const emit = defineEmits(['submitTooth', 'changePopVisible', 'toothClicked'])
const title = ref(props.title)

const data = ref(props.data)

watch(
  () => props.data,
  (val) => {
    data.value = val
  },
  { deep: true }
)
watch(
  () => props.title,
  (val) => {
    title.value = val
  },
  { deep: true }
)
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
// 选中牙位
const handleSelectTooth = (item, title) => {
  emit('toothClicked')
  useSelectTooth(item, props.title)
}

const handleSubmitTooth = (title) => {
  if (props.step == 2) {
    if (!title.submitAble) {
      return
    }
    if (props.module == 'evaluate') {
      let obj = {
        aptmId: props.appId,
        titleId: title.id,
        optionsIdStr: [],
        otherContent: '',
        cephalometricsContent: '',
        optionSuffix: '牙位图',
        fdiToothCode: title.toothCode.join(),
        showPosition: JSON.stringify(title.position),
        classId: props.classId,
        owningModule: props.owningModule
      }
      Post('/prod-api/emr/facialAssessment/addFacialResult', obj).then(() => {
        title.submitAble = false
      })
    } else {
      let obj = {
        aptmId: props.appId,
        titleId: title.id,
        optionsIdStr: [],
        otherContent: '',
        cephalometricsContent: '',
        optionSuffix: '牙位图',
        fdiToothCode: title.toothCode.join(),
        showPosition: JSON.stringify(title.position),
        classId: props.classId,
        owningModule: props.owningModule
      }
      Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj).then(() => {
        title.submitAble = false
      })
    }
  } else {
    emit('submitTooth', title)
  }
  // 清理掉poper
}
const openPop = (title, item) => {
  // 如果没有图片，就不显示popover
  item.orthTitleList?.forEach((t) => {
    if (title !== t) {
      t.popVisible = false
    }
  })
  title.popVisible = !title.popVisible
}
const handleClick = (title, data) => {
  openPop(title, data)
  activeTitle.value = title
}
const activeTitle = ref()
onMounted(() => {
  window.addEventListener('click', (e) => {
    // 点击空白处，弹窗消失
    const popover = document.querySelector('.el-popper.el-popover')
    console.log(`output->e.target`, e.target)
    if (popover) {
      if (e.target !== popover && !popover.contains(e.target) && data.value) {
        const index = data.value.orthTitleList?.findIndex((title) => title.popVisible)

        if (index !== -1) {
          data.value.orthTitleList[index].popVisible = false
        }
      }
    }
  })
})
</script>

<style lang="scss" scoped>
.diagramWrapper {
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  .diagram {
    position: relative;
    .diagramBox {
      width: 122px;
      height: 36px;
      display: flex;
      div {
        height: 36px;
        width: 61px;
        display: flex;
        align-items: center;
        padding: 4px;
        box-sizing: border-box;
      }
      &:nth-child(1) {
        border-bottom: 1px solid #d8d8d8;
        > div:nth-child(1) {
          border-right: 1px solid #d8d8d8;
          justify-content: end;
        }
      }
      &:nth-child(2) {
        > div:nth-child(1) {
          border-right: 1px solid #d8d8d8;
          justify-content: end;
        }
      }
    }
  }
}
.selectContainer {
  .container {
    display: grid;
    grid-template-columns: auto auto;
    .symptomBox {
      display: flex;
      .symptomItem {
        width: 24px;
        height: 24px;
        /* border: solid 1px #ccc; */
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 2px 2px;
        cursor: pointer;
        border: 0.5px solid #e9e9eb;
        box-sizing: border-box;
        &.selected {
          background-color: #0081cc;
          border-color: #0081cc;
          color: #fff;
        }
      }
      &.marginTop {
        margin-top: 16px;
      }
      &.marginBottom {
        margin-bottom: 16px;
      }
      &.marginRight {
        margin-right: 12px;
      }
      &.marginLeft {
        margin-left: 12px;
      }
      &.itemAlignRight {
        justify-content: end;
      }
    }
  }
  &:after {
    content: '';
    position: absolute;
    width: 1px;
    height: 138px;
    left: 247px;
    top: 16px;
    background: #d8d8d8;
  }
  &:before {
    content: '';
    position: absolute;
    width: 465px;
    height: 1px;
    left: 20px;
    top: 82px;
    background: #d8d8d8;
  }
  .left {
    position: absolute;
    width: 26px;
    height: 20px;
    z-index: 6;
    left: 120px;
    background: #ffffff;
    top: 72px;
    text-align: center;
  }
  .right {
    position: absolute;
    width: 26px;
    height: 20px;
    z-index: 6;
    right: 120px;
    background: #ffffff;
    top: 72px;
    text-align: center;
  }
}
</style>
