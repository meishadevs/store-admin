<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
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
      </a-table>
      <div class="page-wrapper">
        <a-pagination
          show-size-changer
          v-model="listQuery.pageNumber"
          :total="total"
          :page-size.sync="listQuery.pageSize"
          @change="getList"
          @showSizeChange="handlePageSizeChange"
        />
      </div>
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
      visible: false,
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
          dataIndex: 'userName'
        },
        {
          title: '所属角色',
          key: 'roleNames',
          dataIndex: 'roleNames'
        },
        {
          title: '邮箱',
          key: 'email',
          dataIndex: 'email'
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
          dataIndex: 'createTime'
        }
      ],

      // 查询条件
      listQuery: {
        userName: '',
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
      this.listQuery.pageNumber = 1
      this.getList()
    },

    // 新增用户信息
    handleAdd () {
      this.userId = 0
      this.visible = true
    },

    // 编辑用户信息
    handleEdit (record) {
      this.visible = true
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
</style>
