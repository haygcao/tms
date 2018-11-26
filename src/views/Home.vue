<template>
  <div class="home white_bg">
    <Header></Header>
    <el-container class="layout-main">
       <transition name="el-fade-in-linear">
      <el-aside :width="memuWidth">
      <left-side-menu @menuCollapse="handleCollapse" :isCollapse="isCollapse"></left-side-menu>
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
      isCollapse: true,
      white_bg: "bg-white"
    };
  },
  computed: {
    memuWidth() {
      return this.isCollapse ? "66px" : "200px";
    }
  },
  created() {
    this.$nextTick(() => {
      window.__app_tms_loaded = true;
    });
  },
  methods: {
    handleCollapse(collapse) {
      this.isCollapse = collapse;
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
}

.home.white_bg {
  background-color: #ffffff;
}

.gray-bg {
  background-color: #f8f8f9;
  min-height: calc(100% - 40px);
  min-height: fill-available;
}

.home .el-main .main-content {
  padding: 20px;
}

.home .el-main {
  padding: 0px;
  -webkit-overflow-scrolling: touch;
}

// .home .el-main >div {
// padding: 20px;
// }
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

.bg-white {
  background-color: #ffffff;
  min-height: fill-available;
}
</style>


