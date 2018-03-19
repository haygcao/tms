<template>
  <div id="app">
    <transition name="el-fade-in" mode="out-in">
        <router-view/>
    </transition>
  </div>
</template>
<script>
</script>

<style lang="stylus">
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
   height: 100%;
}
</style>
