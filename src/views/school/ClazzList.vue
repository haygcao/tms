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
          <el-select v-model="searchForm.begin_date" placeholder="开课日期" clearable>
            <el-option v-for="item in beginDateOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="class_begin_time">
          <el-select v-model="searchForm.class_begin_time" placeholder="上课时段" :value-key="'key'" clearable>
            <el-option v-for="item in beginTimeOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="teacher_name">
          <el-input v-model="searchForm.teacher_name" placeholder="输入老师姓名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="onSearch" icon="el-icon-search">查询</el-button>
          <el-button v-if="showResetButton" type="text" @click="onResetSearchForm" icon="el-icon-circle-close-outline">清除查询条件</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-row class="">
      <div class="clazz-list">
        <div class="clazz-item block" v-for="clazz in clazzList.rows" :key="clazz.id">
          <div class="clazz-item-p1">
            <div>{{clazz.begin_date|formatDateTime(' M月D日')}}-{{clazz.finish_date|formatDateTime(' M月D日')}}</div>
            <div>
              <span v-if="clazz.class_type=='1'||clazz.class_type=='2'">{{clazz.begin_date|weekDay}}</span>
              <span v-if="clazz.class_type=='3'||clazz.class_type=='4'">每天</span>
              {{clazz.class_begin_time|toShortTimeString}}-{{clazz.class_finish_time|toShortTimeString}}</div>
          </div>
          <div class="clazz-item-p2">
            <div class="clazz-title">
              {{clazz.year}}{{clazz.subject|subjectName}}{{clazz.grade|grade}}{{clazz.term|terms}}{{clazz.class_type|classType}}
              <span class="clazz-state-badge" v-if="clazz.state==1">{{clazz.state|classState}}</span>
            </div>
            <div class="clazz-item-p2-s2">
              <span class="clazz-location">
                <i class="el-icon-location-outline"></i>
                <span>{{clazz.classroom_name}}</span>
              </span>
              <span class="clazz-lesson">共{{clazz.total_lesson_number||0}}节课
                <span v-if="clazz.state==1" class="text-danger">(剩余{{clazz.total_lesson_number - (clazz.current_lesson_number||0)}}节课)</span>
              </span>
            </div>
            <div class="clazz-item-p2-s3">
            
              <div>
                  
                <el-popover
                        placement="right"
                        :open-delay="320"	
                        width="400"
                        trigger="hover">
                          <div class="teacher-dialog">
                              <div class="teacher-info">
                              <div class="text-center"><img class="img-circle" :src="teacher_info.avatar_url?teacher_info.avatar_url:require('@/assets/img/default_teacher_avatar.png')"  :alt="teacher_info.name"></div>
                              <p class="text-center">{{teacher_info.name}}</p>
                            <div class="info-element">
                              <h4>毕业院校</h4>
                              <div>{{clazz.teacher.graduated_from}}</div>
                            </div>
                              <div class="info-element">
                              <h4>教学特点</h4>
                              <div>{{clazz.teacher.teaching_features}}</div>
                            </div>
                              <div class="info-element">
                              <h4>教学成果</h4>
                              <div>{{clazz.teacher.teaching_achievement}}</div>
                            </div>
                            </div>
                          </div>
                             <span class="clazz-teacher-name" slot="reference"> 
                               <img class="img-circle small" :src="clazz.teacher.avatar_url?clazz.teacher.avatar_url:require('@/assets/img/default_teacher_avatar.png')"
                                  :alt="clazz.teacher.name">
                                <span>{{clazz.teacher.name}}</span>
                             </span>
                </el-popover>

              </div>
            </div>
          </div>
          <div class="clazz-item-p3">
            <h3 v-if="clazz.student_limit<=clazz.student_count">已报满</h3>
            <div v-else>
              <p>
                <small>剩余名额</small>
                <span :class="{'text-danger':(clazz.student_limit-clazz.student_count)<4}" class="clazz-last-count">{{clazz.student_limit-clazz.student_count}}</span>
              </p>
              <div>
                <el-button @click="handleEnrollmentClick(clazz)" size="small" type="danger">报名</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <el-table :data="clazzList.rows" stripe size="medium" v-if="false">

        <el-table-column type="index" label="#" width="40">
        </el-table-column>
        <el-table-column label="班级">
          <template slot-scope="scope">
            {{scope.row.year}}{{scope.row.subject|subjectName}}{{scope.row.grade|grade}}{{scope.row.term|terms}}{{scope.row.class_type|classType}}
          </template>
        </el-table-column>
        <el-table-column width="200" label="上课时间">
          <template slot-scope="scope">
            <p>{{scope.row.begin_date|toDateString}}-{{scope.row.finish_date|toDateString}}</p>
            <p>
              <span v-if="scope.row.class_type=='0'||scope.row.class_type=='1'">{{scope.row.begin_date|weekDay}}</span> {{scope.row.class_begin_time|toShortTimeString}}-{{scope.row.class_finish_time|toShortTimeString}}</p>
          </template>
        </el-table-column>
        <el-table-column width="120" label="上课地点">
          <template slot-scope="scope">
            {{scope.row.classroom_name}}
          </template>
        </el-table-column>
        <el-table-column width="120" label="授课老师">
          <template slot-scope="scope">
            <el-button @click="onShowTeacherInfo(scope.row)" type="text">{{scope.row.teacher_name}}</el-button>
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
        <el-table-column width="80" label="剩余名额">
          <template slot-scope="scope">
            <span :class="{'text-danger':(scope.row.student_limit-scope.row.student_count)<4}">{{scope.row.student_limit-scope.row.student_count}}</span>
          </template>
        </el-table-column>
        <el-table-column width="80" label="班级状态">
          <template slot-scope="scope">
            <span :class="{'text-danger':scope.row.state>0}">{{scope.row.state|classState}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleEnrollmentClick(scope.row)" type="text" size="small">报名</el-button>
          </template>
        </el-table-column>
      </el-table> -->
    </el-row>
    <el-row>
      <div class="text-center">
        <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="pageSize" :total="clazzList.count">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog :visible.sync="dialogFormVisible" center>
      <h1 slot="title">老师介绍</h1>
      <div class="teacher-info" v-if="dialogFormVisible">
        <div class="text-center">
          <img class="img-circle" :src="teacher_info.avatar_url?teacher_info.avatar_url:require('@/assets/img/default_teacher_avatar.png')"
            :alt="teacher_info.name">
        </div>
        <p class="text-center">{{teacher_info.name}}</p>
        <div class="info-element">
          <h4>毕业院校</h4>
          <div>{{teacher_info.graduated_from}}</div>
        </div>
        <div class="info-element">
          <h4>教学特点</h4>
          <div>{{teacher_info.teaching_features}}</div>
        </div>
        <div class="info-element">
          <h4>教学成果</h4>
          <div>{{teacher_info.teaching_achievement}}</div>
        </div>
      </div>
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
      pageSize: 10,
      currentPage: 1,
      showResetButton: false,

      operate_mode: "create",
      dialogFormVisible: false
    };
  },
  computed: {
    ...mapState({
      clazzList: state => state.clazz.clazzListVisibled.data || {},
      current_school: state => state.current_user.current_school,
      teacher_info: state => state.clazz.teacherInfo.data || {}
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
    let query = this.$route.query;
    this.searchForm = Object.assign({}, query);
    this.currentPage = parseInt(this.$route.params.page);
    this.search();
  },
  methods: {
    ...mapActions({
      getClazzList: "searchVisibledClazzList",
      getTeacherInfo: "getTeacherInfo"
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
      this.currentPage = 1;
      this.$router.push({
        name: this.$route.name,
        params: { page: this.currentPage },
        query: this.searchForm
      });
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
      this.$router.push({
        name: this.$route.name,
        params: { page: this.currentPage },
        query: this.searchForm
      });
    },
    onShowTeacherInfo(val) {
      this.dialogFormVisible = true;
      if (
        this.teacher_info &&
        this.teacher_info.employee_id == val.teacher_id
      ) {
        return;
      }
      this.getTeacherInfo({
        teacher_id: val.teacher_id
      });
    }
  },
  components: {}
};
</script>

<style lang="stylus" scoped>
.clazz{
  min-width:800px;
}
.el-select {
  max-width: 110px;
}

.el-input {
  max-width: 120px;
}

.img-circle {
  background-color: #EBEEF5;
  border: 1px solid #E4E7ED;
  width: 60px;
  heigth: 60px;
  overflow: hidden;
  border-radius: 50%;
}

.img-circle.small {
  width: 28px;
  heigth: 28px;
}

.info-element {
  border-top: 1px solid #EBEEF5;
  padding: 5px auto;
}

.info-element h4 {
  margin: 8px auto;
}

.teacher-info {
  max-width: 640px;
}

.clazz-list {
  max-width: 1100px;
}

.clazz-list .clazz-item {
  background-color: #ffffff;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  padding: 20px;
  margin-bottom: 15px;
  font-size: 14px;
}

.clazz-list .clazz-item:last-child {
  margin-bottom: 0px;
}

.clazz-item-p1 {
  width: 200px;
  border-right: 1px solid #EBEEF5;
  text-align: center;
  font-size: 18px;
}

.clazz-item-p1>div {
  padding: 10px 0px;
}

.clazz-item-p2 {
  flex-grow: 1;
  border-right: 1px solid #EBEEF5;
  padding: 0px 10px 0px 20px;
}

.clazz-item-p2 .clazz-title {
  padding: 5px 0px;
  font-size: 18px;
  font-weight: bold;
  position: relative;
}

.clazz-item-p2 .clazz-location {
  width: 200px;
}

.clazz-item-p2 .clazz-lesson {
  flex-grow: 1;
}

.clazz-item-p2 .clazz-item-p2-s2 {
  display: inline-flex;
  justify-content: space-between;
  width: 100%;
  color: #909399;
  padding: 5px 0px;
}

.clazz-item-p2 .clazz-item-p2-s3 {
  padding: 5px 0;
}

.clazz-item-p2 .clazz-teacher-name {
  display: inline-block;
  vertical-align: middle;
}

.clazz-item-p2 .clazz-teacher-name >img {
  display: inline;
}

.clazz-item-p2 .clazz-teacher-name >span {
  display: inline-block;
  line-height :30px;
  vertical-align :super;
  margin-left:5px;
}

.clazz-item-p3 {
  width: 150px;
  text-align: center;
}

.clazz-state-badge {
  transform: translateY(-50%);
  background-color: rgba(245, 107, 107, 0.1);
  border: 1px solid rgba(245, 107, 107, 0.2);
  color: #f56c6c;
  border-radius: 15px;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 3px 6px;
  text-align: center;
  white-space: nowrap;
}

.clazz-item-p3 .el-button {
  letter-spacing: 5px;
}

.clazz-item-p3 small {
  color: #909399;
}

.clazz-item-p3 .clazz-last-count {
  font-size: 180%;
}
</style>