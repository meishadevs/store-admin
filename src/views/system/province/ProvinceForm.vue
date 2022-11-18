<template>
  <a-modal
    :title="dialogTitle"
    :width="500"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="loading"
    @ok="handleSubmit"
    @cancel="handleCloseDialog"
  >
    <a-form-model
      ref="provinceForm"
      :model="provinceDetail"
      :rules="rules"
      v-bind="layout"
    >
      <a-form-model-item
        label="省份名称"
        prop="provinceName"
      >
        <a-input v-model="provinceDetail.provinceName" :maxLength="20" />
      </a-form-model-item>
      <a-form-model-item
        label="省份编码"
        prop="provinceCode"
      >
        <a-input v-model="provinceDetail.provinceCode" :maxLength="20" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { getProvinceDetail, saveProvinceData } from '@/api/province';

export default {
  name: 'ProvinceForm',

  props: {
    // 省份 id
    provinceId: {
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

      // 验证规则
      rules: {
        provinceName: [
          { required: true, message: '省份名称不能为空', trigger: 'blur' }
        ],
        provinceCode: [
          { required: true, message: '省份编码不能为空', trigger: 'blur' }
        ]
      },

      // 省份信息
      provinceDetail: {
        id: 0,

        // 省份名称
        provinceName: '',

        // 省份编码
        provinceCode: ''
      }
    };
  },

  computed: {
    dialogTitle () {
      return this.provinceId ? '编辑省份信息' : '新增省份信息';
    }
  },

  created () {
    this.visible = true;

    if (this.provinceId) {
      this.getProvinceDetail();
    }
  },

  methods: {
    getProvinceDetail () {
      getProvinceDetail(this.provinceId).then(res => {
        this.provinceDetail = {
          ...this.provinceDetail,
          ...res.data
        };
      }).catch(error => {
        this.$message.error(error.msg);
      });
    },

    handleSubmit () {
      this.$refs.provinceForm.validate(valid => {
        if (valid) {
          this.loading = true;
          saveProvinceData(this.provinceDetail).then(res => {
            this.loading = false;
            this.visible = false;
            this.$emit('refresh-data');
            this.$message.success(res.msg);
          }).catch(err => {
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
</style>
