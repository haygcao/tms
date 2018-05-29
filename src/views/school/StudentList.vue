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
                    <el-input style="width:320px" v-model="searchForm.kw" placeholder="输入学员姓名，编号或手机号查询"></el-input>
                </el-form-item>
                <el-form-item>
                <el-button type="danger" @click="onSearch" icon="el-icon-search">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row class="block">
            <el-table :data="studentList.rows" stripe style="width: 100%;">
                <el-table-column type="expand" width="40">
                    <template slot-scope="scope">
                        <el-form label-position="left" inline class="order-table-expand">
                          <el-form-item label="课程顾问">
                            <span>{{ scope.row.parents }}</span>
                          </el-form-item>
                          <el-form-item label="家长">
                            <span>{{scope.row.parents}}</span>
                          </el-form-item>
                          <el-form-item label="是否年缴">
                            <span>{{scope.row.order_type==0?'否':('缴'+scope.row.order_type+'年')}}</span>
                          </el-form-item>
                          <el-form-item label="创建时间">
                            <span>{{scope.row.created_at|toDateTimeString}}</span>
                          </el-form-item>
                          <el-form-item label="支付时间">
                            <span> {{scope.row.payment_time|toDateTimeString}}</span>
                          </el-form-item>
                          <el-form-item label="支付方式">
                            <span> {{scope.row.payment_type|payment_type}}</span>
                          </el-form-item>
                          <el-form-item label="收款人">
                            <span>{{scope.row.payee}}</span>
                          </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="student_no" width="120" label="编号">
                </el-table-column>
                <el-table-column prop="name" width="120" label="姓名">
                </el-table-column>
                <el-table-column prop="name" width="60" label="性别">
                </el-table-column>  
                <el-table-column prop="name" width="" label="年龄">
                </el-table-column>  
                <el-table-column prop="mobile" width="" label="睿乐账号">
                </el-table-column> 
                <el-table-column  width="" label="家长">
                </el-table-column> 
                <el-table-column prop="name" width="" label="累计报班">
                </el-table-column> 
                <el-table-column prop="name" width="" label="消课/购课">
                </el-table-column> 
                <el-table-column prop="name" width="" label="睿乐币">
                </el-table-column> 
                <el-table-column prop="name" width="" label="是否在学">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="">
                    <template slot-scope="scope">
                        <el-button @click="onUpdateStudent(scope.row)" type="primary" size="small">修改资料</el-button>
                        <el-button @click="onResetPassword(scope.row)" type="default" size="small">重置密码</el-button>
                        <el-button @click="onShiftSchedule(scope.row)" type="danger" size="small">调课</el-button>
                        <el-button @click="onShiftClazz(scope.row)" type="danger" size="small">转班</el-button>
                        <el-button @click="onLockStudent(scope.row)" type="danger" size="small">锁定</el-button>
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
  computed: {
    ...mapState({
      studentList: state => state.student.studentList.data || [],
      current_school: state => state.current_user.current_school
    })
  },
  methods: {
    onSearch(){

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

