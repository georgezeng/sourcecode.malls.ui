import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/authority/list', queryInfo)
  },
  delete: (ids) => {
    return axios.post('/authority/delete', { ids })
  },
  load: (id) => {
    return axios.get('/authority/one/p/' + id)
  },
  save: (obj) => {
    return axios.post('/authority/save', obj)
  }
}
