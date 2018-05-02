<template>
  <div class="employee">
   <el-row >
     <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/employee' }">业务管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/employee/1' }">员工管理</el-breadcrumb-item>
        <el-breadcrumb-item >新增员工</el-breadcrumb-item>
      </el-breadcrumb>
     </div>
    
  </el-row>
  <el-row>
    <el-form ref="createForm" :model="createForm" label-width="180px" class="create-form">
      <el-form-item label="员工编号" >
           <label >{{createForm.employee_no}}</label>
      </el-form-item>
      <el-form-item label="姓名" prop="name" :rules="[
            { required: true, message: '请输入姓名', trigger: 'blur' },
            ]">
        <el-input v-model="createForm.name" placeholder="员工姓名"></el-input>
      </el-form-item>
      <el-form-item label="英文名">
        <el-col :span="11">
        <el-input v-model="createForm.first_name_en" placeholder="first name"></el-input>
        </el-col>
        <el-col class="text-center" :span="2">-</el-col>
        <el-col :span="11">
        <el-input v-model="createForm.last_name_en" placeholder="last name"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="手机号(登录睿乐系统)" prop="mobile" :rules="[
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern : /^1[34578]\d{9}$/, message: '只支持中国大陆的手机号码', trigger: 'blur' },
            ]">
          <el-col :span="24">
          <el-input v-model="createForm.mobile" placeholder="手机号为登录睿乐系统的账号"></el-input>
          </el-col>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ]">
          <el-input v-model="createForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="id_card" :rules="[
            { required: true, message: '请输入身份证号', trigger: 'blur' },
            ]">
          <el-input v-model="createForm.id_card" placeholder="身份证号"></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="birthday" :rules="[
            { required: true, message: '请输入生日', trigger: 'blur' },
            ]">
        <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="生日" v-model="createForm.birthday" ></el-date-picker>
      </el-form-item>
      <el-form-item label="性别" prop="gender" :rules="[
            { required: true, message: '请选择性别', trigger: 'blur' },
            ]">
        <el-select v-model="createForm.gender" placeholder="性别">
          <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="婚姻状况" prop="marital_status" :rules="[
            { required: true, message: '请选择婚姻状况', trigger: 'blur' },
            ]">
        <el-select v-model="createForm.marital_status" placeholder="婚姻状况">
          <el-option v-for="item in marital_status" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学历" prop="marital_status" :rules="[
            { required: true, message: '请填写学历', trigger: 'blur' },
            ]">
        <el-select v-model="createForm.marital_status" placeholder="学历">
          <el-option v-for="item in educations" :key="item.key" :label="item.name" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      
    <div class="horization-line"></div>
      <el-form-item label="入职日期" prop="hire_date" :rules="[
            { required: true, message: '请输入入职日期', trigger: 'blur' },
            ]">
        <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="入职日期" v-model="createForm.hire_date" ></el-date-picker>
      </el-form-item>
      <el-form-item label="职位" prop="job_title" :rules="[
            { required: true, message: '请输入职位', trigger: 'blur' },
            ]">
        <el-select v-model="createForm.job_title" placeholder="职位">
          <el-option
            v-for="item in jobTitles"
            :key="item.key"
            :label="item.name"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="isAddTeacher()" label="毕业院校" prop="graduated_from" :rules="[
            { required: true, message: '请输入毕业院校', trigger: 'blur' },
            ]">
          <el-input v-model="createForm.graduated_from" placeholder="毕业院校"></el-input>
      </el-form-item>
      <el-form-item v-if="isAddTeacher()"  label="教学特点" prop="teaching_features" :rules="[
            { required: true, message: '请输入教学特点', trigger: 'blur' },
            ]">
          <el-input type="textarea" v-model="createForm.teaching_features" placeholder="教学特点"></el-input>
      </el-form-item>
      <el-form-item  v-if="isAddTeacher()" label="教学成果" prop="teaching_achievement" :rules="[
            { required: true, message: '请输入教学成果', trigger: 'blur' },
            ]">
          <el-input type="textarea" v-model="createForm.teaching_achievement" placeholder="教学成果"></el-input>
      </el-form-item>
      <el-form-item label="隶属校区" prop="schools">
        <el-checkbox-group v-model="createForm.schools">
        <el-checkbox label="备选项1" border></el-checkbox>
        <el-checkbox label="备选项2" border ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" icon="el-icon-search">保存</el-button>
      </el-form-item>
    </el-form>
  </el-row>
  <el-row>

  </el-row>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      genders: [{ value: 1, label: "男" }, { value: 0, label: "女" }],
      marital_status: [
        { value: 1, label: "已婚" },
        { value: 0, label: "未婚" }
      ],
      createForm: {
        employee_no: "123",
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
        job_type: undefined,
        hire_date: undefined,
        graduated_from: undefined,
        teaching_features: undefined,
        teaching_achievement: undefined,
        schools: []
      }
    };
  },
  computed: {
    ...mapState({
      jobTitles: state => state.metadata.jobTitles,
      educations: state => state.metadata.educations,
      createResult: state => state.employee.create_result
    })
  },
  mounted() {
    this.getJobTitles();
    this.getEducations();
  },
  methods: {
    ...mapActions([
      "getJobTitles",
      "getEducations",
      "getEmployeeList",
      "createEmployee"
    ]),
    isAddTeacher() {
      return this.createForm.job_title == "teacher";
    },
    onSubmit() {
      let self = this;
      this.$refs["createForm"].validate(valid => {
        if (valid) {
          let payload = self.createForm;
          this.createEmployee(payload);
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.create-form .el-form-item {
    max-width: 600px;
}

.horization-line {
    border-bottom: 1px solid #EBEEF5;
    margin-top: 15px;
    margin-bottom: 15px;
}
</style>

