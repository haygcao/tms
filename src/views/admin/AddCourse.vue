<template>
<div class="course">
    <el-row>
        <h3>创建课程</h3>
        <div class="horization-line"></div>
    </el-row>
    <el-row>
        <el-form ref="form" :model="form" :rules="rules"  label-width="180px" class="create-form">
            <el-form-item label="名称" prop="name" style="width:400px;">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="学科" prop="subject">
                <el-radio-group v-model="form.subject">
                    <el-radio v-for="item in course_settings" :key="item.key" :label="item.key"  border>{{item.name}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="年级" prop="grade" >
                <el-radio-group v-model="form.grade">
                    <el-radio v-for="item in subjectGrades" :key="item.key" :label="item.key" border>{{item.name}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="学期" prop="term" >
                <el-radio-group v-model="form.term">
                    <el-radio v-for="item in subjectTerms" :key="item.key" :label="item.key"  border>{{item.name}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="班型" prop="class_type" >
                <el-radio-group v-model="form.class_type">
                    <el-radio v-for="item in class_types" :key="item.key" :label="item.key"  border>{{item.name}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="课程时长" prop="lesson_time" >
                <el-radio-group v-model="form.lesson_time">
                    <el-radio v-for="item in lesson_times" :key="item.key" :label="item.key" border>{{item.name}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="课次数" prop="total_lesson_number">
                <el-input-number v-model="form.total_lesson_number" :min="1" :max="100" label="课次数"></el-input-number>
            </el-form-item>
             <el-form-item label="课次单价" prop="price" >
                <el-input v-model="form.price" style="width:200px;" :min="1" :max="100" label="课次单价"></el-input>元(CNY)
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
            </el-form-item>
        </el-form>
    </el-row>

</div>
</template>

<script>
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "create_course",
  data() {
    return {
      form: {
        name: undefined,
        term: undefined,
        subject: 1,
        grade: undefined,
        class_type: undefined,
        price: undefined,
        total_lesson_number: undefined,
        lesson_time: null
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        subject: [{ required: true, message: "请选择学科", trigger: "blur" }],
        grade: [{ required: true, message: "请选择年级", trigger: "blur" }],
        class_type: [
          { required: true, message: "请选择班型", trigger: "blur" }
        ],
        term: [{ required: true, message: "请选择学期", trigger: "blur" }],
        total_lesson_number: [
          { required: true, message: "请输入课次数", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请输入课次单价", trigger: "blur" },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入一个数字",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      createResult: state => state.course.createResult
    }),
    ...mapGetters([
      "provinceList",
      "terms",
      "subjects",
      "class_types",
      "grades",
      "lesson_times",
      "course_settings"
    ]),
    subjectGrades() {
      let sub = this.course_settings.find(v => v.key == this.form.subject);
      return sub.grades;
    },
    subjectTerms() {
      let sub = this.course_settings.find(v => v.key == this.form.subject);
      let grades = sub.grades;
      let grade = grades.find(v => v.key == this.form.grade);
      if (grade) {
        return grade.terms;
      }
      return sub.terms;
      
    },
    name_display() {
      return `${SubjectName[this.form.subject] || ""}${Grade[this.form.grade] ||
        ""}${Terms[this.form.term] || ""}${ClassType[this.form.class_type] ||
        ""}`;
    }
  },
  created() {},
  watch: {
    name_display(c, o) {
      if (c != o) {
        this.form.name = c;
      }
    },
    createResult(c, o) {
      // debugger;
      if (c.code == 0) {
        this.$message({
          message: "恭喜你，创建成功",
          type: "success"
        });
      } else {
        this.$message.error("创建失败  " + c.message);
      }
    }
  },
  mounted() {},
  methods: {
    ...mapActions({
      createCourse: "createCourse"
    }),

    handleRegionItemChange(val) {
      console.log(val);
    },
    toolTip(type, msg) {
      this.$message({
        message: msg || "恭喜你，创建成功",
        type: type || "success"
      });
    },
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let payload = this.form;
          this.createCourse(payload);
        } else {
          //   console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style>
.horization-line {
  border-bottom: 1px solid #dcdcdc;
  margin-top: 5px;
  margin-bottom: 5px;
}

.course .el-form {
  max-width: 900px;
}

.admin-form .create-form .el-cascader {
  width: 100%;
}
</style>
