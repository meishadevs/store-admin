<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="所属角色">
                <a-select
                  allowClear
                  v-model="listQuery.roleId"
                  placeholder="请选择所属角色"
                  @change="handleSearch"
                >
                  <a-select-option
                    v-for="item in roleList"
                    :key="item.id"
                    :value="item.id">
                    {{ item.roleName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="用户状态">
                <a-select
                  allowClear
                  v-model="listQuery.status"
                  placeholder="请选择用户状态"
                  @change="handleSearch"
                >
                  <a-select-option :value="1">启用</a-select-option>
                  <a-select-option :value="0">禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="用户名">
                <a-input
                  allowClear
                  v-model="listQuery.userName"
                  placeholder="请输入用户名"
                  @change="handleChangeUserName"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
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
        <template slot="status" slot-scope="status">
          <a-tag :color="status ? 'green' : 'red'">
            {{ status ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <template slot="action" slot-scope="row">
          <a
            class="oprate-btn"
            @click="handlePublish(row.id)"
            href="javascript:;">
            {{ row.status ? '禁用' : '启用' }}
          </a>
          <a
            class="oprate-btn"
            @click="handleEdit(row.id)"
            href="javascript:;">
            编辑
          </a>
          <a
            class="oprate-btn"
            @click="handleResetPassword(row.id)"
            href="javascript:;">
            重置密码
          </a>
          <a
            :disabled="[userName, 'admin'].includes(row.userName)"
            class="oprate-btn btn-del"
            href="javascript:;"
            @click="handleDelete(row)"
          >
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
      <user-form
        v-if="userFormVisible"
        :userId="userId"
        @refresh-data="refreshUserData"
        @close-dialog="closeUserDialog"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import UserForm from './UserForm';
import { getAllRoleList } from '@/api/role';
import { getUserList, changeUserStatus, resetPassword, deleteUserInfo } from '@/api/user';

export default {
  name: 'User',

  components: {
    UserForm
  },

  data () {
    return {
      userFormVisible: false,
      tableLoading: false,
      userId: 0,

      // 数据条数
      total: 0,

      // 角色列表
      roleList: [],

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
          title: '用户名',
          key: 'userName',
          dataIndex: 'userName',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '180px'
              }
            };
          }
        },
        {
          title: '所属角色',
          key: 'roleNames',
          dataIndex: 'roleNames',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '200px'
              }
            };
          }
        },
        {
          title: '邮箱',
          key: 'email',
          dataIndex: 'email',
          width: 200
        },
        {
          title: '用户状态',
          key: 'status',
          dataIndex: 'status',
          width: 150,
          align: 'center',
          scopedSlots: {
            customRender: 'status'
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          dataIndex: 'createTime',
          width: 180
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
        userName: '',
        status: undefined,
        roleId: undefined,
        pageNumber: 1,
        pageSize: 10
      }
    };
  },

  computed: {
    // 当前登录用户的用户名
    userName () {
      return this.$store.state.user.userName;
    }
  },

  created () {
    this.getList();
    this.getAllRoleList();
  },

  methods: {
    getAllRoleList () {
      getAllRoleList()
        .then((res) => {
          this.roleList = res.data.list;
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },

    getList () {
      this.tableLoading = true;
      getUserList(this.listQuery)
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

    handleClear () {
      this.listQuery.userName = '';
      this.listQuery.status = undefined;
      this.listQuery.roleId = undefined;
      this.listQuery.pageNumber = 1;
      this.getList();
    },

    handleChangeUserName () {
      if (!this.listQuery.userName) {
        this.handleSearch();
      }
    },

    // 新增用户信息
    handleAdd () {
      this.userId = 0;
      this.userFormVisible = true;
    },

    // 启用/禁用用户
    handlePublish (id) {
      changeUserStatus(id)
        .then((res) => {
          this.$message.success(res.msg);
          this.getList();
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },

    // 编辑用户信息
    handleEdit (id) {
      this.userId = id;
      this.userFormVisible = true;
    },

    // 重置密码
    handleResetPassword (id) {
      resetPassword(id)
        .then((res) => {
          this.$message.success(res.msg);
          this.getList();
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },

    // 删除
    handleDelete ({ id, userName }) {
      this.$confirm({
        title: '提示',
        content: `确定要删除用户名为 “${userName}” 的用户信息吗？`,
        onOk: () => {
          deleteUserInfo(id)
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

    refreshUserData () {
      this.userFormVisible = false;
      this.handleSearch();
    },

    // 关闭新增、编辑用户信息对话框后的回调
    closeUserDialog () {
      this.userFormVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
