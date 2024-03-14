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
          <div
            class="checkTitle color-#fff ml-[12px] position-relative z-3 h-[32px] flex items-center pl-[12px]"
          >
            临床检查
          </div>
          <div class="bg-#F7FBFD mt-[-6px] z--1 py-[16px] px-[20px] pb-0">
            <div><List :list="list" class="grid! grid-cols-3!" /></div>
          </div>
        </div>
        <!-- 其他内容 -->
        <div class="px-[20px] py-[10px]">
          <div class="flex">
            <!-- 面型评估 -->
            <div class="mr-[10px] borderBox">
              <div class="h-[50px] w-[420px] px-[20px] py-[14px] bg-#216FB0 color-#FFFFFF font-500">
                面型评估
              </div>
              <div class="p-[10px] max-w-[400px]">
                <div class="grid grid-cols-3 w-full gap-[10px]">
                  <img src="@/assets/eveluatePdf/FrontalRepose.jpg" class="w-[120px]" />
                  <img src="@/assets/eveluatePdf/FrontalRepose.jpg" class="w-[120px]" />
                  <img src="@/assets/eveluatePdf/FrontalRepose.jpg" class="w-[120px]" />
                </div>
                <div>正貌：左侧较丰满</div>
              </div>
            </div>
            <!-- 全景片 -->
            <div class="flex-1 borderBox">
              <div class="h-[50px] w-auto px-[20px] py-[14px] bg-#216FB0 color-#FFFFFF font-500">
                全景片
              </div>
              <div class="p-[10px]">
                <div><img src="@/assets/eveluatePdf/Panoramic.jpg" class="w-[290px]" /></div>
                <div>正貌：左侧较丰满</div>
              </div>
            </div>
          </div>
          <!-- 口内照 -->
          <div class="mt-[12px] borderBox">
            <div class="h-[50px] w-full px-[20px] py-[14px] bg-#216FB0 color-#FFFFFF font-500">
              口内照
            </div>
            <div class="flex items-center p-[10px]">
              <!-- 这里是图片, grid布局-->
              <div class="grid grid-cols-2 gap-[10px] mr-[16px]">
                <img src="@/assets/eveluatePdf/test.png" class="w-[150px]" />
                <img src="@/assets/eveluatePdf/test.png" class="w-[150px]" />
                <img src="@/assets/eveluatePdf/test.png" class="w-[150px]" />
                <img src="@/assets/eveluatePdf/test.png" class="w-[150px]" />
                <img src="@/assets/eveluatePdf/test.png" class="w-[150px]" />
              </div>
              <div class="flex-1"><List :list="list" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import List from '@/components/evaluatePdf/list.vue'
const list = [
  { title_name: '正貌', option_names: '左侧较丰满' },
  { title_name: '正貌', option_names: '左侧较丰满' },
  { title_name: '正貌', option_names: '左侧较丰满' },
  { title_name: '正貌', option_names: '左侧较丰满' },
  { title_name: '正貌', option_names: '左侧较丰满' },
  { title_name: '正貌', option_names: '左侧较丰满' },
  { title_name: '正貌', option_names: '左侧较丰满' },
  { title_name: '正貌', option_names: '左侧较丰满' },
  { title_name: '正貌', option_names: '左侧较丰满' },
  { title_name: '正貌', option_names: '左侧较丰满' },
  { title_name: '正貌', option_names: '左侧较丰满' },
  { title_name: '正貌', option_names: '左侧较丰满' }
]
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
        background-size: auto 32px;
      }
    }
    .borderBox {
      box-sizing: border-box;
      border: 2px solid #216fb0;
      .mouthImage {
      }
    }
  }
}
</style>
