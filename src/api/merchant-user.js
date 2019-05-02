import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/merchant/user/list', queryInfo)
  },
  updateStatus: (ids, status) => {
    return axios.post('/merchant/user/updateStatus/params/' + status, {ids})
  }
}
