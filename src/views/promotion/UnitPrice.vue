<template>
  <div class="discount">
   <el-row >
     <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>业务管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/promotion/unitprice' }"> 优惠</el-breadcrumb-item>
        <el-breadcrumb-item>课次单价</el-breadcrumb-item>
      </el-breadcrumb>
     </div>
  </el-row>
  <el-row>
    <div class="discount_table">
        <div class="discount_table_row" v-for="(subject) in subjects" :key="subject.key">
          <div class="discount_table_col">{{subject.name}}</div>
          <div class="discount_table_col">
            <div class="discount_table_cel" v-for="classType in class_types" :key="classType.key">
               {{classType.name}}
            </div>
          </div>
        </div>
    </div>
  </el-row>
  </div>
  </template>
  <script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "unit-price",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["subjects", "class_types"])
  },
  mounted() {}
};
</script>
  
  