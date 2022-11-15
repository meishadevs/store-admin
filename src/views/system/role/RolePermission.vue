<template>
  <div>
    <a-drawer
      :title="`操作权限：${roleName}`"
      :width="450"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="closeDrawer"
    >
      <div class="drawer-content">
        <a-tree
          v-if="permissionData.length"
          v-model="checkedKeys"
          checkable
          :treeData="permissionData"
          :defaultExpandAll="true"
          :selected-keys="selectedKeys"
          :replaceFields="{
            'key':'id'
          }"
          @select="handleSelect"
          @check="handleCheck"
        />
      </div>
      <div class="drawer-footer">
        <a-button :style="{ marginRight: '8px' }" @click="closeDrawer">取消</a-button>
        <a-button type="primary" @click="handleSubmit">确定</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { getPermissionData } from '@/api/role';

export default {
  name: 'RolePermission',

  props: {
    // 角色id
    roleId: {
      type: Number,
      default: 0
    },

    // 角色名称
    roleName: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      visible: false,
      loading: false,
      checkedKeys: [],
      selectedKeys: [],
      permissionData: []
    };
  },

  created () {
    this.getPermissionData();
    this.initData();
  },

  methods: {
    getPermissionData () {
      this.loading = true;
      getPermissionData()
        .then((res) => {
          this.permissionData = res.data.list;
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },

    initData () {
      this.visible = true;
    },

    handleSelect (selectedKeys) {
      console.log('select');
      console.log('selectedKeys:', selectedKeys);
      this.selectedKeys = selectedKeys;
    },

    handleCheck (checkedKeys) {
      console.log('check');
      console.log('checkedKeys:', checkedKeys);
    },

    handleSubmit () {
    },

    closeDrawer () {
      this.visible = false;
      this.$emit('close-dialog');
    }
  }
};
</script>

<style lang="less" scoped>
.drawer-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
  z-index: 1;
}
</style>
