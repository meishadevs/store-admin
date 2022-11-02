import axios from '@/utils/request'

// 登录
export function login (param) {
  return axios.request({
    url: 'user/login',
    method: 'post',
    data: param
  })
}

// 获得用户信息
export function getUserInfo () {
  return axios.request({
    url: 'user/logout',
    method: 'get'
  })
}

// 退出登录
export function logout () {
  return axios.request({
    url: '',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
