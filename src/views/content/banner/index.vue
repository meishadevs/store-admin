<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="轮播图名称">
                <a-input
                  allowClear
                  v-model="listQuery.bannerName"
                  placeholder="请输入轮播图名称"
                  @change="handleChangeBannerName"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button
                  type="primary"
                  @click="handleSearch"
                >
                  查询
                </a-button>
                <a-button
                  style="margin-left: 8px"
                  @click="handleClear"
                >
                  重置
                </a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator">
        <a-button
          type="primary"
          icon="plus"
          v-permission="{ rule: 'banner:add' }"
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
        <template
          slot="publishStatus"
          slot-scope="publishStatus"
        >
          <a-badge
            :status="publishStatus ? 'success' : 'error'"
            :text="publishStatus ? '已发布' : '未发布'"
          />
        </template>
        <template
          slot="topStatus"
          slot-scope="topStatus"
        >
          <a-badge
            :status="topStatus ? 'success' : 'error'"
            :text="topStatus ? '已置顶' : '未置顶'"
          />
        </template>
        <template
          slot="action"
          slot-scope="row"
        >
          <a
            class="oprate-btn"
            href="javascript:;"
            v-permission="{ rule: 'banner:publish' }"
            @click="handlePublish(row)"
          >
            {{ row.publishStatus ? '撤销' : '发布' }}
          </a>
          <a
            class="oprate-btn"
            href="javascript:;"
            v-permission="{ rule: 'banner:edit' }"
            @click="handleEdit(row.id)"
          >
            编辑
          </a>
          <a
            class="oprate-btn btn-del"
            href="javascript:;"
            v-permission="{ rule: 'banner:delete' }"
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
      <banner-form
        v-if="bannerFormVisible"
        :bannerId="bannerId"
        @refresh-data="refreshBannerData"
        @close-dialog="closeBannerDialog"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import BannerForm from './BannerForm';
import { getBannerList, changePublishStatus, deleteBanner } from '@/api/banner';

export default {
  name: 'Banner',

  components: {
    BannerForm
  },

  data () {
    return {
      bannerFormVisible: false,
      tableLoading: false,
      bannerId: 0,

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
          title: '轮播图名称',
          key: 'bannerName',
          dataIndex: 'bannerName',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '180px'
              }
            };
          }
        },
        {
          title: '轮播图图片',
          key: 'imageUrl',
          dataIndex: 'imageUrl',
          customHeaderCell: (column) => {
            return {
              style: {
                'min-width': '200px'
              }
            };
          }
        },
        {
          title: '发布状态',
          key: 'publishStatus',
          dataIndex: 'publishStatus',
          width: 140,
          align: 'center',
          scopedSlots: {
            customRender: 'publishStatus'
          }
        },
        {
          title: '置顶状态',
          key: 'topStatus',
          dataIndex: 'topStatus',
          width: 150,
          align: 'center',
          scopedSlots: {
            customRender: 'topStatus'
          }
        },
        {
          title: '显示顺序',
          key: 'sort',
          dataIndex: 'sort',
          width: 180
        },
        {
          title: '创建人',
          key: 'createBy',
          dataIndex: 'createBy',
          width: 180
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
        bannerName: '',
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
      getBannerList(this.listQuery)
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
      this.listQuery.bannerName = '';
      this.listQuery.pageNumber = 1;
      this.getList();
    },

    handleChangeBannerName () {
      if (!this.listQuery.bannerName) {
        this.handleSearch();
      }
    },

    // 新增用户信息
    handleAdd () {
      this.bannerId = 0;
      this.bannerFormVisible = true;
    },

    // 编辑用户信息
    handleEdit (id) {
      this.bannerId = id;
      this.bannerFormVisible = true;
    },

    // 发布/撤销轮播图
    handlePublish ({ id }) {
      changePublishStatus(id)
        .then((res) => {
          this.$message.success(res.msg);
          this.getList();
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },

    // 删除
    handleDelete ({ id, bannerName }) {
      this.$confirm({
        title: '提示',
        content: `确定要删除轮播图名称为 “${bannerName}” 的轮播图吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          deleteBanner(id)
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

    refreshBannerData () {
      this.bannerFormVisible = false;
      this.handleSearch();
    },

    // 关闭新增、编辑用户信息对话框后的回调
    closeBannerDialog () {
      this.bannerFormVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
