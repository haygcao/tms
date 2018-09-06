<template>
<div class="clazz">
    <!-- <el-row>
        <div class="page-breadcrumb clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/teaching' }">教学管理</el-breadcrumb-item>
                <el-breadcrumb-item>班级管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </el-row> -->
    <el-row>
    <div class="block">
      <course-filter-box :searchForm="searchForm"></course-filter-box>
    </div>
    </el-row>
    <el-row>
      <el-tooltip effect="dark" content="新建班级" placement="top">
        <el-button style="position: absolute;top: -42px;right: 0;" circle type="danger" @click="onAddClass" icon="el-icon-plus"></el-button>
      </el-tooltip>
    </el-row>
    <el-row>
        <el-form :inline="true" ref="searchForm" :model="searchForm" size="small" class="search-form-inline clearfix" @keydown.native.enter.prevent="()=>{}">
          <el-form-item prop="year">
                <el-select style="width:120px;" @change="onSearch" v-model="searchForm.year" placeholder="年份" clearable>
                    <el-option v-for="item in yearOptions" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select style="width:120px;" v-model="searchForm.state" @change="onSearch" placeholder="班级状态"  clearable>
                    <el-option label="未开课" value="0"></el-option>
                    <el-option label="开课中" value="1"></el-option>
                    <el-option label="已结课" value="2"></el-option>
                    <el-option label="已关闭" value="99"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input style="width:240px;" @keyup.enter.native="onSearch" v-model="searchForm.teacher_name" placeholder="输入老师姓名" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="onSearch" icon="el-icon-search">查询</el-button>
            </el-form-item>
        </el-form>
    </el-row>
    <el-row v-if="clazzListCopy.length==0">
      <empty-data-view ></empty-data-view>
    </el-row>
    <el-row v-else class="clazz-list" style="margin-left:-10px;margin-right:-10px;">
      <transition-group name="list" tag="div">
        <el-col style="padding:10px" :xs="24" :sm="12" :md="8" :lg="6" v-for="clazz in clazzListCopy" :key="clazz.id">
        <el-card  shadow="hover" class="box-card">
          <div class="subject-state" :class="{'subject-state-2':clazz.subject==2,'subject-state-3':clazz.subject==3}" style="">{{clazz.subject|subjectName}}</div>
        <div slot="header" class="clearfix">
          <span>{{clazz.year}}<span class="text-warning">{{clazz.grade|grade}}</span>{{clazz.term|terms}}{{clazz.class_type|classType}}</span>
          <span style="float: right;">
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button :disabled="clazz.state==1||clazz.student_count>0" style="padding: 3px;" @click="handleDelClick(clazz)" size="" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="关闭班级" placement="top">
              <el-button :disabled="clazz.state==99" style="padding: 3px;" @click="handleCloseClick(clazz)" size="" type="text" icon="el-icon-remove-outline"></el-button>
            </el-tooltip>
          </span>
        </div>
        <div class="content" style="display:flex">
          <div class="" style="flex:1 padding:0px 5px">
            <div class="text-info text-small">{{clazz.begin_date|toDateString}}-{{clazz.finish_date|toDateString}}</div>
            <strong> <span v-if="clazz.class_type=='0'||clazz.class_type=='1'">{{clazz.begin_date|weekDay}}</span> 
            {{clazz.class_begin_time|toShortTimeString}}-{{clazz.class_finish_time|toShortTimeString}}</strong>
            <p class="text-small"><span class="text-info">授课老师:</span> {{clazz.teacher_name}}</p>
            <p class="text-small text-info"> <i class="el-icon-location-outline"></i>{{clazz.classroom_name}}</p>
          </div>
          <div style="flex:1">
            <div class="text-center">
              <div class="text-info text-small">剩余课次/总课次</div>
              <strong> {{clazz.total_lesson_number - (clazz.current_lesson_number||0)}}</strong>/<strong> {{clazz.total_lesson_number||0}}</strong>
            </div>
            <div class="text-center">
              <div class="text-info text-small">报名人数/限额</div>
              <a @click="showClazzStudents(clazz)"><strong> {{clazz.student_count}}</strong>/<strong> {{clazz.student_limit||0}}</strong></a>
            </div>
          </div>
        </div>
        <div class="bottom clearfix">
          <span style="line-height: 20px;" :class="{'text-success':clazz.state==1}">{{clazz.state|classState}}</span>
          <el-tooltip effect="dark" content="公开状态的班级才可报名" placement="top">
          <el-switch style="float:right;margin-right:10px;" :disabled="!(clazz.state==0&&clazz.student_count==0)"
            v-model="clazz.visible"
            @change="handleVisibleClick(clazz)"
            active-color="#13ce66"
            active-text="公开"
            inactive-text="隐藏">
          </el-switch>
          </el-tooltip>
          <div class="text-info text-small" >{{clazz.created_at|formatDateTime('YYYY/MM/DD HH:mm:ss')}}</div>
        </div>
      </el-card>
        </el-col>
      </transition-group>
    </el-row>
    <el-row>
        <div class="text-center" v-if="clazzList.count>0">
            <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="pageSize" :current-page.sync="currentPage" :total="clazzList.count">
            </el-pagination>
        </div>
    </el-row>
    <el-dialog :visible.sync="dialogFormVisible" fullscreen center>
      <h1 slot="title">{{operate_mode=='create'?'新建':'修改'}}班级</h1>
      <add-class v-if="dialogFormVisible" v-bind:mode="operate_mode" @update-success="onUpdated"
        @create-success="onCreated"></add-class>
    </el-dialog>
    <el-dialog :visible.sync="dialogClazzStudentVisible" fullscreen  center >
        <h1 slot="title">班级成员<small class="text-info">(共{{clazzStudents.length}}人)</small></h1>
       <el-row>
         <el-col v-if="dialogClazzStudentVisible" style="padding:10px" :xs="24" :sm="12" :md="12" :lg="8" v-for="student in clazzStudents" :key="student.id">
        <student-info-card :student="student"></student-info-card>
         </el-col>
        </el-row>
     </el-dialog>
</div>
</template>

<script>
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import AddClass from "@/views/teaching_manage/AddClass.vue";
import CourseFilterBox from "@/components/CourseFilterBox.vue";
import StudentInfoCard from "@/components/StudentInfoCard.vue";
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
      dialogFormVisible: false,
      clazzListCopy: [],
      dialogClazzStudentVisible: false
    };
  },
  computed: {
    ...mapState({
      clazzList: state => state.clazz.clazzList.data || {},
      current_school: state => state.current_user.current_school,
      clazzStudents: state => state.clazz.clazzStudents.data || []
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
    current_school(val, old) {
      if (val.id != old.id) {
        this.search();
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    // react to route changes...
    // don't forget to call next()
    this.currentPage = to.params.page > 0 ? to.params.page : 1;
    this.searchForm = Object.assign(this.searchForm, to.query);
    this.search();
    next();
  },
  mounted() {
    // let query = this.$route.query;
    // this.searchForm = Object.assign({}, query);
    // this.currentPage = parseInt(this.$route.params.page);
    // this.search();
    this.currentPage =
      this.$route.params.page > 0 ? parseInt(this.$route.params.page) : 1;
    this.searchForm = Object.assign({}, this.searchForm, this.$route.query);

    this.search();
  },
  methods: {
    ...mapActions({
      getClazzList: "getClazzList",
      setClazzVisibleState: "setClazzVisibleState",
      removeClazz: "removeClazz",
      closeClazz: "closeClazz",
      getClazzStudents: "getClazzStudents"
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
        this.$alert("已开课班级无法隐藏", { showClose: false });
        return false;
      }
      if (data.student_count > 0) {
        this.$alert("已报名班级无法隐藏", { showClose: false });
        return false;
      }
      let msg = `确定要公开该班级？公开后班级信息将无法修改`;
      if (!data.visible) {
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
            visible: data.visible
          }).then(res => {
            if (res.code == 0) {
              this.$message.success("设置成功");
              this.$forceUpdate();
            } else {
              this.$message.error(res.message || "设置失败");
            }
          });
        })
        .catch(_ => {
          data.visible = !data.visible;
        });
    },
    handleCloseClick(data) {
      if (data.state == 1) {
        this.$alert("开课中班级无法关闭", { showClose: false });
        return false;
      }
      if (data.state == 0 && data.student_count > 0) {
        this.$alert("该班级已有学生报名，无法关闭", { showClose: false });
        return false;
      }
      // if (data.state == 0 && data.student_count > 0) {
      //   this.$alert("该班级已有学生报名，无法关闭");
      //   return false;
      // }
      this.$confirm("确认关闭班级？", "警告", { type: "warning" })
        .then(_ => {
          this.closeClazz({
            clazz_id: data.id
          }).then(res => {
            if (res.code > 0) {
              this.$message.error(res.message || "关闭失败");
            } else {
              this.$message.success("关闭成功");
              this.search();
            }
          });
        })
        .catch(_ => {});
    },
    handleDelClick(data) {
      let self = this;

      if (data.state == 1 || (data.state == 0 && data.student_count > 0)) {
        this.$alert("开课中班级或已报名的班级无法删除", { showClose: false });
        return false;
      }
      if (data.visible) {
        this.$alert("公开状态的班级无法删除，请先设置成隐藏状态", {
          showClose: false
        });
        return false;
      }
      this.$confirm("确认删除？", "警告", { type: "error" })
        .then(_ => {
          this.removeClazz({
            clazz_id: data.id
          }).then(res => {
            if (res.code > 0 || res.data < 1) {
              this.$message.error(res.message || "删除失败");
            } else {
              this.$message.success("删除成功");
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
        // this.clazzListTracker = res.data.rows.map(v => {
        //   return { id: v.id, visible: v.visible };
        // });
        this.clazzListCopy = (res.data.rows || []).map(v => {
          return Object.assign({}, v);
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
      this.dialogFormVisible = false;
      this.search();
    },
    onCreated() {
      this.dialogFormVisible = false;
      this.search();
    },
    onAddClass() {
      this.operate_mode = "create";
      this.dialogFormVisible = true;
    },
    async showClazzStudents(clazz) {
      if (clazz.student_count == 0) {
        return false;
      }
      let res = await this.getClazzStudents({ clazz_id: clazz.id });
      if (res && res.code == 0) {
        this.dialogClazzStudentVisible = true;
      } else {
        this.$message.error("无法获取学员名单");
      }
    }
  },
  components: {
    AddClass,
    CourseFilterBox,
    StudentInfoCard
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

.visible-link {
  text-decoration: none;
  cursor: pointer;
}
.clazz {
  max-width: 1440px;
}
.clazz-list .box-card {
  /* width: 340px; */
  /* width: 340px;
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 15px; */
  position: relative;
}
.box-card .bottom {
  margin-top: 13px;
}
.box-card .subject-state {
  position: absolute;
  right: 0px;
  bottom: 0px;
  background-color: #409eff;
  /* background-color: rgba(245, 108, 108, 0.6); */
  color: #ffffff;
  padding: 5px 5px;
  font-size: 14px;
  border-radius: 50% 0px 0px 0px;
}
.box-card .subject-state-2 {
  background-color: #e6a23c;
}
.box-card .subject-state-3 {
  background-color: #f56c6c;
}
</style>
