<template>
<div >
  <el-card v-if="status=='success'" style="transform:translateY(50%)">
    <h3 class=" text-center text-success"><i class="el-icon-success"></i>订单已支付成功</h3>
  </el-card>
<div v-else style="transform:translateY(50%)">
  <!-- <empty-data-view v-if="!orderSummaryInfo||!orderSummaryInfo.order_no" message="订单不存在"></empty-data-view> -->
  <el-card v-if="code&&code==110">
    <h3 class=" text-center text-danger"><i class="el-icon-error"></i>支付失败,超出支付时间</h3>
  </el-card>
  <el-card v-else-if="code&&code==130">
    <h3 class=" text-center text-danger"><i class="el-icon-error"></i>订单已取消或者被关闭，无法完成付款</h3>
  </el-card>
  <el-card v-else>
    <h3 class=" text-center text-danger"><i class="el-icon-error"></i>订单异常，无法继续支付</h3>
  </el-card>
</div>
</div>
</template>

<script>
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    // ...mapState({
    //   payOfflineResult: state => state.order.payOfflineResult,
    //   current_school: state => state.current_user.current_school,
    //   //   course: state => state.order.course,
    //   student: state => state.order.student,
    //   orderSummaryInfo: state => state.order.orderSummaryInfo.data || {}
    // }),
    status() {
      return this.$route.params.status || "success";
    },
    order_id() {
      return this.$route.query.order_id;
    },
    code() {
      return this.$route.query.code || 0;
    }
  },
  watch: {},
  mounted() {
    // this.fetchOrderById({ order_id: this.order_id });
  },
  methods: {
    ...mapActions({
      //   payOffline: "payOffline",
      fetchOrderById: "fetchOrderById"
      //   cancelOrder: "cancelOrder"
    })
  }
};
</script>
<style lang="stylus" scoped>
.order {
  background-color: #ffffff;
}

.search-form .el-input {
  width: 240px;
}

.order .el-row {
  border-top: 1px dashed #DCDFE6;

  &:first-child {
    border-top: none;
  }
}

.parent-form {
  border-top: 1px dashed #EBEEF5;
  padding-top: 15px;

  &:first-child {
    border-top: none;
    padding-top: 0;
  }
}

.mt-15 {
  margin-top: 15px;
}

.student-form .el-input {
}
</style>
