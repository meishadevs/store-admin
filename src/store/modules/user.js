import storage from 'store';
import expirePlugin from 'store/plugins/expire';
import { login, getUserInfo, logout } from '@/api/user';
import { ACCESS_TOKEN } from '@/store/mutation-types';
import { welcome } from '@/utils/util';

storage.addPlugin(expirePlugin);

const user = {
  state: {
    token: '',

    // 用户名
    userName: '',
    welcome: '',

    // 头像
    avatar: '',

    // 角色
    roles: [],

    // 用户信息
    info: {},

    // 权限
    permissions: []
  },

  mutations: {
    // 设置 token
    SET_TOKEN: (state, token) => {
      state.token = token;
    },

    // 设置用户名
    SET_USER_NAME: (state, { userName, welcome }) => {
      state.userName = userName;
      state.welcome = welcome;
    },

    // 设置头像
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },

    // 设置角色
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },

    // 设置用户信息
    SET_INFO: (state, info) => {
      state.info = info;
    },

    // 设置权限
    SET_PERMISSION: (state, permissions) => {
      state.permissions = permissions;
    },

    // 清空用户数据
    CLEAR_USER_DATA: (state) => {
      state.token = '';
      state.userName = '';
      state.welcome = '';
      state.avatar = '';
      state.roles = [];
      state.info = {};
      state.permissions = [];
      storage.remove(ACCESS_TOKEN);
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          const token = res.data.accessToken;
          storage.set(ACCESS_TOKEN, token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
          commit('SET_TOKEN', token);
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获得当前登录的用户信息
    getUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        // 请求后端获取用户信息
        getUserInfo().then(res => {
          const { data } = res;

          commit('SET_ROLES', data.roleList);
          commit('SET_INFO', data);
          commit('SET_USER_NAME', { userName: data.userName, welcome: welcome() });
          commit('SET_AVATAR', data.avatar);
          commit('SET_PERMISSION', data.permissions);
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('CLEAR_USER_DATA');
          resolve();
        }).catch((err) => {
          console.log('logout fail:', err);
          // resolve()
        }).finally(() => {
        });
      });
    }
  }
};

export default user;
