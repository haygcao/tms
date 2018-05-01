<template>
<div>
<el-row>
 <h3>{{franchisee.franchisee_no}}-{{franchisee.name}}</h3>
</el-row>
<el-row >
  <el-button type="primary" style="float:right" icon="el-icon-circle-plus-outline" @click="handleAddSchoolClick()">添加校区</el-button>
</el-row>

<el-row>
    <div class="info-block"  v-if="!franchisee.schools||franchisee.schools.length<1">
        <p class="text-center">还没有添加校区，<el-button @click="handleAddSchoolClick()" type="text" size="medium">马上创建</el-button></p>
    </div>
 <el-table  v-if="franchisee.schools&&franchisee.schools.length>0"
    :data="franchisee.schools"
    stripe
    border=""
    style="width: 100%">
    <el-table-column
      prop="name"
      label="名称"
      width="150">
    </el-table-column>
    <el-table-column
      prop="contact"
      label="联系人"
      width="80">
    </el-table-column>
    <el-table-column
      prop="contact_tel"
      label="联系电话"
      width="120">
    </el-table-column>
    <el-table-column
      label="授权期限">
       <template slot-scope="scope">
          <span style="">{{ scope.row.signed_date }}</span>
          至
           <span style="">{{ scope.row.signed_expire_date }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="地址">
       <template slot-scope="scope">
          <span style="">{{ scope.row.province_name?scope.row.province_name:scope.row.province_code }}</span>
           <span style="">{{ scope.row.city_name?scope.row.city_name:scope.row.city_code }}</span>
           <span style="">{{ scope.row.area_name?scope.row.area_name:scope.row.area_code }}</span>
           <span style="">{{ scope.row.address }}</span>
      </template>
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
      franchisee_id: ""
    };
  },
  computed: {
    ...mapState({
      franchisee: state => state.franchisee.schools.data
    })
  },
  created() {},
  mounted() {
    this.franchisee_id = this.$route.params.franchisee_id || "";
    this.getSchoolList({ franchisee_id: this.franchisee_id });
  },
  methods: {
    ...mapActions({
      getSchoolList: "getSchoolList",
      removeSchool:"removeSchool"
    }),
    handleAddSchoolClick() {
      this.$router.push({
        name: "franchisee_add_school",
        params: { franchisee_id: this.franchisee_id }
      });
    },
    handleDelClick(val) {
      let self = this;
      this.$confirm("确认删除？")
        .then(_ => {
          self.removeSchool({
            school_id: val.id,
            franchisee_id: self.franchisee_id
          });
        })
        .catch(_ => {});
    }
  }
};
</script>



