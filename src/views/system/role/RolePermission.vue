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
          checkable
          v-model="selectedNodes"
          :tree-data="permissionData"
          :expanded-keys="expandedNodes"
          :replace-fields="replaceFields"
        />
      </div>
      <div class="drawer-footer">
        <a-dropdown>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="merge">合并所有</a-menu-item>
            <a-menu-item key="expand">展开所有</a-menu-item>
          </a-menu>
          <a-button class="mr-10">树操作<a-icon type="down" /></a-button>
        </a-dropdown>
        <a-button class="mr-10" @click="closeDrawer">取消</a-button>
        <a-button type="primary" @click="handleSubmit">确定</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { getPermissionData, getRoleDetail } from '@/api/role';

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

      replaceFields: {
        key: 'id'
      },

      // 权限数据
      permissionData: [],

      // 父节点
      parentNodes: [],

      // 当前选中的节点
      selectedNodes: [],

      // 展开的节点
      expandedNodes: [],

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

  created () {
    this.getPermissionData();
    this.initData();
  },

  methods: {
    initData () {
      this.visible = true;
      this.getRoleDetail();
    },

    // 获得权限数据
    getPermissionData () {
      this.loading = true;
      getPermissionData()
        .then((res) => {
          this.permissionData = res.data.list;
          this.traverseTree(this.permissionData);
          this.loading = false;
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },

    // 获得角色详情
    getRoleDetail () {
      getRoleDetail(this.roleId)
        .then((res) => {
          this.roleDetail = {
            ...this.roleDetail,
            ...res.data
          };

          this.selectedNodes = [
            ...this.roleDetail.menus
          ];
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },

    // 遍历树
    traverseTree (treeList) {
      treeList.map((item) => {
        // 如果节点下有子节点
        if (item.children && item.children.length) {
          this.parentNodes.push(item.id);
          this.expandedNodes.push(item.id);
          this.traverseTree(item.children);
        }
      });
    },

    // 展开/收起父节点
    handleMenuClick ({ key }) {
      if (key === 'expand') {
        this.expandedNodes = [...this.parentNodes];
      } else {
        this.expandedNodes = [];
      }
    },

    handleSubmit () {},

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
