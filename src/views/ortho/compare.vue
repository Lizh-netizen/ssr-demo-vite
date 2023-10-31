<template>
  <div class="compare-page">
    <div class="tab">
      <div class="tab__left">
        <div
          class="tab__left__item"
          v-for="(item, index) in tab"
          :key="item.value"
          :class="{ active: activeTab == index }"
          @click="handleChangeTab(index, item)"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="tab__right"></div>
    </div>
    <div class="main">
      <div class="table-container">
        <div class="table-header">
          <div class="table-row">
            <div
              class="table-cell"
              v-for="item in filteredHeaders"
              :key="item.label"
              :class="{ flaged: item.flag == true, isImg: item.isImg == true }"
            >
              <div
                :style="{
                  display: 'flex',
                  'align-items': 'center',
                  gap: '9px'
                }"
              >
                <img
                  src="../../assets/svg/whiteFlag.svg"
                  v-if="item.flag === true"
                />{{ item.label }}
                <div
                  v-if="item.label === '评估时间'"
                  :style="{
                    display: 'flex',
                    'margin-left': '20px',
                    cursor: 'pointer'
                  }"
                  @click="handleCaret"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    fill="red"
                    version="1.1"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                  >
                    <g transform="matrix(0,1,1,0,0,0)">
                      <path
                        d="M12.0518,9.91667Q12.1286,9.78365,12.1684,9.63529Q12.2081,9.48693,12.2081,9.33333Q12.2081,9.17974,12.1684,9.03138Q12.1286,8.88302,12.0518,8.75L8.01036,1.75Q7.93357,1.61698,7.82496,1.50838Q7.71635,1.39977,7.58333,1.32297Q7.45032,1.24617,7.30196,1.20642Q7.15359,1.16667,7,1.16667Q6.84641,1.16667,6.69804,1.20642Q6.54968,1.24617,6.41667,1.32297Q6.28365,1.39977,6.17504,1.50838Q6.06643,1.61698,5.98964,1.75L1.94819,8.75Q1.87139,8.88302,1.83163,9.03138Q1.79188,9.17974,1.79188,9.33333Q1.79188,9.48693,1.83163,9.63529Q1.87139,9.78365,1.94819,9.91667Q2.02498,10.0497,2.13359,10.1583Q2.2422,10.2669,2.37522,10.3437Q2.50823,10.4205,2.65659,10.4602Q2.80495,10.5,2.95855,10.5L11.0415,10.5Q11.195,10.5,11.3434,10.4602Q11.4918,10.4205,11.6248,10.3437Q11.7578,10.2669,11.8664,10.1583Q11.975,10.0497,12.0518,9.91667ZM10.0311,8.75L7,3.5L3.96891,8.75L10.0311,8.75Z"
                        :fill-rule="
                          changeOrderClick % 2 === 1 ? 'even' : 'evenodd'
                        "
                        fill="#fff"
                        fill-opacity="1"
                      />
                    </g>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    fill="none"
                    version="1.1"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                  >
                    <g transform="matrix(0,1,-1,0,14,-14)">
                      <path
                        d="M26.0518,9.91667Q26.1286,9.78365,26.1684,9.63529Q26.2081,9.48693,26.2081,9.33333Q26.2081,9.17974,26.1684,9.03138Q26.1286,8.88302,26.0518,8.75L22.01036,1.75Q21.93357,1.61698,21.82496,1.50838Q21.71635,1.39977,21.58333,1.32297Q21.450319999999998,1.24617,21.30196,1.20642Q21.15359,1.16667,21,1.16667Q20.84641,1.16667,20.69804,1.20642Q20.549680000000002,1.24617,20.41667,1.32297Q20.28365,1.39977,20.17504,1.50838Q20.06643,1.61698,19.98964,1.75L15.94819,8.75Q15.87139,8.88302,15.83163,9.03138Q15.791879999999999,9.17974,15.791879999999999,9.33333Q15.791879999999999,9.48693,15.83163,9.63529Q15.87139,9.78365,15.94819,9.91667Q16.02498,10.0497,16.133589999999998,10.1583Q16.2422,10.2669,16.37522,10.3437Q16.50823,10.4205,16.65659,10.4602Q16.804949999999998,10.5,16.95855,10.5L25.0415,10.5Q25.195,10.5,25.343400000000003,10.4602Q25.491799999999998,10.4205,25.6248,10.3437Q25.7578,10.2669,25.8664,10.1583Q25.975,10.0497,26.0518,9.91667ZM24.031100000000002,8.75L21,3.5L17.96891,8.75L24.031100000000002,8.75Z"
                        :fill-rule="
                          changeOrderClick > 0 && changeOrderClick % 2 === 0
                            ? 'even'
                            : 'evenodd'
                        "
                        fill="#FFFFFF"
                        fill-opacity="1"
                      />
                    </g>
                  </svg>
                </div>
              </div>
              <span
                class="table-cell-diffFlag"
                v-if="!item.isImg && item.label !== '评估时间' && item.diff"
                >差异</span
              >
            </div>
          </div>
        </div>
        <div class="table-data">
          <div
            class="table-data-wrapper"
            :class="{
              singleColumn: recordIndex % 2 === 0,
              toAddData: data.showBtn === true
            }"
            v-for="(data, recordIndex) in filteredRecordList"
            :key="data.label"
          >
            <div
              class="table-data-item"
              v-for="(item, itemIndex) in data"
              :key="item.label"
            >
              <div class="table-row">
                <div
                  class="table-cell"
                  :class="{
                    time: item.label == '评估时间',
                    isImg: item.isImg == true
                  }"
                  @mouseenter="data.showDeleteBtn = true"
                  @mouseleave="data.showDeleteBtn = false"
                >
                  <template v-if="!item.isImg"
                    ><div
                      class="table-cell-text"
                      @click.stop="handleOpenDateList(item)"
                    >
                      <span>{{ item.value }} </span>
                      <img
                        class="arrow"
                        src="../../assets/svg/arrowup.svg"
                        v-show="
                          item.dateListVisible && item.label == '评估时间'
                        "
                      />
                      <img
                        class="arrow"
                        src="../../assets/svg/arrowdown.svg"
                        v-show="
                          !item.dateListVisible && item.label == '评估时间'
                        "
                      />
                      <div
                        class="dropdown"
                        v-if="item.dateListVisible && item.label == '评估时间'"
                      >
                        <div
                          class="option"
                          :class="{ choose: option.choose === true }"
                          v-for="(option, optionIndex) in dateList"
                          :key="option"
                          @click="
                            chooseOption(option, optionIndex, recordIndex)
                          "
                        >
                          {{ option.label }}
                          <el-icon v-if="option.choose" color="#86909C"
                            ><Select
                          /></el-icon>
                        </div>
                      </div></div></template
                  ><template v-else>
                    <img class="img" :src="item.imageUrl" />
                  </template>

                  <img
                    src="../../assets/svg/deleteBtn.svg"
                    v-show="itemIndex == 0 && data.showDeleteBtn"
                    class="deleteBtn"
                    @click="handleDeleteRecord(recordIndex)"
                  />
                </div>
              </div>
            </div>
            <div
              class="blankArea"
              @mouseenter="mouseEnterBlank(data)"
              @mouseleave="mouseLeaveBlank($event, data)"
              @click="handleClick"
            ></div>
            <img
              class="addBtn"
              src="../../assets/svg/addBtn.svg"
              v-if="data.showBtn === true"
              @click="addRecord(data, recordIndex)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Get } from '@/utils/request'

const tab = [
  { value: 'all', label: '全部内容' },
  { value: 'abnormal', label: '只看异常' },
  { value: 'difference', label: '只看不同' }
]
const activeTab = ref(0)
const filteredHeaders = ref([])
// 用filtered来表示过滤后的数组
const handleChangeTab = (index, item) => {
  activeTab.value = index
  if (item.value == 'difference') {
    filteredHeaders.value = [...headers].filter(
      (header) => header.diff === true
    )
    const mapHeaders = filteredHeaders.value.map((header) => header.label)
    filteredRecordList.value = recordList.value.map((record) =>
      record.filter((r) => mapHeaders.includes(r.label))
    )
  } else if (item.value == 'all') {
    filteredHeaders.value = headers
    filteredRecordList.value = JSON.parse(JSON.stringify(recordList.value))
  } else if (item.value == 'abnormal') {
    filteredHeaders.value = headers.filter((header) => header.serious === true)
    const mapHeaders = filteredHeaders.value.map((header) => header.label)
    filteredRecordList.value = recordList.value.map((record) =>
      record.filter((r) => mapHeaders.includes(r.label))
    )
  }
}
// 删除记录
const handleDeleteRecord = (recordIndex) => {
  const date = dateList.value.find(
    (date) => date.label == recordList.value[recordIndex][0].StartTime
  )
  if (date) {
    date.choose = false
  }

  filteredRecordList.value.splice(recordIndex, 1)
}
let headers = [
  { label: '评估时间', flag: false, serious: true },
  { label: '主诉', flag: true },
  { label: '现病史', flag: true },
  { label: '既往史', flag: true },
  { label: '全身病史', flag: false },
  { label: '手术史', flag: false },
  { label: '家族史', flag: false },
  { label: '外伤史', flag: false },
  { label: '早期矫正史', flag: false },
  { label: '过敏源', flag: false },
  { label: '过敏症状', flag: false },
  { label: '耳鼻喉就诊史', flag: false },
  { label: '耳鼻喉用药史', flag: false },
  { label: '孩子矫正意愿', flag: true },
  { label: '家长矫正意愿', flag: true },
  { label: '正面像', flag: true, isImg: true },
  { label: '正貌', flag: false },
  { label: '唇', flag: false },
  { label: '颏部偏斜', flag: false },
  { label: '面上三分之一', flag: false },
  { label: '面下三分之一', flag: false },
  { label: '90度侧面像', flag: true, isImg: true },
  { label: '90度侧面微笑像', flag: true, isImg: true },
  { label: '面中三分之一', flag: false }
]
const recordList = ref([])
const filteredRecordList = ref([])
const dateList = ref([])
const historyRecord = ref([])
const route = useRoute()
// const appId = route.params.appId
const patientName = ref()
const patientAge = ref()
const patientId = route.params.patientId
recordList.value = []
Get(
  `/prod-api/business/public/api/v1/appointment/appList?patientId=${patientId}`
).then((res) => {
  if (res.code == 200 && res.data.historyRecord.length > 0) {
    historyRecord.value = res.data.historyRecord
    dateList.value = res.data.historyRecord.map((item) => ({
      label: item.StartTime.split(' ')[0],
      value: item.app_id,
      choose: false
    }))
    patientName.value = historyRecord.value[0].patientName
    patientAge.value = historyRecord.value[0].age
    const appId = historyRecord.value[0].app_id
    getIssuesList(appId, 0)
  }
})
// 记录要比较的index
const compareIndex = ref(0)
function findImageUrl(image, header) {
  if (image) {
    header.imageUrl = image.image_url
  } else {
    header.imageUrl = require('../../assets/ortho/imagePlaceholderBig.png')
  }
}
async function getIssuesList(appId, optionIndex, recordIndex) {
  Get(`/prod-api/business/orthClass/issuesList?apmtId=${appId}`).then((res) => {
    if (res.data) {
      const data = JSON.parse(JSON.stringify(headers))
      data.forEach((d) => {
        const find = res.data.find((item) => item.title_name == d.label)
        d.value = find ? find.option_names : '--'
        d.serious = find && find.serious == '1' ? true : false
      })
      // 找到数据中对应图片的imageURl
      const imageArr = ['90度侧面像', '90度侧面微笑像', '正面像']
      imageArr.forEach((label) => {
        const image = res.data.find((item) => item.className == label)
        const header = data.find((item) => item.label == label)
        findImageUrl(image, header)
      })
      data.forEach((d, index) => {
        if (d.serious) {
          headers[index].serious = true
        }
      })
      const arr = ['正貌', '唇', '颏部偏斜', '面上三分之一', '面下三分之一']
      const someDiff = arr.some(
        (item) => headers.find((h) => h.label == item).serious === true
      )
      if (someDiff) {
        headers.find((item) => item.label === '正面像').serious = true
      }
      data[0].value = `${patientName.value}(${
        patientAge.value == '0岁'
          ? patientAge.value
          : historyRecord.value[optionIndex].age.split(' ')[1]
      }) | ${historyRecord.value[optionIndex].StartTime.split(' ')[0]}`
      data[0].dateListVisible = false
      data[0].StartTime =
        historyRecord.value[optionIndex].StartTime.split(' ')[0]

      // 在长度为0的时候
      if (recordList.value.length == 0) {
        const data2 = headers.map((item) => ({
          label: item.label,
          value: '--',
          isImg: ['90度侧面像', '90度侧面微笑像', '正面像'].includes(item.label)
            ? true
            : false
        }))
        data2.forEach((d) => {
          d.serious = false
          if (['90度侧面像', '90度侧面微笑像', '正面像'].includes(d.label)) {
            d.imageUrl = require('../../assets/ortho/imagePlaceholderBig.png')
          }
        })
        data2[0].value = `请选择评估报告`
        data2[0].dateListVisible = false
        recordList.value.push(data)
        recordList.value.push(data2)
        filteredRecordList.value = JSON.parse(JSON.stringify(recordList.value))
        dateList.value[0].choose = true
      } else {
        // 点击评估报告时，替换掉数据,同时把日期的选择给去掉
        const replacedDate = dateList.value.find(
          (date) => date.label == recordList.value[recordIndex][0].StartTime
        )
        if (replacedDate) {
          replacedDate.choose = false
        }

        recordList.value[recordIndex] = data
        filteredRecordList.value = JSON.parse(JSON.stringify(recordList.value))
        data.forEach((d, index) => {
          const compareData = recordList.value[compareIndex.value]
          // value值不同的时候，headers显示差异的flag
          if (data[index].value !== compareData[index].value) {
            headers[index].diff = true
          }
          // 比较图片的url是否一样
          const sideImages = ['90度侧面像', '90度侧面微笑像']
          if (sideImages.includes(d.label)) {
            const image1 = data.find((item) => item.label == d.label)
            const image2 = compareData.find((item) => item.label == d.label)
            if (image1.imageUrl !== image2.imageUrl) {
              headers[index].diff = true
            }
          }
        })

        // 正面向不同的特征也要显示正面像
        const arr = ['正貌', '唇', '颏部偏斜', '面上三分之一', '面下三分之一']
        const someDiff = arr.some(
          (item) => headers.find((h) => h.label == item).diff === true
        )
        if (someDiff) {
          headers.find((item) => item.label === '正面像').diff = true
        }
      }
      filteredHeaders.value = [...headers]
    }
  })
}
// 日期下拉框
const handleOpenDateList = (item) => {
  item.dateListVisible = !item.dateListVisible
  filteredRecordList.value.forEach((record) => {
    const findDate = dateList.value.find(
      (date) => date.label == record[0].StartTime
    )
    if (record[0].StartTime && findDate) {
      findDate.choose = true
    }
  })
}
window.addEventListener('click', () => {
  const dropdown = document.querySelector('.dropdown')
  if (dropdown) {
    filteredRecordList.value.forEach((data) => {
      data[0].dateListVisible = false
    })
  }
})
const chooseOption = (option, optionIndex, recordIndex) => {
  // 点击已经有了的 没有行为
  if (option.choose) {
    return
  } else {
    option.choose = true
    getIssuesList(dateList.value[optionIndex].value, optionIndex, recordIndex)
  }
}

// 新增对比
const addRecord = (data, recordIndex) => {
  if (filteredRecordList.value.length >= 3) {
    data.showBtn = false
    return
  }
  const data1 = JSON.parse(JSON.stringify(headers))
  data1.forEach((d) => {
    d.value = '--'
    if (['90度侧面像', '90度侧面微笑像', '正面像'].includes(d.label)) {
      d.imageUrl = require('../../assets/ortho/imagePlaceholderBig.png')
    }
  })
  // 添加一个空白的数据
  data1[0].value = `请选择评估报告`
  data1[0].dateListVisible = false
  recordList.value.splice(recordIndex + 1, 0, data1)
  filteredRecordList.value.splice(recordIndex + 1, 0, data1)
  data.showBtn = false
}

// 显示/隐藏添加按钮逻辑
const mouseEnterBlank = (data) => {
  data.showBtn = true
}
let timeout
const mouseLeaveBlank = (e, data) => {
  timeout = setTimeout(() => {
    data.showBtn = false
  }, 200)
  if (Array.from(e.toElement.classList).includes('addBtn')) {
    clearTimeout(timeout)
  }
}

function customSort(arr, value) {
  function sort(a, b) {
    const dateA = new Date(a[0].StartTime)
    const dateB = new Date(b[0].StartTime)
    if (value % 2 == 0) {
      return dateB - dateA
    } else {
      return dateA - dateB
    }
  }
  arr.sort(sort)
}

// filteredRecordList.value recordList不能指向同一个引用
const changeOrderClick = ref(0)
const handleCaret = () => {
  changeOrderClick.value++
  customSort(filteredRecordList.value, changeOrderClick.value)
}
</script>

<style lang="scss" scoped>
.dropdown {
  position: absolute;
  top: 40px;
  left: 0px;
  border: 1px solid #e4e7ed;
  background: #ffffff;
  box-sizing: border-box;
  width: 100%;
  border-radius: 4px;
  z-index: 3;
  text-align: left;
  padding: 8px 12px;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.12);
  .option {
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    height: 24px;
    align-items: center;
    &.choose {
      color: #86909c;
    }
    .optionChoosed {
      position: absolute;
    }
  }
}

.compare-page {
  width: 100%;
  height: 100%;
  background: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  .tab {
    // height: 43px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    &__left {
      height: 43px;
      display: flex;
      cursor: pointer;
      background: #f2f3f5;
      border-radius: 12px;
      &__item {
        flex: 1;
        padding: 10px 24px;
        &.active {
          background: #2e6ce4;
          color: #fff;
          border-radius: 12px;
        }
      }
    }
  }
  .main {
    .table-container {
      display: flex;
      .table-header {
        border-radius: 12px 0 0 12px;
        background: #629cff;
        color: #ffffff;
        width: 194px;
        .table-row {
          .table-cell {
            box-sizing: border-box;
            width: 194px;
            height: 55px;
            padding: 16px 38px;
            padding-right: 4px;
            display: flex;
            gap: 9px;
            align-items: center;
            justify-content: space-between;
            border-image: linear-gradient(
                270deg,
                #86b1fc 0,
                rgba(150, 189, 255, 0) 100%
              )
              10;
            border-bottom: 2px solid;
            &.flaged {
              padding: 20px;
              padding-right: 4px;
            }
            &.isImg {
              height: 302px;
            }
            &-diffFlag {
              background: #fdebeb;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              padding: 4px 12px;
              width: 48px;
              height: 25px;
              border-radius: 4px;
              box-sizing: border-box;
              color: #f53f3f;
              font-family: Source Han Sans CN;
              font-size: 12px;
            }
          }
        }
      }
      .table-data {
        flex: 1;
        display: flex;
        &-wrapper {
          flex: 1;
          text-align: center;
          position: relative;
          box-sizing: border-box;
          border-right: 2px solid #fff;
          .blankArea {
            position: absolute;
            height: 100%;
            top: 0;
            right: -8.5px;
            width: 17px;
            pointer-events: all;
            z-index: 10;
          }
          .addBtn {
            position: absolute;
            top: -17px;
            cursor: pointer;
            right: -9.5px;
          }
          .table-data-item {
            box-sizing: border-box;
            .table-row {
              position: relative;
              .table-cell {
                min-height: 55px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                border-image: linear-gradient(90deg, #ececec 0, #ececec 100%) 10;
                border-bottom: 2px solid;
                &.time {
                  cursor: pointer;
                }
                &.isImg {
                  height: 302px;
                }
                &-text {
                  display: inline-block;
                  padding: 6px 16px;
                  position: relative;
                  display: flex;
                  align-items: center;
                  &:hover {
                    background: #f2f3f5;
                  }
                  .arrow {
                    margin-left: 8px;
                  }
                }
                .img {
                  height: 270px;
                  width: 450px;
                  // border: 1px solid #e7e7e7;
                  border-radius: 10px;
                }
                .deleteBtn {
                  position: absolute;
                  right: 36px;
                }
              }
            }
            &:first-child {
              .table-row {
                .table-cell {
                  font-size: 20px;
                }
              }
            }
          }
          &.singleColumn {
            background: #f4f7fd;
          }
          &.toAddData {
            border-right: 2px solid #2e6ce4;
            box-sizing: border-box;
          }
          &:last-child {
            .table-data-item {
              .table-cell {
                border-image: linear-gradient(
                    90deg,
                    #ececec 0,
                    rgba(236, 236, 236, 0) 100%
                  )
                  10;
                border-bottom: 2px solid;
              }
            }
          }
        }
      }
    }
  }
}
</style>
