<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="角色名称">
                <a-input
                  allowClear
                  v-model="listQuery.roleName"
                  placeholder="请输入角色名称"
                  @change="handleChangeRoleName"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button style="margin-left: 8px" @click="handleClear">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div>

      <a-table
        :loading="tableLoading"
        :pagination="false"
        :columns="tablecolumn"
        :data-source="list"
        :rowKey="(record) => record.id"
        bordered
      >
        <template slot="action" slot-scope="row">
          <a
            class="oprate-btn"
            @click="handleEdit(row.id)"
            href="javascript:;">
            编辑
          </a>
          <a
            class="oprate-btn"
            @click="handlePermission(row)"
            href="javascript:;">
            操作权限
          </a>
          <a
            class="oprate-btn btn-del"
            @click="handleDelete(row)"
            href="javascript:;">
            删除
          </a>
        </template>
      </a-table>
      <div class="page-wrapper">
        <a-pagination
          v-if="total > 0"
          show-size-changer
          v-model="listQuery.pageNumber"
          :total="total"
          :page-size.sync="listQuery.pageSize"
          @change="getList"
          @showSizeChange="handlePageSizeChange"
        />
      </div>
      <role-form
        v-if="roleFormVisible"
        :roleId="roleId"
        @refresh-data="refreshRoleData"
        @close-dialog="closeRoleDialog"
      />
      <role-permission
        v-if="rolePermissionVisible"
        :roleId="roleId"
        :roleName="roleName"
        @refresh-data="refreshRoleData"
        @close-dialog="closeRoleDialog"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import RoleForm from './RoleForm';
import RolePermission from './RolePermission';
import { getRoleList, deleteRoleInfo } from '@/api/role';

export default {
  name: 'Role',

  components: {
    RoleForm,
    RolePermission
  },

  data () {
    return {
      roleFormVisible: false,
      rolePermissionVisible: false,
      tableLoading: false,

      // 角色 id
      roleId: 0,

      // 角色名称
      roleName: '',

      // 数据条数
      total: 0,

      // 列表数据
      list: [],

      tablecolumn: [
        {
          title: '序号',
          key: 'index',
          dataIndex: 'index',
          width: 80,
          align: 'center',
          customRender: (text, record, index) => {
            return index + (this.listQuery.pageNumber - 1) * this.listQuery.pageSize + 1;
          }
        },
        {
          title: '角色名',
          key: 'roleName',
          dataIndex: 'roleName',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '200px'
              }
            };
          }
        },
        {
          title: '创建人',
          key: 'createBy',
          dataIndex: 'createBy',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '200px'
              }
            };
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          dataIndex: 'createTime',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '200px'
              }
            };
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 240,
          fixed: 'right',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],

      // 查询条件
      listQuery: {
        roleName: '',
        pageNumber: 1,
        pageSize: 10
      }
    };
  },

  created () {
    this.getList();
  },

  methods: {
    getList () {
      this.tableLoading = true;
      getRoleList(this.listQuery)
        .then((res) => {
          this.list = res.data.list;
          this.total = res.data.count;
          this.tableLoading = false;
        })
        .catch((error) => {
          this.tableLoading = false;
          this.$message.error(error.msg);
        });
    },

    handlePageSizeChange (current, pageSize) {
      this.listQuery.pageNumber = 1;
      this.listQuery.pageSize = pageSize;
      this.getList();
    },

    handleSearch () {
      this.listQuery.pageNumber = 1;
      this.getList();
    },

    handleChangeRoleName () {
      if (!this.listQuery.roleName) {
        this.handleSearch();
      }
    },

    handleClear () {
      this.listQuery.roleName = '';
      this.listQuery.pageNumber = 1;
      this.getList();
    },

    // 新增角色信息
    handleAdd () {
      this.roleId = 0;
      this.roleFormVisible = true;
    },

    // 编辑角色信息
    handleEdit (id) {
      this.roleId = id;
      this.roleFormVisible = true;
    },

    // 操作权限
    handlePermission ({ id, roleName }) {
      this.roleId = id;
      this.roleName = roleName;
      this.rolePermissionVisible = true;
    },

    // 删除
    handleDelete ({ id, roleName }) {
      this.$confirm({
        title: '提示',
        content: `确定要删除角色名称为 “${roleName}” 的角色信息吗？`,
        onOk: () => {
          deleteRoleInfo(id)
            .then((res) => {
              this.$message.success(res.msg);
              this.getList();
            })
            .catch((error) => {
              this.$message.error(error.msg);
            });
        }
      });
    },

    refreshRoleData () {
      this.roleFormVisible = false;
      this.rolePermissionVisible = false;
      this.handleSearch();
    },

    // 关闭新增、编辑角色信息对话框后的回调
    closeRoleDialog () {
      this.roleFormVisible = false;
      this.rolePermissionVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
