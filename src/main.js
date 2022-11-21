import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/';
import i18n from './locales';
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout';
import themePluginConfig from '../config/themePluginConfig';

import bootstrap from './core/bootstrap';

// 使用懒加载组件
import './core/lazy_use';

// 权限控制
import './permission';

// 全局过滤器
import './utils/filter';

// 全局样式
import '@/assets/less/global.less';

// 默认配置
import config from '@/config';

Vue.config.productionTip = false;

// use pro-layout components
Vue.component('pro-layout', ProLayout);
Vue.component('page-container', PageHeaderWrapper);
Vue.component('page-header-wrapper', PageHeaderWrapper);

window.umi_plugin_ant_themeVar = themePluginConfig.theme;

// 获得 api 请求的基础地址
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;

// 全局注册后端基础路径
Vue.prototype.$baseUrl = baseUrl;

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app');
