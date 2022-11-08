import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// 默认路由模式为静态路由 (router.config.js)
import permission from './modules/static-router'

import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },

  state: {},
  mutations: {},
  actions: {},
  getters
})
