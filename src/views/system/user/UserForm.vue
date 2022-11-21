<template>
  <a-modal
    :title="dialogTitle"
    :width="500"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="loading"
    okText="确定"
    cancelText="取消"
    @ok="handleSubmit"
    @cancel="handleCloseDialog"
  >
    <a-form-model
      ref="userForm"
      :model="userDetail"
      :rules="rules"
      v-bind="layout"
    >
      <a-form-model-item
        label="用户名"
        prop="userName"
      >
        <a-input v-model="userDetail.userName" :maxLength="30" />
      </a-form-model-item>
      <a-form-model-item
        label="所属角色"
        prop="roles"
      >
        <a-select
          mode="multiple"
          v-model="userDetail.roles"
          placeholder="请选择所属角色"
        >
          <a-select-option
            v-for="item in roleList"
            :key="item.id"
            :value="item.id"
          >
            {{ item.roleName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="邮箱"
        prop="email"
      >
        <a-input v-model="userDetail.email" :maxLength="30" />
      </a-form-model-item>
      <a-form-model-item
        label="用户状态"
        prop="status"
      >
        <a-select
          v-model="userDetail.status"
          placeholder="请选择用户状态"
        >
          <a-select-option :value="1">启用</a-select-option>
          <a-select-option :value="0">禁用</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { getAllRoleList } from '@/api/role';
import { getUserDetail, saveUserData } from '@/api/user';

export default {
  name: 'UserForm',

  props: {
    // 用户 id
    userId: {
      type: Number,
      required: false,
      default: 0
    }
  },

  data () {
    // 验证用户名
    const validateUserName = (rule, value, callback) => {
      if (!this.userDetail.userName) {
        callback(new Error('请填写用户名'));
      } else if (this.userDetail.userName.length < 3 || this.userDetail.userName.length > 15) {
         callback(new Error('长度应为3~15个字符'));
      } else if (!(/^[A-Za-z]/.test(this.userDetail.userName))) {
        callback(new Error('用户名必须以英文字母开头'));
      } else if (!(/^[a-zA-Z0-9_]*$/.test(this.userDetail.userName))) {
        callback(new Error('用户名须由字母数字下划线组成'));
      } else {
        callback();
      }
    };

    // 验证邮箱
    const validateEmail = (rule, value, callback) => {
      // 验证邮箱格式的正则表达式
      const emailReg = /^\w+([_\\.\\-]\w+)*@\w+([_\-\\.]\w+)*\.\w+([_\\.]\w+)*$/;

      if (this.userDetail.email && !emailReg.test(this.userDetail.email)) {
         callback(new Error('邮箱格式不正确'));
      } else {
        callback();
      }
    };

    return {
      visible: false,
      loading: false,

      // 表单布局
      layout: {
        labelCol: {
          span: 6
        },
        wrapperCol: {
          span: 18
        }
      },

      // 角色列表
      roleList: [],

      // 验证规则
      rules: {
        userName: [
          { required: true, validator: validateUserName, trigger: 'blur' }
        ],
        roles: [
          { required: true, type: 'array', message: '请选择所属角色', trigger: 'change' }
        ],
         email: [
          { required: false, validator: validateEmail, trigger: 'blur' }
        ]
      },

      // 用户详情
      userDetail: {
        id: 0,

        // 用户名
        userName: '',

        // 邮箱
        email: '',

        // 用户状态
        status: 1,

        // 所属角色
        roles: [],

        // 是否接受服务条款
        isAgree: 0
      }
    };
  },

  computed: {
    dialogTitle () {
      return this.userId ? '编辑用户' : '新增用户';
    }
  },

  created () {
    this.visible = true;
    this.getAllRoleList();

    if (this.userId) {
      this.getUserDetail();
    }
  },

  methods: {
    getAllRoleList () {
      getAllRoleList().then(res => {
        this.roleList = res.data.list;
      }).catch(error => {
        this.$message.error(error.msg);
      });
    },

    getUserDetail () {
      getUserDetail(this.userId).then(res => {
        this.userDetail = {
          ...this.userDetail,
          ...res.data
        };
      }).catch(error => {
        this.$message.error(error.msg);
      });
    },

    handleSubmit () {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.loading = true;
          saveUserData(this.userDetail).then(res => {
            this.loading = false;
            this.visible = false;
            this.$emit('refresh-data');
            this.$message.success(res.msg);
          }).catch(err => {
            this.loading = false;
            this.$message.error(err.msg);
          });
        } else {
          return false;
        }
      });
    },

    handleCloseDialog () {
      this.visible = false;
      this.$emit('close-dialog', this.visible);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
