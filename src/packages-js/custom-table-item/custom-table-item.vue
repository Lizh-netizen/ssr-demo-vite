<template>
  <renderTableColumn />
</template>

<script setup lang="jsx">
import { ref, useSlots } from 'vue'
import style from './index.module.scss'
import SvgIcon from '../svg-icon/svg-icon.vue'
import unNote from '@/assets/imgs/unNote.png'
import { ElTableColumn, ElTooltip, ElInput } from 'element-plus'
/**
 * slots
 * default type = operation 操作下的默认插槽
 * iconHover type = state状态下iconhover的显示内容
 */

/**
 * @prop 当前列的内容
 * @title 当前列的标题
 * @width 当前列宽 默认自适应
 * @height 行高
 * @fixed 只建议表头和表尾部使用，参考element属性
 * @sortable 开启排序
 * @type 当前行内展示的元素格式 string类型 可以以enum文件中的 Tdtype 为准
 * // tagOption
 * @text 标签文本内容
 * @color tag颜色 + 背景色
 * @prop tag的判断条件
 * // iconOption
 * @name svg的name
 * @prop icon的判断条件
 * @secondName 第二种情况的prop 根据prop的判断
 * @iconSize svg图的大小
 * // stateOption
 * @stateOption
 *   name 状态名
 *   prop 状态依据
 *   color 状态颜色 内外 颜色
 *   value 依据值=什么
 * @stateIcon 状态的icon 依据stateOption-prop转化布尔后的值
 * @slotName 插槽名字 仅适用于 state状态的时候点击icon的气泡框
 */
const {
  prop,
  title,
  width,
  fixed,
  sortable,
  type = 'text',
  iconOption,
  leftTagOption,
  rightTagOption,
  stateOption,
  stateIcon,
  editStateType,
  noteList
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
  'editStateType',
  'noteList'
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
  Noble: 'rgba(167, 126, 241, 1)'
}
const emit = defineEmits()

// 备注的每一列
const isEditList = ref([])
// 内容渲染
const noteVal = ref('')
const renderTableColumn = () => (
  <ElTableColumn prop={prop} label={title} width={width} fixed={fixed} sortable={sortable}>
    {({ row, $index }) => {
      isEditList.value.push({ isEdit: false })
      {
        /* 纯文本 */
      }
      if (type === TdType.text) {
        return row[prop] || '无'
      } else if (type === TdType.icon) {
        {
          /* 纯icon */
        }
        return (
          <>
            {!!iconOption?.prop ? (
              <>
                {/* 如果有多种情况 */}
                <SvgIcon
                  size={iconOption?.iconSize}
                  name={!!row[iconOption?.prop] ? iconOption?.name : iconOption?.secondName}
                />
              </>
            ) : (
              <>
                {/* 如果没有多种情况 */}
                <SvgIcon size={iconOption?.iconSize} name={iconOption?.name} />
              </>
            )}
          </>
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
            {row[prop] || '无'}
          </div>
        )
      } else if (type === TdType.rightIcon) {
        {
          /* 右边带有icon */
        }
        return (
          <div class={style.rightIcon}>
            {row[prop] || '无'}
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
            {row[prop] || '无'}
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
                          <span class="circle" style={{ background: ColorTypeEnum[item.color] }} />
                        </div>
                        <div class="name">{item.name}</div>
                        <ElTooltip
                          effect="light"
                          trigger="click"
                          v-slots={{
                            default: () => stateIcon && <SvgIcon name={stateIcon} />,
                            content: () => slot['icon-hover'] && slot['icon-hover'](row)
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
                      <arco-dropdown
                        position="bl"
                        tabIndex={0}
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
                                <arco-doption onClick={() => emit('editState', { row, it })}>
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
                                          background: ColorTypeEnum[it.color].replace('1)', '.1')
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
                                  {row[it.prop] == it.value && <SvgIcon name="check" />}
                                </arco-doption>
                              </div>
                            ))
                          }
                        }}
                      >
                        <arco-button type="text">
                          <div class="content" onClick={() => (isspread.value = !isspread.value)}>
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
                          <icon-down />
                        </arco-button>
                      </arco-dropdown>
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
              <arco-dropdown
                position="bl"
                popup-visible
                tabIndex={0}
                v-slots={{
                  content: () => (
                    <div class={style.suffix}>
                      <div class="total">按“Enter”保存备注内容</div>
                      {noteList?.length ? (
                        <>
                          {noteList?.map((item, index) => (
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
                  }}
                />
              </arco-dropdown>
            )}
            <div
              class="iconBtn"
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
                <SvgIcon name="cancel" />
              ) : (
                <SvgIcon name="edit" />
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
)

const slot = useSlots()
</script>
<style lang="scss">
.arco-trigger-popup[tabindex='0'] {
  .arco-dropdown {
    background-color: transparent;
    padding: 0;
    border: none;
  }
}
</style>
