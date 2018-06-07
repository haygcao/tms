<template>
  <div class="dashboard">
        <el-row>
        <div class="page-breadcrumb clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/school' }">校区管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{current_school.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="12" :lg="8">
            <div class="card">
            <ve-ring :data="chartData"></ve-ring>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8">
            <div class="card">
            <ve-ring :data="chartData"></ve-ring>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8">
            <div class="card">
             <ve-pie :data="chartData"></ve-pie>
            </div>
          </el-col>
        </el-row>
        <el-row>
           <el-col :xs="24" :sm="24" :md="12" :lg="8">
             <div class="card">
             <ve-histogram :data="chartData2"></ve-histogram>
             </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8"> 
             <div class="card">
             <ve-histogram :data="chartData2"></ve-histogram>
             </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8">
            <div class="card">
             <ve-histogram :data="chartData2"></ve-histogram>
            </div>
          </el-col>
             
        </el-row>
  </div>
</template>
<script>
import VeRing from "v-charts/lib/ring";
import VeHistogram from "v-charts/lib/histogram";
import VePie from "v-charts/lib/pie";
import SchoolSelect from '@/components/SchoolSelect.vue'
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      chartData: {
        columns: ["日期", "访问用户"],
        rows: [
          { 日期: "1/1", 访问用户: 1393 },
          { 日期: "1/2", 访问用户: 3530 },
          { 日期: "1/3", 访问用户: 2923 },
          { 日期: "1/4", 访问用户: 1723 }
        ]
      },
      chartData2: {
        columns: ["日期", "访问用户"],
        rows: [
          { 日期: "1/1", 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
          { 日期: "1/2", 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
          { 日期: "1/3", 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
          { 日期: "1/4", 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      current_school: state => state.current_user.current_school
    }),
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
    VePie,
    SchoolSelect
  }
};
</script>
<style scoped>
.card{
  margin: 5px;
  padding: 5px;
  background-color: #ffffff;
  border: 1px solid #EBEEF5;
}
</style>

