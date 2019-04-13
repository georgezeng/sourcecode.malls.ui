import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/merchant/list', queryInfo)
  },
  disable: (ids) => {
    return axios.post('/merchant/disable', { ids })
  },
  enable: (ids) => {
    return axios.post('/merchant/enable', { ids })
  },
  load: (id) => {
    return axios.get('/merchant/one/params/' + id)
  },
  save: (obj) => {
    return axios.post('/merchant/save', obj)
  }
}
