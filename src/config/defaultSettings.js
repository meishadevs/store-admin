/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * contentWidth - 内容区布局： 流式 |  固定
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 */

export default {
  // 导航栏的主题
  navTheme: 'dark',

  // 默认主题色
  primaryColor: '#1890ff',

  // 整体布局方式
  layout: 'sidemenu',

  // 内容区布局方式
  contentWidth: 'Fluid',

  // 是否固定头部
  fixedHeader: false,

  // 是否固定左侧菜单
  fixSiderbar: false,

  // 是否开启色盲模式
  colorWeak: false,

  menu: {
    locale: true
  },

  // 标题
  title: 'Store Admin',

  pwa: false,

  iconfontUrl: '',

  production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true',

  // token 在 Cookie 中存储的天数，默认 1 天
  cookieExpires: 1,

   // api 请求基础路径
   baseUrl: {
     dev: 'http://localhost:8002',
     pro: 'http://localhost:8002'
   }
}
