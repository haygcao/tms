<template>
    <div class="">
        <el-container style="height:100%">
        <el-aside class="tab-nav-container" width="200px">
            <div class="left-sub-nav">
                <div class="tab-nav-title text-info">
                 <router-link class="nav-item" :to="{ name:'customer'  }"><i class="el-icon-arrow-left"></i>返回客户列表</router-link>
                </div>
                <ul class="list-nav">
                    <router-link class="nav-item" exact tag="li" :to="{ name:'customer_detail',params: $route.params }">
                    <a>客户信息</a>
                    </router-link>
                     <router-link class="nav-item" exact tag="li" :to="{ name:'customer_communication',params: $route.params }">
                    <a>跟进记录</a>
                    </router-link>
                     <router-link class="nav-item" exact tag="li" :to="{ name:'customer_audition',params: $route.params }">
                    <a>试听记录</a>
                    </router-link>
                </ul>
            </div>
        </el-aside>
        <el-main>
           <transition name="el-fade-in" mode="out-in">
          <router-view></router-view>
        </transition>
        </el-main>
        </el-container>
    </div>
</template>
<script>
export default {};
</script>
<style scoped>
.tab-nav-container {
  background-color: #ffffff;
  width: 200px;
  color: #303133;
  border-right: 1px solid #e4ebf0;
}
.left-sub-nav {
}
.tab-nav-title {
  padding: 20px;
  /* border-bottom: 1px solid #e4ebf0; */
  margin-bottom: 10px;
  font-size: 12px;
}
.tab-nav-title a:hover {
  color: #303133;
}
.list-nav {
  padding: 0;
  margin: 0;
}
.list-nav .router-link-active {
  border-right: 3px solid #1587d9;
  background: #f5f8fa;
}
.list-nav .nav-item {
  padding: 10px 0 10px 20px;
  /* border-right: 3px solid #1587d9; */
  word-break: break-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* .list-nav .nav-item.active {
  border-right: 3px solid #1587d9;
  background: #f5f8fa;
} */
.list-nav .nav-item a:hover {
  color: #303133;
}
</style>


