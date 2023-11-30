<template>
  <!-- 影像管理弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    title="影像管理"
    width="1183px"
    @close="handleCloseImgDialog"
    :close-on-click-modal="false"
  >
    <div class="imageManagement" ref="loadingTarget2">
      <div class="imageManagement__images subSection">
        <div class="title">
          <div class="title__left">图库</div>
          <div class="title__middle">
            <img src="@/assets/svg/reminder.svg" :style="{ 'margin-right': '4px' }" />
            可直接拖拽照片到右侧指定位置或点击下方一键“自动分类”哦～
          </div>
          <div class="title__right file-upload">
            <div class="file-upload__label">
              <el-button type="primary" link :icon="Upload">上传图片</el-button>
            </div>
            <input class="file-upload__input" type="file" @change="handleFileChange" multiple />
          </div>
        </div>
        <div
          :style="{
            'padding-left': '14px',
            'padding-bottom': '50px',
            'padding-top': '50px'
          }"
        >
          <img
            class="imgContainer__empty"
            src="@/assets/svg/empty__image.svg"
            v-if="imageArr.length == 0"
          />
          <template v-else>
            <div v-for="(item, index) in imageArr" :key="index">
              <div>
                {{ item.StartTime.split('T')[0] }}
              </div>
              <div class="imgContainer">
                <div
                  class="item"
                  v-for="img in item.imageList"
                  :key="img.id"
                  @mouseenter="img.showFlag = true"
                  @mouseleave="img.showFlag = false"
                >
                  <div
                    :style="{
                      position: 'relative',
                      border: '1px solid #e5e6eb',
                      'border-radius': '12px'
                    }"
                  >
                    <img
                      :style="{ display: 'block' }"
                      class="img"
                      :src="img.imgUrl"
                      :class="{
                        choose: img.choose === true
                      }"
                      draggable="true"
                      @dragstart="handleDragStart(img, $event)"
                      @dragend="handleDragEnd"
                      @click="handleToggleChoose(img)"
                    />
                    <img
                      src="@/assets/svg/imageChecked.svg"
                      :style="{
                        position: 'absolute',
                        right: '6px',
                        bottom: '6px'
                      }"
                      @click="handleToggleChoose(img)"
                      v-show="img.choose === true"
                    />
                  </div>
                </div>
              </div>
              <div
                :style="{
                  display: 'inline-flex',
                  color: '#4E5969',
                  cursor: 'pointer'
                }"
                @click="handleLoadPic"
                v-if="!item.file && index === imageArr.length - 1"
              >
                <span>加载上次影像</span><img src="@/assets/svg/morePic.svg" />
              </div>
            </div>
          </template>
        </div>

        <div class="classifyWrapper">
          <span :style="{ 'margin-right': '6px' }">已选中{{ chooseImgNum }}张</span
          ><el-button @click="handleClassifyPics">自动分类</el-button>
        </div>
      </div>
      <div class="imageManagement__classify subSection">
        <div class="title">分类</div>
        <div class="imageWrapper">
          <div
            class="item"
            v-for="img in imageList"
            :key="img.typeName"
            @mouseenter="img.showFlag = true"
            @mouseleave="img.showFlag = false"
          >
            <div
              :style="{
                position: 'relative',
                border: '1px solid #e5e6eb',
                'border-radius': '12px',
                overflow: 'hidden',
                height: '80px'
              }"
            >
              <img
                class="img"
                :class="{
                  hover: img.reminder === true,
                  animate__animated: img.reminder === true,
                  animate__bounce: img.reminder === true
                }"
                :style="{ display: 'block' }"
                :src="img.fileUrl"
                @drop="(e) => handleDrop(e, img)"
                @dragover.prevent="handleDragOver"
                @dragleave="handleDragLeave"
                @dragstart="handleDragStart1(img)"
                @dragend="handleDragEnd"
              />
            </div>
            <el-popconfirm
              width="300"
              confirm-button-text="确认"
              :icon="WarningFilled"
              icon-color="#FF7D00"
              cancel-button-text="取消"
              title="确认删除该张图片吗？"
              @confirm="handleDeleteImage1(img)"
            >
              <template #reference>
                <img
                  :style="{ cursor: 'pointer' }"
                  class="deleteImage"
                  src="@/assets/svg/deleteImage.svg"
                  v-if="img.showFlag && !img.fileUrl.startsWith('data:image')"
                />
              </template>
            </el-popconfirm>
            <div class="item__caption">{{ img.caption }}</div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePics"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
  <img
    id="img"
    :style="{
      opacity: 0
    }"
  />
</template>

<script setup>
defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  imageList: {
    type: Array,
    default: () => []
  },
  imageArr: {
    type: Array,
    default: () => []
  }
})
</script>

<style></style>
