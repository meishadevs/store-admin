import axios from '@/utils/request'

// 获得所有角色列表数据
export function getAllRoleList () {
  return axios.request({
    url: '/role/all',
    method: 'get'
  })
}
