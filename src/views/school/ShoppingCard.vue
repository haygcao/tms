<template>
    <div class="shopping-card-content" ref="shoppingCard">
        <div class="card-title">已选课程</div>
        <div class="empty-card-info" v-if="card.length==0">还没选取课程</div>
        <div class="card-content summary" v-if="card.length>0&&display=='summary'">
           <div class="card-item" v-for="item in card" :key="item.index.id">
             <strong>{{item.index.subject|subjectName}}</strong>
           </div>
        </div>
        <div class="card-content" v-if="card.length>0&&display=='detail'">
        <div class="card-item" v-for="item in card" :key="item.index.id">
            <div class="card-item-title clearfix" style=" border-left:3px solid #F56C6C">
            <div class="item-title-inner">
            <strong>{{item.index.subject|subjectName}}</strong>

            <el-button @click="onRemoveFromCard(item.index)" class="float-right" size="mini" circle icon="el-icon-close"></el-button>
            </div>
            </div>
            <div class="divide-line"></div>
            <div class="card-item-index" >
              <div v-if="item.category=='clazz'">
                <div class="item-desc">报名班级:</div>
                <div class="clazz-name">
                    <span>{{item.index.grade|grade}}{{item.index.term|terms}}{{item.index.class_type|classType}}</span>
                    <span class="clazz-state-badge" v-if="item.index.state==1">{{item.index.state|classState}}</span>
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
                <div class="item-desc">需购课程:</div>
                <div class="product-info">
                  <span>{{item.product.subject|subjectName}}{{item.product.class_type|classType}}</span>
                  <cny class="margin-left-10" :value="item.product.price"></cny>
                  <span class="text-info"> &times;</span>
                  <strong>{{item.quantity}}</strong>
                  <span class="text-info">=</span>
                  <cny class="text-danger" :value="item|item_amount"></cny>
                </div>
                <div></div>
              </template>
            </div>
            <div class="card-item-detail">
                <el-button size="mini" type="text" @click="item.showDetail=(!item.showDetail)">选择连报:<i class="el-icon-arrow-down"></i></el-button>
                <el-collapse-transition>
                <div v-show="item.showDetail">
                <div v-for="(grade,idx) in item.details" :key="idx">
                    <div class="grade-title">
                      <strong><el-checkbox @change="cardItemDetailGradeCheckChanged(grade,item)" v-model="grade.checked">{{grade.grade|grade}}</el-checkbox>
                      </strong><span class="float-right"><small class=" text-info">已选</small><strong class="">{{grade|grade_lesson_count}}</strong><small class=" text-info">次课</small></span></div>
                    <div class="terms-list">
                        <div v-for="(term,idx2) in grade.terms" :key="idx2">
                            <div>{{term.term|terms}}
                              <el-checkbox @change="cardItemDetailTermCheckChanged(term,item)" v-model="term.checked"></el-checkbox>
                              </div><div>{{term.available_lesson_count}}<small v-if="item.index.state==1&&term.term==item.index.term&&grade.grade==item.index.grade">(剩余)</small></div>
                    </div>
                    </div>
                    
                </div>
                </div>
                </el-collapse-transition>
            </div>
        </div>
        </div>
        <div class="card-bottom" v-if="card.length>0&&display=='detail'" :style="{'width':width}">
            <span class="text-info">总计:</span><cny class="amount-total margin-left-10 text-danger"  :value="$shoppingCard.amount|total_amount_discounted((discount.discount_percent||100)/100)"></cny>
            <el-badge v-if="discount&&(discount.discount_percent||100)<100" :value="formatDiscount(discount.discount_percent)" class="item">
            <span v-if="discount&&(discount.discount_percent||100)<100" class="margin-left-10 text-info"><small>&yen;</small><del>{{$shoppingCard.amount|formatCurrency}}</del></span>
            </el-badge>
            <!-- <strong class=" margin-left-10" v-if="discount&&(discount.discount_percent||100)<100"><i class="el-icon- iconfont icon-discount"></i>{{(discount.discount_percent||100)|formatDiscount}}折</strong> -->
            <el-button type="danger" class="card-submit-button" @click="purchase">结算</el-button>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "shopping-card",
  props: {
    width: { type: String },
    display: { type: String, default: "summary" }
  },
  data() {
    return {
      loadding_course: false,
      card_width: "340px",
      year_length: 1,
      teacher_avatar_man: require("@/assets/img/teacher_1.png"),
      teacher_avatar_woman: require("@/assets/img/teacher_0.png")
    };
  },
  computed: {
    ...mapState({
      current_school: state => state.current_user.current_school,
      discounts: state => state.discount.list.data || []
    }),
    ...mapGetters([
      "terms",
      "subjects",
      "class_types",
      "grades",
      "course_settings"
    ]),
    discount() {
      if (!this.discounts) {
        return {};
      }
      let total_quantity = this.$shoppingCard.quantity;
      // let discounts_sorted = this.discounts.slice().sort((a, b) => {
      //   return a.min_quantity - b.min_quantity;
      // });
      let filter = this.discounts.filter(v => v.min_quantity <= total_quantity);
      if (filter && filter.length > 0) {
        return filter[filter.length - 1];
      }
      return {};
    },
    card() {
      return this.$shoppingCard.items;
    }
    // amount() {
    //   return this.$shoppingCard.amount;
    // }
  },
  created() {
    let self = this;
    this.$shoppingCard.emitter.$on("added", item => {
      this.$emit("content-changed");
    });
    this.$on("_caculate_product_count", function(cardItem) {
      cardItem.quantity = self.total_lesson_count(cardItem.details);
      // console.warn("_caculate_product_count", cardItem.quantity);
    });
  },
  activated() {
    if (!this.discounts) {
      this.getDiscountList({ school_id: this.current_school.id });
    }
  },
  mounted() {
    this.getDiscountList({ school_id: this.current_school.id });
  },
  methods: {
    ...mapActions({
      fetchCourseLesson: "fetchCourseLesson",
      getClazzById: "getClazzById",
      getProduct: "getProduct",
      getDiscountList: "getDiscountList"
    }),
    addClazzToCard(clazz) {
      if (this.card.find(v => v.index.id == clazz.id)) {
        return false;
      }
      this.getClazzById({ clazz_id: clazz.id }).then(res => {
        if (!res.data) {
          return this.$message.error("班级不存在");
        }
        if (res.data && res.data.student_count >= res.data.student_limit) {
          {
            return this.$alert("班级名额已满,请选择其他班级", "操作失败", {
              confirmButtonText: "确定",
              type: "error"
            });
          }
        }

        //更新班级信息
        clazz = Object.assign({}, clazz, res.data);
        //检查购物车是否存在同类型班级(每个学科只能报一个班级)  && v.index.grade == clazz.grade
        let existClazz = this.card.find(v => v.index.subject == clazz.subject);
        //存在同类型班级 ，提示是否替换
        if (existClazz) {
          let message = `已经选择了${existClazz.subject_display ||
            ""}${existClazz.class_type_display || ""}其它班级，是否替换？`;
          this.$confirm(message, "", {
            confirmButtonText: "替换",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              //替换所报班级
              this.$shoppingCard.remove(
                new this.$shoppingCardItem({ key: clazz.id, index: clazz })
              );
              this._addClazzCardItem(clazz);
            })
            .catch(() => {});
        } else {
          //不存在 ，则加入购物车，
          this._addClazzCardItem(clazz);
        }
      });
    },
    _addClazzCardItem(clazz) {
      let getProduct = this.getProduct({
        subject: clazz.subject,
        class_type: clazz.class_type
      });
      //根据班级 ，获取所有待售课程
      let fetchCourseLesson = this.fetchCourseLesson({ clazz_id: clazz.id });
      Promise.all([getProduct, fetchCourseLesson]).then(results => {
        let prod = results[0];
        let course = results[1];
        if (!prod || !prod.data || !course || !course.data) {
          this.$message.error("无法获取课程的价格信息");
          return false;
        }
        let cardItem = this._packClazzCardItem(course.data, clazz, prod.data);
        this.$shoppingCard.add(cardItem);
      });
    },
    _packClazzCardItem(allCourse, clazz, product) {
      let availableCourseList = [];

      //筛选可选课程加入购物车，选择同学科，同班型，>=当前年级 的所有学期课程
      let subject_setting = this.course_settings.find(
        c => c.key == clazz.subject
      );
      //获取年级设置
      let grades = subject_setting.grades;
      let currentGradeIdx = grades.findIndex(g => g.key == clazz.grade);
      //选择年级>=当前班所在年级的课程
      let availableGrades = grades.slice(currentGradeIdx) || [];
      for (let i = 0; i < availableGrades.length; i++) {
        var g = availableGrades[i];
        let current_grade = {
          grade: g.key,
          checked: false,
          terms: []
        };
        var terms = []; //g.terms.map(t => t.key);
        let current_term = parseInt(clazz.term);
        if (current_term < 5) {
          //兼容老数据
          //暑，秋，寒，春，
          terms = ["1", "2", "3", "4"];
        } else if (current_term == 5 || current_term == 6) {
          //暑秋，寒春，
          terms = ["5", "6"];
        } else if (current_term == 7) {
          //全年
          terms = ["7"];
        }
        terms.forEach(t => {
          let c = allCourse.find(
            v =>
              v.term == t &&
              v.grade == current_grade.grade &&
              v.class_type == clazz.class_type
          );
          //只取当前年级未开课的学期
          if (
            clazz.grade == current_grade.grade &&
            parseInt(clazz.term) > parseInt(t)
          ) {
            c = null;
          }
          let current_term = {
            term: t,
            course: c,
            checked: false,
            parent: current_grade.grade
          };
          if (c) {
            current_term.available_lesson_count = c.total_lesson_number;
            if (c.grade == clazz.grade && c.term == clazz.term) {
              current_term.available_lesson_count =
                clazz.total_lesson_number - clazz.current_lesson_number;
              current_term.checked = true;
            }
          } else {
            current_term.available_lesson_count = 0;
          }
          current_grade.terms.push(current_term);
        });
        availableCourseList.push(current_grade);
      }
      let cardItem = new this.$shoppingCardItem({
        key: clazz.id,
        category: "clazz",
        product: product,
        quantity: clazz.total_lesson_number - clazz.current_lesson_number,
        index: clazz,
        details: availableCourseList
      });

      // let cardItem = {
      //   key: clazz.id,
      //   index: clazz,
      //   length: availableGrades.length,
      //   details: availableCourseList
      // };
      return cardItem;
    },
    cardItemDetailGradeCheckChanged(grade, cardItem) {
      if (grade.checked) {
        grade.terms.forEach(term => {
          term.checked = true;
        });
      } else {
        grade.terms.forEach(term => {
          term.checked = false;
        });
      }
      this.$emit("_caculate_product_count", cardItem);
    },
    cardItemDetailTermCheckChanged(term, cardItem) {
      if (term.checked) {
        let parentGrade = cardItem.details.find(d => d.grade == term.parent);
        let unchecked = parentGrade.terms.find(t => t.checked == false);
        if (!unchecked) {
          parentGrade.checked = true;
        } else {
          parentGrade.checked = false;
        }
      } else {
        let parentGrade = cardItem.details.find(d => d.grade == term.parent);
        parentGrade.checked = false;
      }
      this.$emit("_caculate_product_count", cardItem);
    },
    onRemoveFromCard(item) {
      this.$shoppingCard.remove(item);
    },
    purchase() {
      if (this.card.length > 0) {
        // this.$router.push({ name: "create_order" });
        this.$emit("onPurchase");
      }
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
    total_lesson_count(gradeList) {
      if (!gradeList || gradeList.length == 0) {
        return 0;
      }
      return gradeList.reduce((a, c) => {
        return (
          a +
          (c.terms || []).reduce((acc, cur) => {
            return acc + (cur.checked ? cur.available_lesson_count : 0);
          }, 0)
        );
      }, 0);
    }
  },
  filters: {
    grade_lesson_count(gradeItem) {
      if (!gradeItem || !gradeItem.terms || gradeItem.terms.length == 0) {
        return 0;
      }
      return gradeItem.terms.reduce((acc, cur) => {
        return acc + (cur.checked ? cur.available_lesson_count : 0);
      }, 0);
    },

    total_amount(card) {
      let amount = 0;
      card.forEach(item => {
        amount += item.quantity * parseFloat(item.product.price);
      });

      return amount;
    },
    total_amount_discounted(amount, discount) {
      return amount * discount;
    },
    item_amount(item) {
      return item.quantity * parseFloat(item.product.price);
    }
  }
};
</script>
<style lang="stylus" scoped>
.shopping-card-content {
  text-align: left;
  font-size: 12px;
  padding-bottom: 120px;
  overflow-x: hidden;
}

.card-title {
  text-align: center;
  font-size: 16px;
  padding: 10px 20px;
}

.card-content {
  height: inherit;
}

.clazz-state-badge {
  transform: translateY(-50%);
  background-color: rgba(245, 107, 107, 0.1);
  border: 1px solid rgba(245, 107, 107, 0.2);
  color: #f56c6c;
  border-radius: 15px;
  display: inline-block;
  font-size: 12px;
  height: 14px;
  line-height: 14px;
  padding: 2px 3px;
  text-align: center;
  white-space: nowrap;
}

.margin-left-10 {
  margin-left: 10px;
}

.img-circle {
  background-color: #EBEEF5;
  border: 1px solid #E4E7ED;
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 50%;
  text-align: center;
  vertical-align: middle;
  margin: auto 2px;
}

.img-circle.small {
  width: 30px;
  height: 30px;
  line-height: 30px;
}

.empty-card-info {
  text-align: center;
  padding: 30px;
  color: #909399;
}

.card-item {
  background: #fff;
  padding: 0px;
  margin-bottom: 5px;
  border-bottom: 1px solid #dedede;
  border-top: 1px solid #dedede;
}

.card-item-title {
  padding: 10px 0px;
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
  background: #f8f8f8;
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

.card-bottom {
  position: fixed;
  bottom: 0px;
  background-color: #ffffff;
  overflow: hidden;
  padding: 0 10px;
  border-top: 1px solid #e4e7ed;
  z-index: 10;
}

.card-submit-button {
  float: right;
  border: none;
  border-radius: 0;
}

.amount-total {
  line-height: 38px;
  font-size: 16px;
}

.summary .card-item {
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  color: #fff;
  background: #fe7708;
  font-size: 12px;
  text-align: center;
  margin: 0 auto;
}
</style>


