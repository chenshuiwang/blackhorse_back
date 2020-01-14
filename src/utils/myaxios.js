import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:3000'
axios.interceptors.request.use(function (config) {
    //console.log('经过了没有？')
    // 在发送请求之前做些什么
    let token = localStorage.getItem('login_token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })
export default axios