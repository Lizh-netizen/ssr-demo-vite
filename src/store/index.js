import { defineStore } from 'pinia'
import axios from 'axios'
export const useStore = defineStore('user', {
  state() {
    return {
      patientInfo: {
        id: '',
        content: '',
        key: ''
      }
    }
  },
  actions: {
    async getList() {
      return axios({
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then((res) => {
        this.patientInfo = res.data
      })
    }
  }
})
