<template>
  <a-modal
    :title="dialogTitle"
    :width="600"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="loading"
    @ok="handleSubmit"
    @cancel="handleCloseDialog"
  >
    <a-form-model
      ref="menuForm"
      :model="menuDetail"
      :rules="rules"
      v-bind="layout"
    >
      <a-form-model-item
        label="菜单类型"
        prop="type"
      >
        <a-radio-group v-model="menuDetail.type">
          <a-radio :value="0">菜单</a-radio>
          <a-radio :value="1">按钮</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item
        label="菜单名称"
        prop="title"
      >
        <a-input v-model="menuDetail.title" />
      </a-form-model-item>
      <a-form-model-item
        label="上级菜单"
        prop="parentId"
      >
        <a-tree-select
          v-model="menuDetail.parentId"
          style="width: 100%"
          :dropdown-style="{
            maxHeight: '400px',
            overflow: 'auto'
          }"
          placeholder="请选择上级菜单"
          tree-default-expand-all
          :replace-fields="replaceFields"
          :tree-data="permissionData"
        />
      </a-form-model-item>
      <a-form-model-item
        label="权限"
        prop="permissions"
      >
        <a-input v-model="menuDetail.permissions" />
      </a-form-model-item>
      <a-form-model-item
        label="路由地址"
        prop="url"
      >
        <a-input v-model="menuDetail.url" />
      </a-form-model-item>
      <a-form-model-item
        label="图标"
        prop="icon"
      >
        <a-input v-model="menuDetail.icon" />
      </a-form-model-item>
      <a-form-model-item
        label="排序"
        prop="sort"
      >
        <a-input-number v-model="menuDetail.sort" :min="1" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { getPermissionData, getMenuDetail, saveMenuData } from '@/api/menu';

export default {
  name: 'MenuForm',

  props: {
    // 菜单 id
    menuId: {
      type: Number,
      required: false,
      default: 0
    }
  },

  data () {
    return {
      visible: false,
      loading: false,

      // 权限数据
      permissionData: [],

      // 表单布局
      layout: {
        labelCol: {
          span: 6
        },
        wrapperCol: {
          span: 18
        }
      },

      replaceFields: {
        key: 'id',
        value: 'id'
      },

      // 验证规则
      rules: {
        title: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, type: 'number', message: '上级菜单不能为空', trigger: 'change' }
        ],
        permissions: [
          { required: true, message: '权限不能为空', trigger: 'blur' }
        ]
      },

      // 菜单详情
      menuDetail: {
        id: 0,

        // 菜单名称
        title: '',

        // 菜单类型
        type: 0,

        // 父级菜单 id
        parentId: 0,

        // 路由地址
        url: '',

        // 排序
        sort: 1,

        // 权限
        permissions: '',

        // 图标
        icon: ''
      }
    };
  },

  computed: {
    dialogTitle () {
      return this.menuId ? '编辑菜单' : '新增菜单';
    }
  },

  created () {
    this.visible = true;
    this.getPermissionData();

    if (this.menuId) {
      this.getMenuDetail();
    }
  },

  methods: {
    // 获得权限数据
    getPermissionData () {
      getPermissionData()
        .then((res) => {
          this.permissionData = res.data.list;
          this.permissionData.unshift({
            id: 0,
            title: '父级菜单',
            parentId: 0
          });
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },

    getMenuDetail () {
      getMenuDetail(this.menuId)
        .then((res) => {
          this.menuDetail = {
            ...this.menuDetail,
            ...res.data
          };
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },

    handleSubmit () {
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          saveMenuData(this.menuDetail)
            .then((res) => {
              this.loading = false;
              this.visible = false;
              this.$emit('refresh-data');
              this.$message.success(res.msg);
            })
            .catch((err) => {
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
