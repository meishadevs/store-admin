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
