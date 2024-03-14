<template>
  <div class="pdfContent">
    <div class="pdfPage">
      <div class="patientInfo color-#fff font-500">
        <div class="mb-[8px] flex items-center">
          <img src="../../assets/eveluatePdf/avatar.svg" class="mr-[8px]" />patientInfo
        </div>
        <div class="mb-[8px] flex items-center">
          <img src="../../assets/eveluatePdf/privateId.svg" class="mr-[8px]" />222
        </div>
        <div class="mb-[8px] flex items-center">
          <img src="../../assets/eveluatePdf/date.svg" class="mr-[8px]" />222
        </div>
      </div>
      <div class="pt-[150px]">
        <div class="check">
          <div class="checkTitle color-#fff ml-[12px] position-relative z-3">临床检查</div>
          <div class="bg-#F7FBFD h-[200px] mt-[-6px] z--1"></div>
        </div>
        <!-- 其他内容 -->
        <div class="px-[20px] py-[10px]">
          <div class="flex">
            <!-- 面型评估 -->
            <div class="mr-[10px] borderBox">
              <div class="h-[50px] w-[420px] px-[20px] py-[14px] bg-#216FB0 color-#FFFFFF">
                面型评估
              </div>
              <div class="p-[10px]">
                <div></div>
                <div>正貌：左侧较丰满</div>
              </div>
            </div>
            <!-- 全景片 -->
            <div class="flex-1 borderBox">
              <div class="h-[50px] w-auto px-[20px] py-[14px] bg-#216FB0 color-#FFFFFF">全景片</div>
              <div class="p-[10px]">
                <div></div>
                <div>正貌：左侧较丰满</div>
              </div>
            </div>
          </div>
          <!-- 口内照 -->
          <div class="mt-[12px]">
            <div class="h-[50px] w-full px-[20px] py-[14px] bg-#216FB0 color-#FFFFFF">口内照</div>
            <div class="flex items-center">
              <!-- 这里是图片, grid布局-->
              <div></div>
              <List :list="list" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import List from '@/components/pdf/list.vue'
const list = [{ title_name: 1, option_names: '正貌：左侧较丰满' }]
</script>

<style scoped lang="scss">
.pdfContent {
  position: relative;
  width: 210mm;

  .pdfPage {
    color: #404682;
    position: relative;
    width: 210mm; /* 页面宽度 */
    height: 297mm; /* 页面高度 */
    background-image: url('../../assets/eveluatePdf/cover.png');
    background-size: contain;
    background-size: 100%;
    page-break-inside: avoid;
    .patientInfo {
      position: absolute;
      left: 550px;
      top: 20px;
    }
    .check {
      .checkTitle {
        background-image: url('../../assets/eveluatePdf/临床检查背景.svg');
        background-repeat: no-repeat;
      }
    }
    .borderBox {
      box-sizing: border-box;
      border: 2px solid #216fb0;
    }
  }
}
</style>
