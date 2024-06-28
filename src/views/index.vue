<template>
  <div class="contain">
    <div class="taskCard">
      <task-card :default="currentTab" @changeTab="changeTab">
        <task-card-item
          v-for="item in tabData"
          :svg_name="item.svg_name"
          :name="item.name"
          :left_num="item.left_num"
          :right_num="item.right_num"
          :left_text="item.left_text"
          :right_text="item.right_text"
        ></task-card-item>
      </task-card>
    </div>
    <div class="content-wrapper">
      <template v-if="currentTab == '应矫预约率'"
        ><div class="pl-[20px] mb-[12px]">
          <a-button
            class="border-rd-[115px]! mr-[8px]!"
            :class="{ activeTab: currentTab1 == item.label }"
            v-for="item in aptmLists"
            @click="handleChangeTab1(item.label)"
            >{{ item.label }}</a-button
          >
        </div></template
      >
      <div class="content">
        <filter-search
          v-if="isChangeTab"
          @filter="filter"
          :storageName="storageName"
          @setInitialState="setInitialState"
          :list="
            currentTab1 == '有未来预约'
              ? [
                  {
                    name:
                      currentTab == '应矫预约率' && currentTab1 == '有未来预约'
                        ? '儿牙医生'
                        : '医生',
                    type:
                      currentTab == '应矫预约率' && currentTab1 == '无未来预约'
                        ? undefined
                        : 'select',
                    prop:
                      currentTab == '应矫预约率' && currentTab1 == '有未来预约'
                        ? 'pediDentistId'
                        : 'doctorId',
                    options:
                      currentTab == '应矫预约率' && currentTab1 == '有未来预约'
                        ? doctorList
                        : options,
                    allowSearch: true
                  },
                  {
                    name: '预约状态',
                    type:
                      currentTab == '应矫预约率' && currentTab1 == '有未来预约'
                        ? 'select'
                        : undefined,
                    prop: 'orthAppointmentStatus',
                    options: [
                      { value: '不匹配', label: '不匹配' },
                      { value: '已预约', label: '已预约' },
                      { value: '未预约', label: '未预约' },
                      { value: '冲突', label: '冲突' },
                      { value: '可合并', label: '可合并' }
                    ]
                  },
                  {
                    name: '优先级',
                    type:
                      currentTab == '应矫预约率' && currentTab1 == '有未来预约'
                        ? 'select'
                        : undefined,
                    prop: 'priorityLevel',
                    options: [
                      { value: '高', label: '高优先' },
                      { value: '中', label: '中优先' },
                      { value: '低', label: '低优先' },
                      { value: '无', label: '无优先级' }
                    ]
                  },
                  {
                    name:
                      currentTab == '应矫预约率' && currentTab1 == '无未来预约'
                        ? '末诊日期'
                        : '预约日期',
                    dateType: currentTab == '应矫预约率' ? 'range' : undefined,
                    type: 'date',
                    prop: 'date',
                    disabledDate: (date) => {
                      return dayjs(date).isBefore(dayjs().startOf('day'))
                    },
                    defaultDate:
                      currentTab == '应矫预约率' && currentTab1 == '有未来预约'
                        ? [firstDate, date]
                        : currentTab == '应矫预约率' && currentTab1 == '无未来预约'
                          ? [lastStartDate, lastEndDate]
                          : firstDate
                  },
                  {
                    name: '快筛/面评结果',
                    type:
                      currentTab == '应矫预约率' &&
                      (currentTab1 == '有未来预约' || currentTab1 == '无未来预约')
                        ? 'select'
                        : undefined,
                    prop: 'orthFilterORFacialResult',
                    options: [
                      { value: '快筛', label: '快筛' },
                      { value: '面评', label: '面评' },
                      { value: '未做快筛/面评', label: '未做快筛/面评' }
                    ]
                  },
                  {
                    name: '矫正优先级',
                    type:
                      currentTab == '应矫预约率' && currentTab1 == '无未来预约'
                        ? 'select'
                        : undefined,
                    prop: 'priorityLevel',
                    options: [
                      { value: '高', label: '高优先' },
                      { value: '中', label: '中优先' },
                      { value: '低', label: '低优先' },
                      { value: '无', label: '无优先级' }
                    ]
                  }
                ]
              : [
                  {
                    name:
                      currentTab == '应矫预约率' && currentTab1 == '有未来预约'
                        ? '儿牙医生'
                        : '医生',
                    type:
                      currentTab == '应矫预约率' && currentTab1 == '无未来预约'
                        ? undefined
                        : 'select',
                    prop: 'doctorId',
                    options: options,
                    allowSearch: true
                  },
                  {
                    name: '预约状态',
                    type:
                      currentTab == '应矫预约率' && currentTab1 == '有未来预约'
                        ? 'select'
                        : undefined,
                    prop: 'orthAppointmentStatus',
                    options: [
                      { value: '不匹配', label: '不匹配' },
                      { value: '已预约', label: '已预约' },
                      { value: '未预约', label: '未预约' },
                      { value: '冲突', label: '冲突' },
                      { value: '可合并', label: '可合并' }
                    ]
                  },
                  {
                    name: '优先级',
                    type:
                      currentTab == '应矫预约率' && currentTab1 == '有未来预约'
                        ? 'select'
                        : undefined,
                    prop: 'priorityLevel',
                    options: [
                      { value: '高', label: '高优先' },
                      { value: '中', label: '中优先' },
                      { value: '低', label: '低优先' },
                      { value: '无', label: '无优先级' }
                    ]
                  },
                  {
                    name:
                      currentTab == '应矫预约率' && currentTab1 == '无未来预约'
                        ? '末诊日期'
                        : '预约日期',
                    dateType: currentTab == '应矫预约率' ? 'range' : undefined,
                    type: 'date',
                    prop: 'date',
                    disabledDate: (date) => {
                      return !dayjs(date).isBefore(dayjs().startOf('day'))
                    },
                    defaultDate:
                      currentTab == '应矫预约率' && currentTab1 == '无未来预约'
                        ? [lastStartDate, lastEndDate]
                        : firstDate
                  },
                  {
                    name: '快筛/面评结果',
                    type:
                      currentTab == '应矫预约率' &&
                      (currentTab1 == '有未来预约' || currentTab1 == '无未来预约')
                        ? 'select'
                        : undefined,
                    prop: 'orthFilterORFacialResult',
                    options: [
                      { value: '快筛', label: '快筛' },
                      { value: '面评', label: '面评' },
                      { value: '未做快筛/面评', label: '未做快筛/面评' }
                    ]
                  },
                  {
                    name: '矫正优先级',
                    type:
                      currentTab == '应矫预约率' && currentTab1 == '无未来预约'
                        ? 'select'
                        : undefined,
                    prop: 'priorityLevel',
                    options: [
                      { value: '高', label: '高优先' },
                      { value: '中', label: '中优先' },
                      { value: '低', label: '低优先' },
                      { value: '无', label: '无优先级' }
                    ]
                  }
                ]
          "
        ></filter-search>
        <div ref="loadingTarget">
          <CustomTable
            v-if="isChangeTab"
            :data="patientList"
            :columns="columns"
            :pagination="true"
            :total="total"
            :pagesStorage="pagesStorage"
            @change-page="changePage"
            @change-note="changeNote"
          >
            <template #patientName="{ row }">
              <span class="color-[#2E6CE4] cursor-pointer" @click="handleGoLj(row)">{{
                row.patientName
              }}</span>
            </template>
            <template #notes="{ row }">
              <div
                :style="{
                  color: '#2E6CE4',
                  cursor: 'pointer'
                }"
                @click="handleNoteDrawer(row)"
              >
                点击查看
              </div>
            </template>
            <template #voice_text="{ row }">
              <div :style="{ display: 'flex', alignItems: 'center' }">
                <div :style="{ marginRight: '2px', width: '70px' }">
                  {{ row.voice_text }}
                </div>
                <div
                  :style="{ display: 'flex' }"
                  id="playPauseButton"
                  @click="togglePlayPause(row)"
                  v-if="row.voice_file_url"
                ></div>
              </div>
            </template>
            <template #difficultyLevel="{ row }">
              {{
                row.difficultyLevel == 1
                  ? '低风险'
                  : row.difficultyLevel == 2
                    ? '中风险'
                    : row.difficultyLevel == 3
                      ? '高风险'
                      : ''
              }}
            </template>
            <template #orthFilterORFacialResult="{ row }">
              <div class="flex items-center">
                <img
                  v-if="row.orthFilterORFacialResult && row.orthFilterORFacialResult !== '--'"
                  :src="
                    statusStrategy[row.orthFilterORFacialResult] == 'evaluateStatus'
                      ? evaluateStatus
                      : orthoStatus
                  "
                /><span class="ml-[8px] mr-[24px]"
                  >{{ row.orthFilterORFacialResult
                  }}<img
                    v-if="row.fromWhich == '面评'"
                    class="position-absolute top-[4px] w-[24px]"
                    src="../assets/png/mianpingFlag.png"
                /></span>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="`点击查看${row.fromWhich}详情`"
                  placement="top-start"
                  v-if="row.fromWhich"
                >
                  <span>
                    <el-popover
                      placement="bottom"
                      :width="424"
                      trigger="click"
                      content="this is content, this is content, this is content"
                      v-if="row.fromWhich"
                    >
                      <template #reference>
                        <div
                          class="hover:bg-[#E5E6EB] h-[16px] w-[16px] border-rd-[4px]"
                          v-if="row.fromWhich"
                        >
                          <img
                            src="../assets/svg/more.svg"
                            v-if="row.orthFilterORFacialResult !== '--'"
                            @click.self="handleDetail(row)"
                          />
                        </div>
                      </template>
                      <div class="color-[#4E5969]">
                        <div class="mb-[16px]">操作医生：{{ detail?.operationDoctorName }}</div>

                        <div class="mb-[16px]">操作时间：{{ detail?.operationTime }}</div>
                        <div
                          class="mb-[16px]"
                          v-if="
                            detail?.orthFilterORFacialResult == '后续面评' &&
                            row.fromWhich == '面评'
                          "
                        >
                          后续时间：{{ detail?.facialTime }}
                        </div>
                        <div
                          class="mb-[16px]"
                          v-if="
                            detail?.orthFilterORFacialResult == '立即矫正' &&
                            row.fromWhich == '面评'
                          "
                        >
                          推荐医生：{{ detail?.recommendedDoctor }}
                        </div>
                        <div
                          class="mb-[16px]"
                          v-if="
                            detail?.orthFilterORFacialResult == '转三级面评' &&
                            row.fromWhich == '面评'
                          "
                        >
                          转诊至：{{ detail?.facialReferralToDoctorName }}
                        </div>
                        <div class="mb-[16px] flex items-center" v-if="row.fromWhich == '快筛'">
                          风险等级：
                          <div v-if="detail?.difficultyLevel !== null">
                            <img src="../assets/png/highRisk.png" class="w-[14px] h-[14px]" /><span
                              class="ml-[4px]"
                              >{{ detail?.difficultyLevel }}等级</span
                            >
                          </div>
                          <div v-else>--</div>
                        </div>
                        <div class="mb-[16px]" v-if="row?.fromWhich == '快筛'">
                          <span class="w-[70px] text-right">优先级：</span>
                          <span v-if="detail?.priorityLevel && row.fromWhich == '快筛'"
                            >{{ detail?.priorityLevel }}优先</span
                          ><span v-else>--</span>
                        </div>
                        <div class="mb-[16px]">
                          <span class="w-[70px] text-right">备注：</span>
                          <span>{{ detail?.remarks }}</span>
                        </div>

                        <div>
                          历史记录：<span
                            class="color-[#2E6CE4] cursor-pointer"
                            v-if="recordList?.length > 1"
                            ><span @click="row.fold = !row.fold" v-if="row.fold === true"
                              >点击查看</span
                            >
                            <span @click="row.fold = !row.fold" v-if="row.fold === false"
                              >点击收起</span
                            >
                          </span>
                          <span v-else>--</span>
                        </div>
                        <div v-if="!row.fold" class="notesWrapper">
                          <div class="item" v-for="item in recordList" :key="item">
                            <span
                              class="circle w-[18px] h-[18px] flex items-center justify-center font-size-[10px]"
                              >{{ row.fromWhich?.slice(0, 1) }}</span
                            >
                            <div
                              class="rightBox bg-[#F7F8FA]"
                              @mouseenter="item.showFlag = true"
                              @mouseleave="item.showFlag = false"
                            >
                              <div class="title flex">
                                <div class="time flex items-center">
                                  <img
                                    class="mr-[9px]"
                                    :src="`/src/assets/png/${statusStrategy[row.orthFilterORFacialResult]}.png`"
                                  />{{ item.orthFilterORFacialResult }}
                                </div>
                                <span
                                  v-if="item.showFlag && !item.showDetail"
                                  class="color-[#2E6CE4] cursor-pointer"
                                  @click="item.showDetail = true"
                                  >展开</span
                                >
                                <span
                                  v-else-if="item.showFlag && item.showDetail"
                                  class="color-[#2E6CE4] cursor-pointer"
                                  @click="item.showDetail = false"
                                  >收起</span
                                >
                              </div>
                              <div
                                class="content flex justify-between color-[#4E5969] font-size-[12px]"
                              >
                                <div class="name" v-if="item.operationTime">
                                  {{ item.operationTime?.slice(0, 10) }}
                                </div>
                                <div class="remarkType">{{ item?.recommendedDoctor }}</div>
                              </div>
                              <div
                                v-if="
                                  item.orthFilterORFacialResult == '后续面评' && item.showDetail
                                "
                              >
                                后续时间：{{}}
                              </div>
                              <div
                                v-if="
                                  item.orthFilterORFacialResult == '立即矫正' && item.showDetail
                                "
                              >
                                <div class="mb-[8px]">
                                  推荐医生：
                                  {{ item.recommendedDoctor }}
                                </div>
                                <div class="mb-[8px]">
                                  患者依从性：{{
                                    item.patientCompliance == '1'
                                      ? '好'
                                      : item.patientCompliance == '2'
                                        ? '中'
                                        : '差'
                                  }}
                                </div>
                                <div>备注：{{ item.remarks }}</div>
                              </div>
                              <div
                                v-if="
                                  item.orthFilterORFacialResult == '转三级面评' && item.showDetail
                                "
                              >
                                <div class="mb-[8px]">
                                  转诊至：{{ item.facialReferralToDoctorName }}
                                </div>

                                <div class="mb-[8px]">备注：{{ item.remarks }}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-popover>
                  </span>
                </el-tooltip>
              </div>
            </template>
            <template #orthAppointmentStatus="{ row }">
              <template v-if="row.orthAppointmentStatus">
                <div class="flex items-center">
                  <div
                    class="w-[52px] flex justify-center text-center font-size-[12px] border-rd-[4px]"
                    :style="{ display: 'inline-block' }"
                    :class="{
                      'bg-[#FFD9D9] color-[#F65B56]':
                        row.orthAppointmentStatus === '未预约' ||
                        row.orthAppointmentStatus === '冲突',
                      'color-[#FF9A2E] border-color-[#FF9A2E] border-width-[1px] border-solid':
                        row.orthAppointmentStatus === '不匹配',
                      'color-[#4E5969] bg-[#F2F3F5]': row.orthAppointmentStatus === '已预约',
                      'color-[#2E6CE4] bg-[#EAF0FC]': row.orthAppointmentStatus === '可合并'
                    }"
                  >
                    {{ row.orthAppointmentStatus }}
                  </div>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="点击查看正畸预约详情"
                    placement="top-start"
                    v-if="row.orthAppointmentStatus"
                  >
                    <span>
                      <el-popover
                        placement="bottom"
                        :width="350"
                        trigger="click"
                        content="this is content, this is content, this is content"
                        v-if="row.orthAppointmentStatus"
                      >
                        <template #reference>
                          <div
                            class="hover:bg-[#E5E6EB] h-[16px] w-[16px] border-rd-[4px] ml-[17px]"
                            v-if="row.orthAppointmentStatus"
                          >
                            <img
                              src="../assets/svg/more.svg"
                              @click="handleOrthDetail(row)"
                              v-if="row.orthAppointmentStatus"
                            />
                          </div>
                        </template>
                        <div class="color-[#4E5969]">
                          <template v-for="(orthDetail, index) in orthDetailList">
                            <div
                              class="flex items-center mb-[8px]"
                              v-if="orthDetailList.length > 1"
                            >
                              <img
                                src="../assets/png/aptmFlag.png"
                                class="h-[16px] mr-[10px]"
                              /><span class="color-[#1D2129] font-500">预约{{ index + 1 }}</span>
                            </div>
                            <div
                              class="mb-[16px]"
                              v-if="orthDetail.orthAppointmentStatus !== '未预约'"
                            >
                              预约时间：{{ orthDetail?.startTime }}
                            </div>
                            <div class="mb-[16px] flex items-center">
                              风险等级：
                              <div
                                v-if="orthDetail?.difficultyLevel !== null"
                                class="flex items-center"
                              >
                                <img
                                  class="h-[14px]"
                                  src="../assets/png/highRisk.png"
                                  v-if="orthDetail.difficultyLevel == '高'"
                                /><img
                                  class="h-[14px]"
                                  src="../assets/png/mediumRisk.png"
                                  v-if="orthDetail.difficultyLevel == '中'"
                                />
                                <img
                                  class="h-[14px]"
                                  src="../assets/png/lowRisk.png"
                                  v-if="orthDetail.difficultyLevel == '低'"
                                />
                                {{ orthDetail.difficultyLevel }}风险
                              </div>
                              <div v-else>--</div>
                            </div>
                            <div
                              class="mb-[16px] flex"
                              v-if="orthDetail.orthAppointmentStatus == '未预约'"
                            >
                              当日正畸医生：
                              <div
                                class="flex flex-1 flex-wrap"
                                v-if="orthDetail?.orthDoctorList.length > 0"
                              >
                                <template v-for="doctor in orthDetail?.orthDoctorList">
                                  <div
                                    class="h-[28px] px-[8px] py-[4px] bg-[#F2F3F5] border-[1px] border-solid border-color-[#C9CDD4] mr-[8px] mb-[8px] border-rd-[4px]"
                                  >
                                    {{ doctor }}
                                  </div>
                                </template>
                              </div>
                              <div v-else>暂无排班医生</div>
                            </div>
                            <div
                              class="mb-[16px]"
                              v-if="orthDetail.orthAppointmentStatus == '未预约'"
                            >
                              面评建议医生：{{ orthDetail?.recommendedDoctor }}
                            </div>

                            <div
                              class="mb-[16px] flex items-center"
                              v-if="orthDetail.orthAppointmentStatus !== '未预约'"
                            >
                              预约医生：<img
                                class="w-[16px]"
                                src="../assets/png/一级@3x.png"
                                v-if="orthDetail?.orthLevel == 1"
                              />
                              <img
                                class="w-[16px]"
                                src="../assets/png/二级@3x.png"
                                v-if="orthDetail?.orthLevel == 2"
                              />
                              <img
                                class="w-[16px]"
                                src="../assets/png/三级@3x.png"
                                v-if="orthDetail?.orthLevel == 3"
                              />
                              {{ orthDetail?.doctorName }}
                              <div
                                class="flex items-center"
                                v-if="orthDetail.orthAppointmentStatus == '不匹配'"
                              >
                                <img
                                  src="../assets/svg/serious.svg"
                                  class="ml-[4px] mr-[5px]"
                                /><span class="color-[#F76560] font-500">等级不匹配</span>
                              </div>
                            </div>
                            <div
                              class="mb-[16px]"
                              v-if="orthDetail.orthAppointmentStatus !== '未预约'"
                            >
                              预约项目：{{ orthDetail?.appointmentItemStr }}
                            </div>
                            <div
                              class="mb-[12px]"
                              v-if="orthDetail.orthAppointmentStatus !== '未预约'"
                            >
                              预约备注：{{ orthDetail?.appointmentNotes }}
                            </div>

                            <div
                              class="h-[1px] w-[286px] bg-[#E5E6EB] mb-[12px]"
                              v-if="index !== orthDetailList.length - 1"
                            ></div>
                          </template>
                        </div>
                      </el-popover>
                    </span>
                  </el-tooltip></div
              ></template>
              <template v-else>--</template>
            </template>
            <template #facialAdvise="{ row }">
              <div>
                {{
                  row.facialAdvise == 1
                    ? '立即矫正'
                    : row.facialAdvise == 2
                      ? '无需矫正'
                      : row.facialAdvise == 3
                        ? '后续面评'
                        : row.facialAdvise == 4
                          ? '转三级面评'
                          : '未评估'
                }}
              </div>
            </template>
            <template #lastDoctorName="{ row }">
              <template v-if="row.lastDoctorName">{{ row.lastDoctorName }}23</template>
              <template v-else>--</template>
            </template>
            <template #filterStatus="{ row }">
              <div>
                {{ row.filterStatus == 1 ? '已筛选' : '未筛选' }}
              </div>
            </template>
            <template #responsibleDoctor="{ row }">
              <a-select
                placeholder="请选择"
                allow-search
                v-model="selectDoctor"
                @change="handleSaveOrthDoctor(row)"
              >
                <a-option
                  v-for="item in orthDoctorList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  {{ item.label }}</a-option
                >
              </a-select>
            </template>
            <template #pediAppointmentNotes="{ row }">
              <template v-if="row.pediAppointmentNotes !== '--'">
                <a-popover class="w-[300px]!">
                  <div class="ellipsis">
                    {{ row.pediAppointmentNotes }}
                  </div>
                  <template #content>
                    {{ row.pediAppointmentNotes }}
                  </template>
                </a-popover></template
              >
              <template v-else>--</template>
            </template>
            <template #lastAdmissionNote="{ row }">
              <template v-if="row.lastAdmissionNote !== '--'">
                <a-popover class="w-[300px]!">
                  <div class="ellipsis">
                    {{ row.lastAdmissionNote }}
                  </div>
                  <template #content>
                    {{ row.lastAdmissionNote }}
                  </template>
                </a-popover></template
              >
              <template v-else>--</template>
            </template>
            <template #operation="{ row }">
              <el-button @click="handleEvaluateOrth(row)" v-if="currentTab == '面评'"
                >进入面评</el-button
              >
              <el-button @click="handleViewPdf(row)" v-if="currentTab == '面评'"
                >查看报告</el-button
              >
              <el-button @click="handleViewOrth(row)" v-if="currentTab == '矫正方案'"
                >进入正畸方案</el-button
              >
              <!-- <el-button @click="handleCompareOrth(row)" v-if="currentTab == '矫正方案'"
              >对比矫正方案报告</el-button
            >
            <el-button @click="handleCompareOrth(row)" v-if="currentTab == '面评'"
              >对比面评报告</el-button
            > -->
              <div class="flex items-center" v-if="currentTab == '应矫预约率'">
                <img src="../assets/png/Callender@3x.png" class="w-[16px]" /><span
                  @click="handleGoSche(row)"
                  class="color-[#2E6CE4] cursor-pointer ml-[12px]"
                  >去预约表</span
                >
              </div>
            </template>
          </CustomTable>
        </div>
        <audio
          id="audioPlayer"
          controls
          :style="{
            opacity: 0
          }"
          @canplay="handleCanPlay"
        >
          <source id="audioSource" type="audio/mp3" :src="voiceUrl" />
        </audio>
      </div>
    </div>
  </div>
  <div class="drawer">
    <a-drawer v-model:visible="drawerVisible" class="drawer">
      <template #header>
        <div class="title" :style="{ color: '#1d2129' }">备注</div>
      </template>

      <div v-if="!edit" @click="handleAddNote" :style="{ display: 'flex', alignItems: 'center' }">
        <img src="@/assets/svg/addNote.svg" :style="{ marginRight: '4px', cursor: 'pointer' }" />
        新增备注
      </div>

      <div class="form" v-else>
        <div class="form_title">
          <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
            <div
              class="selectWrapper"
              :style="{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                width: '114px',
                background: '#f2f3f5'
              }"
            >
              <a-select
                v-model="remarkType"
                :style="{ width: '114px' }"
                placeholder="选择类型"
                default-popup-visible="true"
                @focus="dropdown"
              >
                <a-option
                  v-for="item in remarkTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >{{ item.label }}</a-option
                >
              </a-select>
              <img src="@/assets/svg/arrowup.svg" v-if="dropdown" />
              <img src="@/assets/svg/arrowdown.svg" v-else />
            </div>

            <div class="btns">
              <a-button @click="edit = false">取消</a-button>
              <a-button type="primary" @click="handleSaveNotes">保存 </a-button>
            </div>
          </div>
        </div>
        <div
          class="form_input"
          :style="{
            position: 'relative'
          }"
        >
          <a-select v-model="patientAptm">
            <a-option
              v-for="item in patientAptmList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >{{ item.label }}</a-option
            >
          </a-select>
          <div class="cover"></div>

          <div class="chooseAptm">选择预约</div>
        </div>
        <div class="form_textarea">
          <a-textarea placeholder="请输入内容或选择下方快捷回复" allow-clear v-model="textarea" />

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
      <div class="notesWrapper">
        <img src="@/assets/ortho/emptyImage.png" v-if="empty" class="emptyImage" />
        <div v-else="!empty">
          <div class="item" v-for="item in noteList" :key="item">
            <span class="circle"></span>
            <div class="rightBox">
              <div class="title">
                <div class="time">{{ item.time }}</div>
                <div class="name">{{ item.name }}</div>
              </div>
              <div class="content">
                <span class="remarkType">{{ item.remarkTypeName }}</span
                >{{ item.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script setup>
import { ref, watchEffect, watch, nextTick, onMounted, onBeforeMount } from 'vue'
import dayjs from 'dayjs'
import { Post, Get } from '../utils/request'
import { useRouter, useRoute } from 'vue-router'
import { formatAptmTime } from '../utils/formatTime'
import {
  columns_config_evaluate,
  columns_config_ortho,
  columns_config_aptm,
  columns_config_aptmNo
} from './config'
import CustomTable from '../packages-js/custom-table/custom-table.vue'
import filterSearch from '../packages-js/filter-search/filter-search.vue'
import taskCardItem from '../packages-js/task-card-item/task-card-item.vue'
import taskCard from '../packages-js/task-card/task-card.vue'
import Drawer from '../components/list/drawer.vue'
import { ElTableColumn, ElMessage } from 'element-plus'
import customList from '@/components/pdf/customList.vue'
import evaluateStatus from '../assets/png/evaluateStatus.png'
import orthoStatus from '../assets/png/orthoStatus.png'
import { useStore } from 'vuex'
import { ElLoading } from 'element-plus'
const store = useStore()
const route = useRoute()
const params = route.query
const requestAble = ref({})
const userInfo = ref()
const currentTab = ref(sessionStorage.currentTab || '应矫预约率')
sessionStorage.setItem('currentTab', currentTab.value)
const setInitialState = (val) => {
  requestAble.value[val] = true
}
if (params.token) {
  sessionStorage.odos_token = params.token
}
// 切换卡片
// 首次渲染的时候也执行了

const isChangeTab = ref(true)
const changeTab = async (val) => {
  isChangeTab.value = await Promise.resolve(false)
  currentTab.value = val
  sessionStorage.setItem('currentTab', val)
  // 添加缓存
  storageName.value = strategy.value[val].storage
  pagesStorage.value = strategy.value[val].page
  // if (strategy.value[currentTab.value].firstReq) {
  const args = getCache(currentTab)
  strategy.value[val].request(args)
  // }
  isChangeTab.value = await Promise.resolve(true)
}

// 只有在一次点击卡片的时候才会执行watch中的请求
// watch(requestAble.value, (newVal) => {
// if (newVal[strategy.value[currentTab.value].storage] && !strategy.value[currentTab.value].firstReq) {
// const args = getCache(currentTab)
// strategy.value[currentTab.value].request(args)
// strategy.value[currentTab.value].firstReq = true
// }
// })
const statusStrategy = {
  面评: 'evaluateStatus',
  矫正: 'orthoStatus'
}
// 定义状态
const status = ref('矫正')

const currentTab1 = ref('有未来预约')
const strategy = ref({
  应矫预约率: {
    config: columns_config_aptm,
    storage: 'aptm',
    page: 'aptmPage',
    request: getAptmList,
    stasCountRequest: getAptmCount,
    firstReq: false
  },
  面评: {
    config: columns_config_evaluate,
    storage: 'evaluate',
    page: 'evaluatePage',
    request: getEvaluateList,
    stasCountRequest: getFacialCount,
    firstReq: false
  },
  矫正方案: {
    config: columns_config_ortho,
    storage: 'ortho',
    page: 'orthoPage',
    request: getOrthoList,
    stasCountRequest: getOrthCount,
    firstReq: false
  }
})

const total = ref(0)
const date = ref('')
const firstDate = ref('')
// 默认是今天的日期
// firstdate是上个月的1号

firstDate.value = formatAptmTime().firstDate
date.value = formatAptmTime().formattedToday

const columns = ref([...columns_config_evaluate])

const evaluateList = ref([])
const page = ref(sessionStorage.getItem('page') || 1)
const pageSize = ref(sessionStorage.getItem('pageSize') || 10)
const storageName = ref(strategy.value[sessionStorage.getItem('currentTab')].storage)

async function getEvaluateList(val) {
  if (date.value) {
    const res = await Post('/prod-api/emr/orthCommon/appointmentList', {
      startTime: val?.date || date.value, //预约日期
      pageSize: val?.pageSize || pageSize.value,
      pageNum: val?.page || page.value,
      officeId: officeId.value,
      doctorId: val?.doctorId,
      location: '1'
    })
    if (res.code == 200) {
      total.value = res.total
      evaluateList.value = res.rows.map((item) => ({
        ...item,
        StartTime: item.startTime.replace('T', ' ').slice(0, 16),
        patientName: item.patientName,
        age: item.age,
        facialAdvise: item.facialAdvise ? item.facialAdvise : '未评估',
        list: [
          { label: '临床检查', finished: item.clinicalExamination },
          { label: '图像上传', finished: item.imageUpload },
          { label: '检查结果', finished: item.imageAnalysis },
          { label: '面评结论', finished: item.facialConclusion }
        ]
      }))
      patientList.value = evaluateList.value
      total.value = res.total
    }
  }
}
function getCache(currentTab) {
  const pages = sessionStorage.getItem(strategy.value[currentTab.value]?.page)
  const storage = sessionStorage.getItem(strategy.value[currentTab.value]?.storage)
  const val = { ...JSON.parse(pages), ...JSON.parse(storage) }
  return val
}
const orthoList = ref([])
const patientList = ref([])
async function getOrthoList(val) {
  if (date.value) {
    const res = await Post('/prod-api/emr/orthCommon/appointmentList', {
      startTime: val?.date || date.value, //预约日期
      pageSize: val?.pageSize || pageSize.value,
      pageNum: val?.page || page.value,
      officeId: officeId.value,
      doctorId: val?.doctorId,
      location: '2'
    })
    if (res.code == 200) {
      total.value = res.total
      orthoList.value = res.rows.map((item) => ({
        ...item,
        StartTime: item.startTime?.replace('T', ' ').slice(0, 16),
        patientName: item.patientName,
        age: item.age,
        facialAdvise: item.facialAdvise ? item.facialAdvise : '未评估',
        list: [
          { label: '问诊和检查', finished: item.clinicalExamination },
          { label: '图像上传', finished: item.imageUpload },
          { label: '图像分析', finished: item.imageAnalysis },
          { label: '模型分析', finished: item.modelAnalysis },
          { label: '诊断', finished: item.diagnosis },
          { label: '里程碑与工具', finished: item.plansTools },
          { label: '审批提交', finished: item.approvalSubmitted }
        ]
      }))
      patientList.value = orthoList.value
      total.value = res.total
    }
  }
}
const aptmList = ref([])
async function getNoAptmList(val) {
  const loading = ElLoading.service({
    lock: true,
    text: '正在加载中',
    background: 'rgba(255, 255, 255, 0.66);',
    target: loadingTarget.value
  })
  let pageSizes = val?.pageSize || pageSize.value
  let pageNum = val?.page || page.value
  let obj = {
    orthFilterORFacialResult: val?.orthFilterORFacialResult,
    priorityLevel: val?.priorityLevel
  }
  obj.endTime = setEndTime(val)
  obj.startTime = setStartTime(val)
  const res = await Post(
    `/prod-api/emr/orthAppointments/selectPatientsNotScheduledList?pageNum=${pageNum}&pageSize=${pageSizes}`,
    obj
  )
  if (res.code == 200) {
    if (currentTab.value == '应矫预约率' && currentTab1.value == '有未来预约') return

    total.value = res.total
    patientList.value = res.rows?.map((item) => ({
      ...item,
      fold: true,
      startTime: item.startTime?.replace('T', ' ').slice(5, 16),
      noteList: [{ time: '', name: '', content: 'content' }],
      lastAdmissionTime: item.lastAdmissionTime.slice(0, 10)
    }))
  }
  loading.close()
}
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
function formatDateWithoutTime(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getDefaultDates() {
  const today = new Date()
  const lastYearToday = new Date(today)
  lastYearToday.setFullYear(today.getFullYear() - 1)

  const lastStartDate = formatDateWithoutTime(lastYearToday)
  const lastEndDate = formatDateWithoutTime(today)

  return { lastStartDate, lastEndDate }
}

const { lastStartDate, lastEndDate } = getDefaultDates()
console.log(lastStartDate, lastEndDate)
function setStartTime(val) {
  const today = new Date()
  let startTime

  if (typeof val.date === 'string') {
    startTime = ''
  } else {
    const selectedDate = dayjs(val.date?.[0]).startOf('day')
    if (selectedDate.isSame(today, 'day')) {
      // 如果是今天的日期，添加当前的时分秒
      startTime = formatDate(today)
    } else {
      // 如果不是今天的日期，时分秒设为 00:00:00
      startTime = selectedDate.format('YYYY-MM-DD 00:00:00')
    }
  }
  return startTime
}
function setEndTime(val) {
  if (typeof val.date === 'string') {
    return val.date
  }

  const selectedDate = dayjs(val.date?.[1])

  // 在选中的日期上加1天，时分秒设为 00:00:00
  return selectedDate.add(1, 'day').startOf('day').format('YYYY-MM-DD 00:00:00')
}
async function getAptmList(val) {
  const loading = ElLoading.service({
    lock: true,
    text: '正在加载中',
    background: 'rgba(255, 255, 255, 0.66);',
    target: loadingTarget.value
  })
  let pageSizes = val?.pageSize || pageSize.value
  let pageNum = val?.page || page.value
  let obj = {
    orthFilterORFacialResult: val?.orthFilterORFacialResult,
    orthAppointmentStatus: val?.orthAppointmentStatus,
    priorityLevel: val?.priorityLevel,
    pediDentistId: val?.pediDentistId
  }
  obj.endTime = setEndTime(val)
  obj.startTime = setStartTime(val)
  const res = await Post(
    `/prod-api/emr/orthAppointments/selectPatientsScheduledList?pageNum=${pageNum}&pageSize=${pageSizes}`,
    obj
  )
  if (res.code == 200) {
    if (currentTab.value == '应矫预约率' && currentTab1.value == '无未来预约') return

    total.value = res.total
    patientList.value = res.rows?.map((item) => ({
      ...item,
      fold: true,
      startTime: item.startTime?.replace('T', ' ').slice(5, 16),
      noteList: [{ time: '', name: '', content: 'content' }],
      pediAppointmentDate: item.pediAppointmentDate.slice(0, 10)
    }))
  }
  loading.close()
}
const hasNextAppointment = ref(true)
// 快筛面评逻辑
const aptmLists = [{ label: '有未来预约' }, { label: '无未来预约' }]

const handleChangeTab1 = async (label) => {
  currentTab1.value = label
  strategy.value['应矫预约率'].config =
    label == '有未来预约' ? columns_config_aptm : columns_config_aptmNo
  const val = sessionStorage.getItem('currentTab')
  storageName.value = strategy.value[val].storage
  const value = sessionStorage.getItem(storageName.value)
  const obj = JSON.parse(value)

  obj.date = label == '有未来预约' ? [firstDate.value, date.value] : [lastStartDate, lastEndDate]
  sessionStorage.setItem(storageName.value, JSON.stringify(obj))
  isChangeTab.value = await Promise.resolve(false)

  isChangeTab.value = await Promise.resolve(true)
  const args = getCache(currentTab)
  if (label == '无未来预约') {
    await getNoAptmList(args)
  } else {
    await getAptmList(args)
  }
}
const circleStyle = (item) => ({
  '--circle-content': `'${item.slice(0, 1)}'`
})
const detail = ref()
const recordList = ref()
const handleDetail = async (item) => {
  const res = await Post('/prod-api/emr/orthAppointments/selectOrthoFacialAndFilterDetail', {
    patientId: item.patientId,
    fromWhich: item.fromWhich
  })
  detail.value = res.data[0]
  recordList.value = res.data.slice(1)
}
const loadingTarget = ref(null)
const orthDetailList = ref([])
const handleOrthDetail = async (item) => {
  const res = await Post('/prod-api/emr/orthAppointments/selectOrthoAppointmentDetail', {
    patientId: item.patientId, //患者id
    startTime: item.startTime, //预约时间
    difficultyLevel: item.difficultyLevel, //难度等级
    orthAppointmentStatus: item.orthAppointmentStatus,
    fromWhich: item.fromWhich,
    pediAppointmentDate: item.pediAppointmentDate.slice(0, 10),
    officeId: item.pediAppointmentDate == '--' ? sessionStorage.getItem('officeId') : item.officeId
  })
  orthDetailList.value = res.data
}
const noteList = ref([])
const empty = ref(false)
const selected = ref()
async function getNote(row) {
  let url = `/prod-api/business/totalRemark/list?`
  if (row.aptmId) {
    url += `aptmId=${row.aptmId}`
  } else if (row.PatientId) {
    url += `PatientId=${row.PatientId}`
  } else if (row.id) {
    url += `customerId=${row.id}`
  }
  const res = await Get(url)
  if (res.code == 200) {
    if (res.rows.length == 0) {
      empty.value = true
    }
    selected.value = row
    noteList.value = res.rows.map((item) => ({
      ...item,
      time: item.createTime.slice(0, 16),
      name: item.createBy,
      content: item.remark
    }))
  }
}
const allOptions = ref([])
const loading = ref(false)
const getDoctorList = () => {
  loading.value = true
  Get('/prod-api/business/public/api/v1/provider/list?Job=医生').then((res) => {
    allOptions.value = res.map((item) => ({
      label: item.doctorName,
      value: +item.doctorId
    }))
    options.value = allOptions.value
  })
}
// 备注
const drawer = ref(false)
const drawerVisible = ref(false)
const edit = ref(false)
const type = ref()
const handleNoteDrawer = (row) => {
  drawerVisible.value = true
  getNote(row)
  getPatientAptm(row)
  getRemarkType(row)
}
const patientAptmList = ref([])
const remarkTypeList = ref([])
async function getRemarkType(row) {
  let url = `/prod-api/business/totalRemark/typeList`
  if (row.apmtId) {
    url += `?needApmtId=1`
  } else {
    url += `?needApmtId=0`
  }
  const res = await Get(url)
  if (res.code == 200) {
    remarkTypeList.value = res.data.map((item) => ({
      label: item.type,
      value: item.typeId
    }))
  }
}

async function getPatientAptm(row) {
  const res = await Get(
    `/prod-api/business/public/api/v1/appointment/allAppList?patientId=${row.PatientId}`
  )
  if (res.code == 200) {
    patientAptmList.value = res.data.map((item) => ({
      label: item.StartTime + ' ' + '|' + ' ' + item.doctorName,
      value: item.app_id
    }))
  }
}
const handleAddNote = () => {
  edit.value = true
  empty.value = false
}
async function handleSaveNotes() {
  const res = await Post('/prod-api/business/totalRemark', {
    customerId: selected.value.id, //客户id
    remark: textarea.value, //备注
    patientId: selected.value.PatientId, //患者id
    aptmId: selected.value.aptmId,
    remarkType: remarkType.value
  })
  if (res.code == 200) {
    // ElMessage.success('保存成功')
  }
  drawerVisible.value = false
  edit.value = false
  textarea.value = ''
  remarkType.value = ''
}
const dropdown = ref(false)

const remarkType = ref()
const handleClose = () => {}
// 快捷录入
const quickReplies = ['未接通', '关机', '需再次联系']
const handleAutoFill = (item) => {
  textarea.value = item
}
const textarea = ref()
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
      value: +item.ljOfficeId
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
  router.push(`/ortho/${item.aptmId}/${item.patientId}`)
  sessionStorage.setItem('planCompletionId', item.planCompletionId)
  sessionStorage.setItem('patientInfo', JSON.stringify(item))
  window.parent.postMessage(`ortho/${item.aptmId}/${item.patientId}`, '*')
}
const orthStatus = ref(-1)
const hasPermission = ref(false)
async function verifyPermission() {
  const res = await Get(
    `/prod-api/emr/public/api/v1/assessment/getOrthDoctorInfoByDoctorId/${userInfo.value?.ljProviderId}`
  )
  if (res.code == 200 && res.data.length > 0 && res.data[0].orthLevel) {
    if (res.data[0].orthLevel == '一级正畸医生') {
      orthStatus.value = 1
      hasPermission.value = true
    } else if (res.data[0].orthLevel == '二级正畸医生') {
      orthStatus.value = 2
      hasPermission.value = true
    } else if (res.data[0].orthLevel == '三级正畸医生') {
      orthStatus.value = 3
      hasPermission.value = true
    }
  }
}
const handleViewPdf = (item) => {
  if (!item.pdfUrl) {
    ElMessage.warning('暂无报告哦')
    return
  }
  sessionStorage.setItem('patientInfo', JSON.stringify(item))
  window.open(item.pdfUrl)
}
const handleEvaluateOrth = async (item) => {
  if (!hasPermission.value) {
    ElMessage.warning('无面评操作权限')
    return
  }

  let path = ''

  if (!item.facialId) {
    await Post('/prod-api/emr/public/api/v1/assessment/add', {
      patientId: item.patientId,
      aptmId: item.aptmId
    }).then(({ data }) => {
      item.facialId = data?.facialId
      store.commit('setPatientInfo', item)
      sessionStorage.setItem('patientInfo', JSON.stringify(item))
    })
  } else {
    sessionStorage.setItem('patientInfo', {})
    store.commit('setPatientInfo', item)
    sessionStorage.setItem('patientInfo', JSON.stringify(item))
  }
  sessionStorage.setItem('facialCompletionId', item.facialCompletionId)
  path =
    orthStatus.value !== -1
      ? `/evaluateOrtho/${item.aptmId}/${item.patientId}/${item.facialId}/${orthStatus.value}`
      : `/evaluateOrtho/${item.aptmId}/${item.patientId}/${item.facialId}`
  router.push(path)
}
const handleCompareOrth = (item) => {
  router.push(`/compareOrtho/${item.apmtId}/${item.patientId}`)
}
const handleGoLj = (item) => {
  console.log(item)
  window.open(`https://orange.linkedcare.cn/#/patient/info/${item.patientId}/record`, '_blank')
}
const handleGoSche = (item) => {
  window.open(`https://orange.linkedcare.cn/#/patient/info/${item.patientId}/apptRecord`, '_blank')
}

const filter = (val) => {
  const v = getCache(currentTab)
  if (currentTab1.value == '无未来预约') {
    getNoAptmList(val)
    return
  }
  // 改变时间的时候去重新执行请求就好了
  strategy.value[currentTab.value].request(v)
  if (currentTab.value !== '应矫预约率') {
    strategy.value[currentTab.value].stasCountRequest(v)
  }
}

const pagesStorage = ref('evaluatePage')
const changePage = (page) => {
  const pages = sessionStorage.getItem(strategy.value[currentTab.value].page)
  const storage = sessionStorage.getItem(strategy.value[currentTab.value].storage)
  const val = { ...JSON.parse(pages), ...JSON.parse(storage) }
  if (currentTab1.value == '无未来预约') {
    getNoAptmList(val)
    return
  }
  strategy.value[currentTab.value].request(val)
}
watch(
  currentTab,
  (val) => {
    if (val == '面评') {
      patientList.value = evaluateList.value
      total.value = 0
    } else if (val == '矫正方案') {
      patientList.value = orthoList.value
      total.value = 0
    } else {
      patientList.value = aptmList.value.map((i) => ({
        ...i
      }))
      total.value = 0
    }
    columns.value = strategy.value[val].config
  },

  { immediate: true }
)
watch(
  currentTab1,
  (val) => {
    if (currentTab.value == '应矫预约率') {
      columns.value = strategy.value['应矫预约率'].config
    }
  },
  { immediate: true }
)
const officeId = ref()
onBeforeMount(() => {
  // 初始化
  pagesStorage.value = strategy.value[currentTab.value].page
  const val = sessionStorage.getItem('currentTab')
  officeId.value = JSON.parse(sessionStorage.getItem('jc_odos_user'))?.ljOfficeId

  const doctorId = JSON.parse(sessionStorage.getItem('jc_odos_user'))?.ljProviderId
  for (let key in strategy.value) {
    if (key == '面评') {
      const args = JSON.parse(sessionStorage.getItem(strategy.value[key].storage))
      if (!args) {
        const val = {}
        val.officeId = officeId
        val.doctorId = doctorId
        val.date = date.value
        strategy.value[key].stasCountRequest(val)
      } else {
        strategy.value[key].stasCountRequest(args)
      }
    }
    if (key == '矫正方案') {
      const args = JSON.parse(sessionStorage.getItem(strategy.value[key].storage))
      if (!args) {
        const val = {}
        val.doctorId = doctorId
        val.officeId = officeId
        val.date = date.value
        strategy.value[key].stasCountRequest(val)
      } else {
        strategy.value[key].stasCountRequest(args)
      }
    }
    if (key == '面评矫正预约率') {
      const args = JSON.parse(sessionStorage.getItem(strategy.value[key].storage))
      if (!args) {
        const val = {}
        val.doctorId = doctorId
        val.officeId = officeId
        val.date = [firstDate.value, date.value]
      } else {
      }
    }
  }
  storageName.value = strategy.value[val].storage
  pagesStorage.value = strategy.value[val].page
  const jc_odos_user = JSON.parse(sessionStorage.getItem('jc_odos_user'))
  userInfo.value = jc_odos_user
  const list = ['ortho', 'evaluate', 'aptm']
  list.forEach((element) => {
    sessionStorage.setItem(
      [element],
      JSON.stringify({
        doctorId: jc_odos_user?.ljProviderId,
        date:
          element == 'aptm' && currentTab1.value == '有未来预约'
            ? [firstDate.value, date.value]
            : element == 'aptm' && currentTab1.value == '无未来预约'
              ? [lastStartDate.value, lastEndDate.value]
              : firstDate.value
      })
    )
    sessionStorage.setItem('officeId', jc_odos_user?.ljOfficeId)
  })
  verifyPermission()
})

// 看板数据
const facialCount = ref({})
async function getFacialCount(val) {
  const res = await Post('/prod-api/emr/orthCommon/orthBoardCount', {
    startTime: val?.date || date.value, //预约日期
    officeId: officeId.value,
    doctorId: val?.doctorId,
    location: '1'
  })
  facialCount.value = res.data
  tabData.value[0].left_num = facialCount.value.numerator
  tabData.value[0].right_num = facialCount.value.totalCount
}
const orthCount = ref({})

async function getOrthCount(val) {
  const res = await Post('/prod-api/emr/orthCommon/orthBoardCount', {
    startTime: val?.date || date.value, //预约日期
    officeId: officeId.value,
    doctorId: val?.doctorId,
    location: '2'
  })
  orthCount.value = res.data
  tabData.value[1].left_num = orthCount.value.numerator
  tabData.value[1].right_num = orthCount.value.totalCount
}
const doctorList = ref()
const getDoctorLists = async () => {
  const res = await Get('prod-api/business/user/listNoPage?title=医生')
  doctorList.value = res.rows.map((item) => ({
    label: item.userName,
    value: item.ljProviderId
  }))
}
getDoctorLists()
const aptmCount = ref()
async function getAptmCount(val) {
  let obj = {
    officeId: val?.officeId,
    orthFilterORFacialResult: val?.orthFilterORFacialResult,
    orthAppointmentStatus: val?.orthAppointmentStatus,
    priorityLevel: val?.priorityLevel
  }
  obj.endTime = setEndTime(val)
  obj.startTime = setStartTime(val)
  const res = await Post('/prod-api/emr/orthAppointments/selectOrthoAppointmentRate', obj)
  if (res.code == 200) {
    aptmCount.value = res.data
    tabData.value[0].left_num = aptmCount.value.numerator
    tabData.value[0].right_num = aptmCount.value.totalCount
  }
}

const tabData = ref([
  {
    svg_name: 'cardSvg3',
    name: '应矫预约率',
    left_num: 0,
    right_num: 0,
    left_text: '已预约矫正人数',
    right_text: '需要矫正人数'
  },
  {
    svg_name: 'cardSvg2',
    name: '面评',
    left_num: 0,
    right_num: 0,
    left_text: '已面评人数',
    right_text: '预约面型发育评估人数'
  },
  {
    svg_name: 'cardSvg1',
    name: '矫正方案',
    left_num: 0,
    right_num: 0,
    left_text: '已录入矫正方案人数',
    right_text: '需要矫正人数'
  }
])

async function changeNote(val) {
  val.row.note = val.note
  val.row.noteList.push({
    time: new Date().toLocaleString(),
    name: 'admin',
    content: val.note
  })
  const res = await Post('/prod-api/emr/public/api/v1/assessmentNote', {
    apmtId: val.row.apmtId,
    note: val.note
  })
  if (res.code == 200) {
    // ElMessage.success('新增成功')
  }
}

const audioPlayer = ref(null)
var audioSource = ref(null)
const voiceUrl = ref()
onMounted(() => {
  audioSource.value = document.getElementById('audioSource')
  audioPlayer.value = document.getElementById('audioPlayer')
  // 当音频播放结束时，将播放状态重置为false
  audioPlayer.value?.addEventListener('ended', function () {
    selectedVoiceItem.value.isPlaying = false
    voiceUrl.value = ''
  })
})

const selectedVoiceItem = ref()
async function togglePlayPause(row) {
  // 切换数据源
  if (!voiceUrl.value && !selectedVoiceItem.value) {
    selectedVoiceItem.value = row
    voiceUrl.value = selectedVoiceItem.value.voice_file_url
    audioPlayer.value.load()
  } else {
    if (selectedVoiceItem.value.patientName == row.patientName) {
      if (!audioPlayer.value.paused && row.isPlaying) {
        audioPlayer.value.pause()
      } else if (audioPlayer.value.paused && !row.isPlaying) {
        audioPlayer.value.play()
      }
    } else {
      selectedVoiceItem.value = row
      voiceUrl.value = selectedVoiceItem.value.voice_file_url
      audioPlayer.value.load()
      if (!audioPlayer.value.paused && row.isPlaying) {
        audioPlayer.value.pause()
      } else if (audioPlayer.value.paused && !row.isPlaying) {
        audioPlayer.value.play()
      }
    }
  }

  row.isPlaying = !row.isPlaying
}
const handleCanPlay = () => {
  audioPlayer.value.play().then(() => {})
}
const selectDoctor = ref()
const orthDoctorList = ref([])
async function getOrthDoctorList() {
  const res = await Get('/prod-api/emr/public/api/v1/assessment/orthDoctorList')
  if (res.code == 200) {
    orthDoctorList.value = res.data.map((item) => {
      return {
        label: item.doctorName,
        value: item.doctorId
      }
    })
  }
}
getOrthDoctorList()
async function handleSaveOrthDoctor(item) {
  const found = orthDoctorList.value.find((i) => i.value == selectDoctor.value)
  const data = {
    orthDoctorName: found.label,
    orthDoctorId: selectDoctor.value,
    patientId: item.PatientId,
    apmtId: item.apmtId,
    id: item.id
  }
  const res = await Post('/prod-api/emr/public/api/v1/assessment', data)
  if (res.code == 200) {
  }
}
</script>

<style lang="scss" scoped>
.ellipsis {
  white-space: nowrap; /* 强制文本在一行显示 */
  overflow: hidden; /* 隐藏溢出的部分 */
  text-overflow: ellipsis; /* 溢出部分显示省略号 */
}
:deep .arco-btn.activeTab {
  background: #eaf0fc;
  color: #2e6ce4;
  font-weight: 500;
}
:deep .arco-drawer-footer > .arco-btn {
  border-radius: 6px !important;
}
:deep .arco-drawer-footer {
  :deep .arco-btn {
    border-radius: 6px;
  }
}
:deep .arco-textarea {
  height: 110px;
  background: #fff;
}
.arco-btn {
  border-radius: 6px;
}
.arco-input-wrapper {
  background: #fff;
}
.el-drawer.rtl.open {
  background: #fff;
}
:deep .arco-drawer-footer {
  display: none;
}
.drawer {
  color: #1d2129;
  position: relative;

  :deep .arco-drawer {
    width: 480px;
    :deep .arco-drawer-footer {
      display: none;
    }
  }
  :deep .arco-select-view-single {
    position: relative;
    img {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  :deep .el-drawer__header {
    margin-bottom: 0;
  }
  :deep .el-textarea {
    --el-input-border-color: #fff;
    --el-input-focus-border-color: none;
    &:hover {
      --el-input-hover-border: none;
      --el-border-color-hover: none;
    }
  }
  .notesWrapper {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    .emptyImage {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 240px;
    }
  }
  .title {
    font-size: 18px;
  }
  .form {
    background: #f4f7fd;
    // width: 448px;
    height: 253px;
    padding: 12px;
    border-radius: 12px;
    :deep .arco-select-view-suffix {
      display: none;
    }
    &_title {
      // padding: 4px 12px;
      // background: #e5e6eb;
      margin-bottom: 12px;
      // border-radius: 6px;
      // width: 114px;
      .selectWrapper:hover {
        background-color: #e5e6eb;
      }
    }
    &_input {
      height: 36px;
      margin-bottom: 12px;
      :deep .el-input {
        height: 36px;
      }
      :deep .arco-select-view-single {
        background: #fff !important;
      }
      :deep .arco-select-view-single:hover {
        background: #fff !important;
      }
      .cover {
        background: #fff;
        top: -0.5px;
        height: 4px;
        width: 50px;
        position: absolute;
        left: 8px;
      }
      .chooseAptm {
        position: absolute;
        /* padding: 2px; */
        top: -7px;
        left: 12px;
        font-size: 10px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: 0em;
        color: #4e5969;
        z-index: 10;
      }
    }
    &_textarea {
      height: 149px;
      border: 1px solid #e5e6eb;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      :deep .el-textarea {
        height: 117px;
      }
      :deep .el-textarea__inner {
        resize: none;
      }

      &_quickReply {
        color: #4e5969;
        padding-left: 12px;
        display: flex;
        align-items: center;
        margin-bottom: 6px;
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
  .item {
    width: 376px;
    position: relative;
    display: flex;
    // .circle {
    //   width: 8px;
    //   height: 8px;
    //   background: #c9cdd4;
    //   margin: 7px 17px 0 4px;
    //   border-radius: 50%;
    //   --circle-content: '';
    //   &::before {
    //     display: block;
    //     content: var(--circle-content);
    //     width: 1px;
    //     height: calc(100% - 25px);
    //     background-color: #c9cdd4;
    //     position: absolute;
    //     left: 7.5px;
    //     bottom: 0;
    //   }
    // }
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
      .remarkType {
        font-size: 12px;
        font-weight: normal;
        line-height: 20px;
        letter-spacing: 0px;
        border-radius: 4px;
        color: #2e6ce4;
        padding: 4px 10px;
        border: 1px solid #2e6ce4;
        margin-right: 12px;
      }
    }
  }
}

.contain {
  margin: 15px;
  border-radius: 10px;
  background-color: #fff;
}

.content {
  padding: 2px 20px;
  border-radius: 12px;
  // :deep .arco-select-view-single.arco-select-view-search {
  //   width: 100px;
  // }
  :deep .arco-select-view-single .arco-select-view-suffix {
    padding-left: 0;
  }
}
.notHasAptm {
  border: 1px solid #f76560;

  border-radius: 4px;
  color: #f76560;
}
.notesWrapper {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  .emptyImage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 240px;
  }
  .item {
    width: 376px;
    position: relative;
    display: flex;
    .circle {
      min-width: 18px;
      height: 18px;
      margin: 4px 17px 0 0px;
      border-radius: 50%;
      background: #2e6ce4;
      color: #fff;
      font-size: 12px !important;
      font-weight: 500;
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
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 12px;
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
}
</style>
