<template>
  <el-form
    :label-position="direction"
    :label-width="labelWidth"
    ref="form"
    :model="form"
    :rules="rules"
    class="base-form"
    :disabled="disabled"
    :key="formKey"
  >
    <div v-for="(item,index) in formData" :key="index">
      <el-form-item
        :label="item.title"
        :prop="item.disabled ? '' : item.prop"
        :class="{'siding':item.type=='minMax'}"
        v-if="!item.destroy"
      >
        <!-- 输入框 -->
        <el-input
          v-if="item.type=='input' || item.type=='input-limit'"
          :disabled="item.disabled?item.disabled:false"
          v-model="form[item.prop]"
          :placeholder="item.placeholder?`${item.placeholder}`:`请输入${item.title}`"
          :maxlength="item.maxlength"
          :onbeforepaste="item.onbeforepaste"
          :oninput="item.oninput"
          :class="item.class"
          show-word-limit
        ></el-input>
        <!-- 输入框  数字-->
        <el-input
          v-if="item.type=='input-number'"
          oninput="this.value=this.value.replace(/[^\d]/g,'')"
          onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
          :disabled="item.disabled?item.disabled:false"
          v-model.number="form[item.prop]"
          show-word-limit
          :placeholder="item.placeholder?`${item.placeholder}`:`请输入${item.title}`"
          :class="item.class"
        ></el-input>
        <!-- 输入框  数字 可以允许小数点（小数点的位数 需在正则rules.js 配置） -->
        <el-input
          v-if="item.type=='input-number-point'"
          :disabled="item.disabled?item.disabled:false"
          v-model="form[item.prop]"
          :placeholder="item.placeholder?`${item.placeholder}`:`请输入${item.title}`"
          :class="item.class"
        >
          <template slot="append">{{item.unit}}</template>
        </el-input>
        <!-- 输入框 单位（元） -->
        <el-input
          v-if="item.type=='input-unit'"
          oninput="this.value=this.value.replace(/[^\d]/g,'')"
          onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
          :disabled="item.disabled?item.disabled:false"
          v-model.number="form[item.prop]"
          :placeholder="item.placeholder?`${item.placeholder}`:`请输入${item.title}`"
          :class="item.class"
          :maxlength="item.maxlength"
        >
          <template slot="append">{{item.unit}}</template>
        </el-input>
        <!-- 输入框 密码 -->
        <el-input
          v-if="item.type=='password'"
          :prefix-icon="`el-icon-${item.icon}`"
          show-password
          :oninput="item.oninput"
          v-model="form[item.prop]"
          :placeholder="item.placeholder?`${item.placeholder}`:`请输入${item.title}`"
          :maxlength="item.maxlength"
          readonly
          @focus="e => {e.target.removeAttribute('readonly')}"
        ></el-input>
        <!-- 输入框 带icon-->
        <el-input
          v-if="item.type=='input-icon'"
          :prefix-icon="`el-icon-${item.icon}`"
          :oninput="item.oninput"
          v-model="form[item.prop]"
          :onbeforepaste="item.onbeforepaste"
          :placeholder="item.placeholder?`${item.placeholder}`:`请输入${item.title}`"
          :maxlength="item.maxlength"
        ></el-input>
        <!-- 支持单选 -->
        <el-select
          v-if="item.type=='select'"
          :filterable="item.filterable"
          :disabled="item.disabled"
          v-model="form[item.prop]"
          :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
          :class="item.class"
        >
          <el-option
            v-for="(items,index) in item.options"
            :key="index"
            :label="items.label"
            @click.native="changeSelect(items)"
            :value="items.value"
            :disabled="items.disabled"
          ></el-option>
        </el-select>
        <!-- 支持单选 -->
        <el-select
          v-if="item.type=='select-item'"
          :filterable="item.filterable"
          :disabled="item.disabled"
          v-model="form[item.prop]"
          :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
          :class="item.class"
        >
          <el-option
            v-for="(items,index) in item.options"
            :key="index"
            :label="items.label"
            @click.native="changeSelect(items)"
            :value="items"
          ></el-option>
        </el-select>
        <!-- 支持多选 -->
        <el-select
          v-if="item.type=='select-multiple'"
          multiple
          v-model="form[item.prop]"
          :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
        >
          <el-option
            v-for="(items,index) in item.options"
            :key="index"
            :label="items.label"
            @click.native="changeSelect(items)"
            :value="items.value"
            :disabled="items.disabled"
          ></el-option>
        </el-select>
        <!-- 开关 -->
        <el-switch
          v-if="item.type=='switch'"
          v-model="form[item.prop]"
          :active-text="form[item.prop]?'开启':'关闭'"
          :inactive-value="0"
          :active-value="1"
        ></el-switch>
        <!-- 单个日期选择// dateType设置时间类型 年 月 日 -->
        <!-- <el-date-picker type="year"
          v-if="item.type=='dateyear'"
          v-model="form[item.prop]"
          :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`">
        </el-date-picker>-->
        <!-- 单个日期选择// dateType设置时间类型 年 月 日 -->
        <el-date-picker
          v-if="item.type=='datepicker'"
          v-model="form[item.prop]"
          :type="item.dateType"
          :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
          :picker-options="item.pickerOptions"
          :disabled="item.disabled"
        ></el-date-picker>
        <!-- 起止日期选择 -->
        <el-date-picker
          type="daterange"
          v-if="item.type=='datepicker-range'"
          v-model="dateParam[item.prop]"
          @change="changeDate(item)"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <!-- 单个时间选择 -->
        <el-date-picker
          type="datetime"
          v-if="item.type=='datetime'"
          v-model="form[item.prop]"
          :picker-options="item.pickerOptions"
          :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
        ></el-date-picker>
        <!-- 两个时间选择 -->
        <el-date-picker
          type="datetimerange"
          v-if="item.type=='datetime-range'"
          v-model="timeParam[item.prop]"
          @change="changeTime(item)"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        ></el-date-picker>
        <!-- 支持文本域 -->
        <el-input
          v-if="item.type=='textarea'"
          v-model="form[item.prop]"
          type="textarea"
          :maxlength="item.maxlength?item.maxlength:'500'"
          :disabled="item.disabled?item.disabled:false"
          :autosize="{ minRows: 3, maxRows: 5}"
          :placeholder="item.placeholder?`${item.placeholder}`:`请输入${item.title}`"
        ></el-input>
        <!-- 级联选择 返回id-->
        <el-cascader
          v-if="item.type=='cascader'"
          v-model="form[item.prop]"
          :value="item.value"
          :options="item.options"
          :props="item.setProps"
          :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
          :disabled="item.disabled"
        ></el-cascader>
        <!-- 级联选择 返回对象-->
        <el-cascader
          v-if="item.type=='cascader-object'"
          v-model="form[item.prop]"
          :value="item"
          :options="item.options"
          :props="item.setProps"
          :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
        ></el-cascader>
        <!-- 级联选择（多选） -->
        <el-cascader
          v-if="item.type=='cascader-multiple'"
          v-model="form[item.prop]"
          :options="item.options"
          :props="item.setProps"
          :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
          clearable
        ></el-cascader>
        <!-- 单选 -->
        <el-radio-group
          v-if="item.type=='radio'"
          @change="changeRadio(item)"
          v-model="radioParam[item.prop]"
        >
          <el-radio
            v-for="(list,index) in item.options"
            :key="index"
            :label="list.value"
          >{{list.label}}</el-radio>
        </el-radio-group>
        <!-- 上下排列的单选 带输入框 -->
        <div v-if="item.type=='radio-textarea'">
          <el-radio
            v-model="form[item.props[0]]"
            :label="item.options[0].value"
          >{{item.options[0].label}}</el-radio>
          <div class="flex-wrap">
            <el-radio
              v-model="form[item.props[0]]"
              :label="item.options[1].value"
            >{{item.options[1].label}}</el-radio>
            <el-input
              v-model="form[item.props[1]]"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
            ></el-input>
          </div>
        </div>
        <!-- 地址栏 -->
        <div v-if="item.type=='address'">
          <el-cascader
            v-model="citySelect"
            :props="cascaderProps"
            @change="changeCity"
            :options="cityData"
            placeholder="请选择省、市、区"
          ></el-cascader>
          <el-input v-model="form[item.prop]" placeholder="填写详细地址"></el-input>
        </div>
        <!-- 最大值最小值 -->
        <el-input
          v-if="item.type=='minMax'"
          v-model="form[item.options[0]]"
          @blur="checkNumber"
          type="text"
          placeholder="输入最小值"
        ></el-input>
        <span v-if="item.type=='minMax'" class="siding-flag">至</span>
        <el-input
          v-if="item.type=='minMax'"
          v-model="form[item.options[1]]"
          @blur="checkNumber"
          type="text"
          placeholder="输入最大值"
        ></el-input>
        <!-- 多选checkbox -->
        <el-checkbox-group
          v-if="item.type=='checkbox'"
          @change="changeCheckbox"
          v-model="form[item.prop]"
        >
          <el-checkbox
            v-for="(list, index) in item.options"
            :key="index"
            :label="list.value"
          >{{list.label}}</el-checkbox>
        </el-checkbox-group>
        <!-- 图片上传 -->
        <el-upload
          v-if="item.type=='upload'"
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="success"
          :before-upload="beforeUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <!-- 多个图片上传 -->
        <div v-if="item.type=='upload-drag'">
          <el-upload
            class="upload-demo"
            drag
            multiple
            action
            :limit="10"
            :show-file-list="true"
            :on-remove="handleRemove"
            :http-request="uploadFile"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </div>
      </el-form-item>
    </div>
  </el-form>
</template>

<script type="text/javascript">
import moment from 'moment'
import cityData from '@/libs/map/area.json'

export default {
  name: '',
  props: {
    formKey: {
      type: Number,
      default: 0
    },
    formData: {
      type: Array,
      default() {
        return []
      }
    },
    rules: {
      type: Object,
      default() {
        return {}
      }
    },
    direction: {
      type: String,
      default: 'right'
    },
    labelWidth: {
      type: String,
      default: '90px'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cityData,
      citySelect: '',
      cascaderProps: {
        label: 'text',
        value: 'value',
        children: 'children'
      },
      form: {},
      radioValue: '',
      radioParam: {}, // 用于保存radio的参数
      switchText: '开启',
      dateParam: {}, // 用于保存起止日期的参数
      timeParam: {}, // 用于保存起止时间的参数
      selectParam: {}, // 用于保存起止时间的参数
      cascaderParams: {}, // 用于保存级联选择器（多选）的参数
      cascaderParam: {}, // 用于保存级联选择器（单选）的参数
      imageUrl: ''
    }
  },
  watch: {
    form: {
      handler(newValue, oldValue) {
        let param = JSON.parse(JSON.stringify(newValue))
        // console.log('newValue', newValue)
        for (let key in this.cascaderParams) {
          if (param[key] && param[key].length > 0) {
            for (let i = 0; i < param[key].length; i++) {
              param[key][i] = param[key][i][param[key][i].length - 1]
            }
          }
        }
        for (let key in this.cascaderParam) {
          if (param[key] && param[key].length > 0) {
            param[key] = param[key][param[key].length - 1]
          }
        }
        // console.log('param', param)

        this.$emit('change', param)
      },
      // 深度监听 监听对象，数组的变化
      deep: true
    },
    formData: {
      handler(newValue, oldValue) {
        // this.form = {};
        this.init(newValue)
      },
      // 深度监听 监听对象，数组的变化
      deep: true
    }
  },
  created() {
    this.init(this.formData)
  },
  components: {},
  methods: {
    handleRemove() {},
    async uploadFile(files) {
      let formData = new FormData()
      this.softData[3].value = `${(files.file.size / 1024).toFixed(1)} KB`
      formData.append('file', files.file)
      formData.append('refId', 1)
      formData.append('flag', true)
      formData.append('busType', 1)
      const res = await this.$api.testUpload({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          // console.log('上传进度事件:', evt);
        }
      })
      console.log('uploadFile', res)
      // this.gameBagId = res.data.fileId;
    },
    changeCheckbox(val) {
      console.log(val)
    },
    checkNumber(val, flag) {
      if (this.form[val] < 0) {
        this.$message.warning(`${flag}须大于0`)
      }
    },
    success(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    changeDate(val) {
      this.form[val.options[0]] = moment(this.dateParam[val.prop][0]).format(
        'YYYY-MM-DD'
      )
      this.form[val.options[1]] = moment(this.dateParam[val.prop][1]).format(
        'YYYY-MM-DD'
      )
    },
    changeTime(val) {
      this.form[val.options[0]] = moment(this.timeParam[val.prop][0]).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      this.form[val.options[1]] = moment(this.timeParam[val.prop][1]).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    },
    changeRadio(val) {
      this.form[val.prop] = this.radioParam[val.prop]
    },
    changeCity(val) {
      const self = this
      self.cityData.forEach(item => {
        if (item.value === val[0]) {
          self.form.provinceId = item.value
          self.form.provinceName = item.text
          item.children.forEach(list => {
            if (list.value === val[1]) {
              self.form.cityId = list.value
              self.form.cityName = list.text
              list.children.forEach(el => {
                if (el.value === val[2]) {
                  self.form.townId = el.value
                  self.form.townName = el.text
                }
              })
            }
          })
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    validate(callback) {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log('校验通过')
          // this.$emit('asset')
          callback(new Error('true'))
        } else {
          // console.log('校验不通过')
          callback(new Error('false'))
        }
      })
    },
    changeSwitch(val) {
      this.switchText = val ? '开启' : '关闭'
    },
    changeSelect(val) {
      // console.log(val)
      this.form[val.prop] = this.selectParam[val.prop]
      // console.log(this.selectParam)
    },
    init(data) {
      const self = this
      data &&
        data.forEach(item => {
          if (
            item.type === 'datepicker-range' ||
            item.type === 'datetime-range'
          ) {
            if (item.value !== '') {
              // 数据回填
              self.timeParam[item.prop] = item.value
              self.dateParam[item.prop] = item.value
            } else {
              self.$set(self.form, item.options[0], '')
              self.$set(self.form, item.options[1], '')
              // self.timeParam[item.type] = item.options; // 用于获取起止时间的字段名称
              console.log('时间参数', self.timeParam)
            }
          } else if (item.type === 'switch') {
            if (item.value !== '') {
              // 数据回填
              self.changeSwitch(item.value)
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, 0)
            }
          } else if (item.type === 'radio') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.radioParam, item.prop, item.value)
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, '')
              self.$set(self.radioParam, item.prop, '')
            }
          } else if (item.type === 'address') {
            if (item.value !== '') {
              // 数据回填
              self.citySelect = item.value
              self.$set(self.form, 'address', item.address)
            } else {
              self.$set(self.form, 'provinceId', '')
              self.$set(self.form, 'provinceName', '')
              self.$set(self.form, 'cityId', '')
              self.$set(self.form, 'cityName', '')
              self.$set(self.form, 'townId', '')
              self.$set(self.form, 'townName', '')
              self.$set(self.form, 'address', '')
            }
          } else if (item.type === 'select') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.selectParam, item.prop, item.value)
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, '')
              self.$set(self.selectParam, item.prop, '')
            }
          } else if (item.type === 'checkbox') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.selectParam, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, [])
            }
          } else if (item.type === 'radio-textarea') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.props[0], item.value[0])
              self.$set(self.form, item.props[1], item.value[1])
            } else {
              self.$set(self.form, item.props[0], '')
              self.$set(self.form, item.props[1], '')
            }
          } else if (item.type === 'cascader-multiple') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, [])
            }
            self.$set(self.cascaderParams, item.prop, '')
          } else if (item.type === 'cascader') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, [])
            }
            self.$set(self.cascaderParam, item.prop, '')
          } else if (item.type === 'cascader-object') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, [])
            }
            // self.$set(self.cascaderParam, item.prop , '');
          } else {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, '')
            }
          }
        })
    }
  }
}
</script>

<style lang="less">
.flex-wrap {
  display: flex;
  align-items: center;
}
.el-form-item__content {
  width: auto;
}
</style>
