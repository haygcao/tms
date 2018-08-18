<template>
<div class="clazz-modal">
    <el-container class="clazz-modal-container">

        <!-- <div style="width:150px">
            <el-steps direction="vertical" finish-status="success" :active="current_step">
                <el-step title="" description="选择课程"></el-step>
                <el-step title="" description="排课"></el-step>
                <el-step title="" description="完成"></el-step>
            </el-steps>
        </div> -->
        <div>
            <el-row>
                <el-form ref="searchForm" size="small" :model="searchForm" :rules="searchRules" :label-position="lalel_position" :label-width="lalel_width" class="form">
                    <el-form-item label="学科" prop="subject">
                        <el-radio-group v-model="searchForm.subject">
                            <el-radio v-for="item in subjects" :key="item.key" :label="item.key" border>{{item.name}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="年级" prop="grade">
                        <el-radio-group v-model="searchForm.grade">
                            <el-radio v-for="item in subjectGrades" :key="item.key" :label="item.key" border>{{item.name}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="学期" prop="term">
                        <el-radio-group v-model="searchForm.term">
                            <el-radio v-for="item in terms" :key="item.key" :label="item.key" border>{{item.name}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="班型" prop="class_type">
                        <el-radio-group v-model="searchForm.class_type">
                            <el-radio v-for="item in class_types" :key="item.key" :label="item.key" border>{{item.name}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <el-form :disabled="!course.id" ref="form" size="small" :label-position="lalel_position" :model="form" :rules="rules" :label-width="lalel_width" class="form">
                    <el-col :span="12">
                        <el-form-item label="总课次">
                            <label>{{course.total_lesson_number}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="当前课次">
                            <label>1</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="开课日期" prop="begin_date">
                            <el-date-picker type="date"  :picker-options="pickerOptions" v-model="form.begin_date" value-format="yyyy-MM-dd" placeholder="开课日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结课日期" prop="">
                            <label>{{form.finish_date|formatDate}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="上课时间" prop="class_begin_time">
                            <el-time-select v-model="form.class_begin_time" :picker-options="{
                            start: '08:30',
                            step: '00:15',
                            end: '20:30'
                        }" placeholder="选择时间">
                            </el-time-select>

                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="下课时间" prop="class_finish_time">
                            <label>{{form.class_finish_time}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="授课老师" prop="teacher">
                            <el-select v-model="form.teacher" filterable :value-key="'id'" placeholder="请选择">
                                <el-option v-for="item in schoolTeachers" :key="item.id" :label="item.name" :value="item" >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="班级限额(人)" prop="student_limit">
                            <el-input-number v-model="form.student_limit" :min="1" :max="30" label="班级限额"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="class_types[course.class_type]=='短期班'">
                        <el-form-item label="班级名称" prop="name">
                            <el-input :maxlength="100" type="text" v-model="form.name" placeholder="班级名称..."></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="教室" prop="classroom">
                           <el-select v-model="form.classroom" :value-key="'id'" filterable placeholder="请选择" >
                                <el-option v-for="item in classroomList" :key="item.id" :label="item.name" :value="item" 	>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示状态" prop="visible">
                            <el-switch v-model="form.visible" active-text="公开" inactive-text="隐藏">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit" :disabled="!course.id">保存</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>

        </div>

    </el-container>

</div>
</template>

<script>
import {
  Classroom_Type,
  ClassType,
  SubjectName,
  Terms,
  Grade
} from "@/lib/constants";
import moment from "moment";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "add_class",
  props: {
    mode: String, //'update',
    classroom: String
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: function(current) {
          let now = new Date();
          if (
            current.getTime() <
            new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
          ) {
            return true;
          }
          return false;
        }
      },
      searchForm: {
        term: undefined,
        subject: undefined,
        grade: undefined,
        class_type: undefined
      },
      searchRules: {
        subject: [
          {
            required: true,
            message: "请选择学科",
            trigger: "blur"
          }
        ],
        grade: [
          {
            required: true,
            message: "请选择年级",
            trigger: "blur"
          }
        ],
        class_type: [
          {
            required: true,
            message: "请选择班型",
            trigger: "blur"
          }
        ],
        term: [
          {
            required: true,
            message: "请选择学期",
            trigger: "blur"
          }
        ]
      },
      form: {
        year: new Date().getFullYear(),
        name: undefined,
        begin_date: undefined,
        finish_date: undefined,
        class_begin_time: undefined,
        class_finish_time: undefined,
        visible: false,
        student_limit: 12,
        teacher: undefined,
        classroom: undefined
      },
      rules: {
        begin_date: [
          {
            required: true,
            message: "请选择开课日期",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请选择开课日期"));
              }
              if (this.course) {
                let day = new Date(value).getDay();
                if (this.course.class_type == "1" && !(day == 0 || day == 6)) {
                  return callback(new Error("请选择周六或周日时间"));
                }
                if (this.course.class_type == "2" && (day == 0 || day == 6)) {
                  return callback(new Error("请选择非周六或周日时间"));
                }
              }
              return callback();
            }
          }
        ],
        class_begin_time: [
          {
            required: true,
            message: "请选择上课时间",
            trigger: "blur"
          }
        ],
        student_limit: [
          {
            required: true,
            message: "请填写学生限额",
            trigger: "blur"
          }
        ],
        teacher: [
          {
            required: true,
            message: "请选择授课老师",
            trigger: "blur"
          }
        ]
      },
      current_step: 0,
      lalel_width: "120px",
      lalel_position: "right"
    };
  },
  computed: {
    ...mapState({
      selectedClassroom: state => state.school.selectedClassroom.data,
      classroomList: state => state.school.classroomList.data || [],
      current_school: state => state.current_user.current_school,
      course: state => state.clazz.course.data || {},
      schoolTeachers: state => state.school.schoolTeachers.data || [],
      clazzCreateResult: state => state.clazz.createResult
    }),
    ...mapGetters([
      "terms",
      "subjects",
      "class_types",
      "grades",
      "course_settings",
      "lesson_times"
    ]),
    subjectGrades() {
      let sub = this.course_settings.find(
        v => v.key == this.searchForm.subject
      );
      return sub ? sub.grades : [];
    }
  },
  watch: {
    selectedClassroom: function(val, old) {
      if (this.mode == "update" && this.classroom) {
        this.form.name = val.name;
        this.form.space = val.space;
        this.form.description = val.description;
        this.form.types = (val.type || "")
          .split(",")
          .map(v => Classroom_Type[v]);
      }
    },
    course(val, old) {
      if (!val) return;
      this.current_step = 1;
    },
    searchForm: {
      handler: function(val, old) {
        if (
          val.term != undefined &&
          val.subject != undefined &&
          val.grade != undefined &&
          val.class_type != undefined
        ) {
          this.fetchCourse(val);
        }
      },
      deep: true
    },
    "form.begin_date": {
      handler: function(val, old) {
        if (val == old) {
          return;
        }
        if (!this.course || !this.course.id) {
          return;
        }
        if (!val) {
          this.form.finish_date = undefined;
          return;
        }
        let helper = new ClazzDate(this.course);
        this.form.finish_date = helper.caluFinishDate(val);
      },
      deep: true
    },
    "form.class_begin_time": {
      handler: function(val, old) {
        if (val == old) {
          return;
        }
        if (!this.course || !this.course.id) {
          return;
        }
        if (!val) {
          this.form.class_begin_time = undefined;
          return;
        }
        let helper = new ClazzDate(this.course);
        this.form.class_finish_time = helper.caluFinishTime(val);
      },
      deep: true
    },
    clazzCreateResult(val) {
      this.afterCreated(val);
    }
  },
  filters: {
    formatDate(val) {
      if (!val) return "";
      let ds = moment(val).format("YYYY-MM-DD");
      return ds;
    }
  },
  mounted() {
    // if (this.mode == "update") {
    //   this.fetchClassroom({
    //     classroom_id: this.classroom,
    //     school_id: this.current_school.id
    //   });
    // }
    this.getClassroomList({ school_id: this.current_school.id });
    this.getTeachers({ school_id: this.current_school.id });
    // if (!this.schoolTeachers || this.schoolTeachers.length == 0) {
    //   this.getTeachers({teacher_id:this.current_school.id});
    // }
  },
  beforeDestroy() {
    this.destroyedSelf();
  },
  methods: {
    ...mapActions({
      fetchClassroom: "fetchClassroom",
      getClassroomList: "getClassroomList",
      fetchCourse: "fetchCourse",
      destroyedSelf: "clearClazzCreateStates",
      getTeachers: "getTeachers",
      createClazz: "createClazz"
    }),

    onSubmit() {
      let self = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          let payload = self.form;
          payload.school_id = self.current_school.id;
          payload.school_name = self.current_school.name;
          let teacher = payload.teacher;
          payload.teacher_id = teacher.id;
          payload.teacher_name = teacher.name;
          let classroom = payload.classroom;
          payload.classroom_id = classroom.id;
          payload.classroom_name = classroom.name;
          payload.course_id = self.course.id;

          if (this.mode == "create") {
            this.createClazz(payload);
            return;
          }
          if (this.mode == "update") {
            // payload.id = this.classroom;
            // this.updateClassroom(payload);
          }
        }
      });
    },
    afterCreated(result) {
      if (result.code > 0) {
        this.$message({
          message: result.message || "保存失败",
          type: "error"
        });
      } else {
        this.$message.success("保存成功");
        this.$emit("create-success");
        this.resetForm();
      }
    },
    resetForm() {
      this.$refs["form"].resetFields();
    }
  }
};
class ClazzDate {
  constructor(course) {
    /**
            ◇ 周末班：每周六或周日上课，1次课/周
            ◇ 平时班：周一到周五的任意一天上课，1次课/周
            ◇ 短期班：连续每天上课，班级名称可自定义（如：幼升小冲刺班）
            ◇ 连续班：连续每天上课
            ◇ 试听班：短期试听 （1讲）
             1: '周末班',
            2: '平时班',
            3: '短期班',
            4: '连续班',
            5: '试听班',
            */
    this._course = course;
  }
  validate(startDate) {
    let clazz_type = parseInt(this._course.class_type);
    let start = startDate;
    if (typeof startDate == "string") {
      start = new Date(startDate);
    }
    valid = true;
    switch (clazz_type) {
      case 1: //周末班
        let day = start.getDay();
        valid = day == 0 || day == 6;
        break;
      case 2: //平时班
        let day2 = start.getDay();
        valid = !(day2 == 0 || day2 == 6);
        break;
      case 3:
      case 4:
      case 5:
        valid = true;
        break;
      default:
        valid = true;
        break;
    }
  }
  caluFinishTime(startTime) {
    if (!this._course) return "";
    let len = this._course.lesson_time;
    //     let formatStr="1970-01-01 "+startTime
    //    let date= new Date(formatStr)
    //    new Date(date.getTime()+len*60*1000).getDate()
    return moment(startTime, "HH:mm")
      .add(len, "m")
      .format("HH:mm");
    // return moment.duration(startTime).add(60, "m");
  }
  caluFinishDate(startDate) {
    if (!this._course) return "";
    let clazz_type = parseInt(this._course.class_type);
    let total = this._course.total_lesson_number;
    let start = startDate;
    if (typeof startDate == "string") {
      start = new Date(startDate);
    }
    let end = start.getTime();
    switch (clazz_type) {
      case 1:
      case 2:
        end = start.getTime() + 0x240c8400 * (total - 1);
        break;
      case 3:
      case 4:
      case 5:
      case 99:
        end = start.getTime() + 0x5265c00 * (total - 1);
        break;
      default:
        end = start.getTime() + 0x5265c00 * (total - 1);
        break;
    }
    return new Date(end);
  }
}
</script>

<style scoped>
.form {
  margin: 0 auto;
  max-width: 900px;
}
.clazz-modal-container {
  margin: 0 auto;
  max-width: 1024px;
}
</style>
