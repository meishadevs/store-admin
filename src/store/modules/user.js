import storage from 'store'
import expirePlugin from 'store/plugins/expire'
import { login, getUserInfo, logout } from '@/api/user'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    // 设置 token
    SET_TOKEN: (state, token) => {
      state.token = token
    },

    // 设置姓名
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },

    // 设置头像
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },

    // 设置角色
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },

    // 设置用户信息
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          const token = res.data.accessToken
          storage.set(ACCESS_TOKEN, token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获得当前登录的用户信息
    getUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        // 请求后端获取用户信息
        getUserInfo().then(res => {
          const { data } = res

          // 如果给用户分配了角色，并且角色分配了权限
          if (data.role && data.role.permissions.length > 0) {
            const role = { ...data.role }
            role.permissions = data.role.permissions.map(permission => {
              const per = {
                ...permission,
                actionList: (permission.actionEntitySet || {}).map(item => item.action)
               }
              return per
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            // 覆盖响应体的 role, 供下游使用
            data.role = role

            commit('SET_ROLES', role)
            commit('SET_INFO', data)
            commit('SET_NAME', { name: data.useName, welcome: welcome() })
            commit('SET_AVATAR', data.avatar)
            // 下游
            resolve(data)
          } else {
            reject(new Error('getUserInfo: roles must be a non-null array !'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          resolve()
        }).catch((err) => {
          console.log('logout fail:', err)
          // resolve()
        }).finally(() => {
        })
      })
    }

  }
}

export default user
