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
        label="轮播图名称"
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
          :action="actionUrl"
          :headers="headers"
          :file-list="fileList"
          list-type="picture-card"
          accept=".jpg,.jpeg,.png,.gif"
          :remove="handleRemove"
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
        label="对应商品链接"
        prop="url"
      >
        <a-input
          v-model="bannerDetail.url"
          :maxLength="50"
        />
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
    <image-viewer
      ref="viewer"
    />
  </a-modal>
</template>

<script>
import storage from 'store';
import { ACCESS_TOKEN } from '@/store/mutation-types';
import { getBannerDetail, saveBannerData } from '@/api/banner';
import ImageViewer from '@/components/ImageViewer';

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

  components: {
    ImageViewer
  },

  data () {
    return {
      headers: {
        Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN)
      },

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
        bannerName: [
          { required: true, message: '轮播图名称不能为空', trigger: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '轮播图片不能为空', trigger: 'blur' }
        ]
      },

      // 轮播图详情
      bannerDetail: {
        id: 0,

        // 轮播图名称
        bannerName: '',

        // 图片名称
        imageName: '',

        // 图片地址
        imageUrl: '',

        // 发布状态
        publishStatus: 0,

        // 置顶状态
        topStatus: 0,

        // 显示顺序
        sort: 1,

        // 对应商品链接
        url: ''
      },

      // 是否查看图片
      isViewImage: false,

      previewImage: '',

      // 图片列表
      fileList: [],

      // 图片上传 Url
      actionUrl: `${this.$baseUrl}/auth/upload`
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

          if (this.bannerDetail.imageUrl) {
            this.fileList.push({
              uid: 1,
              status: 'done',
              name: this.bannerDetail.imageName,
              url: this.bannerDetail.imageUrl
            });
          }
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },

    handleCancel () {
      this.previewVisible = false;
    },

    handlePreview (file) {
      var imageUrl = '';
      var imageArray = [];

      if (file.url) {
        imageUrl = file.url;
      } else {
        imageUrl = file.response.data.fileUrl;
      }

      imageArray.push({ thumbnail: imageUrl, source: imageUrl });
      this.$refs.viewer.show(imageArray);
    },

    handleRemove () {
      this.fileList = [];
      this.bannerDetail.imageName = '';
      this.bannerDetail.imageUrl = '';
    },

    handleChange ({ file, fileList }) {
      this.fileList = fileList;

      // 限制只能上传一张图片
      if (this.fileList.length > 1) {
        this.fileList.splice(0, 1);
      }

      if (file.status === 'done') {
        this.bannerDetail.imageName = file.response.data.fileName;
        this.bannerDetail.imageUrl = file.response.data.fileUrl;
      }
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
