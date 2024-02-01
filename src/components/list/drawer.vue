<template>
  <div class="drawer">
    <el-drawer :before-close="handleClose" v-model="drawerVisible" close-on-click-modal="true">
      <template #header>
        <div class="title" :style="{ color: '#1d2129' }">备注</div>
      </template>

      <div class="form">
        <div class="form_title">治疗邀约</div>
        <div class="form_input">
          <el-input placeholder="Please input" />
        </div>
        <div class="form_textarea">
          <el-input v-model="textarea" type="textarea" placeholder="请输入内容或选择下方快捷回复" />
          <div class="form_textarea_quickReply">
            快捷回复：
            <div
              class="form_textarea_quickReply_item"
              v-for="item in quickReplies"
              :key="item"
              @click="handleAutoFill(item)"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>

      <div class="item" v-for="item in noteList" :key="item">
        <span class="circle"></span>
        <div class="rightBox">
          <div class="title">
            <div class="time">{{ item.time }}</div>
            <div class="name">{{ item.name }}</div>
          </div>
          <div class="content">{{ item.content }}</div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
const props = defineProps({
  drawer: {
    type: Boolean
  },
  noteList: {
    type: Array
  }
})
const drawerVisible = ref(false)
watch(props, (val) => {
  drawerVisible.value = val.drawer
})
const handleClose = () => {}
// 快捷录入
const quickReplies = ['未接通', '关机', '需再次联系']
const handleAutoFill = (item) => {
  textarea.value = item
}
const textarea = ref()
</script>

<style lang="scss" scoped>
.drawer {
  color: #1d2129;
  :deep .el-textarea {
    --el-input-border-color: #fff;
    --el-input-focus-border-color: none;
    &:hover {
      --el-input-hover-border: none;
      --el-border-color-hover: none;
    }
  }

  .title {
    font-size: 18px;
  }
  .form {
    background: #f4f7fd;
    width: 448px;
    height: 261px;
    padding: 12px;
    &_title {
      padding: 4px 12px;
      background: #e5e6eb;
      margin-bottom: 12px;
      border-radius: 6px;
      width: 114px;
    }
    &_input {
      height: 36px;
    }
    &_textarea {
      height: 149px;
      border: 1px solid #e5e6eb;
      background: #ffffff;

      :deep .el-textarea {
        height: 117px;
      }
      &_quickReply {
        color: #4e5969;
        padding-left: 12px;
        display: flex;
        align-items: center;
        textarea {
          resize: none;
          &::placeholder {
            color: #4e5969;
          }
        }
        &_item {
          cursor: pointer;
          color: #1d2129;
          background: #f2f3f5;
          padding: 2px 8px;
          margin-left: 8px;
          border-radius: 4px;
        }
      }
    }
  }
}

.item {
  height: 68px;
  width: 376px;
  position: relative;
  display: flex;
  .circle {
    width: 8px;
    height: 8px;
    background: #c9cdd4;
    margin: 7px 17px 0 4px;
    border-radius: 50%;
    &::before {
      display: block;
      content: '';
      width: 1px;
      height: calc(100% - 25px);
      background-color: #c9cdd4;
      position: absolute;
      left: 7.5px;
      bottom: 0;
    }
  }
  &:last-child .cricle::before {
    opacity: 0;
  }
  .rightBox {
    display: flex;
    flex-direction: column;
    .title {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      height: 24px;
      color: #1d2129;
      align-items: center;
    }
    .content {
      width: 331px;
      padding: 8px 0 12px 0;
      line-height: 24px;
      color: #1d2129;
    }
  }
}
</style>
