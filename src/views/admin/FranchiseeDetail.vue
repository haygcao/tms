<template>
<div>
<el-container>
<el-header></el-header>
<el-main>
  <el-table
    :data="schoolList.rows"
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
</el-main>
</el-container>
</div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      
    };
  },
  computed: {
    ...mapState({
      schoolList: state => state.franchisee.schools
    })
  },
  created() {},
  mounted() {
    let franchisee_id = this.$route.params.franchisee_id || "";
    this.getSchoolList({ franchisee_id });
  },
  methods: {
    ...mapActions({
      getSchoolList: "getSchoolList"
    })
  }
};
</script>
