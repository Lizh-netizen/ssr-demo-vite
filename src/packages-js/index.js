// 组件注册
import CustomTable from './custom-table/custom-table.vue'
import CustomTableItem from './custom-table-item/custom-table-item.vue'
import DatePicker from './date-picker/date-picker.vue'
import FilterSearch from './filter-search/filter-search.vue'
import SvgIcon from './svg-icon/svg-icon.vue'
import TaskCard from './task-card/task-card.vue'
import TaskCardItem from './task-card-item/task-card-item.vue'
import ToothBitmap from './tooth-bitmap/tooth-bitmap.vue'
export default {
  install(app) {
    app.component('CustomTable', CustomTable)
    app.component('CustomTableItem', CustomTableItem)
    app.component('DatePicker', DatePicker)
    app.component('FilterSearch', FilterSearch)
    app.component('SvgIcon', SvgIcon)
    app.component('TaskCard', TaskCard)
    app.component('TaskCardItem', TaskCardItem)
    app.component('ToothBitmap', ToothBitmap)
  }
}
