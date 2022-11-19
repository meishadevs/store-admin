<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="所属省份">
                <a-select
                  v-model="listQuery.provinceCode"
                  allowClear
                  placeholder="请选择所属市"
                  @change="handleSearch">
                  <a-select-option
                    v-for="item in provinceList"
                    :key="item.provinceCode"
                    :value="item.provinceCode">
                    {{ item.provinceName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="市名称">
                <a-input v-model="listQuery.cityName" placeholder="请输入市名称" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="市编码">
                <a-input v-model="listQuery.cityCode" placeholder="请输入市编码" />
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
      <city-form
        v-if="cityFormVisible"
        :cityId="cityId"
        @refresh-data="refreshCityData"
        @close-dialog="closeCityDialog"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import CityForm from './CityForm';
import { getAllProvinceList } from '@/api/province';
import { getCityList, deleteCityInfo } from '@/api/city';

export default {
  name: 'City',

  components: {
    CityForm
  },

  data () {
    return {
      cityFormVisible: false,
      tableLoading: false,

      // 市 id
      cityId: 0,

      // 数据条数
      total: 0,

      // 列表数据
      list: [],

      // 省份列表
      provinceList: [],

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
          title: '市名称',
          key: 'cityName',
          dataIndex: 'cityName',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '200px'
              }
            };
          }
        },
        {
          title: '市编码',
          key: 'cityCode',
          dataIndex: 'cityCode',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '200px'
              }
            };
          }
        },
        {
          title: '所属省份',
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
        cityName: '',
        cityCode: '',
        provinceCode: undefined,
        pageNumber: 1,
        pageSize: 10
      }
    };
  },

  created () {
    this.getAllProvinceList();
    this.getList();
  },

  methods: {
    getAllProvinceList () {
      getAllProvinceList()
        .then((res) => {
          this.provinceList = res.data.list;
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },

    getList () {
      this.tableLoading = true;
      getCityList(this.listQuery)
        .then((res) => {
          this.list = res.data.list;
          this.total = res.data.count;
          this.tableLoading = false;
        })
        .catch((error) => {
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
      this.listQuery.cityName = '';
      this.listQuery.cityCode = '';
      this.listQuery.provinceCode = undefined;
      this.listQuery.pageNumber = 1;
      this.getList();
    },

    handleAdd () {
      this.cityId = 0;
      this.cityFormVisible = true;
    },

    handleEdit (id) {
      this.cityId = id;
      this.cityFormVisible = true;
    },

    // 删除
    handleDelete ({ id, cityName }) {
      this.$confirm({
        title: '提示',
        content: `确定要删除市名称为 “${cityName}” 的市信息吗？`,
        onOk: () => {
          deleteCityInfo(id)
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

    refreshCityData () {
      this.cityFormVisible = false;
      this.handleSearch();
    },

    closeCityDialog () {
      this.cityFormVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
