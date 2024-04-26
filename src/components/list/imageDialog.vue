<template>
  <div class="imageDialog">
    <el-dialog
      v-model="imgDialogVisible"
      title="影像管理"
      width="1183px"
      @close="handleCloseImgDialog"
      :close-on-click-modal="false"
    >
      <div class="imageManagement" ref="loadingTarget2">
        <div class="imageManagement__images subSection">
          <div class="title left">
            <div class="title__left">图库</div>
            <div class="title__middle">
              <img src="@/assets/svg/reminder.svg" :style="{ 'margin-right': '4px' }" />
              {{ '可直接拖拽照片到右侧指定位置～' }}
            </div>
            <div class="title__right file-upload flex justify-end items-center">
              <img src="../../assets/svg/Sync.svg" @click="handleSyncOss" />
              <label for="fileInput" class="position-absolute">
                <img src="../../assets/svg/Upload.svg" />
              </label>

              <input class="file-upload__input" type="file" @change="handleFileChange" multiple />
            </div>
          </div>
          <div
            class="flex mt-[50px] px-[12px] py-[12px] gap-[16px] w-[542px] z-[2] position-absolute bg-[#fff]!"
          >
            <div
              v-for="(item, index) in filterList"
              :key="index"
              class="filterBtn cursor-pointer"
              :class="{ active: currentBtn == item.label }"
              @click="handleChangeFilterBtn(item.label)"
            >
              {{ item.label }}
            </div>
          </div>
          <div
            :style="{
              'padding-left': '14px',
              'padding-bottom': '50px',
              'padding-top': '0px'
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
                  {{ item.StartTime?.split('T')[0] }}
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
                        v-if="!img.file"
                        :style="{ display: 'block' }"
                        class="img"
                        :src="img.imgUrl"
                        draggable="true"
                        @dragstart="handleDragStart(img, $event)"
                        @dragend="handleDragEnd"
                        @click="handleToggleChoose(img)"
                      />
                      <img
                        v-if="img.file"
                        :style="{ display: 'block' }"
                        class="img"
                        :src="img.imgUrl"
                        draggable="true"
                        @dragstart="handleDragStart(img, $event)"
                        @dragend="handleDragEnd"
                        @click="handleToggleChoose(img)"
                      />
                      <!-- <img
                        src="@/assets/svg/imageChecked.svg"
                        :style="{
                          position: 'absolute',
                          right: '6px',
                          bottom: '6px'
                        }"
                      /> -->
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
                  v-if="!item.file && index === imageArr.length - 1 && imageArr.length > 0"
                >
                  <span>加载上次影像</span><img src="@/assets/svg/morePic.svg" />
                </div>
              </div>
            </template>
          </div>

          <!-- <div class="classifyWrapper" v-if="module == 'ortho'">
            <span :style="{ 'margin-right': '6px' }">已选中{{ chooseImgNum }}张</span
            ><el-button @click="handleClassifyPics">自动分类</el-button>
          </div> -->
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
                    v-if="img.showFlag && !img.fileUrl.startsWith('data:image')"
                    :style="{ cursor: 'pointer' }"
                    class="deleteImage"
                    src="@/assets/svg/deleteImage.svg"
                  />
                </template>
              </el-popconfirm>
              <div class="item__caption">{{ img.caption }}</div>
            </div>
          </div>
        </div>
      </div>
      <img
        src="../../assets/svg/message.svg"
        v-if="showGif && module !== 'ortho'"
        class="message z-2"
      />
      <div class="gif-container" id="gif-container" ref="gif" v-if="showGif && module !== 'ortho'">
        <img src="../../assets/gif/gif.gif" alt="GIF 示例" id="gif-img" class="h-full w-full" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSavePics"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>

  <img
    id="img"
    :style="{
      opacity: 0
    }"
  />
</template>

<script setup>
import img from '@/assets/svg/addPic.svg'
import blueBgUrl from '@/assets/svg/blueBg.svg'
import { Upload, WarningFilled } from '@element-plus/icons-vue'
import {
  ref,
  defineProps,
  computed,
  defineEmits,
  onMounted,
  watch,
  onBeforeMount,
  nextTick
} from 'vue'
import { Post, Get, Put, Delete } from '@/utils/request'
import 'animate.css'
import placeholderUrl from '@/assets/ortho/imagePlaceholder.png'
import formatTime from '../../utils/formatTime.ts'
import { ElMessage } from 'element-plus'

const props = defineProps({
  module: {
    type: String,
    default: ''
  },
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
  },
  chooseImgNum: {
    type: Number,
    default: 0
  },
  patientId: {
    type: String,
    default: 0
  },
  appId: {
    type: String,
    default: 0
  },
  caption: {
    type: String,
    default: ''
  }
})
onBeforeMount(() => {
  showGif.value = true
})
const firstEnter = ref(false)
const showGif = ref(true)
onMounted(() => {
  firstEnter.value = true
  imageList.value.forEach((a) => {
    a.fileUrl = placeholderUrl
  })
  setTimeout(() => {
    window.addEventListener('click', () => {
      showGif.value = false
    })
  }, 1000)
  handleChangeFilterBtn('全部')
})

onBeforeMount(() => {
  getClassifiedImgList()
})
const currentBtn = ref('全部')
const gif = ref(null)
const filterList = [
  { label: '全部', value: 'all' },
  { label: '全景片', value: 'panorama' },
  { label: '侧位片', value: 'cepha' }
]
// 同步影像
const handleSyncOss = async () => {
  const res = await Post('/prod-api/emr/public/api/v1/tooth/syncToOss', {
    patientId: props.patientId,
    appId: props.appId
  })
  if (res.code == 200) {
    ElMessage({
      message: res.message,
      type: 'success'
    })
  }
}
const handleChangeFilterBtn = async (label) => {
  currentBtn.value = label
  let path
  path =
    label == '全部'
      ? `/prod-api/emr/orthCommon/getTImageList?patientId=${props.patientId}`
      : `/prod-api/emr/orthCommon/getTImageList?patientId=${props.patientId}&typeName=${label}`
  const res = await Get(path)
  totalArr.value = res.data
  if (res.data.length > 0 && res.data.find((a) => a.imageList.length !== 0)) {
    imageArr.value[0] = res.data.find((a) => a.imageList.length !== 0)

    index.value = res.data.findIndex((a) => a.imageList.length !== 0)
    imageArr.value[0].imageList.forEach((img) => {
      img.imgUrl = img.ossImagePath
    })
  } else {
    const index = imageArr.value.find((a) => !a.file)
    if (index) {
      imageArr.value.splice(index, 1)
    }
  }
}
const emit = defineEmits(['savePics', 'cancel'])
const imgDialogVisible = ref(true)
const caption = ref(props.caption)
watch(
  props,
  (val) => {
    imgDialogVisible.value = val.dialogVisible
    caption.value = props.caption
    if (caption.value && imageList.value.find((item) => item.caption === caption.value)) {
      imageList.value.find((item) => item.caption === caption.value).reminder = true
    }
  },
  { deep: true }
)
// 每次点开影像管理都要重新请求右边的列表，因为外边可能会做改动
watch(imgDialogVisible, (newVal) => {
  if (newVal) {
    getClassifiedImgList()
  }
})

const handleCancel = () => {
  emit('cancel')
}
const handleDeleteImage1 = (img) => {
  // 删除图库中的图片
  if (img.id) {
    Delete(`/prod-api/business/orthImage/${img.id}`).then((res) => {
      if (res.code == 200) {
        const found = imageList.value.find((image) => img == image)
        found.fileUrl = placeholderUrl
        found.id = undefined
        // getAllData()
      }
    })
  } else {
    img.fileUrl = placeholderUrl
  }
}
// 影像管理逻辑
const index = ref(0)
const imageArr = ref([])
const totalArr = ref([])
const openImgDialog = () => {
  imgDialogVisible.value = true
  imageList.value.forEach((a) => {
    a.fileUrl = placeholderUrl
  })
  getClassifiedImgList()
}
// 获取左右图像
// async function getImageList() {
//   if (imageArr.value.length !== 0) {
//     return
//   } else {
//     Get(`/prod-api/business/orthImage/imageList?patientId=${props.patientId}`).then((res) => {
//       totalArr.value = res.data
//       if (res.data.find((a) => a.imageList.length !== 0)) {
//         imageArr.value[0] = res.data.find((a) => a.imageList.length !== 0)

//         index.value = res.data.findIndex((a) => a.imageList.length !== 0)
//         imageArr.value[0].imageList.forEach((img) => {
//           img.imgUrl = img.fileUrl
//           img.choose = false
//         })
//       }
//     })
//   }
// }
async function getClassifiedImgList() {
  const res = await Get(`/prod-api/business/orthImage/list?apmtId=${props.appId}`)
  if (res.code == 200 && res.data.length > 0) {
    res.data.forEach((item) => {
      imageList.value.forEach((a) => {
        // a.fileUrl = placeholderUrl
        if (item.imageType == a.caption) {
          a.fileUrl = item.imageUrl
          a.id = item.id
          a.startTime = item.startTime
        }
      })
    })
  } else {
    imageList.value.forEach((a) => {
      a.fileUrl = placeholderUrl
    })
  }
}
// 加载更多图像
const handleLoadPic = () => {
  if (imageArr.value.length < totalArr.value.length) {
    totalArr.value[imageArr.value.length].imageList.forEach((img) => {
      img.imgUrl = img.fileUrl
    })
    const itemWithImage = totalArr.value
      .slice(index.value + 1)
      .find((a) => a.imageList.length !== 0)
    console.log('🚀 ~ handleLoadPic ~ itemWithImage:', itemWithImage)
    if (itemWithImage) {
      imageArr.value.push(itemWithImage)
      index.value = totalArr.value.findIndex(
        (item) => item == imageArr.value[imageArr.value.length - 1]
      )
      imageArr.value[imageArr.value.length - 1].imageList.forEach((img) => {
        img.imgUrl = img.fileUrl
      })
    } else {
      ElMessage('没有更多图像了哦')
    }
    console.log('totalArr.value', imageArr.value)
  }
}

// 右侧分类图片占位
const imageList =
  props.module == 'ortho'
    ? ref([
        {
          caption: '正面像',
          typeName: 'FrontalRepose',
          fileUrl: placeholderUrl
        },
        {
          caption: '正面微笑像',
          typeName: 'FrontalSmile',
          fileUrl: placeholderUrl
        },
        {
          caption: '90度侧面像',
          typeName: 'LeftProfile',
          fileUrl: placeholderUrl
        },
        {
          caption: '90度侧面微笑像',
          typeName: 'RightProfile',
          fileUrl: placeholderUrl
        },
        {
          caption: '45度侧面像',
          typeName: 'LeftSideProfile',
          fileUrl: placeholderUrl
        },
        {
          caption: '45度侧面微笑像',
          typeName: 'RightSideProfile',
          fileUrl: placeholderUrl
        },
        {
          caption: '口内照（左侧）',
          typeName: '',
          fileUrl: placeholderUrl
        },
        {
          caption: '口内照（右侧）',
          typeName: '',
          fileUrl: placeholderUrl
        },
        {
          caption: '磨牙关系（左侧）',
          typeName: 'Left',
          fileUrl: placeholderUrl
        },
        {
          caption: '磨牙关系（右侧）',
          typeName: 'Right',
          fileUrl: placeholderUrl
        },
        {
          caption: '正面咬合',
          typeName: 'Anterior',
          fileUrl: placeholderUrl
        },
        {
          caption: '前牙覆盖',
          typeName: 'Cover',
          fileUrl: placeholderUrl
        },
        {
          caption: '上颌',
          typeName: 'Upper',
          fileUrl: placeholderUrl
        },
        {
          caption: '下颌',
          typeName: 'Lower',
          fileUrl: placeholderUrl
        },
        {
          caption: '全景片',
          typeName: 'Panoramic',
          fileUrl: placeholderUrl
        },
        {
          caption: '侧位片',
          typeName: 'Cephalometric',
          fileUrl: placeholderUrl
        }
      ])
    : ref([
        {
          caption: '正面像',
          typeName: 'FrontalRepose',
          fileUrl: placeholderUrl
        },

        {
          caption: '90度侧面像',
          typeName: 'LeftProfile',
          fileUrl: placeholderUrl
        },
        {
          caption: '尖牙(左侧)',
          typeName: '',
          fileUrl: placeholderUrl
        },
        {
          caption: '尖牙(右侧)',
          typeName: '',
          fileUrl: placeholderUrl
        },

        {
          caption: '磨牙关系（左侧）',
          typeName: 'Left',
          fileUrl: placeholderUrl
        },
        {
          caption: '磨牙关系（右侧）',
          typeName: 'Right',
          fileUrl: placeholderUrl
        },
        {
          caption: '正面咬合',
          typeName: 'Anterior',
          fileUrl: placeholderUrl
        },
        {
          caption: '前牙覆盖',
          typeName: 'Cover',
          fileUrl: placeholderUrl
        },
        {
          caption: '上颌',
          typeName: 'Upper',
          fileUrl: placeholderUrl
        },
        {
          caption: '下颌',
          typeName: 'Lower',
          fileUrl: placeholderUrl
        },
        {
          caption: '全景片',
          typeName: 'Panoramic',
          fileUrl: placeholderUrl
        },
        {
          caption: '自由照片',
          typeName: '',
          fileUrl: placeholderUrl
        }
      ])

// 图片分类

const loading = ref(false)
const loadingTarget2 = ref()
// 自动分类
async function handleClassifyPics() {
  const loading = ElLoading.service({
    lock: true,
    text: '正在分类中',
    background: 'rgba(0, 0, 0, 0.7)',
    target: loadingTarget2.value
  })
  loading.value = true
  try {
    if (chooseImgNum.value == 0) {
      ElMessage({
        message: '未选中图片',
        type: 'error'
      })
    } else {
      const formData = new FormData()
      let orthImageString, orthImageList
      imageArr.value
        .filter((i) => i.file === undefined)
        .forEach((c) => {
          orthImageList = c.imageList
            .filter((b) => b.choose === true)
            .map((a) => {
              if (a.choose) {
                return {
                  ljUrl: a.imgUrl,
                  ljId: a.ljImageId,
                  LJCreateDatetime: a.timestamp
                }
              }
            })
        })
      orthImageString = JSON.stringify({
        patientId: props.patientId,
        apmtId: props.appId,
        orthImageList
      })
      if (imageArr.value.filter((i) => i.file === true).length > 0) {
        imageArr.value
          .filter((i) => i.file === true)[0]
          .imageList.filter((image) => image.choose === true)
          .forEach((file) => {
            formData.append('files', file.file)
          })
      } else {
        formData.append('files', null)
      }
      formData.append('orthImageString', orthImageString)
      const res = await Post('/prod-api/business/orthImage/handleMultiImage', formData, true)
      loading.close()
      if (res.code === 200) {
        imageArr.value.forEach((a) => a.imageList.forEach((b) => (b.choose = false)))
        res.data.forEach((d) => {
          imageList.value.forEach((i) => {
            if (d.typeName == i.typeName) {
              i.fileUrl = d.fileUrl
              i.imageId = d.fileId
            }
          })
        })
      } else {
        ElMessage({
          message: '图片分类失败',
          type: 'error'
        })
      }
    }
  } catch (err) {
    loading.close()
    ElMessage({
      message: '分类失败，请手工向右侧拖入图片',
      type: 'error'
    })
  }
}

// 上传图片逻辑
const fileList = ref([])
const fileListWithFlag = ref([])

const params = new FormData()

const upload = ref(false)
const date = ref()
const handleFileChange = (event) => {
  const selectedFiles = event.target.files

  if (selectedFiles.length > 16) {
    event.preventDefault()
    ElMessage('最多上传16张图片')
    return
  } else {
    imageArr.value.forEach((item) => {
      item.imageList.forEach((img) => {
        img.choose = false
      })
    })
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      params.append('files', file)

      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          fileList.value.push(reader.result)
          fileListWithFlag.value.push({
            imgUrl: reader.result,
            showFlag: false,
            choose: true,
            file: file
          })
        }
        reader.readAsDataURL(file)
      }
    }

    if (!upload.value) {
      date.value = formatTime().formattedToday
      imageArr.value.unshift({
        file: true,
        StartTime: date.value,
        imageList: fileListWithFlag.value
      })
      upload.value = true
    } else {
      imageArr.value[0].imageList = fileListWithFlag.value
    }
  }
  console.log(imageArr.value)
}
const chooseImgNum = computed(() => {
  let num = 0
  imageArr.value.forEach((item) => {
    item.imageList.forEach((img) => {
      if (img.choose) {
        num++
      }
    })
  })
  return num
})
// 反选
// const handleToggleChoose = (img) => {
//   if (chooseImgNum.value >= 16) {
//     ElMessage.warning('最多只能选择16张图片')
//     return
//   }
//   img.choose = !img.choose
// }

// 图片拖拽
const dragFile = ref(null)
const src = ref()
// 在右边区域拖拽
const handleDragStart1 = (img) => {
  dragFile.value = img
  dragFile.value.rightDrop = true
  src.value = dragFile.value.fileUrl
  const image2 = document.getElementById('img')
  image2.src = img.fileUrl
  image2.style.opacity = 1
  image2.width = 120
  image2.height = 80
  image2.style.position = 'absolute'
  image2.style.top = '-9999px'
  image2.style.objectFit = 'cover'
  image2.style.border = '2px solid #2E6CE4'
  image2.style.boxShadow = '0px 9px 18px 0px rgba(0, 0, 0, 0.57)'
  event.dataTransfer.setDragImage(image2, 60, 40)
}
// 从左侧拖到右侧
const handleDragStart = (file, event) => {
  if (file.file) {
    // 本地上传的图片
    event.dataTransfer.setData('text/plain', file)
    const userAgent = navigator.userAgent
    if (userAgent.match(/Chrome/i)) {
      // 谷歌和浏览器处理方式不同
      dragFile.value = event.dataTransfer.files[0]
    } else {
      dragFile.value = file.file
    }
  } else {
    dragFile.value = file
  }
  const image2 = document.getElementById('img')
  image2.src = file.imgUrl
  image2.style.opacity = 1
  image2.width = 120
  image2.height = 80
  image2.style.position = 'absolute'
  image2.style.top = '-9999px'
  image2.style.objectFit = 'cover'
  image2.style.border = '2px solid #2E6CE4'
  image2.style.boxShadow = '0px 9px 18px 0px rgba(0, 0, 0, 0.57)'
  event.dataTransfer.setDragImage(image2, 60, 40)
}
const handleDragEnd = () => {
  const image2 = document.getElementById('img')
  image2.style.opacity = 0
}
const handleSingleImage1 = (file, image) => {
  image.imageId = file.id
  image.startTime = file.startTime
  image.fileUrl = file.ossImagePath
  console.log('🚀 ~ handleSingleImage1 ~ image:', image)
}
const handleDrop = (e, image) => {
  const image2 = document.getElementById('img')
  image2.style.opacity = 0
  e.target.classList.remove('hover')
  if (!dragFile.value.rightDrop) {
    // 从左拖到右

    if (dragFile.value.name) {
      // 本地图片
      handleSingleImage(dragFile.value, image)
    } else {
      // 图库里的
      handleSingleImage1(dragFile.value, image)
    }
  } else {
    // 有id的话是分类过的，要通过接口删除
    if (dragFile.value.id) {
      handleDeleteImage1(dragFile.value)
    } else {
      // 否则只要替换掉fileUrl就可以了
      const found = imageList.value.find((image) => dragFile.value.fileUrl == image.fileUrl)
      found.fileUrl = placeholderUrl
    }
    // 已经上传过的有id
    if (image.id) {
      Put('/prod-api/business/orthImage', {
        id: image.id,
        imageUrl: src.value
      }).then(() => {
        getClassifiedImgList()
      })
      // 否则也是替换掉fileUrl
    } else {
      image.fileUrl = src.value
    }
  }
}

// 上传图片
// file是拖拽的，image是被拖的
const failCount = ref(0)
async function handleSingleImage(file, image) {
  const formData = new FormData()
  if (file.type) {
    formData.append('file', file, 'Cover')
    formData.append(
      'tImageString',
      JSON.stringify({
        patientId: props.patientId,
        aptmId: props.appId,
        tImageList: []
      })
    )
  }
  // else {
  //   formData.append(
  //     'orthImageString',
  //     JSON.stringify({
  //       patientId: props.patientId,
  //       apmtId: props.appId,
  //       orthImageList: [
  //         {
  //           ljUrl: file.imgUrl,
  //           ljId: file.ljImageId,
  //           LJCreateDatetime: file.timestamp,
  //           startTime: file.StartTime
  //         }
  //       ]
  //     })
  //   )
  // }
  const res = await Post('/prod-api/emr/orthCommon/handleSingleImage', formData, true)
  if (res.code == 200 && res.data.length > 0) {
    image.fileUrl = res.data[0].ossImagePath
    image.imageId = res.data[0].id
    image.startTime = res.data[0].startTime
  } else {
    image.fileUrl = placeholderUrl
    if (failCount.value == 0) {
      failCount.value++
      ElMessage({
        message: '拖拽失败',
        type: 'warning'
      })
    } else {
      ElMessage({
        message: '拖拽失败',
        type: 'warning'
      })
    }
  }
}

// 保存图片
async function handleSavePics() {
  imageList.value.forEach((item) => (item.reminder = false))
  const orthImageList = imageList.value.filter((item) => item.fileUrl.startsWith('https'))
  const arr = orthImageList.map((item) => ({
    imageType: item.caption,
    imageUrl: item.fileUrl,
    imageId: item.fileId || null,
    startTime: item.startTime
  }))
  await Post('/prod-api/business/orthImage', {
    apmtId: props.appId,
    orthImageList: arr
  })
  emit('cancel')
  emit('savePics')
}
const handleDragOver = (e) => {
  if (!e.target.src.endsWith('jpeg') && !e.target.src.endsWith('jpg')) {
    e.target.src = blueBgUrl
    e.target.classList.add('hover')
  }
}
const handleDragLeave = (e) => {
  if (!e.target.src.endsWith('jpeg') && !e.target.src.endsWith('jpg')) {
    e.target.src = placeholderUrl
  }
  e.target.classList.remove('hover')
}
const handleCloseImgDialog = () => {
  emit('cancel')
  imageList.value.forEach((image) => (image.reminder = false))
}
</script>

<style scoped lang="scss">
.message {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
}
.gif-container {
  width: 300px;
  position: absolute;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.imageManagement {
  position: relative;
  display: flex;
  .filterBtn {
    width: 60px;
    height: 30px;
    border-radius: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid #c9cdd4;
    box-sizing: border-box;
    justify-content: center;
    &.active {
      background: #f4f7fd;
      color: #2e6ce4;

      /* 主色/100% */
      border: 1px solid #2e6ce4;
    }
  }
  .title {
    width: 543px;
    height: 50px;
    position: absolute;
    background: #ffffff;
    display: flex;
    z-index: 2;
    align-items: center;
    padding: 0 16px;
    box-sizing: border-box;
    border-radius: 12px 12px 0px 0;
    &.left {
      border-bottom: 1px solid #e5e6eb;
    }

    &__left {
      width: 35px;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0em;

      /* 文字/1级 */
      color: #1d2129;
    }
    &__middle {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: normal;
      letter-spacing: 0em;

      color: #3d3d3d;
      margin-left: 12px;
    }
    &__right {
      top: 3px;
      position: relative;
      line-height: px;
      height: 23px;
      flex: 1;
      text-align: right;
      margin-right: 8px;
    }
  }
  .file-upload {
  }

  .file-upload__label {
    display: inline-block;
    color: #333;
    border-radius: 4px;
    cursor: pointer;
  }

  .file-upload__input {
    top: 0;
    left: 0;
    opacity: 0;
    width: 30px;
    height: 100%;
    cursor: pointer;
  }
  .subSection {
    width: 560px;
    height: 533px;
    border-radius: 12px;
    opacity: 1;

    background: #ffffff;

    box-sizing: border-box;
    /* 线条/一般 */
    border: 1px solid #e5e6eb;
    overflow: auto;
  }
  &__images {
    /* position: relative; */
    margin-right: 16px;

    .imgContainer {
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      img.choose {
        border: 2px solid #2e6ce4;
        box-sizing: border-box;
      }
      &__empty {
        position: absolute;
        top: 167px;
        left: 200px;
      }

      .item {
        position: relative;
        width: 25%;
        padding-right: 16px;
        box-sizing: border-box;
        margin-bottom: 16px;
        .img {
          object-fit: cover;
          background-size: 100% 100%;
          width: 120px;
          height: 80px;
          border-radius: 12px;
        }

        .deleteImage {
          position: absolute;
          top: 0;
          right: 15px;
        }
        &__caption {
          display: flex;
          justify-content: center;
          color: #4e5969;
          margin-top: 10px;
        }
      }
    }
    &__button {
      position: absolute;
      right: 16px;
      bottom: 16px;
    }
  }
  &__classify {
    .title {
      color: #1d2129;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0em;
      margin-bottom: 14px;
    }
    .imageWrapper {
      display: flex;
      flex-wrap: wrap;
      padding-left: 14px;

      padding-top: 50px;
      .item {
        position: relative;
        width: 25%;
        padding-right: 16px;
        box-sizing: border-box;
        margin-bottom: 16px;
        .img {
          width: 100%;
          height: 100%;
          border-radius: 12px;
          box-sizing: border-box;
          &.hover {
            border: 2px dashed #2e6ce4;
          }
        }
        .deleteImage {
          position: absolute;
          right: 16px;
          top: 0;
        }
        &__caption {
          display: flex;
          justify-content: center;
          color: #4e5969;
          margin-top: 6px;
        }
      }
    }
  }
  .classifyWrapper {
    width: 544px;
    right: 570px;
    bottom: 0px;
    position: absolute;
    height: 50px;

    text-align: right;

    background: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
    box-sizing: border-box;
    border-radius: 0 0px 12px 12px;
  }
}
</style>
