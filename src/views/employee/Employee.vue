<template>
  <div class="employee">
   <el-row >
     <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/employee' }">业务管理</el-breadcrumb-item>
        <el-breadcrumb-item>员工管理</el-breadcrumb-item>
      </el-breadcrumb>
     </div>
    
  </el-row>
  <el-row>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchForm.query" placeholder="员工姓名、编号或手机号" style="min-width:220px"></el-input>
      </el-form-item>
      <el-form-item >
        <el-select v-model="searchForm.state" placeholder="状态">
          <el-option label="在职" value="1"></el-option>
          <el-option label="离职" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-select v-model="searchForm.job_title" placeholder="职位">
          <el-option
            v-for="item in jobTitles"
            :key="item.key"
            :label="item.name"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch" icon="el-icon-search">查询</el-button>
        <el-button type="danger" @click="onAddEmployee" icon="el-icon-circle-plus-outline">新增员工</el-button>
      </el-form-item>
    </el-form>
  </el-row>
  <el-row>

  </el-row>
  <el-row v-loading="loading">
    <el-card class="box-card" v-for="item in employeeList.rows" :key="item.id">
      <div slot="header" class="clearfix">
        <span>{{item.name}}</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div  class="text item">
        列表内容
      </div>
    </el-card>
  </el-row>
  <el-row>
    <div class="text-center">
      <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="employeeList.count">
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
        query: undefined,
        state: undefined,
        job_title: undefined
      },
      pageSize: 12,
      currentPage: 1,
      loading: false
    };
  },
  computed: {
    ...mapState({
      jobTitles: state => state.metadata.jobTitles,
      educations: state => state.metadata.educations,
      employeeList: state => state.employee.employee_list.data
    })
  },
  watch: {
    employeeList: function(val) {
      if (val) {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.getJobTitles();
    this.getEducations();
    this.getEmployeeList({ state: 1 });
  },
  methods: {
    ...mapActions([
      "getJobTitles",
      "getEducations",
      "getEmployeeList",
      "createEmployee"
    ]),
    onSearch() {
      if (this.loading == true) return;
      this.search();
    },
    onAddEmployee() {
      this.$router.push({ name: "employee_create" });
    },
    search() {
      this.loading = true;
      let payload = this.searchForm;
      payload.limit = this.pageSize;
      payload.offset = (this.currentPage - 1) * this.pageSize;
      this.getEmployeeList(payload);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.search();
    }
  }
};
</script>


<style lang="stylus">
.box-card {
  width: 300px;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
