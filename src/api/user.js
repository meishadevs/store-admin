import axios from '@/utils/request'

// 登录
export function login (param) {
  return axios.request({
    url: '/user/login',
    method: 'post',
    data: param
  })
}

// 获得用户信息
export function getUserInfo () {
  return axios.request({
    url: '/user/info',
    method: 'get'
  })
}

// 退出登录
export function logout () {
  return axios.request({
    url: '/user/logout',
    method: 'post'
  })
}

// 获得用户列表
export function getUserList (query) {
  return axios.request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}
