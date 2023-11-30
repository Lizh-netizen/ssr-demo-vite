<template>
  <el-popover
    :width="490"
    :visible="title.popVisible"
    @show="handleBeforeEnterPopover(title)"
    @after-leave="handleSubmitTooth(title)"
  >
    <template #reference>
      <div class="diagramWrapper" @click.stop="openPop(title, panoramicData[0])">
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
const symptomList = ref([])
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
const handleSelectTooth = (item, title) => {
  useSelectTooth(item, title)
}
const handleSubmitTooth = (title) => {
  if (!title.submitAble) {
    return
  }

  let obj = {
    apmtId: appId,
    titleId: title.id,
    optionsIdStr: [],
    otherContent: '',
    cephalometricsContent: '',
    fdiToothCode: title.toothCode.join(),
    showPosition: JSON.stringify(title.position)
  }
  Post('/prod-api/business/optionsResult', obj).then(() => {
    title.submitAble = false
  })
}
const openPop = (title, item) => {
  if (!item.hasImage) {
    return
  } else {
    // 点击下一个十字牙位时，先吧之前的清空
    panoramicData.value[0].orthTitleList.forEach((t) => {
      if (title !== t) {
        t.popVisible = false
      }
    })
    title.popVisible = !title.popVisible
  }
}
</script>

<style scoped></style>
