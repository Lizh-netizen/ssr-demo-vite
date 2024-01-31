import { Post } from '../utils/request'
// 改变样式
const emptyRadio = (optionId: any, title: any) => {
  if (title.type == 1) {
    // type 1 单选
    const found = title.orthOptionsList.find((option: any) => option.id == optionId)
    found.choosen = false

    
  }
}

export default emptyRadio