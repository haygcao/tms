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
    <el-form :inline="true" size="small" :model="searchForm" class="search-form-inline">
      <el-form-item>
        <el-input v-model="searchForm.query" placeholder="员工姓名、编号或手机号" style="min-width:220px" clearable></el-input>
      </el-form-item>
      <el-form-item >
        <el-select v-model="searchForm.state" placeholder="状态" clearable>
          <el-option label="在职" value="1"></el-option>
          <el-option label="离职" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-select v-model="searchForm.job_title" placeholder="职位" clearable>
          <el-option
            v-for="item in jobTitles"
            :key="item.key"
            :label="item.name"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="onSearch" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="onAddEmployee" icon="el-icon-circle-plus-outline">新增员工</el-button>
      </el-form-item>
    </el-form>
  </el-row>
  <el-row>

  </el-row>
  <el-row v-loading="loading">
    <el-card class="box-card  clearfix" shadow="always" v-for="item in employeeList.rows" :key="item.id">
      <div class="employee-item">
        <div v-if="item.id===current_user.employee_id" class="tag-is-me">我</div>
      <div  class="left">
        <div class="emp-fileds text-center "><img class="circle" :src="item.avatar_url?item.avatar_url:require('@/assets/img/default_teacher_avatar.png')"  :alt="item.name"></div>
        <div class="emp-fileds text-center emp-fileds-name">{{item.name}}<i style="float:right" :class="[item.gender==1 ? 'icon-gender-male emp-gender-male' : 'icon-gender-female emp-gender-female']" class="emp-gender icon iconfont "></i></div>
        <div class="emp-fileds text-center emp-fileds-name-en">{{item.first_name_en}}&nbsp;{{item.last_name_en}}</div>
        <div class="emp-fileds text-center"><el-tag :type="employe_title_tags[item.job_title]" size="mini">{{item.job_title|jobTitle}}</el-tag></div>
      </div>
      <div class="right">
        <div class="emp-fileds"><i class="icon iconfont icon-id-card"></i><span>{{item.employee_no}}</span></div>
        <div class="emp-fileds"><i class="icon el-icon-date"></i><span>{{item.hire_date}}</span></div>
        <div class="emp-fileds"><i class="icon iconfont icon-birthdaycake"></i><span>{{item.birthday}}</span></div>
        <div class="emp-fileds"><i class="icon el-icon-mobile-phone"></i><span>{{item.mobile}}</span></div>
        <div class="emp-fileds"><i class="icon  iconfont icon-email"></i><span :title="item.email">{{item.email}}</span></div>
      </div>
      </div>
    </el-card>
  </el-row>
  <el-row>
    <div class="text-center" v-if="employeeList.count>0">
      <el-pagination
        background
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
      loading: false,
      employe_title_tags: {
        investor: "danger",
        teacher: "success",
        consultant: "primary",
        teaching_manager: "warning",
        school_manager: "danger"
      }
    };
  },
  computed: {
    ...mapState({
      jobTitles: state => state.metadata.jobTitles,
      educations: state => state.metadata.educations,
      employeeList: state => state.employee.employee_list.data || {}
    }),
    current_user(){
      return this.$auth.user;
    }
  },
  watch: {
    current_school(val, old) {
      if (val.id != old.id) {
        this.search();
      }
    },
    employeeList: function(val) {
      if (val) {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.getJobTitles();
    this.getEducations();
    let query = this.$route.query;
    this.searchForm = Object.assign({}, query);
    this.currentPage = parseInt(this.$route.params.page);
    this.search();
  },
  methods: {
    ...mapActions([
      "getJobTitles",
      "getEducations",
      "getEmployeeList",
      "createEmployee"
    ]),
    onSearch() {
      this.currentPage = 1;
      this.refreshRouter();
      this.search();
    },
    onAddEmployee() {
      this.$router.push({ name: "employee_create" });
    },
    search() {
      this.loading = true;
      let payload = Object.assign({}, this.searchForm);
      payload.limit = this.pageSize;
      payload.offset = (this.currentPage - 1) * this.pageSize;
      this.getEmployeeList(payload);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.refreshRouter();
    },
    refreshRouter() {
      this.$router.push({
        name: this.$route.name,
        params: { page: this.currentPage },
        query: Object.assign({}, this.searchForm)
      });
    }
  }
};
</script>


<style lang="stylus" scoped>
.search-form-inline .el-input {
  max-width: 120px;
}

.box-card {
  width: 340px;
  display: inline-block;
  margin-right: 30px;
  margin-bottom: 30px;
  position: relative;
}

.box-card .el-card__body {
  padding: 12px;
}

.employee-item img.circle {
  border: 1px solid #E4E7ED;
  overflow: hidden;
  border-radius: 50%;
  display: inline-block;
  height: 60px;
  width: 60px;
  background-color: rgb(121, 199, 183);
}

.employee-item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  color: #606266;
  font-size: 12px;
}

.employee-item .left {
  padding-right: 10px;
  width: 120px;
}

.employee-item .right {
  flex: 1;
}

.employee-item .emp-fileds i[class^=icon], [class*='icon'] {
  margin-right: 10px;
  font-size: 14px;
  color: #C0C4CC;
}

.employee-item .emp-fileds .emp-gender {
  font-size: 16px;
  margin-left: 10px;
  position: absolute;
  right: -5px;
}

.employee-item .right .emp-fileds {
  padding: 8px 0px;
  overflow: hidden;
  white-space: nowrap;
  word-break: normal;
  text-overflow: ellipsis;
}

.employee-item .left .emp-fileds {
  width: 110px;
  line-height: 30px;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  word-break: normal;
  text-overflow: ellipsis;
}

.employee-item .right .emp-fileds {
}

.emp-gender-male {
  color: #409EFF;
}

.emp-gender-female {
  color: #F56C6C;
}

.employee-item .emp-fileds-name {
  font-size: 16px;
}

.tag-is-me {
  position: absolute;
  left: 0px;
  top: 5px;
  background-color:rgba(245,108,108,.6);
  color: #ffffff;
  padding: 3px 8px;
}
</style>
