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
    <div class="search-block">
      <div class="search-row">
        <div class="search-row-title">学科</div>
        <div class="search-conditions">
        <router-link class="search-item" :to="{name:'course_list',params:{page:1},query:Object.assign({},searchForm,{subject:undefined})}">全部</router-link>
        <router-link class="search-item" :to="{name:'course_list',params:{page:1},query:Object.assign({},searchForm,{subject:item.key})}" v-for="item in subjects" :key="item.key">{{item.name}}</router-link>
        </div>
      </div>
      <div class="search-row">
        <div class="search-row-title">年级</div>
        <div class="search-conditions">
        <router-link class="search-item" :to="{name:'course_list',params:{page:1},query:Object.assign({},searchForm,{grade:undefined})}">全部</router-link>
        <router-link class="search-item" :to="{name:'course_list',params:{page:1},query:Object.assign({},searchForm,{grade:item.key})}" v-for="item in subjectGrades" :key="item.key">{{item.name}}</router-link>
        </div>
      </div>
      <div class="search-row">
        <div class="search-row-title">学期</div>
        <div class="search-conditions">
        <router-link class="search-item" :to="{name:'course_list',params:{page:1},query:Object.assign({},searchForm,{term:undefined})}">全部</router-link>
        <router-link class="search-item" :to="{name:'course_list',params:{page:1},query:Object.assign({},searchForm,{term:item.key})}" v-for="item in terms" :key="item.key">{{item.name}}</router-link>
        </div>
      </div>
      <div class="search-row">
        <div class="search-row-title">班型</div>
        <div class="search-conditions">
        <router-link class="search-item" :to="{name:'course_list',params:{page:1},query:Object.assign({},searchForm,{class_type:undefined})}">全部</router-link>
        <router-link class="search-item" :to="{name:'course_list',params:{page:1},query:Object.assign({},searchForm,{class_type:item.key})}" v-for="item in class_types" :key="item.key">{{item.name}}</router-link>
        </div>
      </div>
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

      let sub = this.course_settings.find(v => v.key == this.searchForm.subject);
      return sub?sub.grades:[];
    },
  },
  beforeRouteUpdate(to, from, next) {
    // react to route changes...
    // don't forget to call next()
    this.currentPage = to.params.page > 0 ? to.params.page : 1;
    this.searchForm = Object.assign({}, to.query);
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
    this.searchForm = Object.assign({}, this.$route.query);
    this.search();
  },
  methods: {
    ...mapActions({
      getCourseList: "getCourseList"
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
      // this.$router.push({
      //   name: "franchisee_detail",
      //   params: { franchisee_id: val.id }
      // });
    },
    handleDelClick(val) {
      let self = this;
      this.$confirm("确认删除？")
        .then(_ => {
          // self.removeFranchisee({
          //   franchisee_id: val.id
          // });
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
      this.$router.push({ name: "course_list", params: { page: val } });
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style scoped>
.search-block {
  border: 1px solid #e4e7ed;
  font-size: 14px;
}
.search-block .search-row {
  padding: 10px 5px;
  border-bottom: 1px dashed #e4e7ed;
}
.search-block .search-row::before,
.search-block .search-row::after {
  content: "";
  display: table;
  line-height: 0;
}
.search-block .search-row::after {
  clear: both;
}
.search-block .search-conditions {
  padding-left: 90px;
}
.search-block .search-row:last-child {
  border-bottom: transparent;
}
.search-block .search-row-title {
  color: #909399;
  text-align: right;
  width: 60px;
  margin-right: 30px;
  float: left;
}
.search-block a:hover {
  color: #409eff;
}
.search-block a:visited {
  color: #303133;
}
.search-block a {
  color: #303133;
}
.search-block a.router-link-exact-active {
  color: #409eff;
  /* color: #ffffff;
  background-color: #409eff;
  padding: 2px 5px;
  border-radius: 2px; */
}
.search-block .search-item {
  text-decoration: none;
  margin: 10px 30px 10px 0;
}
</style>
