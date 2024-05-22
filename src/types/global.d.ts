/**
 * 全局类型提示
 */
import type { TdType } from '@/enums'
import type { TableData } from '@arco-design/web-vue'
import type { SelectOptionData, SelectOptionGroup } from '@arco-design/web-vue'

// 组件类型
export type ComponentType =
  | 'text'
  | 'icon'
  | 'state'
  | 'editState'
  | 'itemState'
  | 'rightIcon'
  | 'leftIcon'
  | 'tag'
  | 'operation'
  | 'notes'

// icon类型
export type IconType = 'uncheck' | 'success' | 'failed' | 'halfComplete'

// 筛选控件类型
export type FilterType = 'date' | 'select' | 'search' | 'radio' | 'checkbox'

// 颜色类型
export type ColorTypeTS = 'Alarm' | 'Warning' | 'Success' | 'Neutral' | 'Disabled' | 'Noble'

// 表格配置项
export type TableColumnData = {
  prop?: string
  title: string
  width?: string
  height?: string | number
  fixed?: boolean | string
  sortable?: boolean | string
  type?: ComponentType
  textAlign?: 'center' | 'end' | 'left'
  iconOption?: {
    name: IconType | string
    secondName?: IconType | string
    prop?: string
    iconSize?: string
  }
  leftTagOption?: { text: string; color?: ColorTypeTS; prop: string }
  rightTagOption?: { text: string; color?: ColorTypeTS; prop: string }
  stateOption?: { name: string; prop: string; color: ColorTypeTS; value: number | string }[]
  editStateType?: 'solid' | 'none'
  editStateEventName?: string
  stateIcon?: string
  slotName?: string
  note?: string
  noteList?: {
    time: string
    name: string
    content: string
  }[]
}

// 筛选配置项目
export type FilterList = {
  name?: string
  type: FilterType
  dateType?: 'date' | 'range'
  defaultDate?: any
  prop: string
  options?: (string | number | boolean | SelectOptionData | SelectOptionGroup)[]
  multiple?: boolean
  allowSearch?: boolean
  selectType?: 'status' | 'switch' | 'text'
  showBtn?: boolean
  radioOptions?: { value: string | number; label: string; disabled?: boolean }[]
  checkboxOptions?: { value: string | number; label: string; disabled?: boolean }[]
}[]
