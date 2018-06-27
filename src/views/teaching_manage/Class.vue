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
        <el-form :inline="true" :model="searchForm" size="small" class="search-form-inline">
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
                    <el-option v-for="item in subjectGrades" :key="item.key" :label="item.name" :value="item.key">
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
            <el-form-item>
                <el-select v-model="searchForm.state" placeholder="班级状态" clearable>
                    <el-option label="未开课" value="0"></el-option>
                    <el-option label="开课中" value="1"></el-option>
                    <el-option label="已结课" value="2"></el-option>
                    <el-option label="已关闭" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input form="no" v-model="searchForm.teacher_name" placeholder="输入老师姓名" clearable style="min-width:220px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="onSearch" icon="el-icon-search">查询</el-button>
            </el-form-item>
        </el-form>
    </el-row>

    <el-row class="block" >
        <el-table v-loading="loading" :data="clazzList.rows" stripe size="medium">
            <el-table-column type="index" label="#" width="40">
            </el-table-column>
            <el-table-column  label="名称">
                <template slot-scope="scope">
              {{scope.row.year}}{{scope.row.subject|subjectName}}{{scope.row.grade|grade}}{{scope.row.term|terms}}{{scope.row.class_type|classType}}
          </template>
            </el-table-column>
            <el-table-column width="200" label="开课日期">
                <template slot-scope="scope">
            <p>{{scope.row.begin_date|toDateString}}-{{scope.row.finish_date|toDateString}}</p>
            <p> <span v-if="scope.row.class_type=='0'||scope.row.class_type=='1'">{{scope.row.begin_date|weekDay}}</span> {{scope.row.class_begin_time|toShortTimeString}}-{{scope.row.class_finish_time|toShortTimeString}}</p>
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
            <el-table-column width="70" label="总课次">
                <template slot-scope="scope">
            {{scope.row.total_lesson_number||0}}
          </template>
            </el-table-column>
            <el-table-column width="80" label="剩余课次">
                <template slot-scope="scope">
             {{scope.row.total_lesson_number - (scope.row.current_lesson_number||0)}}
          </template>
            </el-table-column>
            <el-table-column width="80" label="报名人数">
                <template slot-scope="scope">
            {{scope.row.student_count}}
          </template>
            </el-table-column>
            <el-table-column width="80" label="班级状态">
                <template slot-scope="scope">
            <span :class="{'text-success':scope.row.state==1}">{{scope.row.state|classState}}</span>
          </template>
            </el-table-column>
            <el-table-column width="80" label="显示状态" >
                <template slot-scope="scope">
                  <div v-if="(scope.row.state==0&&scope.row.student_count==0)">
                    <a :class="{'el-button--success':scope.row.visible,'el-button--info':!scope.row.visible}" class="visible-link el-button  el-button--mini is-plain" @click="handleVisibleClick(scope.row)"  @mouseover="handleMouseEnter($event,scope.row)" @mouseout="handleMouseLeve($event,scope.row)">{{scope.row.visible?"公开":"隐藏"}}</a>
                  </div>
                  <div v-else><el-button disabled=""  plain size="small" :type="scope.row.visible?'success':'info'">{{scope.row.visible?"公开":"隐藏"}}</el-button> </div>
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
        <div class="text-center" v-if="clazzList.count>0">
            <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="pageSize" :current-page.sync="currentPage" :total="clazzList.count">
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
      yearOptions: [
        new Date().getFullYear() + 1,
        new Date().getFullYear(),
        new Date().getFullYear() - 1,
        new Date().getFullYear() - 2,
        new Date().getFullYear() - 3
      ],
      pageSize: 10,
      currentPage: 1,
      loading: false,
      operate_mode: "create",
      dialogFormVisible: false
    };
  },
  computed: {
    ...mapState({
      clazzList: state => state.clazz.clazzList.data || {},
      current_school: state => state.current_user.current_school
    }),
    ...mapGetters([
      "terms",
      "subjects",
      "class_types",
      "grades",
      "course_settings"
    ]),
    subjectGrades() {
      let sub = this.course_settings.find(
        v => v.key == this.searchForm.subject
      );
      return sub ? sub.grades : [];
    }
  },
  watch: {
    $route(val, old) {
      // console.warn("route change---->",val,old)
      let query = val.query;
      this.currentPage = parseInt(val.params.page);
      this.searchForm = Object.assign({}, query);
      this.search();
    },
    current_school(val, old) {
      if (val.id != old.id) {
        this.search();
      }
    }
  },
  mounted() {
    let query = this.$route.query;
    this.searchForm = Object.assign({}, query);
    this.currentPage = parseInt(this.$route.params.page);
    this.search();
  },
  methods: {
    ...mapActions({
      getClazzList: "getClazzList",
      setClazzVisibleState: "setClazzVisibleState",
      removeClazz: "removeClazz"
    }),
    handleMouseEnter(event, data) {
      this.$nextTick(() => {
        event.target.innerText = data.visible ? "隐藏" : "公开";
      });
    },
    handleMouseLeve(event, data) {
      this.$nextTick(() => {
        event.target.innerText = data.visible ? "公开" : "隐藏";
      });
    },
    handleVisibleClick(data) {
      if (data.state > 0) {
        this.$alert("已开课班级无法隐藏");
        return false;
      }
      if (data.student_count > 0) {
        this.$alert("已报名班级无法隐藏");
        return false;
      }
      let msg = `确定要公开该班级？公开后班级信息将无法修改`;
      if (data.visible) {
        msg = `确定要隐藏该班级？隐藏后班级将无法报名`;
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(_ => {
          this.setClazzVisibleState({
            clazz_id: data.id,
            visible: !data.visible
          }).then(res => {
            if (res.code == 0) {
              this.$message.success("设置成功");
              this.$forceUpdate();
            } else {
              this.$message.error(res.message || "设置失败");
            }
          });
        })
        .catch(_ => {});
    },
    handleCloseClick(data) {
      if (data.state == 1 || (data.state == 0 && data.student_count > 0)) {
        this.$alert("开课中班级或已报名的班级无法关闭");
        return false;
      }
      if (data.state == 0 && data.student_count > 0) {
        this.$alert("该班级已有学生报名，无法关闭");
        return false;
      }
      // if (data.state == 0 && data.student_count > 0) {
      //   this.$alert("该班级已有学生报名，无法关闭");
      //   return false;
      // }
      this.$confirm("确认关闭班级？", "警告", { type: "error" })
        .then(_ => {
          this.removeClazz({
            clazz_id: data.id
          }).then(res => {
            if (res.code > 0) {
              this.$message.error(res.message || "关闭失败");
            } else {
              this.$message.success("关闭成功");
            }
          });
        })
        .catch(_ => {});
    },
    handleDelClick(data) {
      let self = this;

      if (data.state == 1 || (data.state == 0 && data.student_count > 0)) {
        this.$alert("开课中班级或已报名的班级无法删除");
        return false;
      }
      if (data.visible) {
        this.$alert("公开状态的班级无法删除，请先设置成隐藏状态");
        return false;
      }
      this.$confirm("确认删除？", "警告", { type: "error" })
        .then(_ => {
          this.removeClazz({
            clazz_id: data.id
          }).then(res => {
            if (res.code > 0) {
              this.$message.error(res.message || "删除失败");
            } else {
              this.search();
            }
          });
        })
        .catch(_ => {});
    },
    onSearch() {
      this.currentPage = 1;
      this.$router.push({
        name: this.$route.name,
        params: { page: this.currentPage },
        query: Object.assign({}, this.searchForm)
      });
      this.search();
    },
    search() {
      this.loading = true;
      let payload = Object.assign({}, this.searchForm);
      payload.limit = this.pageSize;
      payload.offset = (this.currentPage - 1) * this.pageSize;
      payload.school_id = this.current_school.id;
      this.getClazzList(payload).then(res => {
        this.loading = false;
        this.clazzListTracker = res.data.rows.map(v => {
          return { id: v.id, visible: v.visible };
        });
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$router.push({
        name: this.$route.name,
        params: { page: this.currentPage },
        query: this.searchForm
      });
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

<style>
.text-classroom-desc {
  overflow: hidden;
  white-space: nowrap;
  word-break: normal;
  text-overflow: ellipsis;
}

.clazz .search-form-inline .el-input {
  max-width: 120px;
}
.visible-link {
  text-decoration: none;
  cursor: pointer;
}
</style>
