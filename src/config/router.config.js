import { UserLayout, BasicLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
]

/**
 * 基础路由
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login')
      }
    ]
  },
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '仪表盘'
    },
    redirect: '/dashboard/workplace',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: {
          title: '工作台',
          keepAlive: true,
          icon: bxAnaalyse,
          permission: ['dashboard']
        },
        children: [
          {
            path: '/dashboard/workplace/:pageNo([1-9]\\d*)?',
            name: 'Workplace',
            component: () => import('@/views/dashboard'),
            meta: {
              title: '工作台',
              keepAlive: false,
              permission: ['dashboard']
            }
          }
        ]
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
