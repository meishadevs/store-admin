import { UserLayout, BasicLayout } from '@/layouts'

// 需要权限才能访问的路由
export const asyncRouter = [
]

// 基础路由
export const baseRouter = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        meta: {
          title: '登录'
        },
        component: () => import(/* webpackChunkName: "user" */ '@/views/login')
      }
    ]
  },
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard'),
        meta: {
          title: '主页',
          keepAlive: false
        }
      }
    ]
  },
  {
    path: '*',
    hidden: true,
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
