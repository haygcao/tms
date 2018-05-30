<template>
    <div class="student-list">
        <el-row>
        <div class="page-breadcrumb clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/school' }">校区管理</el-breadcrumb-item>
                <el-breadcrumb-item>学员管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        </el-row>
        <el-row>
            <el-form :inline="true" size="small" ref="searchForm" :model="searchForm" >
                <el-form-item prop="kw">
                    <el-input style="width:320px" clearable="" v-model="searchForm.kw" placeholder="输入学员姓名，编号或手机号查询"></el-input>
                </el-form-item>
                <el-form-item>
                <el-button type="danger" @click="onSearch" icon="el-icon-search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row class="block">
            <el-table :data="studentList.rows" stripe  size="small">
                <el-table-column type="index" width="30">
                </el-table-column>
                <el-table-column prop="student_no" width="130" label="编号">
                </el-table-column>
                <el-table-column prop="name" width="120" label="姓名">
                </el-table-column>
                <el-table-column width="60" label="性别">
                    <template slot-scope="scope">{{scope.row.gender|gender}}</template>
                </el-table-column>  
                <el-table-column width="110" label="年龄">
                    <template slot-scope="scope">{{scope.row.birthday}}<br>{{scope.row.birthday|age}}</template>
                </el-table-column>  
                <el-table-column prop="mobile" width="" label="睿乐账号">
                </el-table-column> 
                <el-table-column  width="" label="家长">
                </el-table-column> 
                <el-table-column prop="name" width="" label="累计报班">
                    <template slot-scope="scope">{{scope.row.clazz_count}}</template>
                </el-table-column> 
                <el-table-column width="" label="消课/购课">
                    <template slot-scope="scope">{{scope.row.consume_lesson_count}}/{{scope.row.total_lesson_count}}</template>
                </el-table-column> 
                <el-table-column width="" label="睿乐币(当前/累计)">
                    <template slot-scope="scope">{{scope.row.points||0}}/{{scope.row.points_total||0}}</template>
                </el-table-column> 
                <el-table-column width="" label="是否在学">
                    <template slot-scope="scope"><span :class="{'text-success':isStudy(scope.row)}">{{isStudy(scope.row)?'是':'否'}}</span></template>
                </el-table-column>
                <el-table-column fixed="right" width="" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="onShiftSchedule(scope.row)" class="mr-10" size="small" type="text">调课</el-button>
                        <el-dropdown trigger="click" size="small">
                            <span class="el-dropdown-link">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item><a @click="onLockStudent(scope.row)">修改资料</a></el-dropdown-item>
                                <el-dropdown-item divided><a @click="onLockStudent(scope.row)" type="danger">重置密码</a></el-dropdown-item>
                                <el-dropdown-item divided><a @click="onLockStudent(scope.row)" type="danger" size="small">锁定</a></el-dropdown-item>
                                <el-dropdown-item divided><a @click="onShiftClazz(scope.row)" type="danger" size="small">转班</a></el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>                   
            </el-table>
        </el-row>
        <el-row>
            <div class="text-center" v-show="studentList&&studentList.count>0">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage" layout="prev, pager, next" :page-size="pageSize" :total="studentList.count">
                </el-pagination>
            </div>
        </el-row>
    </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      searchForm: {
        kw: undefined
      },
      pageSize: 10,
      currentPage: 1
    };
  },
  watch: {
    current_school(val, old) {
      if (val.id != old.id) {
        this.search();
      }
    },
    $route(val, old) {
      let query = val.query;
      this.currentPage = parseInt(val.params.page);
      this.searchForm = Object.assign({}, query);
      this.search();
    }
  },
  computed: {
    ...mapState({
      studentList: state => state.student.studentList.data || [],
      current_school: state => state.current_user.current_school
    })
  },
  mounted() {
    let query = this.$route.query;
    this.searchForm = Object.assign({}, query);
    this.currentPage = parseInt(this.$route.params.page);
    this.search();
  },
  methods: {
    ...mapActions({
      getStudentListBySchool: "getStudentListBySchool"
    }),
    isStudy(row) {
      return row.total_lesson_count - row.consume_lesson_count > 0;
    },
    onSearch() {
      this.search();
    },
    search() {
      let payload = this.searchForm;
      payload.limit = this.pageSize;
      payload.offset = (this.currentPage - 1) * this.pageSize;
      payload.school_id = this.current_school.id;
      this.getStudentListBySchool(payload);
    },
    handleCurrentChange(val) {},
    onUpdateStudent(data) {},
    onResetPassword(data) {},
    onShiftSchedule(data) {},
    onShiftClazz(data) {},
    onLockStudent(data) {}
  }
};
</script>
<style scoped>
.el-table--small .el-dropdown-link{
    font-size: 12px;
}
.mr-10{
    margin-right: 10px;
}
</style>


