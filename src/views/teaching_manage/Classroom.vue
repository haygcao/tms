<template>
  <div class="classroom">
  <el-row >
     <div class="page-breadcrumb clearfix">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/teaching' }">校区管理</el-breadcrumb-item>
        <el-breadcrumb-item>教室管理</el-breadcrumb-item>
      </el-breadcrumb>
     </div>
    
  </el-row>
  <el-row>
       <el-button type="danger" @click="onAddClassroom" size="small" icon="el-icon-circle-plus-outline">新建教室</el-button>
  </el-row>
  <el-row>
  <el-table
    :data="franchiseeList.rows"
    stripe
    border=""
    style="width: 100%">

    <el-table-column
      prop="franchisee_no"
      label="序号"
      width="80">
    </el-table-column>
    <el-table-column
      prop="name"
      label="教室名称"
      width="150">
    </el-table-column>
    <el-table-column
      prop="investor"
      label="教室类型"
      >
    </el-table-column>
    <el-table-column
      prop="investor"
      label="教室面积">
    </el-table-column>
    <el-table-column
      label="备注">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">管理</el-button>
         <el-button @click="handleDelClick(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </el-row>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      pageSize: 20,
      page: 1
    };
  },
  computed: {
    ...mapState({
      franchiseeList: state => state.franchisee.franchiseeList
      // regions: state => state.region.regions
    })
  },
  methods:{
      onAddClassroom(){}
  },
  components: {
   
  }
};
</script>

