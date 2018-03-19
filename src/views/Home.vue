<template>
  <div class="home">
    <Header></Header>
    <el-container class="layout-main">
      <el-aside width="200px">
        <left-side-menu></left-side-menu>
      </el-aside>
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
      isCollapse: false
    };
  },
  methods: {},
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

.layout-main {
  height: 100%;
  padding-top: 80px;
}
</style>

