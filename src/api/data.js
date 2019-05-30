import axios from '@/libs/api.request'

export const getTableData = () => {
  // return axios.request({
  //   url: 'get_table_data',
  //   method: 'get'
  // })
  return axios.get('/user/current/info')
}

export const getDragList = () => {
  // return axios.request({
  //   url: 'get_drag_list',
  //   method: 'get'
  // })
  return axios.get('/user/current/info')
}

export const errorReq = () => {
  // return axios.request({
  //   url: 'error_url',
  //   method: 'post'
  // })
  return axios.get('/user/current/info')
}

export const saveErrorLogger = info => {
  // return axios.request({
  //   url: 'save_error_logger',
  //   data: info,
  //   method: 'post'
  // })
  console.log(info)
  return axios.get('/user/current/info')
}

export const uploadImg = formData => {
  // return axios.request({
  //   url: 'image/upload',
  //   data: formData
  // })
  return axios.get('/user/current/info')
}

export const getOrgData = () => {
  // return axios.request({
  //   url: 'get_org_data',
  //   method: 'get'
  // })
  return axios.get('/user/current/info')
}

export const getTreeSelectData = () => {
  // return axios.request({
  //   url: 'get_tree_select_data',
  //   method: 'get'
  // })
  return axios.get('/user/current/info')
}
