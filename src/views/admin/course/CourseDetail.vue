<template>
    <div class="course-list">
  <el-row>
     <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/admin/course/list' }">课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{course.name}}</el-breadcrumb-item>
      </el-breadcrumb>
     </div>
  </el-row>
  <el-row>
  <el-table
    :data="course.details||[]"
    stripe
    border=""
    style="width: 100%">
     <el-table-column
      label="课次">
       <template slot-scope="scope">
          {{ scope.row.lesson_no }}
      </template>
    </el-table-column>
    <el-table-column
      label="课件">
       <template slot-scope="scope">
         <span style="margin-right:15px;"> {{ scope.row.courseware?scope.row.courseware.name:'无' }}</span>
        <el-popover
          placement="bottom"
          width="320"
          trigger="click">
          <el-form size="small" :model="coursewareForm" :rules="coursewareFormRules" label-position="top" :ref="scope.row.id">
              <el-form-item label="课件">
                    <el-select v-model="coursewareForm.courseware_id" filterable placeholder="请选择">
                        <el-option
                        v-for="item in coursewareList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        <span style="float: left">{{ item.name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.s_no }}</span>
                        </el-option>
                    </el-select>
              </el-form-item>
            
            <el-form-item>
                <el-button type="danger" @click="submitCourseware">确定</el-button>
              </el-form-item>
          </el-form>
        <el-button slot="reference" @click="onSetCourseware(scope.row)" icon="el-icon-edit" type="text" size="small">设置</el-button>
        </el-popover>
        <p>{{scope.row.courseware?scope.row.courseware.absolute_url:''}}</p>
      </template>
    </el-table-column>
    <el-table-column
      label="作业">
       <template slot-scope="scope">
         <span style="margin-right:15px;"> {{ scope.row.homework?scope.row.homework.name:'无' }}</span>
        <el-popover
          placement="bottom"
          width="320"
          trigger="click">
          <el-form size="small" :model="homeworkForm" :rules="homeworkFormRules" label-position="top" :ref="scope.row.id">
              <el-form-item label="作业">
                    <el-select v-model="homeworkForm.homework_id" filterable placeholder="请选择">
                        <el-option
                        v-for="item in homeworkList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        <span style="float: left">{{ item.name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.s_no }}</span>
                        </el-option>
                    </el-select>
              </el-form-item>
            
            <el-form-item>
                <el-button type="danger" @click="submitHomework">确定</el-button>
              </el-form-item>
          </el-form>
        <el-button slot="reference" @click="onSetHomework(scope.row)" icon="el-icon-edit" type="text" size="small">设置</el-button>
        </el-popover>
        <p>{{scope.row.homework?scope.row.homework.absolute_url:''}}</p>
      </template>
    </el-table-column>
  </el-table>
  </el-row>
    </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      coursewareForm: {
        id: undefined,
        course_id: undefined,
        courseware_id: undefined
      },
      coursewareFormRules: {
        courseware_id: [
          { required: true, message: "请选择课件", trigger: "blur" }
        ]
      },
      homeworkForm: {
        id: undefined,
        course_id: undefined,
        homework_id: undefined
      },
      homeworkFormRules: {
        homework_id: [
          { required: true, message: "请选择作业", trigger: "blur" }
        ]
      },
      course_id: undefined,
      subject: undefined
    };
  },
  computed: {
    ...mapState({
      course: state => state.course.detail.data || {},
      coursewareList: state => state.courseware.list.data || [],
      homeworkList: state => state.homework.list.data || []
    }),
    ...mapGetters([
      "terms",
      "subjects",
      "class_types",
      "grades",
      "lesson_times",
      "course_settings"
    ])
  },
  mounted() {
    this.course_id = this.$route.query.id;
    this.subject = this.$route.query.subject;
    this.getCourseDetail({ id: this.course_id });
    this.getCoursewareList({ subject: this.subject });
    this.getHomeworkList({ subject: this.subject });
  },
  methods: {
    ...mapActions({
      getCourseDetail: "getCourseDetail",
      getCoursewareList: "getCoursewareList",
      setCourseware: "setCourseware",
      getHomeworkList: "getHomeworkList",
      setHomework: "setHomework",
    }),
    filterCourseware() {},
    onSetCourseware(val) {
      this.coursewareForm = {
        courseware_id: undefined,
        id: val.id,
        course_id: this.course_id
      };
    },
    submitCourseware() {
      let self = this;
      if (!this.$refs[this.coursewareForm.id]) {
        return false;
      }
      this.$refs[this.coursewareForm.id].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.coursewareForm);
          this.setCourseware(payload).then(res => {
            if (res && res.code == 0) {
              this.$message.success("保存成功 ");
              this.getCourseDetail({ id: this.course_id });
            } else {
              this.$message.error("保存失败  " + res.message);
            }
          });
        } else {
          //   console.log("error submit!!");
          return false;
        }
      });
    },
    onSetHomework(val) {
      this.homeworkForm = {
        homework_id: undefined,
        id: val.id,
        course_id: this.course_id
      };
    },
    submitHomework() {
      let self = this;
      if (!this.$refs[this.homeworkForm.id]) {
        return false;
      }
      this.$refs[this.homeworkForm.id].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.homeworkForm);
          this.setHomework(payload).then(res => {
            if (res && res.code == 0) {
              this.$message.success("保存成功 ");
              this.getCourseDetail({ id: this.course_id });
            } else {
              this.$message.error("保存失败  " + res.message);
            }
          });
        } else {
          //   console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

