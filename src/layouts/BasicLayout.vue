<template>
  <pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    :i18nRender="i18nRender"
    v-bind="settings"
  >
    <template v-slot:menuHeaderRender>
      <div>
        <img src="@/assets/logo.svg" />
        <h1>{{ title }}</h1>
      </div>
    </template>
    <template v-slot:rightContentRender>
      <right-content
        :top-menu="settings.layout === 'topmenu'"
        :is-mobile="isMobile"
        :theme="settings.theme"
      />
    </template>
    <!-- 自定义 Footer -->
    <template v-slot:footerRender>
      <global-footer />
    </template>
    <router-view />
  </pro-layout>
</template>

<script>
import { i18nRender } from '@/locales'
import { mapState } from 'vuex'
import { CONTENT_WIDTH_TYPE, SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'
import config from '@/config'
import GlobalFooter from '@/components/GlobalFooter'
import RightContent from '@/components/GlobalHeader/RightContent'

export default {
  name: 'BasicLayout',

  components: {
    GlobalFooter,
    RightContent
  },

  data () {
    return {
      // base
      menus: [],

      // 侧栏收起状态
      collapsed: false,

      // 标题
      title: config.title,

      settings: {
        // 布局类型
        layout: config.layout,

        // CONTENT_WIDTH_TYPE
        contentWidth: config.layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : config.contentWidth,

        // 主题
        theme: config.navTheme,

        // 主色调
        primaryColor: config.primaryColor,
        fixedHeader: config.fixedHeader,
        fixSiderbar: config.fixSiderbar,
        colorWeak: config.colorWeak,

        hideHintAlert: false,
        hideCopyButton: false
      },

      // 媒体查询
      query: {},

      // 是否手机模式
      isMobile: false
    }
  },

  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters
    })
  },

  created () {
    const routes = this.mainMenu.find(item => item.path === '/')
    this.menus = (routes && routes.children) || []

    // 处理侧栏收起状态
    this.$watch('collapsed', () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    })

    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
    })
  },

  mounted () {
    const userAgent = navigator.userAgent

    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },

  methods: {
    i18nRender,
    handleMediaQuery (val) {
      this.query = val

      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }

      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
      }
    },

    handleCollapse (val) {
      this.collapsed = val
    },

    handleSettingChange ({ type, value }) {
      console.log('type', type, value)
      type && (this.settings[type] = value)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value
          break
        case 'layout':
          if (value === 'sidemenu') {
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
          }
          break
      }
    }
  }
}
</script>

<style lang="less">
@import "./BasicLayout.less";
</style>
