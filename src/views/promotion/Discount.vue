<template>
    <div class="promotion">
        <vue-headful title="促销折扣-睿乐教育" description="睿乐教育" />
        <el-row >
            <div class="page-breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>业务管理</el-breadcrumb-item>
                <el-breadcrumb-item>折扣设置</el-breadcrumb-item>
            </el-breadcrumb>
            </div>
        </el-row>
        <el-form>
        <el-row v-for="(discount,index) in discounts" :key="index" >
            
        </el-row>
        </el-form>
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
      discounts: state => state.discount.list.data || [],
      current_school: state => state.current_user.current_school
    })
  }
};
</script>

