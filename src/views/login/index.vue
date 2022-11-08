<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="请输入用户名"
          v-decorator="[
            'userName',
            {
              rules: [{ required: true, message: '用户名不能为空' }],
              validateTrigger: 'change',
            },
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input-password
          size="large"
          placeholder="请输入密码"
          v-decorator="['password', { rules: [{ required: true, message: '密码不能为空' }], validateTrigger: 'blur' }]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input-password>
      </a-form-item>
      <a-form-item style="margin-top: 24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="loading"
          :disabled="loading"
        >登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'

export default {
  name: 'Login',

  data () {
    return {
      form: this.$form.createForm(this),

      // 是否显示 loading 效果
      loading: false
    }
  },

  methods: {
    ...mapActions(['Login']),

    handleSubmit (e) {
      // 阻止事件的默认行为
      e.preventDefault()

      const {
        form: { validateFields },
        Login
      } = this

      this.loading = true

      validateFields(['userName', 'password'], { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          delete loginParams.userName
          loginParams.userName = values.userName
          loginParams.password = values.password
          Login(loginParams)
            .then((res) => {
              this.$message.success(res.msg)
              this.$router.push({
                path: '/'
              })
              // 延迟 1 秒显示欢迎信息
              setTimeout(() => {
                this.$notification.success({
                  message: '欢迎',
                  description: `${timeFix()}，欢迎回来`
                })
              }, 1000)
            })
            .catch(error => {
              this.loading = false
              this.$message.error(error.msg)
            })
        } else {
          setTimeout(() => {
            this.loading = false
          }, 600)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
</style>
