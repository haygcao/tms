<template>
    <div class="students" >
        <el-row>
        <div class="page-breadcrumb clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>校区管理</el-breadcrumb-item>
                <el-breadcrumb-item>学员管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        </el-row>
        <el-row>
            <el-form :inline="true" size="small" ref="searchForm" @keydown.native.enter.prevent="()=>{}" :model="searchForm">
                <el-form-item prop="kw">
                    <el-input name="input_kw"  @keyup.enter.native="onEnterPress" form="noref" style="width:320px" clearable  v-model="searchForm.kw" placeholder="输入学员姓名，编号或手机号查询"></el-input>
                </el-form-item>
                <el-form-item>
                  <!-- <input type="text" style="display:none"> -->
                <el-button type="danger" @click.stop="onSearch"  icon="el-icon-search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row class="">
            <div class="student-list" v-loading="loading">
              <div class="student-item block is-show-shadow" v-for="student in studentList.rows" :key="student.id">
                <div class="tag-student-state" :class="{'active':isStudy(student)}"><span class="student-state-text">{{isStudy(student)?'在学':'不在学'}}</span></div>
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
                    <span v-if="index<4"><span>{{ parent.relation }}:{{parent.mobile}}</span></span>
                  </div>
                </div>
                <div class="col-4 clearfix">
                  <div class="student-fileds"><span class="fileds-title">累计报班:</span><span class="fileds-counter">{{student.clazz_count}}</span></div>
                  <div class="student-fileds"><span class="fileds-title">消课/购课:</span><span class="fileds-counter">{{student.consume_lesson_count}}<span style="color:#b1b1b1;font-size:14px">/</span>{{student.total_lesson_count}}</span></div>
                  <div class="student-fileds"><span class="fileds-title" title="(当前/累计)">睿乐币:</span><span class="fileds-counter">{{student.points||0}}<span style="color:#b1b1b1;font-size:14px">/</span>{{student.points_total||0}}</span></div>
                </div>
                <div class="col-5">
                    <div>
                        <el-button :disabled="!isStudy(student)" @click="onShiftSchedule(student)" class="mr-10" size="small" type="primary">调课</el-button>
                        <el-dropdown trigger="click" size="small">
                            <el-button type="danger" size="small">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item><a @click="onUpdateStudent(student)">修改资料</a></el-dropdown-item>
                                <el-dropdown-item><a @click="onResetPassword(student)" type="danger">重置密码</a></el-dropdown-item>
                                <el-dropdown-item   :disabled="!isStudy(student)"><a @click="onLockStudent(student)" type="danger" size="small">锁定</a></el-dropdown-item>
                                <el-dropdown-item divided :disabled="!isStudy(student)"><a @click="onShiftClazz(student)" type="danger" size="small">转班</a></el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
              </div>
            </div>
        </el-row>
        <el-row>
            <div class="text-center" v-show="studentList&&studentList.count>0">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage" layout="prev, pager, next" :page-size="pageSize" :total="studentList.count">
                </el-pagination>
            </div>
        </el-row>
        <el-dialog :visible.sync="dialogAddStudentVisible" fullscreen  center >
            <h1 slot="title">修改学员信息</h1>
            <add-student :mode="addStudentMode" :studentId="selectedStudentId" :school="current_school.id" v-if="dialogAddStudentVisible" @success="onCreateStudentSuccess" @cancel="dialogAddStudentVisible=false"></add-student>
        </el-dialog>
        <el-dialog :visible.sync="dialogRescheduleVisible" fullscreen  center >
          <keep-alive>
          <reschedule v-if="dialogRescheduleVisible" :student="selectedStudent"></reschedule>
          </keep-alive>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
import AddStudent from "@/views/school/AddStudent.vue";
import Reschedule from "@/views/school/Reschedule.vue";
export default {
  data() {
    return {
      searchForm: {
        kw: undefined
      },
      pageSize: 10,
      currentPage: 1,
      loading: false,
      selectedStudentId: undefined,
      dialogAddStudentVisible: false,
      dialogRescheduleVisible: false,
      selectedStudent: undefined,
      addStudentMode: "edit",
      student_avatar_girl: require("@/assets/img/student_0.png"),
      student_avatar_boy: require("@/assets/img/student_1.png")
    };
  },
  watch: {
    current_school(val, old) {
      if (val.id != old.id) {
        this.search();
      }
    }
    // $route(val, old) {
    //   let query = val.query;
    //   this.currentPage = parseInt(val.params.page);
    //   this.searchForm.kw = query.kw;
    //   this.search();
    // }
  },
  beforeRouteUpdate(to, from, next) {
    // react to route changes...
    // don't forget to call next()
    this.currentPage = to.params.page > 0 ? to.params.page : 1;
    this.searchForm = Object.assign(this.searchForm, to.query);
    this.search();
    next();
  },
  computed: {
    ...mapState({
      studentList: state => state.student.studentList.data || [],
      current_school: state => state.current_user.current_school
    })
  },
  mounted() {
    let query = this.$route.query;
    this.searchForm.kw = query.kw;
    this.currentPage =
      this.$route.params.page > 0 ? parseInt(this.$route.params.page) : 1;
    this.search();
  },
  methods: {
    ...mapActions({
      getStudentListBySchool: "getStudentListBySchool",
      resetStudentPassword: "resetStudentPassword"
    }),
    isStudy(row) {
      return row.total_lesson_count - row.consume_lesson_count > 0;
    },
    onEnterPress(event) {
      if (event && event.target.name == "input_kw") {
        this.onSearch();
      }
    },
    onSearch() {
      if (this.loading) {
        return;
      }
      this.currentPage = 1;
      this.$router.push({
        name: this.$route.name,
        params: { page: this.currentPage },
        query: { kw: this.searchForm.kw }
      });
      this.search();
    },
    search() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      let payload = Object.assign({}, this.searchForm);
      payload.limit = this.pageSize;
      payload.offset = (this.currentPage - 1) * this.pageSize;
      payload.school_id = this.current_school.id;
      this.getStudentListBySchool(payload).then(_ => {
        this.loading = false;
      });
    },
    handleCurrentChange(val) {
      this.$router.push({
        name: this.$route.name,
        params: { page: this.currentPage },
        query: Object.assign({}, this.searchForm)
      });
    },
    onUpdateStudent(data) {
      this.dialogAddStudentVisible = true;
      this.selectedStudentId = data.id;
    },
    onResetPassword(data) {
      let msg = `确认要重置 “${
        data.name
      } ”的登录密码？新密码为学员睿乐账号后六位`;
      this.$confirm(msg)
        .then(_ => {
          this.resetStudentPassword({ student_id: data.id }).then(res => {
            let msg = res.code == 0 ? "密码重置成功" : "操作失败";
            this.$message({
              message: msg,
              type: res.code == 0 ? "success" : "error"
            });
          });
        })
        .catch(_ => {});
    },
    onShiftSchedule(data) {
      // return this.$router.push({
      //   name: "reschedule",
      //   params: { student: data.id }
      // });
      this.dialogRescheduleVisible = true;
      this.selectedStudent = data;
    },
    onShiftClazz(data) {},
    onLockStudent(data) {},
    onCreateStudentSuccess(mobile) {
      let self = this;
      this.dialogAddStudentVisible = false;
      this.onSearch();
    }
  },
  components: {
    AddStudent,
    Reschedule
  }
};
</script>
<style scoped>
.el-table--small .el-dropdown-link {
  font-size: 12px;
}
.mr-10 {
  margin-right: 10px;
}
.students {
  min-width: 1000px;
}
.img-circle {
  background-color: #ebeef5;
  border: 1px solid #e4e7ed;
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 50%;
}
.student-list {
  max-width: 1400px;
}
.student-list .student-item {
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

.student-list .student-item:last-child {
  margin-bottom: 0px;
}
.student-item .col-1 {
  width: 120px !important;
  text-align: center;
  border-right: 1px solid #ebeef5;
  padding-left: 0px !important;
  order: 1;
}
.student-item .col-2 {
  width: 200px;
  order: 2;
}
.student-item .col-3 {
  flex: 1;
  order: 3;
  border-right: 1px solid #ebeef5;
}
.student-item .col-4 {
  border-right: 1px solid #ebeef5;
  width: 160px !important;
  order: 1;
}
.student-item .col-5 {
  align-self: center;
  text-align: center;
  order: 5;
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
.tag-student-state {
  position: absolute;
  right: 0px;
  top: 0;
}

.tag-student-state.active .student-state-text {
  background-color: rgba(133, 206, 97, 0.7);
  display: none;
}

.student-state-text {
  transform: rotate(45deg) translateZ(0);
  color: #fcfcfc;
  display: inline-block;
  position: absolute;
  top: 10px;
  right: -30px;
  z-index: 1;
  font-size: 12px;
  text-transform: uppercase;
  width: 90px;
  text-align: center;
  background-color: #c8c8c8;
  line-height: 22px;
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


