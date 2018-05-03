<template>
  <el-menu default-active="/dashboard" :router="true" class="el-menu-vertical" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
  <el-menu-item index="/dashboard">
    <i class="el-icon-menu"></i>
    <span slot="title">校区概况</span>
  </el-menu-item>
  <el-submenu index="2">
    <template slot="title">
      <i class="el-icon-location"></i>
      <span slot="title">业务管理</span>
    </template>
    <el-menu-item-group v-if="business_master">
      <span slot="title">员工</span>
      <el-menu-item index="/home/employee">员工管理</el-menu-item>
      <el-menu-item index="/home/employee/create">新增员工</el-menu-item>
      <el-menu-item index="/home/employee/update">新增员工</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group title="价格管理">
      <el-menu-item index="1-3">课次单价</el-menu-item>
    </el-menu-item-group>
    <el-submenu index="1-4">
      <span slot="title">连报折扣</span>
      <el-menu-item index="1-4-1">选项1</el-menu-item>
    </el-submenu>
  </el-submenu>
  <el-submenu index="/teaching" v-if="school_master">
    <template slot="title">
    <i class="el-icon-menu"></i>
      <span slot="title">教学管理</span>
    </template>
    <el-menu-item index="/teaching/classroom">教室管理</el-menu-item>
    <el-menu-item index="/teaching/schedule">课程表</el-menu-item>
    <el-menu-item index="/teaching/classes">班级管理</el-menu-item>        
  </el-submenu>
  
  <el-menu-item index="2" v-if="school_master">
    <i class="el-icon-menu"></i>
    <span slot="title">导航二</span>
  </el-menu-item>
  <el-menu-item index="3" disabled>
    <i class="el-icon-document"></i>
    <span slot="title">导航三</span>
  </el-menu-item>
  <el-menu-item index="4">
    <i class="el-icon-setting"></i>
    <span slot="title">导航四</span>
  </el-menu-item>
</el-menu>
</template>
<script>
const _roles = [
  { key: "investor", name: "投资人", show: false },
  { key: "teacher", name: "教师", show: true },
  { key: "consultant", name: "顾问", show: true },
  { key: "teaching_manager", name: "教学管理", show: true },
  { key: "school_manager", name: "校区管理", show: true }
];
export default {
  name: "LeftSideMenu",
  data() {
    return {
      isCollapse: false
    };
  },
  computed: {
    business_master: function() {
      return this.$auth.isAuthenticated([
        "administrator",
        "franchisee_admin",
        "investor"
      ]);
    },
    school_master: function() {
      return this.$auth.isAuthenticated([
        "teaching_manager",
        "school_manager",
        "administrator",
        "franchisee_admin",
        "investor"
      ]);
    },
    student_master: function() {
      return this.$auth.isAuthenticated([
        "consultant",
        "teaching_manager",
        "school_manager",
        "administrator",
        "franchisee_admin",
        "investor"
      ]);
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style lang="stylus">
.el-menu-vertical:not(.el-menu--collapse) {
  min-height: 400px;
  height: 100%;
}
</style>