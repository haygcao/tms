<template>
<div class="menu-wrap" :class="{'menu-collapsed':isCollapse}">
 <div class="clearfix menu-expand"><a class="menu-switch primary" @click="handleMenuCollapse"><i class="el-icon-more"></i></a></div>
  <!-- #545c64 -->
  <el-menu :router="true" 
      background-color="#00509F"
      text-color="#fff"
      active-text-color="#f56c6c"
      :unique-opened="true"
      :collapse-transition="true"
      class="el-menu-vertical" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
  <el-menu-item index="/dashboard">
    <i class="el-icon-menu"></i>
    <span slot="title">校区概况</span>
  </el-menu-item>
  <el-submenu index="/home/employee">
    <template slot="title">
      <i class="el-icon-location"></i>
      <span slot="title">业务管理</span>
    </template>
    <el-menu-item-group v-if="business_master">
      <span slot="title">员工</span>
      <el-menu-item index="/home/employee" :route="{name:'employee_default'}">员工管理</el-menu-item>
      <el-menu-item index="/home/employee/create">新增员工</el-menu-item>
      <el-menu-item index="/home/employee/update">新增员工</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group title="价格管理" v-if="business_master">
      <el-menu-item index="1-3">课次单价</el-menu-item>
    </el-menu-item-group>
    <el-submenu index="1-4" v-if="business_master">
      <span slot="title">连报折扣</span>
      <el-menu-item index="1-4-1">选项1</el-menu-item>
    </el-submenu>
  </el-submenu>
  <el-submenu index="/teaching" v-if="school_master">
    <template slot="title">
    <i class="iconfont icon-classroom"></i>
      <span slot="title">教学管理</span>
    </template>
    <el-menu-item index="/teaching/classroom">教室管理</el-menu-item>
    <el-menu-item index="/teaching/schedule">课程表</el-menu-item>
    <el-menu-item index="/teaching/class">班级管理</el-menu-item>        
  </el-submenu>
  
  <el-menu-item index="/school/classes/1" v-if="school_master||student_master">
    <i class="iconfont icon-sign"></i>
    <span slot="title">选课报名</span>
  </el-menu-item>
  <el-menu-item index="/school/purchase/order/list/1" v-if="school_master||student_master">
    <i class="iconfont icon-order"></i>
    <span slot="title">订单管理</span>
  </el-menu-item>
  <el-menu-item index="/school/students/1">
    <i class="iconfont icon-class-setting"></i>
    <span slot="title">学员管理</span>
  </el-menu-item>
</el-menu>
</div>
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
    handleMenuCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$emit("menuCollapse", this.isCollapse);
    },
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
}

.el-menu {
  border-right: none;
}

.menu-wrap {
  height: 100%;
  background-color: #00509F; // #545c64;
  // border-right: solid 1px #e6e6e6;
  overflow-x :hidden;
}

.menu-switch {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;
  padding: 15px 12px;
  font-size: 12px;
  border-radius: 0px;
  width: 100%;
}

.menu-switch.primary {
  color: #fff;
  background-color: #00509F; // #409EFF;
  border-color: #00509F; // #409EFF;
}

.menu-switch:focus, .menu-switch:hover {
  color: #409EFF;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.menu-switch:active {
  color: #3a8ee6;
  border-color: #3a8ee6;
  outline: 0;
}

.menu-switch.primary.is-active, .menu-switch.primary:active {
  background: #3a8ee6;
  border-color: #3a8ee6;
  color: #fff;
}

.menu-switch.primary:focus, .menu-switch.primary:hover {
  background: rgb(0, 64, 127); // #66b1ff;
  border-color: rgb(0, 64, 127); // #66b1ff;
  color: #fff;
}

.menu-expand {
  padding: 0; // 10px 20px;
  text-align: center;
  transition: padding 0.3s, float 0.3s;
}

.menu-collapsed .menu-expand .menu-switch {
  // padding: 12px 12px;
  text-align: center;
}

.menu-switch {
  transition: all 0.3s;
}

.el-menu-item [class^=el-icon-], .el-menu-item [class*='icon-'] {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}
.el-submenu [class*='icon-'] {
    vertical-align: middle;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
}
.iconfont {
  display: inline-block;
}
</style>