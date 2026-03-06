---
outline: deep
---
### element-ui
#### el-upload
##### 常用模板
- 自定义上传 / 手动上传 / limit size 200KB
```vue
<template>
  <el-form ref="form" label-width="130px" :model="form" :rules="rules">
    <el-form-item label="上传图片" prop="file">
      <el-upload
        ref="upload"
        :accept="acceptParams"
        action="/"
        :auto-upload="false"
        :before-upload="uploadBefore"
        :http-request="uploadHttpRequest"
        :on-change="uploadChange"
        :show-file-list="false"
      >
        <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
        <div slot="tip" class="el-upload__tip">
          只能上传{{acceptParams}}文件，且不超过{{limitSize}}KB
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="uploadSave"></el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    data(){
      return {
        form: {
          file:'',
        },
        acceptParams: '.png,.jpg,.rar,.zip,.doc,.docx,.pdf,.xls,.xlsx',
        rules:{
          file: [
            {
              required: true,
              message: '请上传图片',
              trigger: 'blur',
            },
          ],
        },
        limitSize:200
      }
    },
    methods:{
      uploadChange(file) {
        this.form.file = file.raw
        this.$refs.form.validateField('file')
      },
      uploadBefore(file) {
        const files = file.name.split('.')
        const type = files.length > 1 ? files.at(-1) : '*'
        const isType = this.acceptParams.includes(type)

        if (!isType) {
          this.$message.error('文件格式不正确')
        }
        const isSize = file.size / 1024 < this.limitSize

        if (!isSize) {
          this.$message.error(`文件大小不超过${this.limitSize}KB!`)
        }

        return isType && isSize
      },
      async uploadHttpRequest() {
        try {
          const fromData = new FormData()
          fromData.append('file', this.form.file)
          const { data, message, success } = await ajaxNaME(fromData)
          this.$message({
            message,
            type: success ? 'success' : 'error',
          })
        } catch (e) {
          console.log(e)
        }
      },
      async uploadSave() {
        await this.$refs.form.validate()
        this.$refs.upload.submit()
      },
    }
  }
</script>
```
- 默认上传 / 自动上传 / File list / Limit Size 2MB
```vue
<template>
  <el-form ref="form" label-width="130px" :model="form" :rules="rules">
    <el-form-item label="上传图片" prop="file">
    <el-upload
      :accept="acceptParams"
      action="/posts/"
      :before-upload="uploadBefore"
      :file-list="fileList"
      :limit="1"
      :multiple="false"
      :on-remove="uploadRemove"
      :on-success="uploadSuccess"
      >
      <el-button size="small" type="primary">
      点击上传
      </el-button>
      <div slot="tip" class="el-upload__tip">
      只能上传{{acceptParams}}格式文件，且不超过{{limitSize}}MB
      </div>
      </el-upload>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    data(){
      return {
        form: {
          file:'',
        },
        fileList:[],
        acceptParams: '.png,.jpg,.rar,.zip,.doc,.docx,.pdf,.xls,.xlsx',
        rules:{
          file: [
            {
              required: true,
              message: '请上传图片',
              trigger: 'blur',
            },
          ],
        },
        limitSize:2
      }
    },
    methods:{
      updateRemove() {
        this.form.file = ''
        this.$refs.form.validateField('file')
      },
      uploadSuccess(res) {
        this.form.file = res.data
        this.$refs.form.validateField('file')
      },
      uploadBefore(file) {
        const files = file.name.split('.')
        const type = files.length > 1  ? files.at(-1) : '*'
        const isType = this.acceptParams.includes(type)
        if (!isType) {
          this.$message.error('文件格式不正确')
        }
        const isSize = file.size / 1024 / 1024 < this.limitSize
        if (!isSize) {
           this.$message.error(`文件大小不超过${this.limitSize}MB!`)
        }
        return isType && isSize
      },
    }
  }
</script>
```
参考：
- [el-upload](https://element.eleme.cn/#/zh-CN/component/upload)
- [input file limiting_accepted_file_types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#limiting_accepted_file_types)

#### el-tree
##### 节点过滤的两种写法
```vue
<!-- 1 -->
<el-input
  placeholder="输入关键字进行过滤"
  v-model="filterText">
</el-input>
<el-tree
  class="filter-tree"
  :data="data"
  :props="defaultProps"
  default-expand-all
  :filter-node-method="filterNode"
  ref="tree">
</el-tree>
<script>
  export default {
    watch: {
      filterText(val) {
        // this.$refs.tree.filter() 传入一个值
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    },
    data() {
      return {
        filterText: '',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    }
  };
</script>
```
```vue
<!-- 2 -->
<el-input
  placeholder="输入关键字进行过滤"
  v-model="filterText">
</el-input>
<el-tree
  class="filter-tree"
  :data="data"
  :props="defaultProps"
  default-expand-all
  :filter-node-method="filterNode"
  ref="tree">
</el-tree>
<script>
  export default {
    watch: {
      filterText(val) {
        // this.$refs.tree.filter() 传入一个函数
        this.$refs.variableTree.filter((element) => {
          if (!val) return true
          return element.label.toLowerCase().includes(val.toLowerCase())
        })
      }
    },
    methods: {
      filterNode(value, data) {
        // value作为参数传出
        // 将data作为参数传入
        return value(data)
      },
    },
    data() {
      return {
        filterText: '',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    }
  };
</script>
```
[参考：el-tree](https://element.eleme.cn/#/zh-CN/component/tree#jie-dian-guo-lu)

#### el-input
##### 扫描枪触发
```js
<el-form-item prop="value">
  <el-input
    v-model="form.value"
    :autosize="{ minRows: 1, maxRows: 10 }"
    clearable
    :placeholder="$t('N:扫描输入框')"
    :rows="1"
    type="textarea"
    @keydown.enter.native="onKeyup"  // 扫码枪触发事件
  />
</el-form-item>
```

#### el-date-picker
##### el-popover中偏移
- el-date-picker放置到el-popover中，下拉框的div在el-date-picker中，此时计算位置有偏移；
- el-date-picker放置到文本流/el-dialog中，下拉框的div在body中，计算位置无问题；
##### disbaledDate
```vue
<el-date-picker
  v-model="form.time"
  :end-placeholder="$t('N:结束日期')"
  :picker-options="pickerOptions"
  range-separator="-"
  :start-placeholder="$t('N:开始日期')"
  type="datetimerange"
  value-format="yyyy-MM-dd HH:mm:ss"
></el-date-picker>
```
```js
let date = null
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          // 为null则都是可选
          if (!date) return false
          // 选中一个时间(开始时间/结束时间)，则往后+3个月或往前-3个月
          const range = 3 * 30 * 24 * 60 * 60 * 1000
          return time.getTime() > date.getTime() + range || time.getTime() < date.getTime() - range
        },
        onPick({ maxDate, minDate }) {
          // 当选中一个时间(开始时间/结束时间)，给date赋值
          // 否则设置为null
          if (maxDate && !minDate) {
            date = maxDate
          } else if (!maxDate && minDate) {
            date = minDate
          } else {
            date = null
          }
        },
      },
    }
  }
}
```
