<template>
<empty-data-view v-if="card.length==0" message=""><p class="text-info">还没选取课程 <el-button type="text" @click="goBack" size="">去选课<i class="el-icon-arrow-right"></i></el-button></p></empty-data-view>
<div v-else class="order">

    <el-row class="page-breadcrumb ">
        <el-button type="text" @click="goBack" size="" icon="el-icon-arrow-left">重新选课</el-button>
    </el-row>
    <el-row class="" v-if="currentClazz[0].student_limit&&currentClazz[0].student_count==currentClazz[0].student_limit">
      <div class="mt-15 info-block text-center text-warning">
      <p><i class="el-icon-warning"></i>班级名额已满，请选择其他班级报名～</p>
      </div>
    </el-row>
    <div v-else>
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
                <span class="product-info">
                  <span>{{item.product.subject|subjectName}}{{item.product.class_type|classType}}</span>
                  <cny class="margin-left-10" :value="item.product.price"></cny>
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
             <span class="text-info">课程费用总计:</span><cny class="amount-total margin-left-10 text-danger"  :value="card|total_amount"></cny></div></div>
            </div>
        </div>
    </el-row>
    <el-row>
        <h3>学员信息</h3>
        <div>
            <p><span class="text-warning text-small"><i class="el-icon-warning"></i>请先查询系统中是否存在该学员信息!</span></p>
            <el-form @keyup.enter.native="onSearch" :inline="true" size="small" class="search-form" ref="searchForm" :rules="searchFormRules" :model="searchForm">
                <el-form-item prop="mobile">
                    <el-input v-model="searchForm.mobile" clearable placeholder="输入学员家长的手机号查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onSearch" :loading="loading" icon="el-icon-search">查询</el-button>
                    <el-button type="text"  @click="onCreateStudent" icon="el-icon-edit-outline">创建新学员</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div v-if="student.data&&student.data.mobile">
            <p>孩子信息 <el-button size="small" type="text" @click="onEditStudent" icon="el-icon-edit">修改</el-button></p>
            <el-form class="student-info-form" disabled label-position="right" size="small" :model="student" :inline="true">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="student.data.name"></el-input>
                </el-form-item>
                <el-form-item label="英文名">
                    <el-input v-model="student.data.name_en"></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="student.data.nickname"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="student.data.gender" style="width:178px;" placeholder="性别">
                        <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item prop="birthday" label="生日">
                        <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="生日" v-model="student.data.birthday"></el-date-picker>
                </el-form-item>
                <el-form-item> <span class="text-info">年龄:{{student.data.birthday|age}}</span></el-form-item>
            </el-form>
            <el-form v-for="(parentForm ,index) in student.data.parents" :key="index" size="small" class="parent-form" :inline="true" disabled :model="parentForm">
                <el-form-item prop="relation" :label="'家长'+(index+1)">
                    <el-input v-model="parentForm.relation"></el-input>
                </el-form-item>
                <el-form-item prop="name" label="姓名">
                    <el-input v-model="parentForm.name"></el-input>
                </el-form-item>
                <el-form-item prop="mobile" label="手机">
                    <el-input v-model="parentForm.mobile"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="parentForm.email" ></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="loadedStudent&&(!student||!student.data||!student.data.mobile)">
          <el-alert
              title="学员不存在,请先创建新学员"
              type="warning"
              :closable="false"
              show-icon>
          </el-alert>
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
        <h3>
            <el-button type="primary" @click="onSubmitOrder()">确认提交</el-button>
        </h3>
    </el-row>
    </div>
     <el-dialog :visible.sync="dialogAddStudentVisible" fullscreen  center >
        <h1 slot="title">{{addStudentMode=='create'?'添加新学员':'修改学员信息'}}</h1>
      <add-student :mode="addStudentMode" :studentId="(student.data?student.data.id:'')" :school="currentClazz[0].school_id" v-if="dialogAddStudentVisible" @success="onCreateStudentSuccess" @cancel="dialogAddStudentVisible=false"></add-student>
     </el-dialog>
     </div>

</template>

<script>
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
import AddStudent from "@/views/school/AddStudent.vue";

export default {
  data() {
    return {
      teacher_avatar_man: require("@/assets/img/teacher_1.png"),
      teacher_avatar_woman: require("@/assets/img/teacher_0.png"),
      dialogAddStudentVisible: false,
      addStudentMode: "create",
      searchForm: {
        mobile: undefined
      },
      searchFormRules: {
        mobile: [
          {
            pattern: /^1[34578]\d{9}$/,
            message: "只支持中国大陆手机号码",
            trigger: "blur"
          }
        ]
      },
      payment_by_year: false,
      order_length: 1,
      payment_type: 2,
      orderOriginOptions: [
        "Call in",
        "Walk in",
        "Net in",
        "Active",
        "Referral",
        "其他"
      ],
      loadedStudent: false,
      loading: false,
      preferenceForm: {
        customize_preference: undefined,
        customize_preference_description: undefined
      },
      orderInfoForm: {
        origin: undefined,
        references: undefined,
        consultant: undefined,
        consultant_id: undefined,
        consultant_name: undefined,
        note: undefined
      },

      order_charges: []
    };
  },
  computed: {
    ...mapState({
      currentClazz: state => {
        return [state.clazz.selectedClazz.data || {}];
      },
      current_school: state => state.current_user.current_school,
      course: state => state.order.course.data || [],
      student: state => state.order.student || {},
      prePage: state => state.route.from,
      createOrderResult: state => state.order.createOrderResult,
      schoolConsultants: state => state.school.schoolConsultants.data || []
    }),
    ...mapGetters(["genders", "grades", "terms"]),
    card() {
      return this.$shoppingCard.items;
    },
    courseToBuy() {
      let list = [];
      const grade1 = ["A1", "A2", "A3"];
      const grade2 = ["H1", "H2"];
      const term1 = [1, 2, 3, 4];
      const term2 = [5, 6];
      let term = this.currentClazz[0].term < 5 ? term1 : term2;
      this.course.forEach(c => {
        let course = Object.assign({}, c);
        course.purchase_lesson_number = 0;
        if (term.includes(course.term)) {
          list.push(course);
        }
      });
      return list;
    },
    courseTable() {
      const grade1 = ["A1", "A2", "A3"];
      const grade2 = ["H1", "H2"];

      const term1 = [1, 2, 3, 4];
      const term2 = [5, 6];
      let grade = this.currentClazz[0].grade.startsWith("A") ? grade1 : grade2;
      let term = this.currentClazz[0].term < 5 ? term1 : term2;
      let table = {};
      table.count = grade.length;
      grade.forEach(g => {
        table[g] = {};
        table[g].count = term.count;
        term.forEach(t => {
          table[g][t] = {};
          let current = this.course.find(c => c.grade == g && c.term == t);
          table[g][t].total_lesson_number = current
            ? current.total_lesson_number
            : 0;
          this.current;
          table[g][t].buy_lesson_number = this.currentClazz[0];
        });
      });
      return { grades: grade, Terms: term };
    }
  },
  created() {
    // this.clearOrderCreateStates();
  },
  mounted() {
    // this.getClazzById({
    //   clazz_id: this.$route.query.clazz_id
    // });
    // this.fetchCourseLesson({
    //   clazz_id: this.$route.query.clazz_id
    // });
    this.getConsultants({ school_id: this.current_school.id });
  },
  watch: {
    currentClazz(val, old) {
      if (val && val[0]) {
        // console.log(val);
        this.culcOrderCharges(val[0]);
      }
    },
    createOrderResult(val, old) {
      if (val && val.code == 0) {
        this.$router.replace({
          name: "cashier",
          query: { order_id: val.data.order_id, sign: val.data.sign }
        });
      }
    }
  },
  methods: {
    ...mapActions({
      getClazzById: "getClazzById",
      getStudentByMobile: "getOrderStudentByMobile",
      checkStudentExist: "checkStudentExist",
      createStudent: "createStudent",
      addStudentParent: "addStudentParent",
      clearOrderCreateStates: "clearOrderCreateStates",
      fetchCourseLesson: "fetchCourseLesson",
      createOrder: "createOrder",
      getConsultants: "getConsultants"
    }),
    goBack() {
      this.$router.replace({
        path: "/school/classes/1"
      });
    },
    onSearch() {
      if (this.searchForm.mobile == null) {
        return false;
      }
      this.$refs["searchForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.loadedStudent = false;
          let payload = this.searchForm;
          this.getStudentByMobile(payload).then(() => {
            this.loadedStudent = true;
            this.loading = false;
          });
        }
      });
    },
    onCreateStudent() {
      this.dialogAddStudentVisible = true;
      this.addStudentMode = "create";
    },
    onCreateStudentSuccess(mobile) {
      let self = this;
      this.dialogAddStudentVisible = false;
      this.getStudentByMobile({ mobile: mobile });
    },
    onEditStudent() {
      this.dialogAddStudentVisible = true;
      this.addStudentMode = "edit";
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
          if (self.student.data == null) {
            self.$message.error("缺少学员信息！");
            return false;
          }
          let payload = {};
          payload.order = self.createOrderInfo();
          self.createOrder(payload);
        }
      });
    },
    createOrderInfo() {
      let order = {};
      let clazz = this.currentClazz[0];
      let orderInfoForm = this.orderInfoForm;

      //   order.student_id = this.student.data.student_id;
      order.subject = `${SubjectName[clazz.subject]}${Grade[clazz.grade]}${
        Terms[clazz.term]
      }${ClassType[clazz.class_type]}`;
      order.payment_type = this.payment_type;
      order.total_lesson = clazz.total_lesson_number;
      order.origin = orderInfoForm.origin;
      order.references = orderInfoForm.references;
      order.note = orderInfoForm.note;
      let consultant = orderInfoForm.consultant || {};
      order.consultant_id = consultant.id;
      order.consultant_name = consultant.name;
      order.payment_state = 0; //未支付
      order.state = 0; //新单
      order.school_id = clazz.school_id;
      order.franchisee_id = clazz.franchisee_id;
      order.clazz_id = clazz.id;
      order.order_type = this.payment_by_year ? this.order_length : 0;
      order.course = [
        {
          title: `${SubjectName[clazz.subject]}${Grade[clazz.grade]}${
            Terms[clazz.term]
          }${ClassType[clazz.class_type]}`,
          term: clazz.term,
          grade: clazz.grade,
          subject: clazz.subject,
          class_type: clazz.class_type,
          total_lesson_number: clazz.total_lesson_number,
          purchase_lesson_number:
            clazz.total_lesson_number - (clazz.current_lesson_number || 0)
        }
      ];

      return order;
    },
    culcOrderCharges(clazz) {
      clazz = clazz || this.currentClazz[0];
      let price = 200.0;
      this.order_charges.push({
        category: "学费",
        unit_price: price,
        total_lesson_number: clazz.total_lesson_number,
        discount: "--",
        discount_amount: 0.0,
        amount: price * clazz.total_lesson_number,
        total: price * clazz.total_lesson_number
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  },
  filters:{
      total_amount(card) {
      let amount = 0;
      card.forEach(item => {
        amount += item.quantity * parseFloat(item.product.price);
      });
      return amount;
    },
    item_amount(item) {
      return item.quantity * parseFloat(item.product.price);
    }
  },
  destroyed() {},
  components: {
    AddStudent
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
    font-size: 14px;
}

.item-title-inner {
    line-height: 28px;
    font-size: 18px;
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
</style>
