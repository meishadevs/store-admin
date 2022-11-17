import axios from '@/utils/request';

// 获得权限数据
export function getPermissionData () {
  return axios.request({
    url: '/menu/permissions_list',
    method: 'get'
  });
}

// 获得菜单列表
export function getMenuList (query) {
  return axios.request({
    url: '/menu/tree_list',
    method: 'get',
    params: query
  });
}

// 获得菜单详情
export function getMenuDetail (menuId) {
  return axios.request({
    url: '/menu/detail',
    method: 'get',
    params: {
      menuId
    }
  });
}

// 保存菜单信息
export function saveMenuData (formData) {
  return axios.request({
    url: '/menu/save',
    method: 'post',
    data: formData
  });
}

// 删除菜单信息
export function deleteMenuInfo (menuId) {
  return axios.request({
    url: '/menu/delete',
    method: 'post',
    data: {
      menuId
    }
  });
}
