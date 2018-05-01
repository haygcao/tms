<template>
<div class="layout-head">
<header  class="header">
    <div  class="container">
    <h1><router-link to="/"><img src="../assets/logo.png" alt="element-logo" class="nav-logo"><span>睿乐盟</span>
    </router-link></h1>
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
</template>

<script>
export default {
  name: "Header",
  props: {
    msg: String
  },
  data() {
    return {};
  },
  computed: {
    user() {
      console.log(this.$auth.user);
      return this.$auth.user;
    }
  },
  mounted() {},
  methods: {
      logout(){
          this.$auth.logout();
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.layout-head {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 1500;
    height: 80px;
}

.header {
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

.header h1 {
    margin: 0;
    float: left;
    font-size: 32px;
    font-weight: 400;
}

.header h1 a {
    color: #333;
    text-decoration: none;
    display: block;
}

.header .container {
    border-bottom: 1px solid #d2d2d2;
    height: 100%;
    box-sizing: border-box;
}

.header h1 a span {
    box-sizing: content-box;
    font-size: 22px;
    line-height: 38px;
    vertical-align: text-top;
}

.header .nav-logo {
    height: 44px;
    vertical-align: sub;
}

.header .nav {
    float: right;
    height: 100%;
    line-height: 80px;
    background: transparent;
    padding: 0;
    margin: 0;
}

header .nav-item {
    margin: 0;
    float: left;
    list-style: none;
    position: relative;
    cursor: pointer;
}
</style>
