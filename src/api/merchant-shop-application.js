import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/merchant/shop/application/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/merchant/shop/application/one/params/' + id)
  },
  save: (obj) => {
    return axios.post('/merchant/shop/application/save', obj)
  },
  deployed: (id) => {
    return axios.get('/merchant/shop/application/deployed/params/' + id)
  }
}
