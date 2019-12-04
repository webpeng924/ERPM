import axios from 'axios'
import { Toast } from '@nutui/nutui'

axios.defaults.baseURL = '192.168.0.199:8066'

let loadinginstace = null

axios.interceptors.request.use(
  config => {
    //加载中
    loadinginstace = Toast.loading()
    return config
  },
  error => {
    //关闭加载中
    loadinginstace.hide()
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  res => {
    //关闭加载中
    loadinginstace.hide()
    return res
  },
  error => {
    //关闭加载中
    loadinginstace.hide()
    return Promise.reject(error)
  }
)

export default axios
