import axios from '@/utils/request';

// 获得轮播图列表
export function getBannerList (query) {
  return axios.request({
    url: '/banner/list',
    method: 'get',
    params: query
  });
}

// 获得轮播图详情
export function getBannerDetail (bannerId) {
  return axios.request({
    url: '/banner/detail',
    method: 'get',
    params: {
      bannerId
    }
  });
}

// 保存轮播图数据
export function saveBannerData (formData) {
  return axios.request({
    url: '/banner/save',
    method: 'post',
    data: formData
  });
}

// 发布/撤销轮播图
export function changePublishStatus (bannerId) {
  return axios.request({
    url: '/banner/publish',
    method: 'post',
    data: {
      bannerId
    }
  });
}

// 置顶/取消置顶轮播图
export function changeTopStatus (bannerId) {
  return axios.request({
    url: '/banner/top',
    method: 'post',
    data: {
      bannerId
    }
  });
}

// 置顶/取消置顶轮播图
export function changeBannerTopStatus (bannerId) {
  return axios.request({
    url: '/banner/top',
    method: 'post',
    data: {
      bannerId
    }
  });
}

// 删除轮播图
export function deleteBanner (bannerId) {
  return axios.request({
    url: '/banner/delete',
    method: 'post',
    data: {
      bannerId
    }
  });
}
