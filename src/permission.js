import router, { resetRouter } from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress'
import '@/components/NProgress/nprogress.less'
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'

NProgress.configure({ showSpinner: false })

// 不需要验证 token 就能访问的路由
const allowList = ['login', 'register', 'registerResult']

// 登录页的路由
const loginRoutePath = '/user/login'

// 工作台的路由
const defaultRoutePath = '/dashboard/workplace'

router.beforeEach((to, from, next) => {
  NProgress.start()

  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)

  // 获得当前登录的 token
  const token = storage.get(ACCESS_TOKEN)

  // 如果有 token
  if (token) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // 检测当前登录用户的所属角色是否为空
      if (store.getters.roles.length === 0) {
        // 获得当前登录的用户信息
        store.dispatch('getUserInfo')
          .then(res => {
            console.log('res', res)
            // 根据用户权限信息生成可访问的路由表
            store.dispatch('GenerateRoutes', { token, ...res }).then(() => {
              // 重置路由 防止退出重新登录或者 token 过期后页面未刷新，导致的路由重复添加
              resetRouter()

              // 动态添加可访问路由表
              store.getters.addRouters.forEach(r => {
                router.addRoute(r)
              })

              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('Logout').then(() => {
              next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }

  // 如果没有 token
  } else {
    // 如果是不需要登录的路由
    if (allowList.includes(to.name)) {
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
