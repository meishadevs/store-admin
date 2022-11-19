import axios from '@/utils/request';

// 获得所有市列表数据
export function getAllCityList (provinceCode) {
  return axios.request({
    url: '/city/all',
    method: 'get',
    params: {
      provinceCode
    }
  });
}

// 获得市列表
export function getCityList (query) {
  return axios.request({
    url: '/city/list',
    method: 'get',
    params: query
  });
}

// 获得市详情
export function getCityDetail (cityId) {
  return axios.request({
    url: '/city/detail',
    method: 'get',
    params: {
      cityId
    }
  });
}

// 保存市信息
export function saveCityData (formData) {
  return axios.request({
    url: '/city/save',
    method: 'post',
    data: formData
  });
}

// 删除市信息
export function deleteCityInfo (cityId) {
  return axios.request({
    url: '/city/delete',
    method: 'post',
    data: {
      cityId
    }
  });
}
