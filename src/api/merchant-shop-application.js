import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/merchant/shop/application/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/merchant/shop/application/load/params/' + id)
  },
  save: (obj) => {
    return axios.post('/merchant/shop/application/save', obj)
  },
  deploy: (obj) => {
    return axios.post('/merchant/shop/application/deploy', obj)
  }
}
