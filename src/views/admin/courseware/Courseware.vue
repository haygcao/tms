<template>
    <div class="course-list">
  <el-row>
     <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item>课件管理</el-breadcrumb-item>
      </el-breadcrumb>
     </div>
  </el-row>
   <el-row>
    <el-button @click="onCreate" icon="el-icon-plus" type="danger" size="small" round>新建课件</el-button>
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
    :data="coursewareList"
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
      prop="version"
      width="40"
      label="版本">
    </el-table-column>
    <el-table-column
      prop="size"
      width="90"
      label="大小">
       <template slot-scope="scope">
           {{(scope.row.size/1024/1024).toFixed(2) }} MB
       </template>
    </el-table-column>
    <el-table-column
      prop="md5"
      label="md5">
    </el-table-column>
     <el-table-column
      prop="created_at"
      label="创建于">
       <template slot-scope="scope">
           {{scope.row.created_at|formatDateTime('YYYY-MM-DD H:mm')}}
       </template>
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
  <el-dialog fullscreen="" title="添加课件" center :visible.sync="dialogCreateVisible" :close-on-click-modal="false"	>
        <el-form style="max-width:480px;margin:0 auto;" size="medium" :rules="createRules" :model="createForm" label-width="100px" label-position="right" ref="createForm">
             <el-form-item label="学科" prop="subject">
                <el-select v-model="createForm.subject">
                    <el-option v-for="item in course_settings" :key="item.key" :label="item.name" :value="item.key.toString()"></el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="上传课件" prop="file_path" v-show="!uploaded&&createForm.subject">
                <el-upload
            class="upload-demo"
            drag
            action="http://reallyedu-course.oss-cn-beijing.aliyuncs.com/kj-test"
            :show-file-list="false"
            :onSuccess="uploadSuccess"
            :on-progress="onUploadProgress"
            :http-request="onUploadFile">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <p>{{filename}}</p>
            <el-progress :percentage="uploadPercentage" :status="uploadStatus" color="#8e71c7"></el-progress>
            </el-form-item>
            <div v-show="uploaded">
            
            <el-form-item label="标题" prop="name" >
               <el-input type="text" v-model="createForm.name" placeholder="知识点"></el-input>
            </el-form-item>
            <el-form-item label="编号" prop="s_no" >
                <el-input v-model="createForm.s_no" placeholder="s1-g1-t1-01"></el-input>
            </el-form-item>
             <el-form-item label="描述" prop="description" >
                <el-input type="textarea" v-model="createForm.description" placeholder="描述"></el-input>
            </el-form-item>
             <el-form-item label="file_path" prop="file_path">
                <el-input v-model="createForm.file_path" readonly="" placeholder="http://"></el-input>
            </el-form-item>
            <el-form-item label="url" prop="absolute_url">
                <el-input v-model="createForm.absolute_url" readonly="" placeholder="http://"></el-input>
            </el-form-item>
            <el-form-item label="文件大小" prop="size" >
                <el-input v-model="createForm.size" readonly="" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="版本" prop="version" >
                <el-input readonly="" v-model="createForm.version" placeholder=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="submitCreate">确定</el-button>
              </el-form-item>
            </div>
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
  CoursewareBasePath,
  CoursewareDomain
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
      uploadStatus: "pending",
      filename: "",
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
      coursewareList: state => state.courseware.list.data || []
    }),
    ...mapGetters(["subjects", "course_settings"])
  },
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
      getCoursewareList: "getCoursewareList",
      createCourseware: "createCourseware",
      updateCourseware: "updateCourseware",
      removeCourseware: "removeCourseware"
    }),
    initCreateForm() {
      this.uploaded = false;
      this.uploadPercentage = 0;
      this.uploadStatus = "";
      this.$refs["createForm"].resetFields();
    },
    search() {
      this.getCoursewareList({ subject: this.searchForm.subject });
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
          this.createCourseware(payload).then(res => {
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
          this.removeCourseware({ id: item.id }).then(res => {
            this.$message.success("操作成功 ");
            this.getCoursewareList({ subject: this.searchForm.subject });
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
    onUploadFile(e) {
      let self = this;
      let file = e.file.slice();
      self.filename = e.file.name;
      //   console.log(e);
      browserMD5File(file, (err, md5) => {
        let filename =
          self.createForm.subject + "/" + md5 + this.get_suffix(e.file.name);
        let key = this.combineURLs(CoursewareBasePath, filename);
        //   console.log(file);
        self.createForm.md5 = md5;
        self.createForm.size = e.file.size;
        var sts_token_url = "/ali_sts";

        this.$http.get(sts_token_url).then(res => {
          var creds = res.data.token;
          var client = new oss.Wrapper({
            region: OssConfig.region,
            endpoint: OssConfig.endpoint,
            bucket: OssConfig.bucket,
            cname: OssConfig.cname,
            secure: OssConfig.secure,
            accessKeyId: creds.AccessKeyId,
            accessKeySecret: creds.AccessKeySecret,
            stsToken: creds.SecurityToken
          });
          client
            .multipartUpload(key, file, {
              progress: (p, cpt, re) => {
                return function(done) {
                  console.log(re);
                  console.log(cpt);
                  e.percentage = e.file.percentage = ~~(p * 100);
                  e.onProgress(e, p, cpt, re);
                  done();
                };
              }
            })
            .then(function(res) {
              self.createForm.absolute_url = client.generateObjectUrl(
                res.name,
                CoursewareDomain
              );
              self.createForm.file_path = res.name;
              e.onSuccess(res);
              self.uploaded = true;
              self.uploadStatus = "success";
              //   return listFiles(client);
            })
            .catch(err => {
              self.uploadStatus = "exception";
              e.onError(err);
            });
        });
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
  
  