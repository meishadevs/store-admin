<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div>
      <a-table
        v-if="list.length"
        :loading="tableLoading"
        :pagination="false"
        :default-expand-all-rows="true"
        :columns="tablecolumn"
        :data-source="list"
        :row-key="(record) => record.id"
        bordered
      >
        <template slot="type" slot-scope="type">
          {{ type ? '按钮' : '菜单' }}
        </template>
        <template slot="action" slot-scope="row">
          <a
            class="oprate-btn"
            @click="handleEdit(row.id)"
            href="javascript:;">
            编辑
          </a>
          <a
            class="oprate-btn btn-del"
            @click="handleDelete(row)"
            href="javascript:;">
            删除
          </a>
        </template>
      </a-table>
      <menu-form
        v-if="menuFormVisible"
        :menuId="menuId"
        @refresh-data="refreshMenuData"
        @close-dialog="closeMenuDialog"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import MenuForm from './MenuForm';
import { getMenuList, deleteMenuInfo } from '@/api/menu';

export default {
  name: 'Menu',

  components: {
    MenuForm
  },

  data () {
    return {
      menuFormVisible: false,
      tableLoading: false,

      // 菜单 id
      menuId: 0,

      // 列表数据
      list: [],

      tablecolumn: [
        {
          title: '菜单名称',
          key: 'title',
          dataIndex: 'title',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '200px'
              }
            };
          }
        },
        {
          title: '图标',
          key: 'icon',
          dataIndex: 'icon',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '200px'
              }
            };
          }
        },
        {
          title: '类型',
          key: 'type',
          dataIndex: 'type',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '200px'
              }
            };
          },
          scopedSlots: {
            customRender: 'type'
          }
        },
        {
          title: '路由',
          key: 'url',
          dataIndex: 'url',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '200px'
              }
            };
          }
        },
        {
          title: '权限',
          key: 'permissions',
          dataIndex: 'permissions',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '200px'
              }
            };
          }
        },
        {
          title: '排序',
          key: 'sort',
          dataIndex: 'sort',
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
      ]
    };
  },

  created () {
    this.getList();
  },

  methods: {
    getList () {
      this.tableLoading = true;
      getMenuList()
        .then((res) => {
          this.list = res.data.list;
          this.tableLoading = false;
        })
        .catch((error) => {
          this.tableLoading = false;
          this.$message.error(error.msg);
        });
    },

    handleAdd () {
      this.menuId = 0;
      this.menuFormVisible = true;
    },

    handleEdit (id) {
      this.menuId = id;
      this.menuFormVisible = true;
    },

    handleDelete ({ id, title }) {
      this.$confirm({
        title: '提示',
        content: `确定要删除菜单名称为 “${title}” 的菜单信息吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          deleteMenuInfo(id)
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

    refreshMenuData () {
      this.menuFormVisible = false;
      this.getList();
    },

    closeMenuDialog () {
      this.menuFormVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
