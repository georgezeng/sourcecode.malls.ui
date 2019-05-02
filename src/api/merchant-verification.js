import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/merchant/verification/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/merchant/verification/load/params/' + id)
  },
  save: (obj) => {
    return axios.post('/merchant/verification/save', obj)
  }
}
