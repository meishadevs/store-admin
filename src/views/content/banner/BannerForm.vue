<template>
  <a-modal
    :title="dialogTitle"
    :width="500"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="loading"
    okText="确定"
    cancelText="取消"
    @ok="handleSubmit"
    @cancel="handleCloseDialog"
  >
    <a-form-model
      ref="bannerForm"
      :model="bannerDetail"
      :rules="rules"
      v-bind="layout"
    >
      <a-form-model-item
        label="轮播图名"
        prop="bannerName"
      >
        <a-input
          v-model="bannerDetail.bannerName"
          :maxLength="30"
        />
      </a-form-model-item>
      <a-form-model-item
        label="轮播图片"
        prop="imageUrl"
        class="form-item-offset"
      >
        <a-upload
          action=""
          list-type="picture-card"
          :file-list="fileList"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div>
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item
        label="发布状态"
        prop="publishStatus"
      >
        <a-radio-group
          v-model="bannerDetail.publishStatus"
        >
          <a-radio :value="0">不发布</a-radio>
          <a-radio :value="1">发布</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item
        label="显示顺序"
        prop="sort"
      >
        <a-input-number
          v-model="bannerDetail.sort"
          :min="1"
          :maxLength="10"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { getBannerDetail, saveBannerData } from '@/api/banner';

export default {
  name: 'BannerForm',

  props: {
    // 轮播图 id
    bannerId: {
      type: Number,
      required: false,
      default: 0
    }
  },

  data () {
    return {
      visible: false,
      loading: false,

      // 表单布局
      layout: {
        labelCol: {
          span: 6
        },
        wrapperCol: {
          span: 18
        }
      },

      // 角色列表
      roleList: [],

      // 验证规则
      rules: {
        bannerName: [{ required: true, message: '轮播图名称不能为空', trigger: 'blur' }],
        imageUrl: [{ required: true, message: '轮播图片不能为空', trigger: 'blur' }]
      },

      // 轮播图详情
      bannerDetail: {
        id: 0,

        // 轮播图名称
        bannerName: '',

        // 轮播图片
        imageUrl: '',

        // 发布状态
        publishStatus: 0,

        // 置顶状态
        topStatus: 0,

        // 显示顺序
        sort: 1
      },

      // 是否查看图片
      isViewImage: false,

      previewImage: '',

      // 图片列表
      fileList: []
    };
  },

  computed: {
    dialogTitle () {
      return this.bannerId ? '编辑轮播图' : '新增轮播图';
    }
  },

  created () {
    this.visible = true;

    if (this.bannerId) {
      this.getBannerDetail();
    }
  },

  methods: {
    getBannerDetail () {
      getBannerDetail(this.bannerId)
        .then((res) => {
          this.bannerDetail = {
            ...this.bannerDetail,
            ...res.data
          };
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },

    handleCancel () {
      this.previewVisible = false;
    },

    handlePreview (file) {
    },

    handleChange ({ fileList }) {
      this.fileList = fileList;
    },

    handleSubmit () {
      this.$refs.bannerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          saveBannerData(this.bannerDetail)
            .then((res) => {
              this.loading = false;
              this.visible = false;
              this.$emit('refresh-data');
              this.$message.success(res.msg);
            })
            .catch((err) => {
              this.loading = false;
              this.$message.error(err.msg);
            });
        } else {
          return false;
        }
      });
    },

    handleCloseDialog () {
      this.visible = false;
      this.$emit('close-dialog', this.visible);
    }
  }
};
</script>

<style lang="less" scoped>
.form-item-offset {
  margin-bottom: 0;
}
</style>
