<template>

    <div class="student-picker">
        <div v-show="!showAddStudentModal" class="">
        <h3 class="text-info text-center" v-show="!showAddStudentModal">请为您选的课程选择一个学员</h3>

        <el-form v-if="!student" @keydown.native.enter.prevent="()=>{}" @keyup.enter.native="onSearch" :inline="true" size="small" class="search-form" ref="searchForm" :rules="searchFormRules" :model="searchForm">
                <el-form-item prop="mobile">
                    <el-input style="width:320px" v-model="searchForm.mobile" clearable placeholder="输入学员家长的手机号查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onSearch" :loading="loading" icon="el-icon-search">查询</el-button><span class="text-info" style="margin:0 10px">或者</span>
                    <el-button type="text" size="medium"  @click="onCreateStudent" icon="el-icon-edit-outline">创建新学员</el-button>
                </el-form-item>
        </el-form>
        <el-row v-if="!student&&showEmpty">
            <empty-data-view>
                <div class="">学员不存在，<el-button type="text"  @click="onCreateStudent" icon="el-icon-edit-outline">创建新学员</el-button></div>
            </empty-data-view>
        </el-row>
        <el-row v-if="student">
            <small class="text-info">当前选择的学员</small>
            <div class="student-info">
                <div class="student-item block">
                <div class="col-1">
                  <img class="img-circle" :src="student.avatar_url?student.avatar_url:(student.gender==1?student_avatar_boy:student_avatar_girl)"
                                  :alt="student.name">
                  <i style="float:right" :class="[student.gender==1 ? 'icon-gender-male student-gender-male' : 'icon-gender-female student-gender-female']" class="emp-gender icon iconfont "></i>
                  <div class="student-fileds">{{student.name}}</div>
                </div>
                <div class="col-2">
                  <div class="student-fileds"><span class="">编号:</span><span>{{student.student_no}}</span></div>
                  <div class="student-fileds"><span>睿乐账号:</span><span>{{student.mobile}}</span></div>
                  <div class="student-fileds"><span>年龄:</span><span>{{student.birthday}}<span class="text-danger">({{student.birthday|age}})</span></span></div>
                </div>
                <div class="col-3">
                  <div class="student-fileds" v-for="(parent, index) in student.parents" :key="parent.relation">
                    <span v-if="index<4"><span>{{ parent.relation }}<span v-if="parent.name">({{parent.name}})</span>:{{parent.mobile}}</span></span>
                  </div>
                </div>
                <div class="col-4"><el-button icon="el-icon-edit" size="small" plain @click="onEditStudent">修改信息</el-button></div>
              </div>
            </div>
        </el-row>
        <el-row v-if="student" class="pull-right"> 
            <el-button size="medium" @click="clearCardStudent" icon="el-icon-circle-close" type="info">重新选择</el-button>
            <el-button size="medium" @click="gotoPurchase" icon="el-icon-circle-check" type="danger">确认选择，去结算</el-button></el-row>
        </div>
        <div >
        <add-student :mode="addStudentMode" :studentId="(student?student.id:'')" :school="current_school.school_id" v-if="showAddStudentModal" @success="onCreateStudentSuccess" @cancel="showAddStudentModal=false">
        <h1 slot="title">{{addStudentMode=='create'?'添加新学员':'修改学员信息'}}</h1>
        </add-student>
        </div>
    </div>
</template>
<script>
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
import AddStudent from "@/views/school/AddStudent.vue";
export default {
  data() {
    return {
      student_avatar_girl: require("@/assets/img/student_0.png"),
      student_avatar_boy: require("@/assets/img/student_1.png"),
      dialogAddStudentVisible: false,
      showAddStudentModal: false,
      addStudentMode: "create",
      loading: false,
      showEmpty: false,
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
      current_school: state => state.current_user.current_school
    }),
    ...mapGetters(["genders", "grades", "terms"]),
    student() {
      return this.$shoppingCard.student;
    },
    card() {
      return this.$shoppingCard.items || [];
    }
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
          let payload = this.searchForm;
          this.getStudentByMobile(payload)
            .then(stu => {
              if (stu && stu.data) {
                this.showEmpty = false;
                this.$shoppingCard.student = Object.assign({}, stu.data);
              } else {
                this.showEmpty = true;
              }
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
            });
        }
      });
    },
    clearCardStudent() {
      this.$shoppingCard.student = undefined;
    },
    onCreateStudent() {
      this.showAddStudentModal = true;
      this.addStudentMode = "create";
    },
     onEditStudent() {
      this.showAddStudentModal = true;
      this.addStudentMode = "edit";
    },
    onCreateStudentSuccess(mobile) {
      this.getStudentByMobile({ mobile: mobile })
        .then(stu => {
          if (stu && stu.data) {
            this.showEmpty = false;
            this.$shoppingCard.student = Object.assign({}, stu.data);
          } else {
            this.showEmpty = true;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
        this.showAddStudentModal=false;
    },
    gotoPurchase(){
        this.$emit('student-picked')
    }
  },
  components: {
    AddStudent
  }
};
</script>
<style scoped>
.student-picker {
  margin: 0 auto;
  max-width: 1024px;
}
.student-picker .search-form {
  margin-top: 150px;
  text-align: center;
}
.student-info .student-item {
  background-color: #ffffff;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  padding: 20px;
  margin-bottom: 15px;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  color: #606266;
}

.student-item .col-1 {
  width: 120px !important;
  text-align: center;
  border-right: 1px solid #ebeef5;
  padding-left: 0px !important;
  /* order: 1; */
}
.student-item .col-2 {
  width: 200px;
  /* order: 2; */
}
.student-item .col-3 {
  flex: 1;
  /* order: 3; */
}
.student-item .col-4 {
  /* border-right: 1px solid #ebeef5; */
  width: 120px !important;
  /* order: 1; */
}

.student-item .student-fileds .fileds-title {
  width: 80px;
  display: inline-block;
}
.student-item .student-fileds .fileds-counter {
  font-size: 20px;
  line-height: 12px;
}
.student-item div[class^="col-"] {
  padding-left: 15px;
  padding-right: 15px;
  width: 200px;
}
.student-item .student-fileds {
  padding: 8px 0px;
  overflow: hidden;
  white-space: nowrap;
  word-break: normal;
  text-overflow: ellipsis;
}
.student-item:not(.disabled) .student-gender-male {
  color: #409eff;
  color: rgba(64, 158, 255, 0.5);
}

.student-item:not(.disabled) .student-gender-female {
  color: #f56c6c;
  color: rgba(245, 108, 108, 0.5);
}
</style>


