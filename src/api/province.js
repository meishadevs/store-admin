import axios from '@/utils/request';

// 获得所有省份列表数据
export function getAllProvinceList () {
  return axios.request({
    url: '/province/all',
    method: 'get'
  });
}

// 获得省份列表
export function getProvinceList (query) {
  return axios.request({
    url: '/province/list',
    method: 'get',
    params: query
  });
}

// 获得省份详情
export function getProvinceDetail (provinceId) {
  return axios.request({
    url: '/province/detail',
    method: 'get',
    params: {
      provinceId
    }
  });
}

// 保存省份信息
export function saveProvinceData (formData) {
  return axios.request({
    url: '/province/save',
    method: 'post',
    data: formData
  });
}

// 删除省份信息
export function deleteProvinceInfo (provinceId) {
  return axios.request({
    url: '/province/delete',
    method: 'post',
    data: {
      provinceId
    }
  });
}
