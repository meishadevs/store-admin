<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名">
                <a-input v-model="listQuery.userName" placeholder="" />
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
        :columns="tablecolumn"
        :data-source="list"
        :rowKey="record => record.id"
      >
      </a-table>
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
      userId: 0,

      // 数据条数
      total: 0,

      // 列表数据
      list: [],

      tablecolumn: [
        {
          title: '用户名',
          key: 'userName',
          dataIndex: 'userName'
        },
        {
          title: '邮箱',
          key: 'email',
          dataIndex: 'email'
        },
        {
          title: '创建时间',
          key: 'createTime',
          dataIndex: 'createTime'
        }
      ],

      // 查询条件
      listQuery: {
        userName: ''
      }
    }
  },

  created () {
    this.getList()
  },

  methods: {
    getList () {
      getUserList().then(res => {
        this.list = res.data.list
        this.total = res.data.count
      }).catch(error => {
        this.$message.error(error.msg)
      })
    },

    handleSearch () {
      this.getList()
    },

    handleClear () {
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
