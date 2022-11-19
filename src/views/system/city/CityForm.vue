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
      ref="cityForm"
      :model="cityDetail"
      :rules="rules"
      v-bind="layout"
    >
      <a-form-model-item
        label="所属省份"
        prop="provinceCode"
      >
        <a-select
          v-model="cityDetail.provinceCode"
          allowClear
          placeholder="请选择所属省份"
        >
          <a-select-option
            v-for="item in provinceList"
            :key="item.provinceCode"
            :value="item.provinceCode">
            {{ item.provinceName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="市名称"
        prop="cityName"
      >
        <a-input v-model="cityDetail.cityName" :maxLength="20" />
      </a-form-model-item>
      <a-form-model-item
        label="市编码"
        prop="cityCode"
      >
        <a-input v-model="cityDetail.cityCode" :maxLength="20" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { getAllProvinceList } from '@/api/province';
import { getCityDetail, saveCityData } from '@/api/city';

export default {
  name: 'CityForm',

  props: {
    // 市 id
    cityId: {
      type: Number,
      required: false,
      default: 0
    }
  },

  data () {
    // 验证市编码
    const validateCityCode = (rule, value, callback) => {
      if (!this.cityDetail.cityCode) {
        callback(new Error('市编码不能为空'));
      } else if (!(/^[1-9]\d{5}$/.test(this.cityDetail.cityCode))) {
        callback(new Error('市编码应由6位数字组成，且第1位不能为0'));
      } else {
        callback();
      }
    };

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

      // 省份列表
      provinceList: [],

      // 验证规则
      rules: {
        cityName: [
          { required: true, message: '市名称不能为空', trigger: 'blur' }
        ],
        cityCode: [
          { required: true, validator: validateCityCode, trigger: 'blur' }
        ]
      },

      // 市信息
      cityDetail: {
        id: 0,

        // 省份编码
        provinceCode: undefined,

        // 市名称
        cityName: '',

        // 市编码
        cityCode: ''
      }
    };
  },

  computed: {
    dialogTitle () {
      return this.cityId ? '编辑市信息' : '新增市信息';
    }
  },

  created () {
    this.visible = true;
    this.getAllProvinceList();

    if (this.cityId) {
      this.getCityDetail();
    }
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

    getCityDetail () {
      getCityDetail(this.cityId).then(res => {
        this.cityDetail = {
          ...this.cityDetail,
          ...res.data
        };
      }).catch(error => {
        this.$message.error(error.msg);
      });
    },

    handleSubmit () {
      this.$refs.cityForm.validate(valid => {
        if (valid) {
          this.loading = true;
          saveCityData(this.cityDetail).then(res => {
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
