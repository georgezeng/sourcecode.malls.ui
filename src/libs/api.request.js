// import HttpRequest from '@/libs/axios'
import axios from 'axios'
import config from '@/config'
import router from '@/router'
import { Message } from 'iview'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

// const ajax = new HttpRequest(baseUrl)
const ajax = axios.create({
  baseURL: baseUrl,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  withCredentials: true
})

ajax.interceptors.response.use(function (response) {
  if (response.data) {
    if (response.data.code !== 0) {
      alertError(response.data)
      return Promise.reject(response.data)
    }
  }
  return response.data.data || response.data.datas
}, function (ex) {
  handleError(ex)
  return Promise.reject(ex)
})

function handleError (ex) {
  let code = Number(ex && ex.response && ex.response.status)
  switch (code) {
    case 403:
    case 401:
      router.push({
        name: 'error_401'
      })
      return
    case 302:
      router.push({
        name: 'login'
      })
      return
  }
  alertError(ex.response && ex.response.data)
}

function alertError (error) {
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
