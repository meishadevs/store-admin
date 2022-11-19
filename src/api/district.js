import axios from '@/utils/request';

// 获得所有区列表数据
export function getAllDistrictList () {
  return axios.request({
    url: '/district/all',
    method: 'get'
  });
}

// 获得区列表
export function getDistrictList (query) {
  return axios.request({
    url: '/district/list',
    method: 'get',
    params: query
  });
}

// 获得区详情
export function getDistrictDetail (districtId) {
  return axios.request({
    url: '/district/detail',
    method: 'get',
    params: {
      districtId
    }
  });
}

// 保存区信息
export function saveDistrictData (formData) {
  return axios.request({
    url: '/district/save',
    method: 'post',
    data: formData
  });
}

// 删除区信息
export function deleteDistrictInfo (districtId) {
  return axios.request({
    url: '/district/delete',
    method: 'post',
    data: {
      districtId
    }
  });
}
