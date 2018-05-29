<template>
<div class="order">
    <el-row>
        <el-button type="danger" @click="goBack" size="small" icon="el-icon-arrow-left">返回上一页</el-button>
    </el-row>
    <el-row class="" v-if="currentClazz[0].student_limit&&currentClazz[0].student_count==currentClazz[0].student_limit">
      <div class="mt-15 info-block text-center text-warning">
      <p><i class="el-icon-warning"></i>班级名额已满，请选择其他班级报名～</p>
      </div>
    </el-row>
    <div v-else>
    <el-row>
        <h3>所报班级</h3>
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
            <el-table-column width="80" label="剩余名额">
                <template slot-scope="scope">
            <span :class="{'text-danger':(scope.row.student_limit-scope.row.student_count)<4}">{{scope.row.student_limit-scope.row.student_count}}</span>
          </template>
            </el-table-column>
            <el-table-column width="80" label="状态">
                <template slot-scope="scope">
            {{scope.row.state|classState}}
          </template>
            </el-table-column>
        </el-table>
    </el-row>
    <el-row>
        <h3>学员信息</h3>
        <div>
            <p><span class="text-warning text-small"><i class="el-icon-warning"></i>请先查询系统中是否存在该学员信息!</span></p>
            <el-form :inline="true" size="small" class="search-form" ref="searchForm" :rules="searchFormRules" :model="searchForm">
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
                    <el-select v-model="student.data.gender" placeholder="性别">
                        <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item prop="birthday" label="生日">
                        <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="生日" v-model="student.data.birthday"></el-date-picker>
                </el-form-item>
                <el-form-item> <span class="text-danger">{{student.data.birthday|age}}</span></el-form-item>
            </el-form>
            <p>家长信息</p>
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
          <p>学员不存在，<el-button type="text"  @click="onCreateStudent" icon="el-icon-edit-outline">创建新学员</el-button></p>
        </div>
    </el-row>
    <el-row>
        <h3>其他信息</h3>
        <div>
            <el-form size="small" :inline="true" :model="orderInfoForm" ref="orderInfoForm" label-position="left" label-width="">
                <el-form-item prop="consultant" label="顾问">
                  <el-select v-model="orderInfoForm.consultant" filterable :value-key="'id'" placeholder="请选择">
                    <el-option v-for="item in schoolConsultants" :key="item.id" :label="item.name" :value="item" >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="origin" label="来源">
                    <el-select v-model="orderInfoForm.origin" placeholder="来源">
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
        <h3>是否年缴</h3>
        <el-switch disabled v-model="payment_by_year" active-text="按年缴费" inactive-text="仅这学期">
        </el-switch>

        <div class="mt-15">
            <el-radio-group v-if="payment_by_year" v-model="order_length">
                <el-radio :label="1">缴1年</el-radio>
                <el-radio :label="2" v-if="currentClazz[0].grade=='A1'||currentClazz[0].grade=='A2'||currentClazz[0].grade=='H1'">缴2年</el-radio>
                <el-radio :label="3" v-if="currentClazz[0].grade=='A1'||currentClazz[0].grade=='H1'">缴3年</el-radio>
            </el-radio-group>
        </div>
    </el-row>
    <el-row>
        <h3>缴费明细</h3>
        <el-table :data="order_charges" :span-method="objectSpanMethod" border style="max-width: 850px; margin-top: 20px">
            <el-table-column prop="category" label="类目" width="">
            </el-table-column>
            <el-table-column prop="total_lesson_number" label="课次数">
            </el-table-column>
            <el-table-column prop="unit_price" label="单价/元">
            </el-table-column>
            <el-table-column prop="amount" label="原价合计/元">
            </el-table-column>
            <el-table-column prop="discount" label="折扣">
            </el-table-column>
            <el-table-column prop="discount_amount" label="优惠金额/元">
            </el-table-column>
            <el-table-column prop="amount_payable" label="应付/元">
            </el-table-column>
            <el-table-column prop="total" label="合计/元">
            </el-table-column>
        </el-table>
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
            <el-button type="danger" disabled="" @click="createStudentAndSubmitOrder(false)">暂存订单</el-button>
            <el-button type="primary" @click="createStudentAndSubmitOrder(true)">确认提交</el-button>
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
      hover: false,
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
      course: state => state.order.course,
      student: state => state.order.student || {},
      prePage: state => state.route.from,
      createOrderResult: state => state.order.createOrderResult,
      schoolConsultants: state => state.school.schoolConsultants.data || []
    }),
    ...mapGetters(["genders"])
  },
  created() {
    this.clearOrderCreateStates();
  },
  mounted() {
    this.getClazzById({
      clazz_id: this.$route.query.clazz_id
    });
    this.fetchCourseLesson({
      clazz_id: this.$route.query.clazz_id
    });
    this.getConsultants({ school_id: this.current_school.id });
  },
  watch: {
    currentClazz(val, old) {
      if (val && val[0]) {
        console.log(val);
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

    createStudentAndSubmitOrder(payment) {
      let self = this;
      this.validateOrderInfo()
        .then(() => {
          let payload = {};
          if (self.createStudentForm.mobile != undefined) {
            let student = self.createStudentForm;
            student.school_id = self.currentClazz[0].school_id;
            payload.student = student;
            payload.order = self.createOrderInfo();
          } else {
            if (self.student.data == null) {
              self.$message.error("缺少学员信息！");
              return false;
            }
            payload.student = false;
            payload.order = self.createOrderInfo();
          }
          self.createOrder(payload);
        })
        .catch(err => {
          console.error("error when submit order:", err);
        });
    },
    validateOrderInfo() {
      let self = this;
      return new Promise((resolve, reject) => {
        self.$refs["orderInfoForm"].validate(valid => {
          if (valid) {
            if (!self.$refs["createStudentForm"]) {
              return resolve(true);
            }
            self.$refs["createStudentForm"].validate(ok => {
              if (ok) {
                return resolve(true);
              } else {
                return reject(false);
              }
            });
          } else {
            return reject(false);
          }
        });
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
      let consultant = orderInfoForm.consultant;
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
  destroyed() {},
  components: {
    AddStudent
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
  width: 178px;
}
</style>
