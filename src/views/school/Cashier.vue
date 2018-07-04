<template>
<div v-if="orderSummaryInfo" class="order">
    <h3>等待支付,请于 <span class="text-danger">{{orderSummaryInfo.payment_expires_at|formatDateTime('MM月DD日 hh时mm分ss秒')}}</span>前完成支付</h3>
    <el-row>
        <h3>订单:<small>{{orderSummaryInfo.order_no}}</small></h3>
        <el-form :model="orderSummaryInfo">
          <el-form-item label="学员"><span>{{orderSummaryInfo.student_name}}</span></el-form-item>
          <el-col :span="11"><el-form-item label="购买课程">
            <span>{{orderSummaryInfo.subject}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="数量">
            <span>{{orderSummaryInfo.total_lesson}}</span></el-form-item>
          </el-col>
        </el-form>
    </el-row>
    <el-row>
        <h3>缴费金额: <cny class="text-danger" :value="orderSummaryInfo.amount_payable"></cny></h3>
        <p>支付方式:{{orderSummaryInfo.payment_type|payment_type}}</p>
    </el-row>
    <el-row>
        <h3>支付信息</h3>
        <div v-if="orderSummaryInfo.payment_type>=2">
            <el-form size="small" style="max-width:500px;" :model="paymentInfo" ref="paymentInfo" label-position="right" label-width="100px">
                <el-form-item prop="payment_no" label="流水号"  :rules="[
                { required: true, message: '请输入流水号', trigger: 'blur' },
                ]">
                    <el-input v-model="paymentInfo.payment_no" placeholder="请填写支付流水号"></el-input>
                </el-form-item>
                <el-form-item prop="payee" label="收款人">
                    <el-input v-model="paymentInfo.payee" placeholder="收款人"></el-input>
                </el-form-item>
                <el-form-item>
                     <el-button type="danger" @click="onSubmitPayment()">确认付款</el-button>
                      <el-button type="info" @click="onCancleOrder()">取消订单</el-button>
                </el-form-item>
            </el-form>
            </div>
    </el-row>
</div>

</template>

<script>
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      paymentInfo: {
        payment_no: undefined,
        payee: undefined
      }
    };
  },
  computed: {
    ...mapState({
      payOfflineResult: state => state.order.payOfflineResult,
      current_school: state => state.current_user.current_school,
      //   course: state => state.order.course,
      student: state => state.order.student,
      orderSummaryInfo: state => state.order.orderSummaryInfo.data || {}
    }),
    order_id() {
      return this.$route.query.order_id;
    }
  },
  watch: {},
  mounted() {
    this.fetchOrderById({ order_id: this.order_id }).then(res => {
      if (res && res.code == 0 && res.data && res.data.state == 1) {
        if (
          new Date(res.data.payment_expires_at).setMilliseconds(0) < Date.now()
        ) {
          return this.onPaymentResult("failed", {
            code: 110,
            order_id: this.order_id
          });
        }
        return;
      } else {
        if (!res || !res.data) {
          this.$router.replace({
            name: "404"
          });
          return;
        }
        if (res.data.state == 2) {
          return this.onPaymentResult("success");
        }
        if (res.data.state > 2) {
          this.$router.replace({
            name: "order_list"
          });
        }
      }
    });
  },
  methods: {
    ...mapActions({
      payOffline: "payOffline",
      fetchOrderById: "fetchOrderById",
      cancelOrder: "cancelOrder"
    }),
    onPaymentResult(status, query) {
      this.$router.replace({
        name: "cashier_result",
        query: query,
        params: { status: status }
      });
    },
    onSubmitPayment() {
      this.$refs["paymentInfo"].validate(valid => {
        if (valid && this.order_id) {
          let payload = this.paymentInfo;
          payload.order_id = this.order_id;
          payload.school_id = this.current_school.id;
          this.payOffline(payload).then(val => {
            if (val && val.code == 0) {
              this.$message.success("提交成功");
              this.$router.replace({
                name: "cashier_result",
                params: { status: "success" }
              });
              // this.$router.replace({ name: "order_list" });
            } else {
              this.onPaymentResult("falied", {
                code: val.code,
                order_id: payload.order_id
              });
              // this.$router.replace({
              //   name: "cashier_result",
              //   query: { code: val.code, order_id: payload.order_id },
              //   params: { status: "failed" }
              // });
              // this.$message.error("提交失败");
            }
          });
        }
      });
    },
    onCancleOrder() {
      this.$confirm("确认取消订单？")
        .then(_ => {
          this.cancelOrder({ id: this.order_id }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("操作成功");
              this.$router.push({ name: "order_list", params: { page: 1 } });
            } else {
              this.$message.error("操作失败");
            }
          });
        })
        .catch(_ => {});
    }
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
