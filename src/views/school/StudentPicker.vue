<template>
    <div>
        <el-form @keyup.enter.native="onSearch" :inline="true" size="small" class="search-form" ref="searchForm" :rules="searchFormRules" :model="searchForm">
                <el-form-item prop="mobile">
                    <el-input v-model="searchSudentForm.mobile" clearable placeholder="输入学员家长的手机号查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onSearch" :loading="loading" icon="el-icon-search">查询</el-button>
                    <el-button type="text"  @click="onCreateStudent" icon="el-icon-edit-outline">创建新学员</el-button>
                </el-form-item>
        </el-form>
        <el-row>
            <el-form class="student-info-form" disabled label-position="right" size="small" :model="student" :inline="true">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="student.data.name"></el-input>
                </el-form-item>
                <el-form-item label="英文名">
                    <el-input v-model="student.data.name_en"></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="student.data.nickname"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="student.data.gender" style="width:178px;" placeholder="性别">
                        <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item prop="birthday" label="生日">
                        <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="生日" v-model="student.data.birthday"></el-date-picker>
                </el-form-item>
                <el-form-item> <span class="text-info">年龄:{{student.data.birthday|age}}</span></el-form-item>
            </el-form>
            <el-form v-for="(parentForm ,index) in student.data.parents" :key="index" size="small" class="parent-form" :inline="true" disabled :model="parentForm">
                <el-form-item prop="relation" :label="'家长'+(index+1)">
                    <el-input v-model="parentForm.relation"></el-input>
                </el-form-item>
                <el-form-item prop="name" label="姓名">
                    <el-input v-model="parentForm.name"></el-input>
                </el-form-item>
                <el-form-item prop="mobile" label="手机">
                    <el-input v-model="parentForm.mobile"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="parentForm.email" ></el-input>
                </el-form-item>
            </el-form>
        </el-row>
    </div>
</template>
<script>
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
import AddStudent from "@/views/school/AddStudent.vue";
export default {
  data() {
    return {
      teacher_avatar_man: require("@/assets/img/teacher_1.png"),
      teacher_avatar_woman: require("@/assets/img/teacher_0.png"),
      dialogAddStudentVisible: false,
      addStudentMode: "create",
      searchForm: {
        mobile: undefined
      },
      searchFormRules: {
        mobile: [
          {
            pattern: /^1[34578]\d{9}$/,
            message: "只支持中国大陆手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      current_school: state => state.current_user.current_school,
      student: state => state.order.student || {}
    })
  },
  methods: {
    ...mapActions({
      getStudentByMobile: "getOrderStudentByMobile",
      checkStudentExist: "checkStudentExist",
      createStudent: "createStudent",
      addStudentParent: "addStudentParent"
    }),
    onSearch() {
      if (this.searchForm.mobile == null) {
        return false;
      }
      this.$refs["searchForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.loadedStudent = false;
          let payload = this.searchForm;
          this.getStudentByMobile(payload).then(() => {
            this.loadedStudent = true;
            this.loading = false;
          });
        }
      });
    },
    onCreateStudent() {
      this.dialogAddStudentVisible = true;
      this.addStudentMode = "create";
    }
  }
};
</script>

