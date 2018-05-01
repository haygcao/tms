<template>
  <el-menu default-active="home" :router="true" class="el-menu-vertical" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
    <el-menu-item index="home/dashboard">
    <i class="el-icon-menu"></i>
    <span slot="title">校区概况</span>
  </el-menu-item>
  <el-submenu index="2">
    <template slot="title">
      <i class="el-icon-location"></i>
      <span slot="title">业务管理</span>
    </template>

    <el-menu-item-group>
      <span slot="title">员工</span>
      <el-menu-item index="/employee">员工管理</el-menu-item>
      <el-menu-item index="/employee/create">新增员工</el-menu-item>
      <el-menu-item index="/employee/update">新增员工</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group title="价格">
      <el-menu-item index="1-3">选项3</el-menu-item>
    </el-menu-item-group>
    <el-submenu index="1-4">
      <span slot="title">选项4</span>
      <el-menu-item index="1-4-1">选项1</el-menu-item>
    </el-submenu>
  </el-submenu>
  <el-menu-item index="2">
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
export default {
  name: "LeftSideMenu",
  data() {
    return {
      isCollapse: false
    };
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