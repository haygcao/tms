<template>
<empty-data-view v-if="card.length==0" message=""><p class="text-info">还没选取课程 <el-button type="text" @click="goBack" size="">去选课<i class="el-icon-arrow-right"></i></el-button></p></empty-data-view>
<div v-else class="order">

    <el-row class="page-breadcrumb ">
        <el-button type="text" @click="goBack" size="" icon="el-icon-arrow-left">重新选课</el-button>
    </el-row>
      <el-alert
       v-if="clazz_validate_results.length>0"
            title="无法报名"
            type="error"
            :closable="false"
            :description="clazz_validate_results[0].message"
            show-icon>
    </el-alert>
    <div v-else>
    <el-row>
         <h3>学员信息 <el-button size="small" type="text" @click="onEditStudent" icon="el-icon-edit">更改</el-button></h3>
         <div class="student-info">
                <div class="student-item block">
                <div class="col-1">
                  <img class="img-circle" :src="student.avatar_url?student.avatar_url:(student.gender==1?student_avatar_boy:student_avatar_girl)">
                  <i style="float:right" :class="[student.gender==1 ? 'icon-gender-male student-gender-male' : 'icon-gender-female student-gender-female']" class="emp-gender icon iconfont "></i>
                  <div class="student-fileds">{{student.name}}</div>
                </div>
                <div class="col-2">
                  <div class="student-fileds"><span class="">编号:</span><span>{{student.student_no}}</span></div>
                  <div class="student-fileds"><span>睿乐账号:</span><span>{{student.mobile}}</span></div>
                  <div class="student-fileds"><span>年龄:</span><span>{{student.birthday}}<span class="text-danger">({{student.birthday|age}})</span></span></div>
                </div>
                <div class="col-3">
                  <div class="student-fileds" v-for="(parent, index) in student.parents" :key="parent.relation">
                    <span v-if="index<4"><span>{{ parent.relation }}<span v-if="parent.name">({{parent.name}})</span>:{{parent.mobile}}</span></span>
                  </div>
                </div>
                <!-- <div class="col-4"><el-button icon="el-icon-edit" size="small" plain @click="onEditStudent">修改</el-button></div> -->
              </div>
            </div>
    </el-row>
    <el-row>
        <h3>选课信息</h3>
        <div class="card-content" v-if="card.length>0">
        <div class="card-item " v-for="item in card" :key="item.index.id">
            <div class="card-item-title clearfix">
            <div class="item-title-inner">
            <strong>{{item.index.subject|subjectName}}</strong>

            </div>
            </div>
            <div class="divide-line"></div>
            <div class="card-item-index" >
              <div v-if="item.category=='clazz'">
                <div> <span class="item-desc">报名班级:</span>
                    <strong class="clazz-name">
                    <span>{{item.index.grade|grade}}{{item.index.term|terms}}{{item.index.class_type|classType}}</span>
                    <span class="clazz-state-badge" v-if="item.index.state==1">{{item.index.state|classState}}</span>
                </strong>
                </div>
                
                <div class="clazz-fileds clearfix">
                <div class="">
                    <div class="fileds-s1">
                        <div>{{item.index.begin_date|formatDateTime(' M月D日')}}-{{item.index.finish_date|formatDateTime(' M月D日')}}</div>
                        <span v-if="item.index.class_type=='1'||item.index.class_type=='2'">{{item.index.begin_date|weekDay}}</span>
                        <span v-if="item.index.class_type=='3'||item.index.class_type=='4'">每天</span>
                        {{item.index.class_begin_time|toShortTimeString}}-{{item.index.class_finish_time|toShortTimeString}}
                    </div>
                    <div class="fileds-s2">
                    <div>剩余/总课次</div>
                    <div>
                        <strong>{{item.index.total_lesson_number-(item.index.current_lesson_number||0)}}</strong><span class="text-info">/</span>
                        <strong>{{item.index.total_lesson_number}}</strong>
                    </div>
                    </div>
                    <div class="fileds-s3">
                      <img class="img-circle small" :src="item.index.teacher.avatar_url?item.index.teacher.avatar_url:(item.index.teacher.gender==1?teacher_avatar_man:teacher_avatar_woman)"
                                  :alt="item.index.teacher.name">
                                <span>{{item.index.teacher.name}}</span>
                    
                    </div>
                </div>
                </div>
              </div>
            </div>
            <div class="card-item-product">
              <template v-if="item.category=='clazz'">
                <div><span  class="item-desc">已选课程:</span>
                <span class="product-info ">
                  <span>{{item.product.subject|subjectName}}{{item.product.class_type|classType}}</span>
                  <cny class="margin-left-15" :value="item.product.price"></cny>
                  <span class="text-info"> &times;</span>
                  <strong>{{item.quantity}}</strong>
                  <span class="text-info">=</span>
                  <cny class="text-danger" :value="item|item_amount"></cny>
                </span>
                </div>
                <div></div>
              </template>
            </div>
        </div>
        <div class="card-item"><div class="card-item-title">
            <div class="item-title-inner">
             <span class="text-info">费用总计:</span><cny class="amount-total margin-left-15 text-danger"  :value="$shoppingCard.amount|total_amount_discounted((discount.discount_percent||100)/100)"></cny>
             <el-badge v-if="discount&&(discount.discount_percent||100)<100" :value="formatDiscount(discount.discount_percent)" class="item">
             <span v-if="discount&&(discount.discount_percent||100)<100" class="margin-left-15 text-info"><small>&yen;</small><del>{{$shoppingCard.amount|formatCurrency}}</del></span>
             </el-badge>
             </div>
             </div>
        </div>
        </div>
        <br>
        <el-form size="small" :inline="true" :model="preferenceForm" ref="orderInfoForm" label-position="left" label-width="">
                <el-form-item prop="extra_reduction_amount" label="自定义优惠金额¥">
                  <el-input type="number" v-model="preferenceForm.extra_reduction_amount" placeholder="0"></el-input>
                </el-form-item>
                <el-form-item prop="extra_reduction_desction" label="优惠说明">
                   <el-input v-model="preferenceForm.extra_reduction_desction" placeholder="优惠说明（100字以内）"></el-input>
                </el-form-item>
        </el-form>
        <br>
        <div><span class="text-info">应付:</span>
        <cny class="amount-total margin-left-15 text-danger"  :value="amount_payable"></cny>
        </div>
    </el-row>
    
    <el-row>
        <h3>其他信息</h3>
        <div>
            <el-form size="small" :inline="true" :model="orderInfoForm" ref="orderInfoForm" label-position="left" label-width="">
                <el-form-item prop="consultant" label="顾问">
                  <el-select v-model="orderInfoForm.consultant" filterable clearable :value-key="'id'" placeholder="请选择">
                    <el-option v-for="item in schoolConsultants" :key="item.id" :label="item.name" :value="item" >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="origin" label="来源">
                    <el-select v-model="orderInfoForm.origin" clearable placeholder="来源">
                        <el-option v-for="item in orderOriginOptions" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="references" label="推荐人">
                    <el-input v-model="orderInfoForm.references" placeholder="推荐人"></el-input>
                </el-form-item>
                <br>
                <el-form-item prop="note" label="备注">
                    <el-input type="textarea" v-model="orderInfoForm.note" style="width:340px;" placeholder="备注信息"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </el-row>
    <el-row>
        <h3>支付方式</h3>
        <el-radio-group v-model="payment_type">
            <el-radio disabled="" :label="0" border><i class="iconfont icon-wxpay"></i>微信</el-radio>
            <el-radio disabled :label="1" border><i class="iconfont icon-alipay"></i>支付宝</el-radio>
            <el-radio :label="2" border><i class="iconfont icon-rmb"></i>现金</el-radio>
            <el-radio :label="3" border><i class="iconfont icon-yinlian"></i>刷卡</el-radio>
        </el-radio-group>
        
       
    </el-row>
    <el-row>
        <h3>
            <el-button type="danger" size="" icon="iconfont icon-bankcard el-icon-" @click="onSubmitOrder()">确认提交</el-button>
        </h3>
    </el-row>
    </div>
    <el-dialog :visible.sync="dialogStudentPickerVisible" fullscreen  center >
        <student-picker v-if="dialogStudentPickerVisible"  @student-picked="dialogStudentPickerVisible=false"></student-picker>
         <div slot="footer" class="dialog-footer">
        </div>
     </el-dialog>
     </div>

</template>

<script>
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
// import AddStudent from "@/views/school/AddStudent.vue";
import StudentPicker from "@/views/school/StudentPicker.vue";
export default {
  data() {
    return {
      teacher_avatar_man: require("@/assets/img/teacher_1.png"),
      teacher_avatar_woman: require("@/assets/img/teacher_0.png"),
      student_avatar_girl: require("@/assets/img/student_0.png"),
      student_avatar_boy: require("@/assets/img/student_1.png"),
      dialogStudentPickerVisible: false,
      clazz_validate_results: [],
      payment_type: 2, //现金
      orderOriginOptions: [
        "Call in",
        "Walk in",
        "Net in",
        "Active",
        "Referral",
        "其他"
      ],

      preferenceForm: {
        extra_reduction_amount: undefined,
        extra_reduction_desction: undefined
      },
      orderInfoForm: {
        origin: undefined,
        references: undefined,
        consultant: undefined,
        consultant_id: undefined,
        consultant_name: undefined,
        note: undefined
      }
    };
  },
  computed: {
    ...mapState({
      current_school: state => state.current_user.current_school,
      course: state => state.order.course.data || [],
      prePage: state => state.route.from,
      createOrderResult: state => state.order.createOrderResult,
      schoolConsultants: state => state.school.schoolConsultants.data || [],
      discounts: state => state.discount.list.data || []
    }),
    ...mapGetters(["genders", "grades", "terms"]),
    card() {
      return this.$shoppingCard.items;
    },
    student() {
      return this.$shoppingCard.student;
    },
    discount() {
      if (!this.discounts) {
        return {};
      }
      let total_quantity = this.$shoppingCard.quantity;
      let discounts_sorted = this.discounts.slice().sort((a, b) => {
        return a - b;
      });
      let filter = discounts_sorted.filter(
        v => v.min_quantity <= total_quantity
      );
      if (filter && filter.length > 0) {
        return filter[filter.length];
      }
      return {};
    },
    amount_payable() {
      let discount = (this.discount.discount_percent || 100) / 100;
      let amount =
        this.$shoppingCard.amount * discount -
        (this.preferenceForm.extra_reduction_amount || 0);
      return amount;
    }
  },
  created() {
    // this.clearOrderCreateStates();
  },
  mounted() {
    // this.getClazzById({
    //   clazz_id: this.$route.query.clazz_id
    // });
    if (!this.discounts) {
      this.getDiscountList({ school_id: this.current_school.id });
    }
    this.validateClazz();
    this.getConsultants({ school_id: this.current_school.id });
  },
  watch: {
    // createOrderResult(val, old) {
    //   if (val && val.code == 0) {
    //     this.$router.replace({
    //       name: "cashier",
    //       query: { order_id: val.data.order_id, sign: val.data.sign }
    //     });
    //   }
    // }
  },
  methods: {
    ...mapActions({
      getClazzById: "getClazzById",
      //   getStudentByMobile: "getOrderStudentByMobile",
      //   checkStudentExist: "checkStudentExist",
      //   createStudent: "createStudent",
      //   addStudentParent: "addStudentParent",
      clearOrderCreateStates: "clearOrderCreateStates",
      //   fetchCourseLesson: "fetchCourseLesson",
      createOrder: "createOrder",
      getConsultants: "getConsultants"
    }),
    goBack() {
      this.$router.replace({
        path: "/school/classes/1"
      });
    },
    confirmToPurchase() {
      this.$router.push({ name: "create_order" });
    },
    formatDiscount(discount_percent) {
      if (typeof discount_percent !== "number") {
        return "";
      }
      let percent =
        ~~(discount_percent / 10) === discount_percent / 10
          ? ~~(discount_percent / 10)
          : discount_percent / 10;
      return `${percent}折`;
    },
    validateClazz() {
      let tasks = [];
      this.card.forEach(item => {
        tasks.push(this.getClazzById({ clazz_id: item.index.id }));
      });
      if (tasks.length > 0) {
        Promise.all(tasks).then(results => {
          for (let i = 0; i < results.length; i++) {
            let res = results[i];
            if (res.data && res.data.student_count >= res.data.student_limit) {
              this.clazz_validate_results.push({
                message: "所选班级名额已满，无法报名",
                id: res.data.id
              });
            }
          }
        });
      }
    },
    onEditStudent() {
      this.dialogStudentPickerVisible = true;
    },
    switchOrderType(val) {
      if (this.order_type == 1) {
        alert(1);
      }
    },
    onSubmitOrder() {
      let self = this;
      self.$refs["orderInfoForm"].validate(valid => {
        if (valid) {
          if (self.student == null) {
            self.$message.error("缺少学员信息！");
            return false;
          }
          let payload = {};
          payload.order = self.createOrderBody();
          console.log(payload);
          self.createOrder(payload).then(res => {
            if (res.code == 0) {
              this.$router.replace({
                name: "cashier",
                query: { order_id: res.data.order_id }
              });
              this.$shoppingCard.clear();
            } else {
              self.$message.error("订单提交失败");
              return false;
            }
          });
        }
      });
    },
    createOrderBody() {
      let order = {};
      //   let clazz = this.currentClazz[0];
      let orderInfoForm = this.orderInfoForm;

      //   order.student_id = this.student.data.student_id;
      let subs = this.card.map(item => {
        return `${item.index.subject_display}${item.index.class_type_display}`;
      });
      order.subject = subs.toString();

      order.payment_type = this.payment_type;
      order.total_lesson = this.$shoppingCard.quantity;

      let extra_info = Object.assign({}, this.orderInfoForm);
      order.extra_info = extra_info;

      order.payment_state = 0; //未支付
      order.state = 0; //新单
      order.school_id = this.current_school.id;
      order.franchisee_id = this.card[0].index.franchisee_id;
      order.shoppingCard = this.$shoppingCard.package();
      this.checkout(order.shoppingCard); //结算产品金额
      order.order_type = 0; //'ra-sys'
      order.student = this.$shoppingCard.student;
      order.discounts = this.discount;
      order.amount = order.shoppingCard.amount;
      order.amount_payable = this.amount_payable;
      return order;
    },
    checkout(bag) {
      bag.discount = this.discount;
      bag.items.forEach(item => {
        item.amount = item.quantity * parseFloat(item.product.price);
        item.amount_payable =
          item.amount * ((this.discount.discount_percent || 100) / 100);
      });
      bag.amount_payable = this.amount_payable;
      // bag.amount * ((this.discount.discount_percent || 100) / 100);
    }
  },
  filters: {
    total_amount_discounted(amount, discount) {
      return amount * discount;
    },
    item_amount(item) {
      return item.quantity * parseFloat(item.product.price);
    }
  },
  destroyed() {},
  components: {
    StudentPicker
  }
};
</script>

<style lang="stylus" scoped>
em, i, u {
    font-style: normal;
}

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
    padding-top: 15px;

    &:first-child {
        border-top: none;
        padding-top: 0;
    }
}

.mt-15 {
    margin-top: 15px;
}

.student-info-form .el-input {
    width: 178px !important;
}

.card-item {
    background: #fff;
    padding: 0px;
    border: 1px solid #dedede;
}

.card-item:not(:last-child) {
    border-bottom: none;
}

.card-item-title {
    padding: 10px 0px;
    background: #f8f8f8;
}

.item-desc {
    color: #909399;
    padding: 5px 0px;
}

.product-info {
    line-height: 28px;
}

.item-title-inner {
    line-height: 28px;
    // font-size: 18px;
    padding-left: 8px;
    padding-right: 10px;
}

.subject-tag-1 {
    padding: 10px 5px;
    background: #F56C6C;
}

.subject-tag-2 {
    padding: 10px 5px;
    background: #409EFF;
}

.subject-tag-3 {
    padding: 10px 5px;
    background: #E6A23C;
}

.divide-line {
    border-bottom: 1px solid #e4e7ed;
}

.card-item-index, .card-item-product, .card-item-detail {
    padding: 10px;
}

.clazz-name {
    font-size: 16px;
}

.clazz-fileds {
    font-size: 12px;
    padding: 8px;
    margin: 5px 0px;
}

.clazz-fileds div[class^='fileds-'] {
    padding: 0px 8px;
    display: inline-block;
    vertical-align: middle;
}

.clazz-fileds div[class^='fileds-']:first-child {
    border-left: none;
    padding-left: 0px;
}

.fileds-s1 {
    display: inline-block;
}

.fileds-s2 {
    display: inline-block;
    border-left: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
}

.fileds-s3 {
    display: inline-block;
}

.terms-list {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    background: #f8f8f8;
    padding: 8px;
    margin: 5px auto;
    font-size: 12px;
}

.terms-list > div {
    flex: 1;
    text-align: center;
    border-right: 1px solid #e4e7ed;
}

.terms-list > div:last-child {
    border-right: none;
}

.grades {
    font-size: 14px;
}

.float-right {
    float: right;
}

.student-info .student-item {
    background-color: #ffffff;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: stretch;
    padding: 20px;
    margin-bottom: 15px;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    color: #606266;
}

.student-item .col-1 {
    width: 120px !important;
    text-align: center;
    border-right: 1px solid #ebeef5;
    padding-left: 0px !important;
    /* order: 1; */
}

.student-item .col-2 {
    width: 200px;
    /* order: 2; */
}

.student-item .col-3 {
    flex: 1;
    /* order: 3; */
}

.student-item .col-4 {
    /* border-right: 1px solid #ebeef5; */
    width: 120px !important;
    /* order: 1; */
}

.student-item .student-fileds .fileds-title {
    width: 80px;
    display: inline-block;
}

.student-item .student-fileds .fileds-counter {
    font-size: 20px;
    line-height: 12px;
}

.student-item div[class^='col-'] {
    padding-left: 15px;
    padding-right: 15px;
    width: 200px;
}

.student-item .student-fileds {
    padding: 8px 0px;
    overflow: hidden;
    white-space: nowrap;
    word-break: normal;
    text-overflow: ellipsis;
}

.student-item:not(.disabled) .student-gender-male {
    color: #409eff;
    color: rgba(64, 158, 255, 0.5);
}

.student-item:not(.disabled) .student-gender-female {
    color: #f56c6c;
    color: rgba(245, 108, 108, 0.5);
}

.margin-left-15 {
    margin-left: 15px;
}
</style>
