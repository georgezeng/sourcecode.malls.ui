// import HttpRequest from '@/libs/axios'
import axios from 'axios'
import config from '@/config'
import router from '@/router'
import {Message} from 'iview'
import {
  setTagNavListInLocalstorage,
  setToken
} from '@/libs/util'

const LOGIN_PAGE_NAME = 'Login'

// const ajax = new HttpRequest(baseUrl)
const ajax = axios.create({
  baseURL: config.baseUrl,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  withCredentials: true
})

ajax.interceptors.response.use(function (response) {
  if (response.data.code == -1) {
    setTagNavListInLocalstorage([])
    setToken('')
    router.push({
      name: LOGIN_PAGE_NAME
    })
    return response.data
  } else if (response.data.code == 1) {
    alertError(response.data)
    return Promise.reject(response.data)
  }
  if (response.data.data || response.data.datas) {
    return response.data.data || response.data.datas
  } else {
    return response.data
  }
}, function (ex) {
  handleError(ex)
  return Promise.reject(ex)
})

function handleError(ex) {
  let code = Number(ex && ex.response && ex.response.status)
  switch (code) {
    case 403:
    case 401:
      router.push({
        name: 'error_401'
      })
      return
  }
  alertError(ex.response && ex.response.data)
}

function alertError(error) {
  let errors = null
  if (error && error.msgs) {
    errors = '[' + error.traceId + '] '
    if (error.msgs.length > 1) {
      errors += '<br/>'
    }
    for (let i in error.msgs) {
      errors += error.msgs[i] + '<br />'
    }
  }
  var message = errors || '服务请求失败,请稍后重试'
  Message.error({
    content: message,
    duration: 5,
    closable: true
  })
}

export default ajax
