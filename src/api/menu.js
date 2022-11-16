import axios from '@/utils/request';

// 获得权限数据
export function getPermissionData () {
  return axios.request({
    url: '/menu/permissions_list',
    method: 'get'
  });
}
