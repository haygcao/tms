<template>
<div class="course-list">
  <el-row>
     <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      </el-breadcrumb>
     </div>
  </el-row>
  <el-row>
    <div class="block">
       <course-filter-box :searchForm="searchForm"></course-filter-box>
      </div>
  </el-row>
  <el-row>
    <el-button @click="onCreateCourse" icon="el-icon-plus" type="danger" size="small" round>新建课程</el-button>
  </el-row>
  <el-row>
  <el-table
    :data="courseList.rows"
    stripe
    border=""
    style="width: 100%">
    <el-table-column
      prop="name"
      label="名称"
      >
    </el-table-column>
     <el-table-column
      label="学科" width="80">
       <template slot-scope="scope">
          {{ scope.row.subject|subjectName }}
      </template>
    </el-table-column>
    <el-table-column
      prop="grade"
      label="年级">
       <template slot-scope="scope">
          {{ scope.row.grade|grade }}
      </template>
    </el-table-column>
    <el-table-column
      prop="term"
      label="学期"
      >
       <template slot-scope="scope">
          {{ scope.row.term|terms }}
      </template>
    </el-table-column>
    <el-table-column
      label="班型">
       <template slot-scope="scope">
          {{ scope.row.class_type|classType }}
      </template>
    </el-table-column>
    <el-table-column
      label="课次数" width="80">
       <template slot-scope="scope">
          {{ scope.row.total_lesson_number }}
      </template>
    </el-table-column>
    <el-table-column
      label="课程时长" width="80">
       <template slot-scope="scope">
          {{ scope.row.lesson_time/60 }} h
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">管理</el-button>
         <el-button @click="handleDelClick(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </el-row>
 <el-row>
  <div class="text-center" v-if="courseList.count>0">
   <el-pagination
      background
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        :total="courseList.count">
    </el-pagination>
  </div>
  </el-row>
</div>
</template>

<script>
import CourseFilterBox from "@/components/CourseFilterBox.vue";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      searchForm: {
        term: undefined,
        grade: undefined,
        subject: undefined,
        class_type: undefined
      }
    };
  },
  computed: {
    ...mapState({
      courseList: state => state.course.courseList.data || {}
      // regions: state => state.region.regions
    }),
    ...mapGetters([
      "terms",
      "subjects",
      "class_types",
      "grades",
      "lesson_times",
      "course_settings"
    ]),
    subjectGrades() {
      let sub = this.course_settings.find(
        v => v.key == this.searchForm.subject
      );
      return sub ? sub.grades : [];
    }
  },
  beforeRouteUpdate(to, from, next) {
    // react to route changes...
    // don't forget to call next()
    this.currentPage = to.params.page > 0 ? to.params.page : 1;
    this.searchForm = Object.assign(this.searchForm, to.query);
    this.search();
    // console.warn('beforeRouteUpdate')
    next();
  },
  created() {
    // if (true) {
    //   !this.regions || !this.regions.length == 0
    //   console.log('this.getRegions();')
    //   this.getRegions();
    // }
  },
  mounted() {
    this.currentPage =
      this.$route.params.page > 0 ? parseInt(this.$route.params.page) : 1;
    this.searchForm = Object.assign(
      {
        term: undefined,
        year: undefined,
        subject: undefined,
        grade: undefined,
        class_type: undefined
      },
      this.$route.query
    );
    this.search();
  },
  methods: {
    ...mapActions({
      getCourseList: "getCourseList",
      removeCourse: "removeCourse"
    }),
    search() {
      let payload = Object.assign({}, this.searchForm);
      payload.limit = this.pageSize;
      payload.offset = (this.currentPage - 1) * this.pageSize;
      this.getCourseList(payload);
    },
    onCreateCourse() {
      this.$router.push({ name: "course_add" });
    },
    handleClick(val) {
      // console.log(val);
      this.$router.push({
        name: "course_detail",
        query: { id: val.id, subject: val.subject }
      });
    },
    handleDelClick(val) {
      let self = this;
      this.$confirm("确认删除？")
        .then(_ => {
          self.removeCourse({
            id: val.id
          }).then(res=>{
            self.search()
          });
        })
        .catch(_ => {});
    },
    // regionName(code) {
    //   let region = this.regions.find(p => p.region_code == code);
    //   if (region) {
    //     return region.region_name;
    //   }
    //   return code;
    // },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$router.push({
        name: this.$route.name,
        params: { page: this.currentPage },
        query: this.searchForm
      });
    }
  },
  components: {
    CourseFilterBox
  }
};
</script>

