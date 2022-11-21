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
      ref="districtForm"
      :model="districtDetail"
      :rules="rules"
      v-bind="layout"
    >
      <a-form-model-item
        label="所属省份"
        prop="provinceCode"
      >
        <a-select
          v-model="districtDetail.provinceCode"
          allowClear
          placeholder="请选择所属省份"
          @change="handleSelectProvince"
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
        label="所属市"
        prop="cityCode"
      >
        <a-select
          v-model="districtDetail.cityCode"
          allowClear
          placeholder="请选择所属市"
        >
          <a-select-option
            v-for="item in cityList"
            :key="item.cityCode"
            :value="item.cityCode"
          >
            {{ item.cityName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="区名称"
        prop="districtName"
      >
        <a-input v-model="districtDetail.districtName" :maxLength="20" />
      </a-form-model-item>
      <a-form-model-item
        label="区编码"
        prop="districtCode"
      >
        <a-input v-model="districtDetail.districtCode" :maxLength="20" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { getAllProvinceList } from '@/api/province';
import { getAllCityList } from '@/api/city';
import { getDistrictDetail, saveDistrictData } from '@/api/district';

export default {
  name: 'DistrictForm',

  props: {
    // 区 id
    districtId: {
      type: Number,
      required: false,
      default: 0
    }
  },

  data () {
    // 验证区编码
    const validatedistrictCode = (rule, value, callback) => {
      if (!this.districtDetail.districtCode) {
        callback(new Error('区编码不能为空'));
      } else if (!(/^[1-9]\d{5}$/.test(this.districtDetail.districtCode))) {
        callback(new Error('区编码应由6位数字组成，且第1位不能为0'));
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

      // 市列表
      cityList: [],

      // 验证规则
      rules: {
       provinceCode: [
          { required: true, message: '请选择所属省份', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请选择所属市', trigger: 'change' }
        ],
        districtName: [
          { required: true, message: '区名称不能为空', trigger: 'blur' }
        ],
        districtCode: [
          { required: true, validator: validatedistrictCode, trigger: 'blur' }
        ]
      },

      // 区信息
      districtDetail: {
        id: 0,

        // 省份编码
        provinceCode: undefined,
        cityCode: undefined,

        // 区名称
        districtName: '',

        // 区编码
        districtCode: ''
      }
    };
  },

  computed: {
    dialogTitle () {
      return this.districtId ? '编辑区信息' : '新增区信息';
    }
  },

  created () {
    this.visible = true;
    this.getAllProvinceList();

    if (this.districtId) {
      this.getDistrictDetail();
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

     getAllCityList () {
      getAllCityList(this.districtDetail.provinceCode)
        .then((res) => {
          this.cityList = res.data.list;
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },

    getDistrictDetail () {
      getDistrictDetail(this.districtId).then(res => {
        this.districtDetail = {
          ...this.districtDetail,
          ...res.data
        };

        this.getAllCityList();
      }).catch(error => {
        this.$message.error(error.msg);
      });
    },

    handleSelectProvince () {
      this.cityList = [];
      this.districtDetail.cityCode = undefined;
      this.getAllCityList();
    },

    handleSubmit () {
      this.$refs.districtForm.validate(valid => {
        if (valid) {
          this.loading = true;
          saveDistrictData(this.districtDetail).then(res => {
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
