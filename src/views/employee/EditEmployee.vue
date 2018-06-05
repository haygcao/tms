<template>
  <div class="employee-form-wrap">
    <el-row>
      <el-form size="small" ref="createForm_d" :model="createForm" :label-position="labelPosition" :label-width="labelWidth"
        class="create-form">
        <el-form-item label="员工编号">
          <span>{{createForm.employee_no}}</span>
        </el-form-item>
        <el-form-item label="账号(手机号)">
          <span>{{createForm.mobile}}</span>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-form :disabled="createForm.state!=1" size="small" ref="createForm" :model="createForm" :rules="createFormRules" :label-position="labelPosition" :label-width="labelWidth"
        class="create-form">
        <div class="horization-line">
          <span class="title">基本信息</span>
        </div>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="createForm.name" placeholder="员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="英文名">
          <el-col :span="12">
            <el-input v-model="createForm.first_name_en" placeholder="First name"></el-input>
          </el-col>
          <el-col class="text-center" :span="1">·</el-col>
          <el-col :span="11">
            <el-input v-model="createForm.last_name_en" placeholder="Last name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="createForm.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="id_card">
          <el-input v-model="createForm.id_card" placeholder="身份证号"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="生日" v-model="createForm.birthday"></el-date-picker>
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

        <div class="horization-line">
          <span class="title">职位信息</span>
        </div>
        <el-form-item label="入职日期" prop="hire_date">
          <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="入职日期" v-model="createForm.hire_date"></el-date-picker>
        </el-form-item>
        <el-form-item label="职位" prop="job_title">
          <el-select v-model="createForm.job_title" placeholder="职位">
            <el-option v-for="item in jobTitles" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位类型" prop="job_type">
          <el-select v-model="createForm.job_type" placeholder="职位类型">
            <el-option v-for="item in job_types" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isAddTeacher()" label="毕业院校" prop="graduated_from">
          <el-input v-model="createForm.graduated_from" placeholder="毕业院校"></el-input>
        </el-form-item>
        <el-form-item v-if="isAddTeacher()" label="教学特点" prop="teaching_features">
          <el-input type="textarea" v-model="createForm.teaching_features" placeholder="教学特点"></el-input>
        </el-form-item>
        <el-form-item v-if="isAddTeacher()" label="教学成果" prop="teaching_achievement">
          <el-input type="textarea" v-model="createForm.teaching_achievement" placeholder="教学成果"></el-input>
        </el-form-item>
        <el-form-item label="隶属校区" prop="schools">
          <el-checkbox-group v-model="createForm.schools">
            <el-checkbox v-if="!muti_school" :label="schools[0].name" :disabled="true" checked border></el-checkbox>
            <el-checkbox v-if="muti_school" v-for="item in schools" :key="item.id" :label="item.id" border>{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :disabled="!createForm.employee_no">保存</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "create-employee",
  props: {
    employeeId: { type: String, required: true }
  },
  data() {
    return {
      labelPosition: "left",
      labelWidth: "100px",
      createForm: {
        employee_no: undefined,
        employee_number: undefined,
        name: undefined,
        state: undefined,
        job_title: undefined,
        first_name_en: undefined,
        last_name_en: undefined,
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
      created_success: false
    };
  },
  computed: {
    ...mapState({
      employee_detail: state => state.employee.employee_detail.data || {}
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
  },
  created() {},
  activated() {
    this.getEmployee({ employee_id: this.employeeId }).then(res => {
      if (res.code == 0) {
        this.createForm = Object.assign({}, res.data);
        this.createForm.schools = this.createForm.schools.map(v => v.id);
      }
    });
  },
  deactivated() {
    this.resetForm();
  },
  mounted() {},
  methods: {
    ...mapActions(["getEmployee", "checkAccountExist", "updateEmployee"]),
    isAddTeacher() {
      return this.createForm.job_title == "teacher";
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
          this.updateEmployee(payload).then(res => {
            if (res && res.code == 0) {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.$emit('success');
            } else {
              this.$message({
                message: res.message || "保存失败",
                type: "error"
              });
            }
          });
        }
      });
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

.horization-line {
  border-bottom: 1px solid #EBEEF5;
  margin: 30px 0px;
  position: relative;
}

.horization-line .title {
  position: absolute;
  display: inline-block; // background-color: #f68a87;
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

.info-collapse-item__header {
  height: 48px;
  line-height: 48px;
  color: #303133;
  cursor: pointer;
  border-top: 1px solid #ebeef5;
  font-size: 13px;
  font-weight: 500;
  -webkit-transition: border-bottom-color 0.3s;
  transition: border-bottom-color 0.3s;
  outline: 0;
}

.emp-fileds {
  margin-left: 20px;
  font-weight: normal;
}
</style>