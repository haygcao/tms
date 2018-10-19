<template>
    <div class="updates-list">
  <el-row>
     <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item>RTS客户端更新</el-breadcrumb-item>
      </el-breadcrumb>
     </div>
  </el-row>
   <el-row>
    <el-button @click="onCreate" icon="el-icon-plus" type="danger" size="small" round>新建版本</el-button>
  </el-row>
    <el-row>
  <el-table
    :data="versionList||[]"
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
      prop="version"
      width="80"
      label="版本">
    </el-table-column>
    <el-table-column label="创建时间">
        <template slot-scope="scope">
        <span>{{scope.row.created_at|formatDateTime("YYYY-MM-DD H:mm")}}</span>
        </template>
    </el-table-column>
     <el-table-column
      prop="description"
      width="200"
      label="描述">
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
      label="文件地址">
       <template slot-scope="scope">
          <a target="_blank" :href="scope.row.download_url">{{ scope.row.download_url }}</a>
      </template>
    </el-table-column>
    <el-table-column
      label="状态"
      width="100">
      <template slot-scope="scope">
          
        <el-button v-if="scope.row.state==0" @click="handleUpdateClick(scope.row)" type="text" size="small">上线</el-button>
        <span v-if="scope.row.state==1" class="text-success">已上线</span>
        <el-button v-if="scope.row.state==0" @click="handleRemoveClick(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </el-row>
  <el-dialog fullscreen="" title="发布更新包" center :visible.sync="dialogCreateVisible" :close-on-click-modal="false"	>
        <el-form style="max-width:480px;margin:0 auto;" size="medium" :rules="createRules" :model="createForm" label-width="100px" label-position="right" ref="createForm">
            <el-form-item label="版本" prop="version" >
                <el-input v-model="createForm.version" placeholder="semver规范，如（1.0.0-beta1）"></el-input>
            </el-form-item>
             <el-form-item label="描述" prop="description" >
                <el-input type="textarea" v-model="createForm.description" placeholder="描述"></el-input>
            </el-form-item>
             <el-form-item label="更新包地址" prop="download_url">
                 <!-- <span>{{createForm.download_url}}</span> -->
                 <el-input v-model="createForm.download_url" readonly="" placeholder="download_url"></el-input>
                <el-upload v-if="!createForm.download_url"
            class="upload-demo"
            accept=".exe"
            action="http://reallyedu.oss-cn-beijing.aliyuncs.com"
            :show-file-list="true"
            :disabled="uploader.isUploading"
            :on-remove="handleUploadFileRemove"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :http-request="onUploadFile">
            <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            </el-form-item>
            <!-- <el-form-item label="下载地址" prop="download_url" v-if="createForm.download_url">
                 <el-input v-model="createForm.version" placeholder=""></el-input>
            </el-form-item> -->
            <el-form-item label="文件大小" prop="size" v-if="createForm.size">
                <span>{{createForm.size}}</span>
            </el-form-item>
            <el-form-item label="MD5" prop="md5" v-if="createForm.md5">
                <span>{{createForm.md5}}</span>
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
  ResourceOssConfig,
  RTSClientPath,
  RTSClientDownloadDomain
} from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      uploader: {
        isUploading: false,
        file: undefined
      },
      createForm: {
        size: undefined,
        md5: undefined,
        version: undefined,
        description: undefined,
        download_url: undefined
      },
      createRules: {
        version: [
          { required: true, message: "请填写版本号", trigger: "blur" },
          {
            pattern: /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(\+[0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*)?$/,
            message: "版本号遵循semver规范",
            trigger: "blur"
          }
        ],
        download_url: [
          { required: true, message: "请上传安装包", trigger: "blur" }
        ]
      },
      dialogCreateVisible: false
    };
  },
  computed: {
    ...mapState({
      versionList: state => state.rts_client_update.list.data || []
    })
  },
  mounted() {
    this.getRTSClientVersionList();
  },
  activated() {},
  methods: {
    ...mapActions({
      createRTSClientVersion: "createRTSClientVersion",
      releaseRTSClient: "releaseRTSClient",
      getRTSClientVersionList: "getRTSClientVersionList",
      deleteRTSClientVersion: "deleteRTSClientVersion"
    }),
    initCreateForm() {
      this.$refs["createForm"].resetFields();
      this.createForm.md5 = undefined;
      this.createForm.size = undefined;
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
          this.createRTSClientVersion(payload).then(res => {
            if (res && res.code == 0) {
              this.$message.success("保存成功 ");
              this.getRTSClientVersionList();
            } else {
              this.$message.error("保存失败  " + res.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    handleUpdateClick(item) {
      this.$confirm("上线后不可撤销，确认上线？").then(_ => {
        this.releaseRTSClient({ id: item.id }).then(res => {
          this.$message.success("操作成功 ");
          this.getRTSClientVersionList();
        });
      });
    },
    handleRemoveClick(item) {
      this.$confirm("确认删除？")
        .then(_ => {
          this.deleteRTSClientVersion({ id: item.id }).then(res => {
            this.$message.success("操作成功 ");
            this.getRTSClientVersionList();
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
    computeMD5(file) {
      return new Promise((resolve, reject) => {
        browserMD5File(file, (err, md5) => {
          if (err) {
            return reject(err);
          }
          return resolve(md5.toUpperCase());
        });
      });
    },

    async onUploadFile(e) {
      let self = this;
      //   self.uploader.file = e.file;
      //   console.log()
      self.uploader.isUploading = true;
      let file = e.file.slice();
      self.filename = e.file.name;
      let md5 = await self.computeMD5(file);
      let key = this.combineURLs(RTSClientPath, e.file.name.trim());
      self.createForm.md5 = md5;
      self.createForm.size = e.file.size;
      var sts_token_url = "/ali_sts";

      let token_res = await this.$http.get(sts_token_url);
      var creds = token_res.data.token;
      var client = new oss.Wrapper({
        region: ResourceOssConfig.region,
        endpoint: ResourceOssConfig.endpoint,
        bucket: ResourceOssConfig.bucket,
        cname: ResourceOssConfig.cname,
        secure: ResourceOssConfig.secure,
        accessKeyId: creds.AccessKeyId,
        accessKeySecret: creds.AccessKeySecret,
        stsToken: creds.SecurityToken
      });
      try {
        let ret = await client.multipartUpload(key, file, {
          progress: async function(p, cpt, re) {
            let ev = {};
            e.percent = e.file.percentage = ~~(p * 100);
            e.onProgress(e);
          }
        });
        self.uploader.isUploading = false;
        if (ret.res.statusCode === 200) {
          self.createForm.download_url = client.generateObjectUrl(
            ret.name,
            RTSClientDownloadDomain
          );
          e.onSuccess(ret, e.file);
        } else {
          e.onError("上传失败");
        }
      } catch (err) {
        e.onError("上传失败", e.file);
      }
    },
    handleUploadFileRemove(file, fileList) {
      console.log(file, fileList);
    },
    uploadError(res, file, fileList) {
      this.$message.error(res || "上传失败");
    },
    uploadSuccess(res, file, fileList) {
      this.uploader.file = file;
      console.log("upload-success======>", res, file, fileList);
    }
  }
};
</script>
  
  