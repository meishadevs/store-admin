import axios from '@/utils/request';

// 获得菜单列表
export function getMenuList () {
  return axios.request({
    url: '/menu/list',
    method: 'get'
  });
}
