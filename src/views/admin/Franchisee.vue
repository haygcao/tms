<template>
<div>
  <el-table
    :data="franchiseeList.rows"
    stripe
    border=""
    style="width: 100%">
    <el-table-column
      prop="name"
      label="名称"
      width="150">
    </el-table-column>
    <el-table-column
      prop="franchisee_no"
      label="序号"
      width="80">
    </el-table-column>
    <el-table-column
      prop="investor"
      label="投资人"
      >
    </el-table-column>
    <el-table-column
      label="所在地区">
       <template slot-scope="scope">
          <span style="">{{ scope.row.province_name?scope.row.province_name:scope.row.province_code }}</span>/
           <span style="">{{ scope.row.city_name?scope.row.city_name:scope.row.city_code }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="signed_date"
      label="签约日期"
      width="120">
    </el-table-column>
    <el-table-column
      prop="signed_expire_date"
      label="授权到期日期"
      width="120">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">管理</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="page-block">
   <el-pagination
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next"
      :page-size="pageSize"
      :total="franchiseeList.count">
    </el-pagination>
  </div>
</div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      pageSize: 20
    };
  },
  computed: {
    ...mapState({
      franchiseeList: state => state.franchisee.franchiseeList,
      // regions: state => state.region.regions
    })
  },
  beforeRouteUpdate(to, from, next) {
    // react to route changes...
    // don't forget to call next()
    let offset = (to.params.page || 0) * this.pageSize;
    this.getList({ offset: offset, limit: this.pageSize });
  },
  created() {
    // if (true) {
    //   !this.regions || !this.regions.length == 0
    //   console.log('this.getRegions();')
    //   this.getRegions();
    // }
  },
  mounted() {
    let offset = (this.$route.params.page || 0) * this.pageSize;
    this.getList({ offset: offset, limit: this.pageSize });
  },
  methods: {
    ...mapActions({
      getList: "getFranchiseeList",
      // getRegions: "getRegions"
    }),
    handleClick(val) {
      console.log(val)
      this.$router.push({ name: "franchisee_detail", params: { franchisee_id: val.id } });
    },
    // regionName(code) {
    //   let region = this.regions.find(p => p.region_code == code);
    //   if (region) {
    //     return region.region_name;
    //   }
    //   return code;
    // },
    handleCurrentChange(val) {
      this.$router.push({ name: "franchisee_list", params: { page: val } });
      // console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style scoped>
.page-block {
  padding: 10px;
  margin: 0 auto;
}
</style>
