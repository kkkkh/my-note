---
outline: deep
---
## element-ui
#### el-upload
##### 常用模板
- 手动上传/limit size 200KB
```vue
<template>
  <el-form ref="form" label-width="130px" :model="form" :rules="rules">
    <el-form-item label="上传图片" prop="file">
      <el-upload
        ref="upload"
        accept="image/png,image/jpeg,image/jpg"
        action="/"
        :auto-upload="false"
        :before-upload="uploadBefore"
        :http-request="uploadHttpRequest"
        :on-change="uploadChange"
        :show-file-list="false"
      >
        <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
        <span style="margin-left: 6px; font-size: 12px">{{ form.file.name }}</span>
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过200KB
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
        const isImg = file.type.includes('image/')
        const isLt2M = file.size / 1024 < 200
        if (!isImg) {
          this.$message.error('只能上传图片格式!')
        }
        if (!isLt2M) {
          this.$message.error('图片大小不能超过200KB!')
        }
        return isImg && isLt2M
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
- 自动上传 / File list / Limit Size 2MB
```vue
<template>
  <el-form ref="form" label-width="130px" :model="form" :rules="rules">
    <el-form-item label="上传图片" prop="file">
    <el-upload
      :accept="acceptPrarams"
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
      只能上传.png,.jpg,.rar,.zip,.doc,.docx,.pdf,.xls,.xlsx格式文件，且不超过2MB
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
        const isSize = file.size / 1024 / 1024 < 10

        if (!isSize) {
          this.$message.error('文件大小不超过10MB!')
        }

        return isType && isSize
      },
      async handleSave() {
        await this.$refs.form.validate()
        this.$refs.upload.submit()
      },
    }
  }
</script>
```
[参考：el-upload](https://element.eleme.cn/#/zh-CN/component/upload)

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
