<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="省份名称">
                <a-input
                  allowClear
                  v-model="listQuery.provinceName"
                  placeholder="请输入省份名称"
                  @change="handleChangeProvinceName"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="省份编码">
                <a-input
                  allowClear
                  v-model="listQuery.provinceCode"
                  placeholder="请输入省份编码"
                  @change="handleChangeProvinceCode"
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
        <a-button
          type="primary"
          icon="plus"
          v-permission="{rule:'province:add'}"
          @click="handleAdd"
        >
          新增
        </a-button>
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
            href="javascript:;"
            v-permission="{rule:'province:edit'}"
            @click="handleEdit(row.id)"
          >
            编辑
          </a>
          <a
            class="oprate-btn btn-del"
            href="javascript:;"
            v-permission="{rule:'province:delete'}"
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
      <province-form
        v-if="provinceFormVisible"
        :provinceId="provinceId"
        @refresh-data="refreshProvinceData"
        @close-dialog="closeProvinceDialog"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import ProvinceForm from './ProvinceForm';
import { getProvinceList, deleteProvinceInfo } from '@/api/province';

export default {
  name: 'Province',

  components: {
    ProvinceForm
  },

  data () {
    return {
      provinceFormVisible: false,
      tableLoading: false,

      // 省份 id
      provinceId: 0,

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
          title: '省份名称',
          key: 'provinceName',
          dataIndex: 'provinceName',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '200px'
              }
            };
          }
        },
        {
          title: '省份编码',
          key: 'provinceCode',
          dataIndex: 'provinceCode',
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
        provinceName: '',
        provinceCode: '',
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
      getProvinceList(this.listQuery)
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

    handleChangeProvinceName () {
      if (!this.listQuery.provinceName) {
        this.handleSearch();
      }
    },

    handleChangeProvinceCode () {
      if (!this.listQuery.provinceCode) {
        this.handleSearch();
      }
    },

    handleClear () {
      this.listQuery.provinceName = '';
      this.listQuery.provinceCode = '';
      this.listQuery.pageNumber = 1;
      this.getList();
    },

    handleAdd () {
      this.provinceId = 0;
      this.provinceFormVisible = true;
    },

    handleEdit (id) {
      this.provinceId = id;
      this.provinceFormVisible = true;
    },

    // 删除
    handleDelete ({ id, provinceName }) {
      this.$confirm({
        title: '提示',
        content: `确定要删除省份名称为 “${provinceName}” 的省份信息吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          deleteProvinceInfo(id)
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

    refreshProvinceData () {
      this.provinceFormVisible = false;
      this.handleSearch();
    },

    closeProvinceDialog () {
      this.provinceFormVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
