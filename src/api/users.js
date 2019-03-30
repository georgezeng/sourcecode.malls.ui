import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/user/list', queryInfo)
  },
  delete: (ids) => {
    return axios.post('/user/delete', { ids })
  },
  load: (id) => {
    return axios.get('/user/one/params/' + id)
  },
  save: (obj) => {
    return axios.post('/user/save', obj)
  }
}
