<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户状态">
                <a-select
                  v-model="listQuery.status"
                  allowClear
                  placeholder="请选择用户状态"
                  @change="handleSearch"
                >
                  <a-select-option :value="1">启用</a-select-option>
                  <a-select-option :value="0">禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名">
                <a-input v-model="listQuery.userName" placeholder="请输入用户名" />
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
        :rowKey="record => record.id"
        bordered
      >
        <template slot="status" slot-scope="status">
          <a-tag
            :color="status ? 'green' : 'red'"
          >
            {{ status ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <template slot="action" slot-scope="row">
          <a class="oprate-btn" @click="handlePublish(row.id, row.status)" href="javascript:;">
            {{ row.status ? '禁用' : '启用' }}
          </a>
          <a class="oprate-btn" @click="handleEdit(row.id)" href="javascript:;">
            编辑
          </a>
          <a class="oprate-btn" @click="handleResetPassword(row.id)" href="javascript:;">
            重置密码
          </a>
          <a class="oprate-btn btn-del" @click="handleDelete(row.id)" href="javascript:;">
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
import UserForm from './UserForm'
import { getUserList } from '@/api/user'

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
            return index + (this.listQuery.pageNumber - 1) * this.listQuery.pageSize + 1
          }
        },
        {
          title: '用户名',
          key: 'userName',
          dataIndex: 'userName',
          customHeaderCell: column => {
            return {
              style: {
                'min-width': '180px'
              }
            }
          }
        },
        {
          title: '所属角色',
          key: 'roleNames',
          dataIndex: 'roleNames',
          customHeaderCell: column => {
            return {
              style: {
                'min-width': '200px'
              }
            }
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
        pageNumber: 1,
        pageSize: 10
      }
    }
  },

  created () {
    this.getList()
  },

  methods: {
    getList () {
      this.tableLoading = true
      getUserList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.count
        this.tableLoading = false
      }).catch(error => {
        this.$message.error(error.msg)
      })
    },

    handlePageSizeChange (current, pageSize) {
      this.listQuery.pageSize = pageSize
      this.getList()
    },

    handleSearch () {
      this.listQuery.pageNumber = 1
      this.getList()
    },

    handleClear () {
      this.listQuery.userName = ''
      this.listQuery.status = undefined
      this.listQuery.pageNumber = 1
      this.getList()
    },

    // 新增用户信息
    handleAdd () {
      this.userId = 0
      this.userFormVisible = true
    },

    // 启用/禁用用户
    handlePublish (id, status) {
    },

    // 编辑用户信息
    handleEdit (id) {
      this.userId = id
      this.userFormVisible = true
    },

    // 重置密码
    handleResetPassword (id) {
    },

    refreshUserData () {
      this.userFormVisible = false
      this.handleSearch()
    },

    // 关闭新增、编辑用户信息对话框后的回调
    closeUserDialog () {
      this.userFormVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.page-wrapper {
  margin-right: -6px;
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.oprate-btn {
  margin-right: 10px;
}

.btn-del {
  color: #f00;
}
</style>
