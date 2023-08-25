import { showToast } from 'vant'
import axios, { AxiosRequestHeaders } from 'axios'
// import { useRouter } from 'vue-router'
import status from './status'
import { BASE_URL } from '../config'

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10 * 1000,
  // withCredentials: true
})

// 添加请求拦截器
http.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  const token = localStorage.getItem('token')


  if (token) {
    config.headers = {
      ...config.headers,
      token: token
    } as unknown as AxiosRequestHeaders
  }

  return config
}, (err: any) => {
  console.log(err)
  // 对请求错误做些什么
  Promise.reject(err)
})

http.interceptors.response.use(res => {
  // 对响应数据做点什么
  if (res.status === 200 && res.data.code === 200) {
    return res.data
  } else {
    showToast(res.data.message)
    return Promise.reject(res.data)
  }
}, err => {
  console.log(err)
  if (err.response) {
    if (err.response.status === 401) {
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      location.href = '/login'
      showToast('登录已过期')
    } else {
      if (status.has(err.response.code)) {
        showToast(status.get(err.response.code))
      } else {
        showToast('其他异常')
      }
    }
  } else {
    showToast('服务器异常')
    return Promise.reject(err.response)
  }
})

export default http
