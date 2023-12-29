<template>
  <renderTableColumn />
</template>

<script setup lang="jsx">
import { ref, useSlots, defineAsyncComponent } from 'vue'
import style from './index.module.scss'
import unNote from '@/assets/imgs/unNote.png'
import { ElTableColumn, ElTooltip, ElInput } from 'element-plus'
import { Doption, Dropdown, Button } from '@arco-design/web-vue'
const SvgIcon = defineAsyncComponent(() => import('../svg-icon/svg-icon.vue'))
// 接收
const {
  prop,
  title,
  width,
  fixed,
  sortable,
  type,
  iconOption,
  leftTagOption,
  rightTagOption,
  stateOption,
  stateIcon,
  editStateType
} = defineProps([
  'prop',
  'title',
  'width',
  'fixed',
  'sortable',
  'type',
  'iconOption',
  'leftTagOption',
  'rightTagOption',
  'stateOption',
  'stateIcon',
  'editStateType'
])

// 表格当前数据类型
const TdType = {
  /**纯文本展示 */
  text: 'text',
  /**纯icon */
  icon: 'icon',
  /**状态 已完成/未完成 */
  state: 'state',
  /**可编辑状态 */
  editState: 'editState',
  /**项目状态 亮灯/灭灯 */
  itemState: 'itemState',
  /**右边带有icon */
  rightIcon: 'rightIcon',
  /**左边带有icon */
  leftIcon: 'leftIcon',
  /**带有tag */
  tag: 'tag',
  /**操作 */
  operation: 'operation',
  /**备注 */
  notes: 'notes'
}

// 颜色类型
const ColorTypeEnum = {
  /**警报 */
  Alarm: 'rgba(247, 101, 96, 1)',
  /**警示 */
  Warning: 'rgba(255, 154, 46, 1)',
  /**成功 */
  Success: 'rgba(35, 195, 67, 1)',
  /**主题 */
  Neutral: 'rgba(46, 108, 228, 1)',
  /**禁用 */
  Disabled: 'rgba(130, 132, 138, 1)',
  /**高贵 */
  Noble: 'rgba(167, 126, 241, 1)',
  NoColor: 'rgba(255, 255, 255, 0)'
}
const emit = defineEmits()

// 备注的每一列
const isEditList = ref([])
// 内容渲染
const noteVal = ref('')
const renderTableColumn = () => (
  <>
    {type === 'selection' && <ElTableColumn type={type} width={width} />}
    {type !== 'selection' && (
      <ElTableColumn prop={prop} label={title} width={width} fixed={fixed} sortable={sortable}>
        {({ row, $index }) => {
          isEditList.value.push({ isEdit: false })
          {
            /* 纯文本 */
          }
          if (type === TdType.text) {
            return row[prop]
          } else if (type === TdType.icon) {
            {
              /* 纯icon */
            }
            return (
              <div class={style.icon}>
                {!!iconOption?.prop ? (
                  <div>
                    {/* 如果有多种情况 */}
                    <SvgIcon
                      size={iconOption?.iconSize}
                      name={!!row[iconOption?.prop] ? iconOption?.name : iconOption?.secondName}
                    />
                  </div>
                ) : (
                  <div>
                    {/* 如果没有多种情况 */}
                    <SvgIcon size={iconOption?.iconSize} name={iconOption?.name} />
                  </div>
                )}
              </div>
            )
          } else if (type === TdType.leftIcon) {
            {
              /* 左边带有icon */
            }
            return (
              <div class={style.leftIcon}>
                {!!row[iconOption?.prop] && iconOption?.name && (
                  <SvgIcon size={iconOption?.iconSize} name={iconOption?.name} />
                )}
                {row[prop]}
              </div>
            )
          } else if (type === TdType.rightIcon) {
            {
              /* 右边带有icon */
            }
            return (
              <div class={style.rightIcon}>
                {row[prop]}
                {!!row[iconOption?.prop] && iconOption?.name && (
                  <SvgIcon size={iconOption?.iconSize} name={iconOption?.name} />
                )}
              </div>
            )
          } else if (type === TdType.tag) {
            {
              /* 带有tag */
            }
            const leftTag = {
              backgroundColor: ColorTypeEnum[leftTagOption?.color]
            }
            const rightTag = {
              border: `1px solid ${ColorTypeEnum[rightTagOption?.color]}`,
              color: ColorTypeEnum[rightTagOption?.color]
            }
            return (
              <div class={style.Tag}>
                {!!row[leftTagOption?.prop] && leftTagOption?.text && (
                  <div class="left-tag" style={leftTagOption?.color && leftTag}>
                    {leftTagOption?.text}
                  </div>
                )}
                {row[prop]}
                {!!row[rightTagOption?.prop] && rightTagOption?.text && (
                  <div class="right-tag" style={rightTagOption?.color && rightTag}>
                    {rightTagOption?.text}
                  </div>
                )}
              </div>
            )
          } else if (type === TdType.state) {
            {
              /* state 状态 */
              console.log(stateOption)
            }
            return (
              <>
                {stateOption?.map(
                  (item, index) =>
                    row[item.prop] == item.value && (
                      <div class={style.state} key={index}>
                        {row[item.prop] == item.value && (
                          <>
                            <div
                              class="circle"
                              style={{ background: ColorTypeEnum[item.color].replace('1)', '.1') }}
                            >
                              <span
                                class="circle"
                                style={{ background: ColorTypeEnum[item.color] }}
                              />
                            </div>
                            <div class="name">{item.name}</div>
                            <ElTooltip
                              effect="light"
                              trigger="click"
                              v-slots={{
                                default: () => stateIcon && <SvgIcon name={stateIcon} />,
                                content: () => slot['icon-click'] && slot['icon-click'](row)
                              }}
                            />
                          </>
                        )}
                      </div>
                    )
                )}
              </>
            )
          } else if (type === TdType.editState) {
            {
              /* 可编辑状态 */
            }

            const isspread = ref(false)
            return (
              <>
                {stateOption?.map((item, index) => {
                  return (
                    row[item.prop] == item.value && (
                      <div
                        class={editStateType ? style.editStateSolid : style.editState}
                        key={index}
                        style={{
                          backgroundColor: editStateType ? ColorTypeEnum[item.color] : 'transparent'
                        }}
                      >
                        {row[item.prop] == item.value && (
                          <Dropdown
                            position="bl"
                            data-index={0}
                            onPopupVisibleChange={(val) => (isspread.value = val)}
                            v-slots={{
                              content: () => {
                                return stateOption.map((it) => (
                                  <div
                                    class={
                                      editStateType
                                        ? style.editStateDoptionSolid
                                        : style.editStateDoption
                                    }
                                    key={it.value}
                                  >
                                    <Doption onClick={() => emit('editState', { row, it })}>
                                      <div
                                        class="item"
                                        style={{
                                          backgroundColor: !editStateType
                                            ? 'transparent'
                                            : ColorTypeEnum[it.color]
                                        }}
                                      >
                                        {!editStateType && (
                                          <div
                                            class="circle"
                                            style={{
                                              background: ColorTypeEnum[it.color].replace(
                                                '1)',
                                                '.1'
                                              )
                                            }}
                                          >
                                            <span
                                              class="circle"
                                              style={{ background: ColorTypeEnum[it.color] }}
                                            />
                                          </div>
                                        )}
                                        {it.name}
                                      </div>
                                      {row[it.prop] == it.value && (
                                        <i class="svg-icon iconfont icon-check" />
                                      )}
                                    </Doption>
                                  </div>
                                ))
                              }
                            }}
                          >
                            <Button type="text">
                              <div class="content">
                                {!editStateType && (
                                  <div
                                    class="circle"
                                    style={{
                                      background: ColorTypeEnum[item.color].replace('1)', '.1')
                                    }}
                                  >
                                    <span
                                      class="circle"
                                      style={{
                                        background: ColorTypeEnum[item.color]
                                      }}
                                    />
                                  </div>
                                )}
                                {item.name}
                              </div>
                              <i class="iconfont icon-xiangshang" v-show={isspread.value} />
                              <i class="iconfont icon-xiangxia" v-show={!isspread.value} />
                            </Button>
                          </Dropdown>
                        )}
                      </div>
                    )
                  )
                })}
              </>
            )
          } else if (type === TdType.notes) {
            {
              /* 备注 */
            }
            return (
              <div class={style.notes}>
                {!!!isEditList.value[$index]?.isEdit && (
                  <ElTooltip content={row[prop]}>
                    <span class="span">{row[prop]}</span>
                  </ElTooltip>
                )}

                {!!isEditList.value[$index]?.isEdit && (
                  <Dropdown
                    position="bl"
                    popup-visible
                    data-index={0}
                    v-slots={{
                      content: () => (
                        <div class={style.suffix}>
                          <div class="total">按“Enter”保存备注内容</div>
                          {row?.noteList?.length ? (
                            <>
                              {row?.noteList?.map((item, index) => (
                                <div class="item" key={index}>
                                  <span class="cricle" />
                                  <div class="rightBox">
                                    <div class="title">
                                      <div class="time">{item.time}</div>
                                      <div class="name">{item.name}</div>
                                    </div>
                                    <div class="content">{item.content}</div>
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <>
                              <img class="unNote" src={unNote} alt="无历史备注" />
                            </>
                          )}
                        </div>
                      )
                    }}
                  >
                    <ElInput
                      placeholder="请输入备注"
                      v-model={noteVal.value}
                      onChange={(e) => {
                        emit('changeNote', { row, note: e })
                        noteVal.value = ''
                        isEditList.value[$index].isEdit = false
                      }}
                    />
                  </Dropdown>
                )}
                <div
                  class={{
                    iconBtn: true,
                    position: isEditList.value[$index].isEdit
                  }}
                  onClick={() => {
                    isEditList.value.forEach((item, index) => {
                      if ($index === index) {
                        item.isEdit = !item.isEdit
                      } else {
                        item.isEdit = false
                      }
                    })
                  }}
                >
                  {isEditList.value[$index].isEdit ? (
                    <i class="svg-icon iconfont icon-cancel" />
                  ) : (
                    <i class="svg-icon iconfont icon-edit" />
                  )}
                </div>
              </div>
            )
          } else if (type === TdType.operation) {
            {
              /* 操作 */
            }
            return slot.operation && slot.operation(row)
          } else {
            return slot.default && slot.default(row)
          }
        }}
      </ElTableColumn>
    )}
  </>
)

const slot = useSlots()
</script>
<style lang="scss">
.arco-trigger-popup[data-index='0'] {
  .arco-dropdown {
    background-color: transparent;
    padding: 0;
    border: none;
  }
}
</style>
