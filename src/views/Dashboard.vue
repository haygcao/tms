<template>
  <div class="dashboard">
        <el-row>
        <div class="page-breadcrumb clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/school' }">校区管理</el-breadcrumb-item>
                <el-breadcrumb-item>校区概况</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="8">
            <ve-ring :data="chartData"></ve-ring>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8">
            <ve-ring :data="chartData"></ve-ring>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8">
             <ve-pie :data="chartData"></ve-pie>
          </el-col>
        </el-row>
        <el-row>
           <el-col :xs="24" :sm="12" :md="8" :lg="8">
             <ve-histogram :data="chartData2"></ve-histogram>
          </el-col>
           <el-col :xs="24" :sm="12" :md="8" :lg="8"> <ve-histogram :data="chartData2"></ve-histogram></el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8"> <ve-histogram :data="chartData2"></ve-histogram></el-col>
        </el-row>
  </div>
</template>
<script>
import VeRing from "v-charts/lib/ring";
import VeHistogram from "v-charts/lib/histogram";
import VePie from "v-charts/lib/pie";
export default {
  data() {
    return {
      chartData: {
        columns: ["日期", "访问用户"],
        rows: [
          { 日期: "1/1", 访问用户: 1393 },
          { 日期: "1/2", 访问用户: 3530 },
          { 日期: "1/3", 访问用户: 2923 },
          { 日期: "1/4", 访问用户: 1723 },
        ]
      },
      chartData2: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
            { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
            { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
            { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
           
          ]
        }
    };
  },
  computed: {
    current_user() {
      return this.$auth.user;
    },
    schools: function() {
      let schools = this.$auth.userInfo().schools || [];
      return schools;
    }
  },
  watch: {
    current_school(val, old) {
      if (val.id != old.id) {
      }
    }
  },
  methods: {
    onSchoolChange() {}
  },
  components: {
    VeRing,
    VeHistogram,
    VePie
  }
};
</script>
<style scoped>
.school-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.school-list li {
  list-style: none;
  display: inline-block;
}
.school-list li:not(:last-child) {
  /* border-right: 1px solid #ebeef5; */
}
.school-list li a {
  display: inline-block;
  font-size: 14px;
  color: #606266;
  padding: 8px 10px;
  cursor: pointer;
  /* background-color: #F56C6C */
}
.school-list li a:hover,
.school-list li a:focus {
  color: #f56c6c;
}
.school-list li a.active {
  color: #f56c6c;
}
</style>

