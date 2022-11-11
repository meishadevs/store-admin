import axios from '@/utils/request'

// 登录
export function login (formData) {
  return axios.request({
    url: '/user/login',
    method: 'post',
    data: formData
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

// 保存用户数据
export function saveUserData (formData) {
  return axios.request({
    url: '/user/save',
    method: 'post',
    data: formData
  })
}
