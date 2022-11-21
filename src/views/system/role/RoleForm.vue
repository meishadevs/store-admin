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
      ref="roleForm"
      :model="roleDetail"
      :rules="rules"
      v-bind="layout"
    >
      <a-form-model-item
        label="角色名称"
        prop="roleName"
      >
        <a-input v-model="roleDetail.roleName" :maxLength="20" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { getRoleDetail, saveRoleData } from '@/api/role';

export default {
  name: 'RoleForm',

  props: {
    // 角色 id
    roleId: {
      type: Number,
      required: false,
      default: 0
    }
  },

  data () {
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

      // 验证规则
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },

      // 角色详情
      roleDetail: {
        id: 0,

        // 角色名称
        roleName: '',

        // 菜单权限
        menus: []
      }
    };
  },

  computed: {
    dialogTitle () {
      return this.roleId ? '编辑角色' : '新增角色';
    }
  },

  created () {
    this.visible = true;

    if (this.roleId) {
      this.getRoleDetail();
    }
  },

  methods: {
    getRoleDetail () {
      getRoleDetail(this.roleId).then(res => {
        this.roleDetail = {
          ...this.roleDetail,
          ...res.data
        };
      }).catch(error => {
        this.$message.error(error.msg);
      });
    },

    handleSubmit () {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          this.loading = true;
          saveRoleData(this.roleDetail).then(res => {
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
