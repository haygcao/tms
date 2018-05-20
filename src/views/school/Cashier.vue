<template>
<div class="order">
    <h3>等待支付,<span class="text-danger">请于 {{orderSummaryInfo.payment_expires_at|toTimeString}}前完成支付</span></h3>
    <el-row>
        <h3>报名信息</h3>
        <el-table :data="currentClazz" border style="max-width: 1100px">
            <el-table-column label="班级">
                <template slot-scope="scope">
              {{scope.row.year}}{{scope.row.subject|subjectName}}{{scope.row.grade|grade}}{{scope.row.term|terms}}{{scope.row.class_type|classType}}
          </template>
            </el-table-column>
            <el-table-column width="200" label="上课时间">
                <template slot-scope="scope">
            <p>{{scope.row.begin_date|toDateString}}-{{scope.row.finish_date|toDateString}}</p>
            <p><span v-if="scope.row.class_type=='0'||scope.row.class_type=='1'">{{scope.row.begin_date|weekDay}}</span> {{scope.row.class_begin_time|toShortTimeString}}-{{scope.row.class_finish_time|toShortTimeString}}</p>
          </template>
            </el-table-column>
            <el-table-column width="120" label="上课地点">
                <template slot-scope="scope">
            {{scope.row.classroom_name}}
          </template>
            </el-table-column>
            <el-table-column width="120" label="授课老师">
                <template slot-scope="scope">
            {{scope.row.teacher_name}}
          </template>
            </el-table-column>
            <el-table-column width="80" label="总课次">
                <template slot-scope="scope">
            {{scope.row.total_lesson_number||0}}
          </template>
            </el-table-column>
            <el-table-column width="80" label="剩余课次">
                <template slot-scope="scope">
             {{scope.row.total_lesson_number - (scope.row.current_lesson_number||0)}}
          </template>
            </el-table-column>
        </el-table>
    </el-row>
    <el-row>
        <h3>缴费金额(元): <span class="text-danger">{{orderSummaryInfo.amount|money}}</span></h3>
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
                      <el-button type="text" @click="onCancleOrder()">取消订单</el-button>
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
      currentClazz: state => {
        if (state.clazz.selectedClazz.data) {
          return [state.clazz.selectedClazz.data];
        }
        return [];
      },
      payOfflineResult: state => state.order.payOfflineResult,
      //   course: state => state.order.course,
      student: state => state.order.student,
      orderSummaryInfo: state => state.order.orderSummaryInfo.data||{}
    }),
    order_id() {
      return this.$route.query.order_id;
    },
    sign() {
      return this.$route.query.sign;
    }
  },
  watch: {
    orderSummaryInfo(val, old) {
      if (val) {
        this.getClazzById({
          clazz_id: val.clazz_id
        });
      }
    },
    payOfflineResult(val, old) {
      if (val && val.code == 0) {
        this.$message.success("提交成功");
        this.$router.replace({ name: "order_list" });
      } else {
        this.$message.success(val.message || "提交失败");
      }
    }
  },
  mounted() {
    this.fetchOrderById({ order_id: this.order_id });
  },
  methods: {
    ...mapActions({
      payOffline: "payOffline",
      fetchOrderById: "fetchOrderById",
      getClazzById: "getClazzById"
    }),
    onSubmitPayment() {
      this.$refs["paymentInfo"].validate(valid => {
        if (valid && this.order_id && this.sign) {
          let payload = this.paymentInfo;
          payload.order_id = this.order_id;
          payload.sign = this.sign;
          this.payOffline(payload);
        }
      });
    },
    onCancleOrder() {}
  }
};
</script>
<style lang="stylus" scoped>
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
