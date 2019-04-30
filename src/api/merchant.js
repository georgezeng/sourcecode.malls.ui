import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/merchant/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/merchant/one/params/' + id)
  },
  save: (obj) => {
    return axios.post('/merchant/save', obj)
  },
  updateStatus: (ids, status) => {
    return axios.post('/merchant/updateStatus/params/' + status, {ids})
  }
}
