import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/role/list', queryInfo)
  },
  delete: (ids) => {
    return axios.post('/role/delete', { ids })
  },
  load: (id) => {
    return axios.get('/role/one/params/' + id)
  },
  save: (obj) => {
    return axios.post('/role/save', obj)
  }
}
