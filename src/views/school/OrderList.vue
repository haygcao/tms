<template>
<div class="order-list">
    <el-row>
        <div class="page-breadcrumb clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/school' }">校区管理</el-breadcrumb-item>
                <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </el-row>
    <el-row>
        <el-form :inline="true" size="small" ref="searchForm" :model="searchForm" class="order-search-form">
            <el-form-item prop="begin">
                <el-date-picker v-model="searchForm.begin" type="date" placeholder="起始时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="end">
                <el-date-picker v-model="searchForm.end" type="date" placeholder="结束时间"  value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
             <el-form-item prop="order_no">
                <el-input v-model="searchForm.order_no" placeholder="订单编号"></el-input>
            </el-form-item>
            <el-form-item prop="student">
                <el-input v-model="searchForm.student" placeholder="输入学员姓名或手机号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="onSearch" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="text" @click="onSearchLatstWeek">最近一周</el-button>
                <el-button type="text" @click="onSearchLatstMonth">最近一个月</el-button>
            </el-form-item>
        </el-form>
    </el-row>

    <el-row>
        <div class="block">
        <el-table :data="orderList.rows" stripe style="width: 100%;">

            <el-table-column type="expand" width="40">
              <template slot-scope="scope">
                        <el-form label-position="left" inline class="order-table-expand">
                          <el-form-item label="课程顾问">
                            <span>{{ scope.row.consultant_name }}</span>
                          </el-form-item>
                          <el-form-item label="来源">
                            <span>{{scope.row.origin}}</span>
                          </el-form-item>
                          <el-form-item label="是否年缴">
                            <span>{{scope.row.order_type==0?'否':('缴'+scope.row.order_type+'年')}}</span>
                          </el-form-item>
                          <el-form-item label="创建时间">
                            <span>{{scope.row.created_at|toDateTimeString}}</span>
                          </el-form-item>
                          <el-form-item label="支付时间">
                            <span> {{scope.row.payment_time|toDateTimeString}}</span>
                          </el-form-item>
                          <el-form-item label="支付方式">
                            <span> {{scope.row.payment_type|payment_type}}</span>
                          </el-form-item>
                          <el-form-item label="收款人">
                            <span>{{scope.row.payee}}</span>
                          </el-form-item>
                        </el-form>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="40">
            </el-table-column>
            <el-table-column prop="order_no" width="160" label="订单编号">
            </el-table-column>
            <el-table-column width="" label="班级">
                <template slot-scope="scope">
            {{scope.row.subject}}
          </template>
            </el-table-column>
            <el-table-column label="孩子姓名">
                <template slot-scope="scope">
            {{scope.row.student_name}}
          </template>
            </el-table-column>
            <!-- <el-table-column width="80" label="课程顾问">
                <template slot-scope="scope">
            {{scope.row.consultant_name}}
          </template>
            </el-table-column>
            <el-table-column width="80" label="来源">
                <template slot-scope="scope">
            {{scope.row.origin}}
          </template>
            </el-table-column>
            <el-table-column label="是否年缴">
                <template slot-scope="scope">
              {{scope.row.order_type==0?'否':('缴'+scope.row.order_type+'年')}}
          </template>
            </el-table-column> -->
            <el-table-column width="100" label="购买课次">
                <template slot-scope="scope">
            {{scope.row.total_lesson_number}}
          </template>
            </el-table-column>
            <el-table-column width="100" label="订单金额">
                <template slot-scope="scope">
           {{scope.row.amount|money}}
          </template>
            </el-table-column>
            <el-table-column width="80" label="状态">
                <template slot-scope="scope">
            {{scope.row.state|orderState}}
          </template>
            </el-table-column>
            <el-table-column width="150" label="创建时间">
                <template slot-scope="scope">
            {{scope.row.created_at|toDateTimeString}}
          </template>
             </el-table-column>
            <!--<el-table-column width="150" label="支付时间">
                <template slot-scope="scope">
            {{scope.row.payment_time|toDateTimeString}}
          </template>
            </el-table-column>
            <el-table-column width="80" label="支付方式">
                <template slot-scope="scope">
             {{scope.row.payment_type|payment_type}}
          </template>
            </el-table-column>
            <el-table-column width="100" label="收款人">
                <template slot-scope="scope">
            {{scope.row.payee}}
          </template>
            </el-table-column> -->
            <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
            <el-button @click="onShowDetail(scope.row)" type="text" size="small">查看</el-button>
            <el-button v-if="scope.row.state<=1" @click="onCancelOrder(scope.row)" type="text" size="small">取消</el-button>
             <el-button v-if="scope.row.state>1&&scope.row.state<9" @click="onRefundOrder(scope.row)" type="text" size="small">退款</el-button>
          </template>
            </el-table-column>
        </el-table>
        </div>
    </el-row>
    <el-row>
        <div class="text-center">
            <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage" layout="prev, pager, next" :page-size="pageSize" :total="orderList.count">
            </el-pagination>
        </div>
    </el-row>
</div>
</template>

<script>
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import moment from "moment";
import AddClass from "@/views/teaching_manage/AddClass.vue";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      searchForm: {
        begin: undefined,
        end: undefined,
        // state: undefined,
        student: undefined,
        order_no: undefined
      },
      pageSize: 10,
      currentPage: 1
    };
  },
  computed: {
    ...mapState({
      orderList: state => state.order.orderList.data || [],
      current_school: state => state.current_user.current_school,
      cancelOrderResult: state => state.order.cancelOrderResult
    }),
    ...mapGetters(["terms", "subjects", "class_types", "grades"])
  },
  watch: {
    $route(val, old) {
      let query = val.query;
      this.currentPage = parseInt(val.params.page);
      this.searchForm = Object.assign({}, query);
      this.search();
    },
    current_school(val, old) {
      if (val.id != old.id) {
        this.search();
      }
    },
    cancelOrderResult(val, old) {
      if (val && val.code == 0) {
        this.search();
      } else {
        this.$message.error(val.message || "请求失败");
      }
    }
  },
  mounted() {
    let query = this.$route.query;
    this.searchForm = Object.assign({}, query);
    this.currentPage = parseInt(this.$route.params.page);
    this.search();
  },
  methods: {
    ...mapActions({
      getOrderList: "getOrderList",
      cancelOrder: "cancelOrder"
    }),

    onSearch() {
      this.currentPage = 1;
      this.$router.push({
        name: this.$route.name,
        params: { page: this.currentPage },
        query: this.searchForm
      });
      this.search();
    },
    search() {
      let payload = Object.assign({}, this.searchForm);
      payload.limit = parseInt(this.pageSize);
      payload.offset = (this.currentPage - 1) * this.pageSize;
      payload.school_id = this.current_school.id;

      this.getOrderList(payload);
    },
    onSearchLatstWeek() {
      this.currentPage = 1;
      this.searchForm.student = undefined;
      this.searchForm.order_no = undefined;
      this.searchForm.end = moment().format("YYYY-MM-DD");
      this.searchForm.begin = moment(this.searchForm.end)
        .add(-7, "days")
        .format("YYYY-MM-DD");
      this.$router.push({
        name: this.$route.name,
        params: { page: this.currentPage },
        query: this.searchForm
      });
    },
    onSearchLatstMonth() {
      this.currentPage = 1;
      this.searchForm.student = undefined;
      this.searchForm.order_no = undefined;
      this.searchForm.end = moment().format("YYYY-MM-DD");
      this.searchForm.begin = moment(this.searchForm.end)
        .add(-1, "months")
        .format("YYYY-MM-DD");
      this.$router.push({
        name: this.$route.name,
        params: { page: this.currentPage },
        query: this.searchForm
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$router.push({
        name: this.$route.name,
        params: { page: this.currentPage },
        query: this.searchForm
      });
    },
    onCancelOrder(payload) {
      // this.searchForm = Object.assign(this.searchForm, this.defaultSearchForm);
      this.$confirm("确认取消订单？")
        .then(_ => {
          this.cancelOrder({ id: payload.id });
        })
        .catch(_ => {});
    },
    onRefundOrder(payload) {}
  },
  filters: {},
  components: {}
};
</script>

<style>
.order-search-form .el-input {
  max-width: 180px;
}
.order-table-expand {
  font-size: 0;
}

.order-table-expand label {
  width: 90px;
  color: #909399;
}

.order-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

