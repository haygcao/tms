<template>
<div class="order">
    <el-row>
        <el-button type="danger" @click="goBack" size="small" icon="el-icon-arrow-left">返回上一页</el-button>
    </el-row>
    <el-row>
        <h3>所报班级</h3>
        <el-table :data="currentClazz" border style="width: 100%">
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
            <el-form :inline="true" size="small" class="search-form" ref="searchForm" :model="searchForm">
                <el-form-item prop="mobile">
                    <el-input v-model="searchForm.mobile" clearable placeholder="输入学员家长的手机号查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch" icon="el-icon-search">查询</el-button>
                    <el-button v-if="!alreadySearched" type="text" size="small" @click="onCreateStudent" icon="el-icon-plus">创建新学员</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div v-if="alreadySearched&&student.data&&student.data.mobile">
            <p>孩子</p>
            <el-form disabled label-position="right" size="small" :model="student" :inline="true">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="student.data.name"></el-input>
                </el-form-item>
                <el-form-item label="英文名">
                    <el-input v-model="student.data.name"></el-input>
                    <label>{{student.data.name_en}}</label>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="student.data.name"></el-input>
                    <label>{{student.data.nickname}}</label>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="student.data.gender" placeholder="性别">
                        <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生日">
                    <el-form-item prop="birthday">
                        <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="生日" v-model="student.data.birthday"></el-date-picker>
                    </el-form-item>
                </el-form-item>
            </el-form>
            <p>家长</p>
            <el-form v-for="(parentForm ,index) in student.data.parents" :key="index" size="small" class="parent-form" :inline="true" disabled :model="parentForm" label-width="100px">
                <el-form-item prop="relation">
                    <el-select v-model="parentForm.relation" placeholder="与孩子关系">
                        <el-option v-for="item in parentRelations" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="parentForm.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item prop="mobile">
                    <el-input v-model="parentForm.mobile" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input v-model="parentForm.email" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onAddParent()" icon="el-icon-plus"></el-button>
                    <el-button type="default" v-if="index>0" icon="el-icon-minus" @click="onRemoveParent()"></el-button>
                </el-form-item>
            </el-form>
        </div>

        <div v-if="alreadySearched&&(!student.data||!student.data.mobile)" class="student-form">
            <p>创建新学员</p>
            <el-card class="box-card">

                <p class="clearfix">
                    <span>孩子</span>
                </p>
                <el-form size="small" :inline="true" :model="createStudentForm" ref="createStudentForm" label-width="100px" :rules="createStudentFormRules">
                    <el-form-item prop="name">
                        <el-input v-model="createStudentForm.name" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item prop="name_en">
                        <el-input v-model="createStudentForm.name_en" placeholder="英文名"></el-input>
                    </el-form-item>
                    <el-form-item prop="nickname">
                        <el-input v-model="createStudentForm.nickname" placeholder="昵称"></el-input>
                    </el-form-item>
                    <el-form-item prop="gender">
                        <el-select v-model="createStudentForm.gender" placeholder="性别">
                            <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="birthday">
                        <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="生日" v-model="createStudentForm.birthday"></el-date-picker>
                    </el-form-item>
                    <br>
                    <el-form-item prop="mobile">
                        <el-input v-model="createStudentForm.mobile" style="width:340px;" placeholder="填写一个家长手机号用于登录睿乐学APP"></el-input>
                    </el-form-item>
                </el-form>
                <p class="clearfix">
                    <span>家长</span>
                </p>
                <div>
                    <el-form v-for="(parentForm ,index) in studentParentForms" :key="index" size="small" class="parent-form" :inline="true" :model="parentForm" ref="parentForm" label-width="100px">
                        <el-form-item prop="relation">
                            <el-select v-model="parentForm.relation" placeholder="与孩子关系">
                                <el-option v-for="item in parentRelations" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="name">
                            <el-input v-model="parentForm.name" placeholder="姓名"></el-input>
                        </el-form-item>
                        <el-form-item prop="mobile">
                            <el-input v-model="parentForm.mobile" placeholder="手机号"></el-input>
                        </el-form-item>
                        <el-form-item prop="email">
                            <el-input v-model="parentForm.email" placeholder="邮箱"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" @click="onAddParent()" icon="el-icon-plus"></el-button>
                            <el-button type="default" v-if="index>0" icon="el-icon-minus" @click="onRemoveParent()"></el-button>
                        </el-form-item>
                    </el-form>
                    <el-button type="primary" @click="onSubmitCreateStudent()">保存</el-button>
                </div>
            </el-card>
        </div>
    </el-row>
    <el-row>
        <h3>其他信息</h3>
        <el-form>
            <el-form size="small" :inline="true" :model="orderInfoForm" ref="orderInfoForm">
                <el-form-item prop="consultant_id" label="顾问">
                    <el-input v-model="orderInfoForm.consultant_id" placeholder="姓名"></el-input>
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
        </el-form>
    </el-row>
    <el-row>
        <h3>
            <el-switch v-model="payment_by_year" active-text="按年缴费" inactive-text="仅缴这学期">
            </el-switch>
        </h3>
        <div>
            <el-radio-group v-if="payment_by_year" v-model="order_length">
                <el-radio label="1">缴1年</el-radio>
                <el-radio label="2" v-if="currentClazz[0].grade=='A1'||currentClazz[0].grade=='A2'||currentClazz[0].grade=='H1'">缴2年</el-radio>
                <el-radio label="3" v-if="currentClazz[0].grade=='A1'||currentClazz[0].grade=='H1'">缴3年</el-radio>
            </el-radio-group>
        </div>
    </el-row>
    <el-row>
        <h3>支付方式</h3>
        <el-radio-group v-model="payment_type">
            <el-radio disabled="" :label="0">微信</el-radio>
            <el-radio disabled :label="1">支付宝</el-radio>
            <el-radio :label="2">现金</el-radio>
            <el-radio :label="3">刷卡</el-radio>
        </el-radio-group>
          <h3><el-button type="danger" @click="createStudentAndSubmitOrder(false)">暂存订单</el-button>
        <el-button type="primary" @click="createStudentAndSubmitOrder(true)">确认支付</el-button></h3>
    </el-row>
</div>
</template>

<script>
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      searchForm: {
        mobile: undefined
      },
      hover: false,
      payment_by_year: true,
      order_length: "1",
      payment_type: 2,
      orderOriginOptions: [
        "Call in",
        "Walk in",
        "Net in",
        "Active",
        "Referral",
        "其他"
      ],
      parentRelations: ["爸爸", "妈妈", "爷爷", "奶奶", "姥爷", "姥姥", "其他"],
      alreadySearched: false,
      studentParentForms: [
        {
          name: undefined,
          relation: undefined,
          mobile: undefined,
          email: undefined
        }
      ],
      createStudentForm: {
        name: undefined,
        name_en: undefined,
        nickname: undefined,
        mobile: undefined,
        gender: undefined,
        birthday: undefined
      },
      createStudentFormRules: {
        name: [
          {
            required: true,
            message: "请填写孩子姓名",
            trigger: "blur，change"
          }
        ],
        gender: [
          {
            required: true,
            message: "请填写性别",
            trigger: "blur"
          }
        ],
        gender: [
          {
            required: true,
            message: "请填写生日",
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "只支持中国大陆手机号码",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请输入手机号"));
              }
              this.checkStudentExist({
                mobile: value
              }).then(res => {
                if (res && res.code == 0 && res.data != null) {
                  return callback(new Error("该学员已存在，请更换一个手机号"));
                } else {
                  return callback();
                }
              });
            },
            trigger: "blur"
          }
        ]
      },
      orderInfoForm: {
        origin: undefined,
        references: undefined,
        consultant_id: undefined,
        consultant_name: undefined,
        note: undefined
      }
    };
  },
  computed: {
    ...mapState({
      currentClazz: state => {
        return [state.clazz.selectedClazz.data];
      },
      course: state => state.order.course,
      student: state => state.order.student,
      prePage: state => state.route.from,
      createOrderResult: state => state.order.createOrderResult
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
  },

  methods: {
    ...mapActions({
      getClazzById: "getClazzById",
      getStudentByMobile: "getStudentByMobile",
      checkStudentExist: "checkStudentExist",
      createStudent: "createStudent",
      addStudentParent: "addStudentParent",
      clearOrderCreateStates: "clearOrderCreateStates",
      fetchCourseLesson: "fetchCourseLesson",
      createOrder: "createOrder"
    }),
    goBack() {
      this.$router.replace({
        path: "/school/classes/1"
      });
    },
    onSearch() {
      let payload = this.searchForm;
      if (payload.mobile && /^1[34578]\d{9}$/.test(payload.mobile)) {
        this.alreadySearched = true;
        this.getStudentByMobile(payload);
      }
    },
    onCreateStudent() {
      this.alreadySearched = true;
    },
    onAddParent() {
      this.studentParentForms.push({
        name: undefined,
        relation: undefined,
        mobile: undefined,
        email: undefined
      });
    },
    onRemoveParent() {
      this.studentParentForms.pop();
    },
    switchOrderType(val) {
      if (this.order_type == 1) {
        alert(1);
      }
    },
    onSubmitCreateStudent() {
      let self = this;
      this.$refs["createStudentForm"].validate(valid => {
        if (valid) {
          let payload = self.createStudentForm;
          payload.school_id = self.currentClazz[0].school_id;

          self.createStudent(payload).then(res => {
            if (res.code == 0) {
              return Promise.resolve(res.data);
            } else {
              self.$message.error(res.message || "添加学员失败！");
              return Promise.reject(res);
            }
          });
        }
      });
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
                self.$message.error('缺少学员信息！');
                return false;
            }
            payload.student = false;
            payload.order = self.createOrderInfo();
          }
          self.createOrder(payload)
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
      order.subject = `${clazz.year}${SubjectName[clazz.subject]}${
        Grade[clazz.grade]
      }${Terms[clazz.term]}${ClassType[clazz.class_type]}`;
      order.payment_type = this.payment_type;
      order.total_lesson = clazz.total_lesson_number;
      order.origin = orderInfoForm.origin;
      order.references = orderInfoForm.references;
      order.note = orderInfoForm.note;
      order.consultant_id = orderInfoForm.consultant_id;
      order.consultant_name = orderInfoForm.consultant_name;
      order.payment_state = 0; //未支付
      order.state = 0; //新单
      order.school_id = clazz.school_id;
      order.franchisee_id = clazz.franchisee_id;
      order.clazz_id = clazz.id;
      order.course = [
        {
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
    }
  },
  destroyed() {
    // this.alreadySearched = false;
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

.student-form .el-input {
}
</style>
