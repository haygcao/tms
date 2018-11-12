<template>
    <div class="course-list">
  <el-row>
     <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>班型设置</el-breadcrumb-item>
      </el-breadcrumb>
     </div>
  </el-row>
   <el-row>
    <el-button @click="onCreate" icon="el-icon-plus" type="danger" size="small" round>新增班型</el-button>
  </el-row>
    <el-row>
  <el-table
    :data="clazzTypeList"
    stripe
    border=""
    style="width: 100%">
    <el-table-column
      prop="id"
      label="ID"
      >
    </el-table-column>
     <el-table-column
     width="80"
      label="名称">
       <template slot-scope="scope">
          {{ scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column
      label="说明">
       <template slot-scope="scope">
          {{ scope.row.description }}
      </template>
    </el-table-column>
    <el-table-column
      label="是否启用">
       <template slot-scope="scope">
          {{ scope.row.state>0?'已启用':'未启用' }}
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="120">
      <template slot-scope="scope">
        <el-button @click="handleUpdateClick(scope.row)" type="text" size="small">修改</el-button>
        <el-button v-if="scope.row.state<1" @click="handleUpdateStateClick(scope.row)" type="text" size="small">启用</el-button>
      </template>
    </el-table-column>
  </el-table>
  </el-row>
  <el-dialog  title="新增班型" center :visible.sync="dialogCreateVisible" :close-on-click-modal="false"	>
        <el-form size="medium" :rules="createRules" :model="createForm" label-width="100px" label-position="right" ref="createForm">
            
            <el-form-item label="ID" prop="id" >
                <el-input v-model="createForm.id" :maxlength="10" placeholder="1"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name" >
               <el-input type="text" v-model="createForm.name" :maxlength="10" placeholder="知识点"></el-input>
            </el-form-item>
             <el-form-item label="描述" prop="description" >
                <el-input type="textarea" v-model="createForm.description" placeholder="描述"></el-input>
            </el-form-item>
            <el-form-item label="是否启用">
                <el-switch v-model="createForm.state" :active-value="1"
                    :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="submitCreate">确定</el-button>
            </el-form-item>
          </el-form>
  </el-dialog>
  <el-dialog  title="修改班型" center :visible.sync="dialogUpdateVisible" :close-on-click-modal="false"	>
        <el-form size="medium" :rules="updateRules" :model="updateForm" label-width="100px" label-position="right" ref="updateForm">
            <el-form-item label="名称" prop="name" >
               <el-input type="text" v-model="updateForm.name" :maxlength="10" placeholder="知识点"></el-input>
            </el-form-item>
             <el-form-item label="描述" prop="description" >
                <el-input type="textarea" v-model="updateForm.description" placeholder="描述"></el-input>
            </el-form-item>
            <el-form-item label="是否启用">
                <el-switch v-model="updateForm.state" :active-value="1"
                    :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="onUpdateSubmit">确定</el-button>
            </el-form-item>
          </el-form>
  </el-dialog>
  </div>
      
  </template>
  <script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      updateForm: {
        id: undefined,
        name: undefined,
        state: 1,
        description: undefined
      },

      createForm: {
        id: undefined,
        name: undefined,
        description: undefined,
        state: 0
      },
      updateRules: {
        name: [{ required: true, message: "请填写名称", trigger: "blur" }]
      },
      createRules: {
        id: [
          { required: true, message: "填写id", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("填写id"));
              }
              this.checkClazzTypeExist({
                id: value
              }).then(res => {
                if (res && res.code == 0 && res.data == true) {
                  return callback(new Error("id重复"));
                } else {
                  return callback();
                }
              });
            },
            trigger: "blur"
          }
        ],
        name: [{ required: true, message: "请填写名称", trigger: "blur" }]
        // file_path: [
        //   { required: true, message: "请输入文件地址", trigger: "blur" }
        // ]
      },
      dialogCreateVisible: false,
      dialogUpdateVisible: false
    };
  },
  computed: {
    ...mapState({
      clazzTypeList: state => state.clazz_type.list.data || []
    })
    // ...mapGetters(["subjects", "course_settings"])
  },
  mounted() {
    this.getAllClazzTypeList();
  },
  methods: {
    ...mapActions({
      getAllClazzTypeList: "getAllClazzTypeList",
      getClazzTypeById: "getClazzTypeById",
      updateClazzType: "updateClazzType",
      createClazzType: "createClazzType"
    }),
    initCreateForm() {
      this.$refs["createForm"].resetFields();
    },
    checkClazzTypeExist({ id }) {
      return this.getClazzTypeById({ id });
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
          this.createClazzType(payload).then(res => {
            if (res && res.code == 0) {
              this.$message.success("保存成功 ");
              this.getAllClazzTypeList();
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
      this.dialogUpdateVisible = true;
      this.updateForm.id = item.id;
      this.updateForm.name = item.name;
      this.updateForm.state = item.state;
      this.updateForm.description = item.description;
    },
    onUpdateSubmit() {
      this.$refs["updateForm"].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.updateForm);
          let res = this.updateClazzType(payload).then(res => {
            if (res && res.code == 0) {
              this.$message.success("保存成功 ");
              this.getAllClazzTypeList();
            } else {
              this.$message.error("保存失败  " + res.message);
            }
          });
        }
      });
    },
    async handleUpdateStateClick(item) {
      try {
        let c = await this.$confirm("确认删除？");
        if (c) {
          let res = await this.updateClazzType({ state: 1, id: item.id });
          if (res && res.code == 0) {
            this.$message.success("操作成功 ");
            await this.getAllClazzTypeList();
          }
        }
      } catch (e) {}
    }
  }
};
</script>
  
  