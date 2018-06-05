<template>
  <div class="home">
    <Header></Header>
    <el-container class="layout-main">
       <transition name="el-fade-in-linear">
      <el-aside :width="memuWidth">
      <left-side-menu @menuCollapse="handleCollapse"></left-side-menu>
      </el-aside>
       </transition>
      <el-main>
        <transition name="el-fade-in" mode="out-in">
          <router-view/>
        </transition>
      </el-main>
    </el-container>
  
  </div>
</template>
<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import LeftSideMenu from "@/components/LeftSideMenu.vue";
export default {
  name: "home",
  data() {
    return {
      isCollapse: false,
      memuWidth: "200px"
    };
  },
  created() {},
  methods: {
    handleCollapse(collapse) {
      this.isCollapse = collapse;
      this.memuWidth = collapse ? "66px" : "200px";
    }
  },
  components: {
    Header,
    LeftSideMenu
  }
};
</script>
<style lang="stylus">
.home {
  height: 100%;
  // background-color: #F2F6FC;
}

.layout-main {
  height: 100%;
  padding-top: 50px;
}

.el-aside {
  transition: width 0.3s cubic-bezier(0.39, 0.58, 0.51, 0.93) 0s;
}

.home .el-row {
  margin-top: 20px;

  &:first-child {
    margin-top: 0;
  }
}
</style>


