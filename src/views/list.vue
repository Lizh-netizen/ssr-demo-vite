<template>
  <div class="table">
    医生：<el-select
      v-model="doctor"
      placeholder="请输入医生"
      filterable
      remote
      reserve-keyword
      clearable
      :remote-method="remoteMethod"
      ><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
    /></el-select>
    诊所：<el-select
      v-model="tanent"
      placeholder="请输入诊所"
      filterable
      remote
      reserve-keyword
      clearable
      :remote-method="remoteMethod1"
      ><el-option
        v-for="item in options1"
        :key="item.value"
        :label="item.label"
        :value="item.value"
    /></el-select>
    预约时间：<el-date-picker
      type="date"
      value-format="YYYY-MM-DD"
      v-model="date"
      @change="getList"
    ></el-date-picker>
    <el-table
      :data="patientList"
      empty-text="暂无数据"
      stripe
      :header-cell-style="{ background: '#F1F5FF' }"
      cell-class-name="table_cell"
    >
      <el-table-column prop="patientName" label="患者姓名" width="250"></el-table-column>
      <el-table-column prop="doctorName" label="责任医生" width="250"> </el-table-column>
      <el-table-column prop="sex" label="性别" width="250">
        <template #default="scope"
          >{{ scope.row['Sex'] == 1 ? '男' : scope.row['Sex'] == 2 ? '女' : '未知' }}
        </template></el-table-column
      >
      <el-table-column prop="StartTime" label="预约时间" width="250">
        <template #default="scope"
          >{{ scope.row['StartTime'].split('T')[0] }}
        </template></el-table-column
      >
      <el-table-column prop="operation" label="操作">
        <template #default="scope">
          <el-button @click="handleEvaluateOrth(scope.row)">录入面型发育评估</el-button>
          <el-button @click="handleViewOrth(scope.row)">查看正畸检查表</el-button>
          <el-button @click="handleCompareOrth(scope.row)">对比正畸报告</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        small
        background
        v-model:current-page="currentPage"
        :page-size="pageSize"
        layout="total,prev, pager, next"
        :total="total"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { Post, Get } from '../utils/request'
import { useRouter } from 'vue-router'
import moment from 'moment'
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const date = ref('')
date.value = moment(new Date()).format('YYYY-MM-DD')
const doctor = ref()
const patientList = ref([])
async function getList() {
  if (date.value) {
    const res = await Post('/prod-api/business/orthClass/appointmentList', {
      startTime: date.value, //预约日期
      pageSize: pageSize.value,
      pageNum: currentPage.value,
      officeId: tanent.value || '',
      doctorId: doctor.value || ''
    })
    if (res.code == 200) {
      patientList.value = res.rows
      total.value = res.total
    }
  }
}
const allOptions = ref([])
const loading = ref(false)
const getDoctorList = () => {
  loading.value = true
  Get('/prod-api/business/public/api/v1/provider/list?Job=医生').then((res) => {
    allOptions.value = res.map((item) => ({
      label: item.doctorName,
      value: item.doctorId
    }))
    options.value = allOptions.value
  })
}
getDoctorList()
const options = ref([])
const remoteMethod = (query) => {
  if (query) {
    loading.value = true
    options.value = allOptions.value.filter((option) => option.label.includes(query))
  }
}

const allOptions1 = ref([])
const tanent = ref()
const options1 = ref([])
const getTanentList = () => {
  Get('/prod-api/business/office/list').then((res) => {
    allOptions1.value = res.rows.map((item) => ({
      label: item.abbreviation,
      value: item.ljOfficeId
    }))
    options1.value = allOptions1.value.filter((option) => option.value)
  })
}
getTanentList()
const remoteMethod1 = (query) => {
  if (query) {
    loading.value = true
    options1.value = allOptions1.value.filter(
      (option) => option.label.includes(query) && option.value
    )
  }
}
const router = useRouter()
const handleViewOrth = (item) => {
  router.push(`/ortho/${item.apmtId}/${item.patientId}`)
}
const handleCompareOrth = (item) => {
  router.push(`/compareOrtho/${item.apmtId}/${item.patientId}`)
}
const handleEvaluateOrth = (item) => {
  router.push(`/evaluateOrtho/${item.apmtId}/${item.patientId}`)
}
watchEffect(() => {
  getList()
})
</script>
<style lang="scss">
.el-table--fit.el-table {
  margin-top: 16px;
}
.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background: #f8faff;
}
.el-table {
  color: #131414;
  font-weight: normal;
  width: 100%;
  height: 100%;
}
.el-table__header {
  color: #131414;
}
.el-table thead {
  color: #131414;
  font-weight: 500;
}
.el-select {
  width: 167px;
}
</style>
<style lang="scss" scoped>
.table {
  padding: 20px;
  // font-family: 思源黑体;
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
