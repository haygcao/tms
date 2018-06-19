<template>
    <div class="shopping-card-content" ref="shoppingCard">
        <div class="card-content">
        <div class="card-item" v-for="item in card" :key="item.index.id">
            <div class="card-item-title clearfix" style=" border-left:3px solid #F56C6C">
            <div class="item-title-inner">
            <strong>{{item.index.subject|subjectName}}</strong>

            <el-button @click="onRemoveFromCard(item.index)" class="float-right" size="mini" circle icon="el-icon-close"></el-button>
            </div>
            </div>
            <div class="divide-line"></div>
            <div class="card-item-index">
                    <div class="text-info">报名班级:</div>
                <div class="clazz-name">
                    <span>{{item.index.grade|grade}}{{item.index.term|terms}}{{item.index.class_type|classType}}</span>
                    <span class="clazz-state-badge" v-if="item.index.state==0">{{item.index.state|classState}}</span>
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
                    <img class="img-circle small" :src="item.index.teacher.avatar_url?item.index.teacher.avatar_url:require('@/assets/img/default_teacher_avatar.png')"
                                  :alt="item.index.teacher.name">
                                <span>{{item.index.teacher.name}}</span>
                    </div>
                    <div class="fileds-s3">
                    <div>剩余/总课次</div>
                    <div>
                        <strong>{{item.index.total_lesson_number-(item.index.current_lesson_number||0)}}</strong><span class="text-info">/</span>
                        <strong>{{item.index.total_lesson_number}}</strong>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div class="card-item-detail">
                <div class="text-info">需购课程:</div>
                <div class="grades">
                <div class="">
                    <div><span class="demonstration">购课年限:{{year_length}}年</span>
                    <span class="float-right text-info">共<strong class="text-danger">{{item.details|total_lesson_count}}</strong>节课</span>
                    </div>
                    <el-slider
                    v-model="year_length"
                    :step="1"
                    :max="3"
                    :format-tooltip="(val)=>{ return val+'年'}"
                    show-stops>
                    </el-slider>
                    
                </div>
                <div v-for="(course,idx) in item.details" :key="idx">
                    <div class="grade-title"><strong>{{course.grade|grade}}</strong><span class="float-right text-info">共<strong class="text-danger">{{course|grade_lesson_count}}</strong>节课</span></div>
                    <div class="terms-list">
                        <div v-for="(term,idx2) in course.terms" :key="idx2">
                            <div>{{term.term|terms}}</div><div>{{term.available_lesson_count}}</div>
                    </div>
                    </div>
                    
                </div>
                <!-- <span v-for="(course,idx) in item.details" :key="idx">{{course}}</span> -->
                </div>
            </div>
        </div>
        </div>
        <div class="card-bottom" :style="{'width':width}">
            <strong><em>&yen;</em><span>{{amount}}</span></strong>
            <el-button type="danger" class="card-submit-button">结算</el-button>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "shopping-card",
  props: {
    width: { type: String }
  },
  data() {
    return {
      loadding_course: false,
      card_width: "340px",
      year_length: 1
    };
  },
  computed: {
    ...mapGetters([
      "terms",
      "subjects",
      "class_types",
      "grades",
      "course_settings"
    ]),
    card() {
      return this.$shoppingCard.items;
    },
    amount(){
              return this.$shoppingCard.amount;
    }
  },
  created() {
    this.$shoppingCard.emitter.$on("added", item => {});
  },
  activated() {},
  mounted() {
    this.$nextTick(() => {
      // console.log(this.$refs["shoppingCard"].offsetWidth)
      //   this.card_width = this.$refs["shoppingCard"].offsetWidth+'px';
    });
  },
  methods: {
    ...mapActions({
      fetchCourseLesson: "fetchCourseLesson",
      getClazzById: "getClazzById"
    }),
    addToCard(clazz) {
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
            ""}${existClazz.grade_display ||
            ""}${existClazz.class_type_display || ""}其它班级，是否替换？`;
          this.$confirm(message, "", {
            confirmButtonText: "替换",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              //替换所报班级
              this.$shoppingCard.remove({ key: clazz.id, index: clazz });
              this._addCardItem(clazz);
            })
            .catch(() => {});
        } else {
          //不存在 ，则加入购物车，
          this._addCardItem(clazz);
        }
      });
    },
    _addCardItem(clazz) {
      //根据班级 ，获取所有待售课程
      this.fetchCourseLesson({ clazz_id: clazz.id }).then(res => {
        if (res && res.data) {
          let allCourse = res.data;
          let cardItem = this._packCardItem(allCourse, clazz);
          this.$shoppingCard.add(cardItem);
        } else {
          this.$message.error("课程获取失败");
        }
      });
    },
    _packCardItem(allCourse, clazz) {
      let availableCourseList = [];

      //筛选可选课程加入购物车，选择同学科，同班型，>=当前年级 的所有学期课程
      let subject_setting = this.course_settings.find(
        c => c.key == clazz.subject
      );
      let grades = subject_setting.grades;
      let currentGradeIdx = grades.findIndex(g => g.key == clazz.grade);
      //选择年级>=当前班所在年级的课程
      let availableGrades = grades.slice(currentGradeIdx) || [];

      for (let i = 0; i < availableGrades.length; i++) {
        var g = availableGrades[i];
        let current_grade = {
          grade: g.key,
          terms: []
        };
        var terms = []; //g.terms.map(t => t.key);
        if (clazz.term < 5) {
          //兼容老数据
          //暑，秋，寒，春，
          terms = ["1", "2", "3", "4"];
        } else if (clazz.term == 5 || clazz.term == 6) {
          //暑秋，寒春，
          terms = ["5", "6"];
        } else if (clazz.term == 7) {
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
          if (
            clazz.grade == current_grade.grade &&
            parseInt(clazz.term) < parseInt(t)
          ) {
            c = null;
          }
          let current_term = { term: t, course: c, checked: !!c };
          if (c) {
            current_term.available_lesson_count = c.total_lesson_number;
            if (c.grade == clazz.grade && c.term == clazz.term) {
              current_term.available_lesson_count =
                clazz.total_lesson_number - clazz.current_lesson_number;
            }
          } else {
            current_term.available_lesson_count = 0;
          }
          current_grade.terms.push(current_term);
        });

        availableCourseList.push(current_grade);
      }
      let cardItem = {
        key: clazz.id,
        index: clazz,
        length: availableGrades.length,
        details: availableCourseList
      };
      return cardItem;
    },
    onRemoveFromCard(item) {
      this.$shoppingCard.remove(item);
    }
  },
  filters: {
    grade_lesson_count(gradeItem) {
      if (!gradeItem || !gradeItem.terms || gradeItem.terms.length == 0) {
        return 0;
      }
      return gradeItem.terms.reduce((acc, cur) => {
        return acc + cur.available_lesson_count;
      }, 0);
    },
    total_lesson_count(gradeList) {
      if (!gradeList || gradeList.length == 0) {
        return 0;
      }
      return gradeList.reduce((a, c) => {
        return (
          a +
          (c.terms || []).reduce((acc, cur) => {
            return acc + cur.available_lesson_count;
          }, 0)
        );
      }, 0);
    },
    total_amount(card) {
      return 2000.0;
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

.card-item {
    background: #ffffff;
    padding: 0px;
}

.card-item-title {
    padding: 10px 0px;
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

.card-item-index {
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

.card-item-detail {
    padding: 10px;
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
}

.card-submit-button {
    float: right;
    border: none;
    border-radius: 0;
}
</style>


