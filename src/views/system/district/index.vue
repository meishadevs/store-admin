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
                  placeholder="请选择所属省份"
                  @change="handleSelectProvince"
                >
                  <a-select-option
                    v-for="item in provinceList"
                    :key="item.provinceCode"
                    :value="item.provinceCode"
                  >
                    {{ item.provinceName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="所属市">
                <a-select
                  v-model="listQuery.cityCode"
                  allowClear
                  placeholder="请选择所属市"
                  @change="handleSearch"
                >
                  <a-select-option
                    v-for="item in cityList"
                    :key="item.cityCode"
                    :value="item.cityCode"
                  >
                    {{ item.cityName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="区名称">
                <a-input
                  v-model="listQuery.districtName"
                  placeholder="请输入区名称"
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
        <template slot="action" slot-scope="row">
          <a
            class="oprate-btn"
            @click="handleEdit(row.id)"
            href="javascript:;"
          >
            编辑
          </a>
          <a
            class="oprate-btn btn-del"
            @click="handleDelete(row)"
            href="javascript:;"
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
      <district-form
        v-if="districtFormVisible"
        :districtId="districtId"
        @refresh-data="refreshDistrictData"
        @close-dialog="closeDistrictDialog"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import DistrictForm from './DistrictForm';
import { getAllProvinceList } from '@/api/province';
import { getAllCityList } from '@/api/city';
import { getDistrictList, deleteDistrictInfo } from '@/api/district';

export default {
  name: 'District',

  components: {
    DistrictForm
  },

  data () {
    return {
      districtFormVisible: false,
      tableLoading: false,

      // 区 id
      districtId: 0,

      // 数据条数
      total: 0,

      // 列表数据
      list: [],

      // 省份列表
      provinceList: [],

      // 市列表数据
      cityList: [],

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
          title: '区名称',
          key: 'districtName',
          dataIndex: 'districtName',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '200px'
              }
            };
          }
        },
        {
          title: '区编码',
          key: 'districtCode',
          dataIndex: 'districtCode',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '200px'
              }
            };
          }
        },
        {
          title: '所属市',
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
          title: '所属省',
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
        districtName: '',
        districtCode: '',
        provinceCode: undefined,
        cityCode: '',
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

    getAllCityList () {
      getAllCityList(this.listQuery.provinceCode)
        .then((res) => {
          this.cityList = res.data.list;
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },

    getList () {
      this.tableLoading = true;
      getDistrictList(this.listQuery)
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

    // 选择省份后的回调
    handleSelectProvince () {
      this.cityList = [];
      this.listQuery.cityCode = undefined;
      this.listQuery.districtName = undefined;
      this.getAllCityList();
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
      this.listQuery.districtName = '';
      this.listQuery.districtCode = '';
      this.listQuery.provinceCode = undefined;
      this.listQuery.cityCode = undefined;
      this.listQuery.pageNumber = 1;
      this.cityList = [];
      this.getList();
    },

    handleAdd () {
      this.districtId = 0;
      this.districtFormVisible = true;
    },

    handleEdit (id) {
      this.districtId = id;
      this.districtFormVisible = true;
    },

    // 删除
    handleDelete ({ id, districtName }) {
      this.$confirm({
        title: '提示',
        content: `确定要删除区名称为 “${districtName}” 的区信息吗？`,
        onOk: () => {
          deleteDistrictInfo(id)
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

    refreshDistrictData () {
      this.districtFormVisible = false;
      this.handleSearch();
    },

    closeDistrictDialog () {
      this.districtFormVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
