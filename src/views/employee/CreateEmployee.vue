<template>
  <div class="employee-form-wrap">
  <el-row v-show="!created_success">
    <el-form size="small" ref="createForm" :model="createForm" :rules="createFormRules" :label-position="labelPosition"  label-width="180px" class="create-form">
      <el-form-item label="员工编号" >
           <label v-loading="loading_emp_no" 
           element-loading-spinner="el-icon-loading"
           >{{createForm.employee_no}}</label>
      </el-form-item>
       <div class="horization-line"><span class="title">基本信息</span></div>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="createForm.name" placeholder="员工姓名"></el-input>
      </el-form-item>
      <el-form-item label="英文名">
        <el-col :span="12">
        <el-input  v-model="createForm.first_name_en" placeholder="First name"></el-input>
        </el-col>
        <el-col class="text-center" :span="1">·</el-col>
        <el-col :span="11">
        <el-input v-model="createForm.last_name_en" placeholder="Last name"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
          <el-col :span="12">
          <el-input v-model="createForm.mobile" placeholder="手机号为登录睿乐系统的账号"></el-input>
          </el-col>
          <el-col :span="12"><span class="text-danger">(登录睿乐系统,设置后不可更改)</span></el-col>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
          <el-input v-model="createForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="id_card">
          <el-input v-model="createForm.id_card" placeholder="身份证号"></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="生日" v-model="createForm.birthday" ></el-date-picker>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="createForm.gender" placeholder="性别">
          <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="婚姻状况" prop="marital_status">
        <el-select v-model="createForm.marital_status" placeholder="婚姻状况">
          <el-option v-for="item in marital_status" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学历" prop="education">
        <el-select v-model="createForm.education" placeholder="学历">
          <el-option v-for="item in educations" :key="item.key" :label="item.name" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      
    <div class="horization-line"><span class="title">职位信息</span></div>
      <el-form-item label="入职日期" prop="hire_date">
        <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="入职日期" v-model="createForm.hire_date" ></el-date-picker>
      </el-form-item>
      <el-form-item label="职位" prop="job_title">
        <el-select v-model="createForm.job_title" placeholder="职位">
          <el-option
            v-for="item in jobTitles"
            :key="item.key"
            :label="item.name"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职位类型" prop="job_type">
        <el-select v-model="createForm.job_type" placeholder="职位类型">
          <el-option
            v-for="item in job_types"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="isAddTeacher()" label="毕业院校" prop="graduated_from">
          <el-input v-model="createForm.graduated_from" placeholder="毕业院校"></el-input>
      </el-form-item>
      <el-form-item v-if="isAddTeacher()"  label="教学特点" prop="teaching_features">
          <el-input type="textarea" v-model="createForm.teaching_features" placeholder="教学特点"></el-input>
      </el-form-item>
      <el-form-item  v-if="isAddTeacher()" label="教学成果" prop="teaching_achievement">
          <el-input type="textarea" v-model="createForm.teaching_achievement" placeholder="教学成果"></el-input>
      </el-form-item>
      <el-form-item label="隶属校区" prop="schools">
        <el-checkbox-group v-model="createForm.schools">
        <el-checkbox v-if="!muti_school" :label="schools[0].id" :disabled="true" checked border>{{schools[0].name}}</el-checkbox>
        <el-checkbox v-if="muti_school" v-for="item in schools" :key="item.id" :label="item.id" border>{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :disabled="!createForm.employee_no">保存</el-button>
      </el-form-item>
    </el-form>
  </el-row>
  <el-row v-show="created_success">
    <h2 class="text-center text-success">
    <i class="el-icon-success" style="margin-right:10px"></i><span>创建成功！</span><el-button @click="onContinue" type="primary">继续添加</el-button>
    </h2>
  </el-row>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "create-employee",
  data() {
    return {
      createForm: {
        employee_no: undefined,
        employee_number: undefined,
        name: undefined,
        state: undefined,
        job_title: undefined,
        first_name_en: "",
        last_name_en: "",
        gender: undefined,
        birthday: undefined,
        id_card: undefined,
        native_place: undefined,
        marital_status: undefined,
        job_type: 0,
        hire_date: undefined,
        graduated_from: undefined,
        education: undefined,
        teaching_features: undefined,
        teaching_achievement: undefined,
        schools: []
      },
      createFormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur，change" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur，change" },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "只支持中国大陆手机号码",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请输入手机号"));
              }
              this.checkAccountExist({
                mobile: value
              }).then(res => {
                if (res && res.code == 0 && res.data == true) {
                  return callback(new Error("手机号已占用，请更换一个手机号"));
                } else {
                  return callback();
                }
              });
            },
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        id_card: [
          {
            required: true,
            message: "请输入身份证号",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
            message: "只支持中国大陆身份证",
            trigger: "blur"
          }
        ],
        birthday: [
          {
            required: true,
            message: "请输入生日",
            trigger: ["blur", "change"]
          },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请填写生日"));
              }
              if (Date.now() - new Date(value) < 0) {
                return callback(new Error("请填写正确的生日"));
              }
              return callback();
            },
            trigger: "blur"
          }
        ],
        gender: [
          { required: true, message: "请选择性别", trigger: ["blur", "change"] }
        ],
        education: [
          { required: true, message: "请填写学历", trigger: ["blur", "change"] }
        ],
        hire_date: [
          {
            required: true,
            message: "请输入入职日期",
            trigger: ["blur", "change"]
          }
        ],
        // job_type: [
        //   {
        //     required: true,
        //     message: "请输入职位类型",
        //     trigger: ["blur", "change"]
        //   }
        // ],
        job_title: [
          { required: true, message: "请输入职位", trigger: ["blur", "change"] }
        ],
        graduated_from: [
          {
            required: true,
            message: "请输入毕业院校",
            trigger: ["blur", "change"]
          }
        ],
        teaching_achievement: [
          {
            required: true,
            message: "请输入教学成果",
            trigger: ["blur", "change"]
          }
        ],
        teaching_features: [
          {
            required: true,
            message: "请输入教学特点",
            trigger: ["blur", "change"]
          }
        ],
        schools: [
          {
            required: true,
            message: "请至少选择一个校区",
            trigger: ["blur", "change"]
          },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请至少选择一个校区"));
              }
              if (value.length < 1) {
                return callback(new Error("请至少选择一个校区"));
              }
              return callback();
            },
            trigger: "blur,change"
          }
        ]
      },
      loading_emp_no: false,
      created_success: false,
      labelPosition: "right"
    };
  },
  computed: {
    ...mapState({
      createResult: state => state.employee.create_result,
      pre_build_employee: state => state.employee.new_employee
    }),
    ...mapGetters([
      "jobTitles",
      "job_types",
      "educations",
      "genders",
      "marital_status"
    ]),
    schools: function() {
      let schools = this.$auth.userInfo().schools || [];
      return schools;
    },
    muti_school: function() {
      return this.schools.length >= 2;
    }
  },
  watch: {
    pre_build_employee: function(val, old) {
      this.loading_emp_no = false;
      if (val.code > 0) {
        this.$message({
          message: "无法获取到员工编号",
          type: "error"
        });
      } else {
        this.createForm.employee_no = val.data.employee_no;
        this.createForm.employee_number = val.data.employee_number;
      }
    },
    createResult: function(val, old) {
      this.afterCreated(val);
    }
  },
  created() {},
  activated() {
    this.loading_emp_no = true;
    this.generateEmployeeNo();
    this.created_success = false;
  },
  deactivated() {
    this.resetForm();
  },
  mounted() {},
  methods: {
    ...mapActions([
      "createEmployee",
      "generateEmployeeNo",
      "checkAccountExist"
    ]),
    isAddTeacher() {
      return this.createForm.job_title == "teacher";
    },
    onContinue() {
      this.resetForm();
      this.loading_emp_no = true;
      this.generateEmployeeNo();
      this.created_success = false;
    },
    onSubmit() {
      let self = this;
      this.$refs["createForm"].validate(valid => {
        if (valid) {
          let payload = self.createForm;
          // let school_names = payload.schools;
          // payload.schools = this.schools.filter(v =>
          //   school_names.includes(v.name)
          // );
          this.createEmployee(payload);
        }
      });
    },
    afterCreated(result) {
      if (result.code > 0) {
        this.$message({
          message: result.message || "保存失败",
          type: "error"
        });
      } else {
        this.created_success = true;
        this.$emit('success');
        // this.$message.success("保存成功");
        // this.resetForm();
      }
    },
    resetForm() {
      this.$refs["createForm"].resetFields();
    }
  }
};
</script>
<style lang="stylus" scoped>
.employee-form-wrap .create-form .el-form-item {
  max-width: 600px;
}

.employee-form-wrap .create-form .el-input {
  max-width: 320px;
}

.horization-line {
  border-bottom: 1px solid #EBEEF5;
  margin: 30px 0px;
  position: relative;
}

.horization-line .title {
  position: absolute;
  display: inline-block;
  // background-color: #f68a87;
  // color: #EBEEF5;
  color: #ffffff;
  background-color: #c0c4cc;
  width: 100px;
  text-align: center;
  left: 50%;
  top: -8px;
  font-size: 12px;
  line-height: 16px;
  border-radius: 8px;
  margin-left: -50px;
}
</style>

