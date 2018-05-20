<template>
<div class="clazz">
    <el-row>
        <div class="page-breadcrumb clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/teaching' }">教学管理</el-breadcrumb-item>
                <el-breadcrumb-item>班级管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </el-row>
    <el-row>
        <el-button type="danger" @click="onAddClass" size="small" icon="el-icon-circle-plus-outline">新建班级</el-button>
    </el-row>
    <el-row>
        <el-form :inline="true" :model="searchForm" size="small" class="demo-form-inline">
            <el-form-item>
                <el-select v-model="searchForm.state" placeholder="班级状态" clearable>
                    <el-option label="未开课" value="0"></el-option>
                    <el-option label="开课中" value="1"></el-option>
                    <el-option label="已结课" value="2"></el-option>
                    <el-option label="已关闭" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchForm.class_type" placeholder="选择班型" clearable>
                    <el-option v-for="item in class_types" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchForm.teacher" placeholder="输入老师姓名" style="min-width:220px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch" icon="el-icon-search">查询</el-button>
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
            <el-table-column width="80" label="显示">
                <template slot-scope="scope">
            <el-button @click="handleVisibleClick(scope.row)" type="text" size="small">{{scope.row.visible}}</el-button>
          </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
            <el-button @click="handleCloseClick(scope.row)" type="text" size="small">关班</el-button>
            <el-button @click="handleDelClick(scope.row)" type="text" size="small">删除</el-button>
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
        state: undefined
      },
      pageSize: 20,
      currentPage: 1,

      operate_mode: "create",
      dialogFormVisible: false
    };
  },
  computed: {
    ...mapState({
      clazzList: state => state.clazz.clazzList.data || {},
      current_school: state => state.current_user.current_school
    }),
    ...mapGetters(["class_types"])
  },
  watch: {
    current_school(val, old) {
      if (val.id != old.id) {
        this.search();
      }
    }
  },
  mounted() {
    this.search();
  },
  methods: {
    ...mapActions({
      getClazzList: "getClazzList"
    }),
    handleVisibleClick(data) {},
    handleCloseClick(data) {},
    handleDelClick(data) {
      let self = this;
      this.$confirm("确认删除？")
        .then(_ => {
          this.removeClassroom({
            classroom_id: data.id,
            school_id: data.school_id
          });
        })
        .catch(_ => {});
    },
    onSearch() {
      this.search();
    },
    search() {
      let payload = this.searchForm;
      payload.limit = this.pageSize;
      payload.offset = (this.currentPage - 1) * this.pageSize;
      payload.school_id = this.current_school.id;
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
</style>
