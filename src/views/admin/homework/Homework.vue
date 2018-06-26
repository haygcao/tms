<template>
    <div class="course-list">
  <el-row>
     <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item>课后作业</el-breadcrumb-item>
      </el-breadcrumb>
     </div>
  </el-row>
   <el-row>
    <el-button @click="onCreate" icon="el-icon-plus" type="danger" size="small" round>新建课后作业</el-button>
    <el-dropdown style="float:right" trigger="click">
        <el-button size="small"  type="default" class="el-dropdown-link">
          {{searchForm.subject|subjectName}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in subjects" :key="item.name">
            <router-link :class="{'active':searchForm.subject==item.key}" :to="{name:$route.name,query:Object.assign({},searchForm,{subject:item.key})}">{{item.name}}</router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
  </el-row>
    <el-row>
  <el-table
    :data="homeworkList"
    stripe
    border=""
    style="width: 100%">
    <el-table-column
      type="index"
      label="#"
      width="40"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="名称"
      >
    </el-table-column>
     <el-table-column
     width="80"
      label="学科">
       <template slot-scope="scope">
          {{ scope.row.subject|subjectName }}
      </template>
    </el-table-column>
    <el-table-column
      prop="s_no"
      label="编号">
    </el-table-column>
     <el-table-column
      prop="file_path"
      label="路径">
    </el-table-column>
    <el-table-column
      label="文件地址">
       <template slot-scope="scope">
          <a target="_blank" :href="scope.row.absolute_url">{{ scope.row.absolute_url }}</a>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="120">
      <template slot-scope="scope">
        <el-button @click="handleUpdateClick(scope.row)" type="text" size="small">修改</el-button>
        <el-button @click="handleRemoveClick(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </el-row>
  <el-dialog fullscreen="" title="添加作业" center :visible.sync="dialogCreateVisible" :close-on-click-modal="false"	>
        <el-form style="max-width:480px;margin:0 auto;" size="medium" :rules="createRules" :model="createForm" label-width="100px" label-position="right" ref="createForm">
             <el-form-item label="学科" prop="subject">
                <el-select v-model="createForm.subject">
                    <el-option v-for="item in course_settings" :key="item.key" :label="item.name" :value="item.key.toString()"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="name" >
               <el-input type="text" v-model="createForm.name" placeholder="知识点"></el-input>
            </el-form-item>
            <el-form-item label="编号" prop="s_no" >
                <el-input v-model="createForm.s_no" placeholder="s1-g1-t1-01"></el-input>
            </el-form-item>
             <el-form-item label="描述" prop="description" >
                <el-input type="textarea" v-model="createForm.description" placeholder="描述"></el-input>
            </el-form-item>
             <el-form-item label="文件路径" prop="file_path">
                <el-input @blur="getAbsoluteUrl" v-model="createForm.file_path"  placeholder="oss 相对路径"></el-input>
            </el-form-item>
            <el-form-item label="访问地址" prop="absolute_url">
                <el-input v-model="createForm.absolute_url" readonly placeholder="http://"></el-input>
            </el-form-item>
            <el-form-item label="版本" prop="version" >
                <el-input readonly="" v-model="createForm.version" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="submitCreate">确定</el-button>
              </el-form-item>
          </el-form>
  </el-dialog>
  </div>
      
  </template>
  <script>
import * as oss from "ali-oss";
import browserMD5File from "browser-md5-file";
import {
  STS_Server,
  OssConfig,
  HomeworkBasePath,
  HomeworkDomain
} from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      updateForm: {
        id: undefined,
        size: undefined,
        md5: undefined,
        file_path: undefined,
        subject: undefined,
        s_no: undefined,
        name: undefined,
        version: 1,
        description: undefined,
        absolute_url: undefined
      },
      uploaded: false,
      uploadPercentage: 0,
      uploadStatus: "",
      createForm: {
        size: undefined,
        md5: undefined,
        file_path: undefined,
        subject: undefined,
        s_no: undefined,
        name: undefined,
        version: 1,
        description: undefined,
        absolute_url: undefined
      },
      createRules: {
        subject: [{ required: true, message: "请选择学科", trigger: "blur" }],
        name: [{ required: true, message: "请填写名称", trigger: "blur" }]
        // file_path: [
        //   { required: true, message: "请输入文件地址", trigger: "blur" }
        // ]
      },
      searchForm: {
        subject: undefined
      },
      dialogCreateVisible: false
    };
  },
  computed: {
    ...mapState({
      homeworkList: state => state.homework.list.data || []
    }),
    ...mapGetters(["subjects", "course_settings"])
  },
  //   watch: {
  //     "createForm.file_path": {
  //       deep: true,
  //       handler: function(val, old) {
  //           this.createForm.absolute_url=''
  //       }
  //     }
  //   },
  beforeRouteUpdate(to, from, next) {
    // react to route changes...
    // don't forget to call next()
    this.searchForm = Object.assign(this.searchForm, to.query);
    this.search();
    next();
  },
  mounted() {
    this.searchForm = Object.assign(
      { subject: this.subjects[0].key },
      this.$route.query
    );
    this.search();
  },
  activated() {},
  methods: {
    ...mapActions({
      getHomeworkList: "getHomeworkList",
      createHomework: "createHomework",
      updateHomework: "updateHomework",
      removeHomework: "removeHomework"
    }),
    initCreateForm() {
      this.uploaded = false;
      this.uploadPercentage = 0;
      this.uploadStatus = "";
      this.$refs["createForm"].resetFields();
    },
    search() {
      this.getHomeworkList({ subject: this.searchForm.subject });
    },
    onCreate() {
      this.dialogCreateVisible = true;
      this.$nextTick(() => {
        this.initCreateForm();
      });
    },
    submitCreate() {
      this.$refs["createForm"].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.createForm);
          //   payload.price = parseInt(payload.price);
          this.createHomework(payload).then(res => {
            if (res && res.code == 0) {
              this.$message.success("保存成功 ");
              this.search();
            } else {
              this.$message.error("保存失败  " + res.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    handleUpdateClick(item) {},
    handleRemoveClick(item) {
        this.$confirm("确认删除？")
        .then(_ => {
          this.removeHomework({ id: item.id }).then(res => {
            this.$message.success("操作成功 ");
            this.getHomeworkList({ subject: this.searchForm.subject });
          });
        })
        .catch(_ => {});
    },
    get_suffix(filename) {
      var pos = filename.lastIndexOf(".");
      var suffix = "";
      if (pos !== -1) {
        suffix = filename.substring(pos);
      }
      return suffix;
    },
    combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
        : baseURL;
    },
    getAbsoluteUrl() {
      let self = this;
      var sts_token_url = "/ali_sts";
      let path = this.createForm.file_path;
      if (!path) {
        self.createForm.absolute_url = undefined;
        return false;
      }
      console.warn(path);
      this.$http
        .get(sts_token_url)
        .then(res => {
          var creds = res.data.token;
          var client = new oss.Wrapper({
            region: OssConfig.region,
            bucket: OssConfig.bucket,
            accessKeyId: creds.AccessKeyId,
            accessKeySecret: creds.AccessKeySecret,
            stsToken: creds.SecurityToken
          });
          self.createForm.absolute_url = client.generateObjectUrl(
            path,
            HomeworkDomain
          );
          this.$forceUpdate()
          // console.log(self.createForm.absolute_url)
        })
        .catch(err => {
          console.error(err);
        });
    },
    onCompleted() {},
    onUploadProgress(e, res) {
      //   console.log(res.headers["x-oss-request-id"]);
      //   return p;

      console.log("upload: " + e.percentage + "%");
      this.uploadPercentage = e.percentage;
    },
    uploadSuccess(res) {
      console.log(res);
    }
  }
};
</script>
  

  