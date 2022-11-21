import { UserLayout, BasicLayout } from '@/layouts';
import { bxAnaalyse } from '@/core/icons';

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
};

// 需要权限才能访问的路由
export const asyncRouter = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页',
      permission: ['home']
    },
    redirect: '/dashboard/workplace',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: {
          title: '仪表盘',
          keepAlive: true,
          icon: bxAnaalyse,
          permission: ['dashboard']
        },
        children: [
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: () => import('@/views/dashboard'),
            meta: {
              title: '工作台',
              keepAlive: false,
              permission: ['workplace']
            }
          }
        ]
      },
      {
        path: '/system',
        name: 'system',
        redirect: '/system/user',
        component: RouteView,
        meta: {
          title: '系统设置',
          icon: 'table',
          permission: ['system']
        },
        children: [
          {
            path: '/system/user',
            name: 'user',
            hideChildrenInMenu: true,
            meta: {
              title: '用户管理',
              keepAlive: true,
              permission: ['user']
            },
            component: () => import('@/views/system/user')
          },
          {
            path: 'role',
            name: 'role',
            hideChildrenInMenu: true,
            meta: {
              title: '角色管理',
              keepAlive: true,
              permission: ['role']
            },
            component: () => import('@/views/system/role')
          },
          {
            path: 'menu',
            name: 'menu',
            hideChildrenInMenu: true,
            meta: {
              title: '菜单管理',
              keepAlive: true,
              permission: ['menu']
            },
            component: () => import('@/views/system/menu')
          },
          {
            path: 'province',
            name: 'province',
            hideChildrenInMenu: true,
            meta: {
              title: '省份管理',
              keepAlive: true,
              permission: ['province']
            },
            component: () => import('@/views/system/province')
          },
          {
            path: 'city',
            name: 'city',
            hideChildrenInMenu: true,
            meta: {
              title: '市管理',
              keepAlive: true,
              permission: ['city']
            },
            component: () => import('@/views/system/city')
          },
          {
            path: 'district',
            name: 'district',
            hideChildrenInMenu: true,
            meta: {
              title: '区管理',
              keepAlive: true,
              permission: ['district']
            },
            component: () => import('@/views/system/district')
          }
        ]
      }
    ]
  }
];

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
    path: '*',
    hidden: true,
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
];
