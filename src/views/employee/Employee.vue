<template>
  <div class="employee">
   <el-row >
     <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>业务管理</el-breadcrumb-item>
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
    <div class="employee-summary-block">
      <div>在职员工<span class="count-number">{{employeeCountSummary.total}}</span>人</div>
      <div>教师<span class="count-number">{{employeeCountSummary.teacher}}</span>人</div>
      <div>顾问<span class="count-number">{{employeeCountSummary.consultant}}</span>人</div>
      <div>教学管理<span class="count-number">{{employeeCountSummary.teaching_manager}}</span>人</div>
      <div>校区管理<span class="count-number">{{employeeCountSummary.school_manager}}</span>人</div>
    </div>
  </el-row>
  <el-row v-loading="loading">
    <el-card class="box-card  clearfix" shadow="hover" v-for="item in employeeList.rows" :key="item.id">

      <div class="employee-item" :class="{'disabled':item.state!=1}">

        <div v-if="item.state==1" class="tool-bar"><a @click="onEditEmployee(item)" class="bar">编辑</a>
        |<el-popover
          placement="bottom"
          width="400"
          trigger="click">
          <el-form size="small" :model="employeeStateForm" label-position="top" :ref="item.id">
            <el-form-item prop="leave_date" :rules="[{required:true,message:'请填写离职日期'}]">
                  <p name="label">填写 "{{employeeStateForm.name}}" 离职日期</p>
                  <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="" v-model="employeeStateForm.leave_date"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="submitEmployeeState">确定</el-button>
              </el-form-item>
          </el-form>
          <a class="bar" @click="onSetEmployeeState(item)" slot="reference" >离职</a>
        </el-popover></div>
        <div v-if="item.id==current_user.employee_id" class="tag-is-me">我</div>
         <div class="tag-emp-state" :class="{'active':item.state==1}"><span class="emp-state-text">{{item.state==1?'在职':'离职'}}</span></div>
      <div  class="left">
        <div class="emp-fileds text-center "><img class="circle" :src="item.avatar_url?item.avatar_url:require('@/assets/img/default_teacher_avatar.png')"  :alt="item.name"></div>
        <div class="emp-fileds text-center emp-fileds-name">{{item.name}}<i style="float:right" :class="[item.gender==1 ? 'icon-gender-male emp-gender-male' : 'icon-gender-female emp-gender-female']" class="emp-gender icon iconfont "></i></div>
        <div class="emp-fileds text-center emp-fileds-name-en">{{item.first_name_en}}&nbsp;{{item.last_name_en}}</div>
        <div class="emp-fileds text-center"><el-tag :type="employe_title_tags[item.job_title]" size="mini">{{item.job_title|jobTitle}}</el-tag></div>
      </div>
      <div class="right">
        <div class="emp-fileds"><i class="icon iconfont icon-id-card" title="工号"></i><span>{{item.employee_no}}</span></div>
        <div class="emp-fileds"><i class="icon el-icon-date" title="入职日期"></i><span>{{item.hire_date}}</span></div>
        <div class="emp-fileds"><i class="icon iconfont icon-birthdaycake" title="生日"></i><span>{{item.birthday}}</span></div>
        <div class="emp-fileds"><i class="icon el-icon-mobile-phone"  title="联系电话"></i><span>{{item.mobile}}</span></div>
        <div class="emp-fileds"><i class="icon  iconfont icon-email" title="邮箱"></i><span :title="item.email">{{item.email}}</span></div>
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
        :current-page.sync="currentPage"
        :total="employeeList.count">
      </el-pagination>
    </div>
  </el-row>
  <el-dialog :visible.sync="dialogEditEmployeeVisible" :close-on-click-modal="false" center >
            <h2 slot="title">修改员工信息</h2>
            <keep-alive>
            <edit-employee mode="edit" :employeeId="selectedEmployee.id"  v-if="dialogEditEmployeeVisible" 
            @success="onEditEmployeeSuccess" @cancel="dialogAddStudentVisible=false"></edit-employee>
            </keep-alive>
  </el-dialog>
  <el-dialog :visible.sync="dialogCreateEmployeeVisible" :close-on-click-modal="false"  center >
            <h2 slot="title">新建员工信息</h2>
            <keep-alive>
            <create-employee mode="create"  v-if="dialogCreateEmployeeVisible" 
            @success="onCreateEmployeeSuccess" @cancel="dialogCreateEmployeeVisible=false"></create-employee>
            </keep-alive>
  </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
import EditEmployee from "@/views/employee/EditEmployee.vue";
import CreateEmployee from "@/views/employee/CreateEmployee.vue";
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
      },
      employeeStateForm: {
        leave_date: undefined,
        id: undefined,
        name: undefined
      },
      dialogCreateEmployeeVisible: false,
      dialogEditEmployeeVisible: false,
      selectedEmployee: {}
    };
  },
  computed: {
    ...mapState({
      employeeList: state => state.employee.employee_list.data || {},
      employeeCountSummary: state =>
        state.employee.employeeCountSummary.data || {}
    }),
    ...mapGetters(["jobTitles", "job_types", "educations"]),
    current_user() {
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
  beforeRouteUpdate(to, from, next) {
    // react to route changes...
    // don't forget to call next()
    this.currentPage = to.params.page > 0 ? parseInt(to.params.page) : 1;
    this.searchForm = Object.assign(this.searchForm, to.query);
    this.search();
    next();
  },
  mounted() {
    this.countEmployees();
    this.currentPage =
      this.$route.params.page > 0 ? parseInt(this.$route.params.page) : 1;
    this.searchForm = Object.assign(
      {
        query: undefined,
        state: undefined,
        job_title: undefined
      },
      this.$route.query
    );

    this.search();
  },
  methods: {
    ...mapActions([
      "getEmployeeList",
      "createEmployee",
      "setEmployeeStateLeaved",
      "countEmployees"
    ]),
    onSearch() {
      this.currentPage = 1;
      this.refreshRouter();
      this.loading = true;
      this.search();
    },
    search() {
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
    },
    onAddEmployee() {
      // this.$router.push({ name: "employee_create" });
      this.dialogCreateEmployeeVisible = true;
    },
    onCreateEmployeeSuccess() {
      self.search();
    },
    onEditEmployeeSuccess() {
      self.search();
    },
    onEditEmployee(data) {
      if (data.state != 1) {
        return false;
      }
      this.dialogEditEmployeeVisible = true;
      this.selectedEmployee = Object.assign({}, data);
    },
    onSetEmployeeState(data) {
      this.employeeStateForm.id = data.id;
      this.employeeStateForm.name = data.name;
      this.employeeStateForm.leave_date = undefined;
    },
    submitEmployeeState() {
      let self = this;
      this.$refs[this.employeeStateForm.id][0].validate(valid => {
        if (valid) {
          let payload = self.employeeStateForm;
          self.setEmployeeStateLeaved(payload).then(res => {
            self.search();
          });
        }
      });
    }
  },
  components: {
    EditEmployee,
    CreateEmployee
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

.employee-item:not(.disabled) .emp-gender-male {
  color: #409EFF;
}

.employee-item:not(.disabled) .emp-gender-female {
  color: #F56C6C;
}

.employee-item .emp-fileds-name {
  font-size: 16px;
}

.tag-is-me {
  position: absolute;
  left: 0px;
  top: 5px;
  background-color: rgba(245, 108, 108, 0.6);
  color: #ffffff;
  padding: 3px 8px;
}

.tag-emp-state {
  position: absolute;
  right: 0px;
  top: 0;
}

.tag-emp-state.active .emp-state-text {
  // background-color: #85ce61; // #66b1ff;
  background-color: rgba(133, 206, 97, 0.7);
  display: none;
}

.emp-state-text {
  transform: rotate(45deg) translateZ(0);
  color: #fcfcfc;
  display: inline-block;
  position: absolute;
  top: 10px;
  right: -22px;
  z-index: 1;
  font-size: 12px;
  text-transform: uppercase;
  width: 80px;
  text-align: center;
  background-color: #c8c8c8;
  line-height: 22px;
}

.employee-item.disabled {
  color: #C0C4CC;
}

.employee-item:hover .tool-bar {
  display: block;
}

.employee-item .tool-bar {
  display: none;
  position: absolute;
  color: #909399;
  top: 2px;
  right: 10px;
  transition: all 0.3s;
}

.employee-item .tool-bar .bar {
  padding: 5px;
  margin: 2px;
  display: inline-block;
  line-height: 14px;
  cursor: pointer;
}

.employee-item .tool-bar .bar:hover {
  color: #409EFF;
}

.employee-summary-block div {
  display: inline-block;
  margin-right: 30px;
  font-size: 12px;
  color: #909399;
}

.employee-summary-block .count-number {
  font-size: 90%;
  color: #F56C6C;
  padding: 0px 5px;
}
</style>
