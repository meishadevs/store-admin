import axios from '@/utils/request';

// 获得所有角色列表数据
export function getAllRoleList () {
  return axios.request({
    url: '/role/all',
    method: 'get'
  });
}

// 获得角色列表
export function getRoleList (query) {
  return axios.request({
    url: '/role/list',
    method: 'get',
    params: query
  });
}

// 获得角色详情
export function getRoleDetail (roleId) {
  return axios.request({
    url: '/role/detail',
    method: 'get',
    params: {
      roleId
    }
  });
}

// 保存角色信息
export function saveRoleData (formData) {
  return axios.request({
    url: '/role/save',
    method: 'post',
    data: formData
  });
}

// 删除角色信息
export function deleteRoleInfo (roleId) {
  return axios.request({
    url: '/role/delete',
    method: 'post',
    data: {
      roleId
    }
  });
}

// 设置角色权限
export function setRolePermissions (formData) {
  return axios.request({
    url: '/role/set_permissions',
    method: 'post',
    data: formData
  });
}
