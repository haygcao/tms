<template>
<div class="clazz">
    <el-row>
        <div class="page-breadcrumb clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/school' }">校区管理</el-breadcrumb-item>
                <el-breadcrumb-item>报名管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </el-row>
    <el-row>
        <el-form :inline="true" size="small" ref="searchForm" :model="searchForm" class="demo-form-inline">
            <el-form-item prop="year">
                <el-select v-model="searchForm.year" placeholder="年份" clearable>
                    <el-option v-for="item in yearOptions" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item prop="subject">
                <el-select v-model="searchForm.subject" placeholder="学科" clearable>
                    <el-option v-for="item in subjects" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item prop="grade">
                <el-select v-model="searchForm.grade" placeholder="年级" clearable>
                    <el-option v-for="item in grades" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item prop="term">
                <el-select v-model="searchForm.term" placeholder="学期" clearable>
                    <el-option v-for="item in terms" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="class_type">
                <el-select v-model="searchForm.class_type" placeholder="选择班型" clearable>
                    <el-option v-for="item in class_types" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="begin_date">
                <el-select v-model="searchForm.begin_date" placeholder="开课日期" clearable >
                    <el-option v-for="item in beginDateOptions" :key="item.key" :label="item.name" :value="item.key" >
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item prop="class_begin_time">
                <el-select v-model="searchForm.class_begin_time" placeholder="上课时段" :value-key="'key'" clearable >
                    <el-option v-for="item in beginTimeOptions" :key="item.key" :label="item.name" :value="item.key" >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="teacher_name">
                <el-input v-model="searchForm.teacher_name" placeholder="输入老师姓名"></el-input>
            </el-form-item>
            <el-form-item >
               <el-button type="primary" @click="onSearch" icon="el-icon-search">查询</el-button>
                <el-button v-if="showResetButton" type="text" @click="onResetSearchForm" icon="el-icon-circle-close-outline">清除查询条件</el-button>
            </el-form-item>
        </el-form>
    </el-row>

    <el-row>
        <el-table :data="clazzList.rows" stripe border="" style="width: 100%">

            <el-table-column type="index" label="#" width="60">
            </el-table-column>
            <el-table-column prop="year" width="80" label="年份">
            </el-table-column>
            <el-table-column width="80" label="学科">
                <template slot-scope="scope">
            {{scope.row.subject|subjectName}}
          </template>
            </el-table-column>
            <el-table-column width="80" label="年级">
                <template slot-scope="scope">
            {{scope.row.grade|grade}}
          </template>
            </el-table-column>
            <el-table-column width="80" label="学期">
                <template slot-scope="scope">
            {{scope.row.term|terms}}
          </template>
            </el-table-column>
            <el-table-column width="80" label="班型">
                <template slot-scope="scope">
            {{scope.row.class_type|classType}}
          </template>
            </el-table-column>
            <el-table-column  label="名称">
                <template slot-scope="scope">
              {{scope.row.subject|subjectName}}{{scope.row.grade|grade}}{{scope.row.term|terms}}{{scope.row.class_type|classType}}
          </template>
            </el-table-column>
            <el-table-column width="200" label="开课日期">
                <template slot-scope="scope">
            {{scope.row.begin_date|toDateString}}-{{scope.row.finish_date|toDateString}}
          </template>
            </el-table-column>
            <el-table-column width="160" label="上课时间">
                <template slot-scope="scope">
           <span v-if="scope.row.class_type=='0'||scope.row.class_type=='1'">{{scope.row.begin_date|weekDay}}</span> {{scope.row.class_begin_time|toShortTimeString}}-{{scope.row.class_finish_time|toShortTimeString}}
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
            <el-table-column width="50" label="总课次">
                <template slot-scope="scope">
            {{scope.row.total_lesson_number||0}}
          </template>
            </el-table-column>
            <el-table-column width="50" label="剩余课次">
                <template slot-scope="scope">
             {{scope.row.total_lesson_number - (scope.row.current_lesson_number||0)}}
          </template>
            </el-table-column>
            <el-table-column width="50" label="报名人数">
                <template slot-scope="scope">
            {{scope.row.student_count}}
          </template>
            </el-table-column>
            <el-table-column width="80" label="班级状态">
                <template slot-scope="scope">
            {{scope.row.state|classState}}
          </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
            <el-button @click="handleEnrollmentClick(scope.row)" type="text" size="small">报名</el-button>
          </template>
            </el-table-column>
        </el-table>
    </el-row>
    <el-row>
        <div class="text-center">
            <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="pageSize" :total="clazzList.count">
            </el-pagination>
        </div>
    </el-row>
    <el-dialog :visible.sync="dialogFormVisible" fullscreen center>
      <h1 slot="title">{{operate_mode=='create'?'新建':'修改'}}班级</h1>
      <add-class v-if="dialogFormVisible" v-bind:mode="operate_mode" @updated-success="onUpdated"
        @created-success="onCreated"></add-class>
    </el-dialog>
</div>
</template>

<script>
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import AddClass from "@/views/teaching_manage/AddClass.vue";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      searchForm: {
        teacher_name: undefined,
        term: undefined,
        year: undefined,
        subject: undefined,
        grade: undefined,
        class_type: undefined,
        // state: undefined,
        class_begin_time: undefined,
        begin_date: undefined
      },
      beginTimeOptions: [
        { name: "上午", key: "a" },
        { name: "下午", key: "b" },
        { name: "晚上", key: "c" }
      ],
      beginDateOptions: [
        { name: "最近一周", key: "week" },
        { name: "最近一个月", key: "month" }
      ],
      yearOptions: [
        new Date().getFullYear() - 1,
        new Date().getFullYear(),
        new Date().getFullYear() + 1
      ],
      pageSize: 20,
      currentPage: 1,
      showResetButton: false,

      operate_mode: "create",
      dialogFormVisible: false
    };
  },
  computed: {
    ...mapState({
      clazzList: state => state.clazz.clazzList.data || {},
      current_school: state => state.current_user.current_school
    }),
    ...mapGetters(["terms", "subjects", "class_types", "grades"]),

    searchCondition() {
      return `${this.searchForm.year || ""}${this.searchForm.subject ||
        ""}${this.searchForm.term || ""}${this.searchForm.grade || ""}${this
        .searchForm.class_type || ""}${this.searchForm.class_begin_time ||
        ""}${this.searchForm.begin_date || ""}`;
    }
  },
  watch: {
    current_school(val, old) {
      if (val.id != old.id) {
        this.search();
      }
    },
    searchCondition: {
      handler: function(val, old) {
        if (val != "") {
          this.showResetButton = true;
        } else {
          this.showResetButton = false;
        }
        if (val != old) {
          this.search();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.search();
  },
  methods: {
    ...mapActions({
      getClazzList: "getClazzList"
    }),
    handleEnrollmentClick(data) {
      this.$router.push({ name: "create_order", query: { clazz_id: data.id } });
    },
    onResetSearchForm() {
      // this.searchForm = Object.assign(this.searchForm, this.defaultSearchForm);
      this.$refs["searchForm"].resetFields();
      console.log("resetFields");
      this.$refs["searchForm"].resetFields();
    },
    onSearch() {
      this.search();
    },
    search() {
      let payload = Object.assign({}, this.searchForm);
      payload.limit = this.pageSize;
      payload.offset = (this.currentPage - 1) * this.pageSize;
      payload.school_id = this.current_school.id;
      payload.state = -2;
      this.getClazzList(payload);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.search();
    },
    onUpdated() {
      //   this.dialogFormVisible = false;
      this.getClassroomList({
        school_id: this.current_school.id
      });
    },
    onCreated() {
      //   this.dialogFormVisible = false;
      this.getClassroomList({
        school_id: this.current_school.id
      });
    },
    onAddClass() {
      this.operate_mode = "create";
      this.dialogFormVisible = true;
    }
  },
  components: {
    AddClass
  }
};
</script>

<style lang="stylus" scoped>
.text-classroom-desc {
  overflow: hidden;
  white-space: nowrap;
  word-break: normal;
  text-overflow: ellipsis;
}

.classroom .el-row:not(:first-child) {
  max-width: 900px;
}

.el-select {
  max-width: 110px;
}

.el-input {
  max-width: 120px;
}
</style>
