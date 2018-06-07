<template>
  <div class="dashboard">
        <el-row>
       
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="8">
            <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>最新公告</span>
                <el-button style="float: right; padding: 3px 0" type="text">更多<i class="el-icon-d-arrow-right"></i></el-button>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
                {{'列表内容 ' + o }}
            </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8">
            <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>最新公告</span>
                <el-button style="float: right; padding: 3px 0" type="text">更多<i class="el-icon-d-arrow-right"></i></el-button>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
                {{'列表内容 ' + o }}
            </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8">
            <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>最新公告</span>
                <el-button style="float: right; padding: 3px 0" type="text">更多<i class="el-icon-d-arrow-right"></i></el-button>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
                {{'列表内容 ' + o }}
            </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
           <el-col :xs="24" :sm="12" :md="8" :lg="8">
          </el-col>
           <el-col :xs="24" :sm="12" :md="8" :lg="8"> 
               
           </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8"> 
              
          </el-col>
        </el-row>
  </div>
</template>
<script>
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
  components: {}
};
</script>
<style scoped>
.box-card{
    max-width: 320px;
}
</style>

