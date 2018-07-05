<template>
  <div class="admin">
    <div class="layout-head">
    <header  class="header">
    <div  class="container">
    <h1>
        <router-link to="/admin"><img src="../../assets/logo.png" alt="element-logo" class="nav-logo"><span></span></router-link>
    </h1>
    <ul class="nav">
    <li class="nav-item">
    <router-link v-if="user==null" to="/login"><span>登录</span>
    </router-link>
    <el-dropdown v-if="user&&user.id" trigger="click">
      <span class="el-dropdown-link">
        {{user.user_name}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
            <a @click="logout()">退出登录</a>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </li>
   </ul>
    </div>
    </header></div>
    <el-container class="layout-main">
        <el-aside :width="memuWidth">
      <el-menu default-active="/admin/franchisee" :router="true" class="el-menu-vertical" @open="handleOpen" @close="handleClose" :collapse="isCollapse">

        <el-submenu index="1">
            <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">盟商管理</span>
            </template>
            <el-menu-item index="/admin/franchisee">加盟校列表</el-menu-item>
            <el-menu-item index="/admin/franchisee/create">新建加盟校</el-menu-item>
            
        </el-submenu>
         <el-menu-item index="/admin/courseware/list">
            <i class="iconfont el-icon- icon-ppt"></i>
            <span slot="title">课件管理</span>
        </el-menu-item>
         <el-menu-item index="/admin/homework/list">
            <i class="el-icon-time"></i>
            <span slot="title">课程作业</span>
        </el-menu-item>
        <el-menu-item index="/admin/course/list/1">
            <i class="el-icon-date"></i>
            <span slot="title">课程管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/product/course">
            <i class="el-icon-goods"></i>
            <span slot="title">课程价格</span>
        </el-menu-item>
    </el-menu>
    </el-aside>
      <el-main>
          <div class="page-container">
        <transition name="el-fade-in" mode="out-in">
          <router-view/>
        </transition>
          </div>
      </el-main>
    </el-container>
  
  </div>
</template>
<script>
// @ is an alias to /src
// import Header from "@/components/Header.vue";
// import LeftSideMenu from "@/components/LeftSideMenu.vue";
export default {
  name: "admin",
  data() {
    return {
      isCollapse: false,
      activeIndex: "1",
      activeIndex2: "1",
      memuWidth: "200px"
    };
  },
  computed: {
    user() {
      console.log(this.$auth.user);
      return this.$auth.user;
    }
  },
  created() {
    this.$nextTick(() => {
      window.__app_tms_loaded = true;
    });
  },
  methods: {
    logout() {
      this.$auth.logout();
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
.admin .layout-head {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 1500;
    height: 80px;
}

.admin .header {
    height: 80px;
    background-color: #fff;
    color: #fff;
    top: 0;
    left: 0;
    width: 100%;
    line-height: 80px;
    z-index: 100;
    position: relative;
    height: 100%;
}

.admin .header h1 {
    margin: 0;
    float: left;
    font-size: 32px;
    font-weight: 400;
}

.admin .header h1 a {
    color: #333;
    text-decoration: none;
    display: block;
}

.admin .header .container {
    border-bottom: 1px solid #d2d2d2;
    height: 100%;
    box-sizing: border-box;
    padding-left: 20px;
    padding-right: 20px;
}

.admin .header h1 a span {
    box-sizing: content-box;
    font-size: 22px;
    line-height: 38px;
    vertical-align: text-top;
}

.admin .header .nav-logo {
    height: 44px;
    vertical-align: sub;
}

.admin .el-menu-vertical:not(.el-menu--collapse) {
    min-height: 400px;
    height: 100%;
}

.admin {
    height: 100%;
}

.admin .layout-main {
    height: 100%;
    padding-top: 80px;
}

.admin .page-container {
    margin: 0 auto;
}

.admin .el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.admin .header .nav {
    float: right;
    height: 100%;
    line-height: 80px;
    background: transparent;
    padding: 0;
    margin: 0;
}

.admin header .nav-item {
    margin: 0;
    float: left;
    list-style: none;
    position: relative;
    cursor: pointer;
}
</style>
