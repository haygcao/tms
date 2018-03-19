<template>
<div class="layout-head">
<header  class="header">
    <div  class="container">
    <h1><router-link to="/"><img src="../assets/logo.png" alt="element-logo" class="nav-logo"><span>睿乐盟</span>
    </router-link></h1></div></header></div>
</template>

<script>
export default {
  name: "Header",
  props: {
    msg: String
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
</style>
