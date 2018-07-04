<template>
  <div class="clazz" style="max-width:1400px;" :style="{'padding-right':rightTabWidth}">
    <vue-headful title="睿乐教育-选课报名" description="睿乐教育" />
    <!-- <el-row>
      <div class="page-breadcrumb clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/school' }">校区管理</el-breadcrumb-item>
          <el-breadcrumb-item>报名管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-row> -->
    <el-row>
    <div class="block">
      <course-filter-box :searchForm="searchForm"></course-filter-box>
    </div>
    </el-row>
    <el-row class="search-section-2">
      <el-col :span="12">
      <el-form :inline="true" size="small" ref="searchForm" @keydown.native.enter.prevent="()=>{}"  :model="searchForm" class="clearfix">
        <el-form-item prop="teacher_name">
          <el-input style="width:240px" v-model="searchForm.teacher_name" @keyup.enter.native="onSearch" placeholder="输入老师姓名查询" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="onSearch" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
      </el-col>
      <el-col :span="12">
        <div style="float:right">
      <el-dropdown trigger="click">
        <el-button class="el-dropdown-link">
          {{(yearOptions.find(p=>p.key==searchForm.year)||{}).name||yearOptions[0].name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in yearOptions" :key="item.name">
            <router-link :class="{'active':searchForm.year==item.key}" :to="{name:$route.name,params:{page:1},query:Object.assign({},searchForm,{year:item.key})}">{{item.name}}</router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown trigger="click">
        <el-button class="el-dropdown-link">
          {{(beginDateOptions.find(p=>p.key==searchForm.begin_date)||{}).name||beginDateOptions[0].name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in beginDateOptions" :key="item.name">
            <router-link :class="{'active':searchForm.begin_date==item.key}" :to="{name:$route.name,params:{page:1},query:Object.assign({},searchForm,{begin_date:item.key})}">{{item.name}}</router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown trigger="click">
        <el-button class="el-dropdown-link">
          {{(beginTimeOptions.find(p=>p.key==searchForm.class_begin_time)||{}).name||beginTimeOptions[0].name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in beginTimeOptions" :key="item.name">
            <router-link :class="{'active':searchForm.class_begin_time==item.key}" :to="{name:$route.name,params:{page:1},query:Object.assign({},searchForm,{class_begin_time:item.key})}">{{item.name}}</router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
        </div>
      </el-col>

    </el-row>

    <el-row class="">
      <div class="clazz-list">
        <transition-group name="list" tag="div">
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
                              <div class="text-center"><img class="img-circle" :src="teacher_info.avatar_url?teacher_info.avatar_url:(teacher_info.gender==1?teacher_avatar_man:teacher_avatar_woman)"  :alt="teacher_info.name"></div>
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
                               <img class="img-circle small" :src="clazz.teacher.avatar_url?clazz.teacher.avatar_url:(clazz.teacher.gender==1?teacher_avatar_man:teacher_avatar_woman)"
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
        </transition-group>
      </div>
      <empty-data-view v-show="clazzList.count==0" message="没有可报名的班级"></empty-data-view>
    </el-row>
    <el-row>
      <div class="text-center" v-show="clazzList.count>0">
        <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="pageSize" :total="clazzList.count">
        </el-pagination>
      </div>
    </el-row>
    <div class="right-tab" :style="{'width':rightTabWidth}" >
      <div class="right-tab_arrow" @click="onToggleTabOpen"><span :class="tab_arrow_class" class="icon-bar"></span></div>
      <div class="shopping-card-container scroll_bar">
        <shopping-card @content-changed="rightTabOpened=true" @onPurchase="onPurchase" :display="rightTabOpened?'detail':'summary'" :width="rightTabWidth" ref="shoppingCard"></shopping-card>
      </div>
    </div>
     <el-dialog :visible.sync="dialogStudentPickerVisible" fullscreen  center >
        <student-picker v-if="dialogStudentPickerVisible" @student-picked="confirmToPurchase"></student-picker>
         <div slot="footer" class="dialog-footer">
        </div>
     </el-dialog>
  </div>
</template>

<script>
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import CourseFilterBox from "@/components/CourseFilterBox.vue";
import ShoppingCard from "@/views/school/ShoppingCard.vue";
import StudentPicker from "@/views/school/StudentPicker.vue";
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
        { name: "所有时段", key: undefined },
        { name: "上午", key: "a" },
        { name: "下午", key: "b" },
        { name: "晚上", key: "c" }
      ],
      beginDateOptions: [
        { name: "日期不限", key: undefined },
        { name: "最近一周", key: "week" },
        { name: "最近一个月", key: "month" }
      ],
      yearOptions: [
        {
          name: "年份不限",
          key: undefined
        },
        {
          name: new Date().getFullYear() - 1 + "年",
          key: new Date().getFullYear() - 1
        },
        {
          name: new Date().getFullYear() + "年",
          key: new Date().getFullYear()
        },
        {
          name: new Date().getFullYear() + 1 + "年",
          key: new Date().getFullYear() + 1
        }
      ],
      pageSize: 10,
      currentPage: 1,
      showResetButton: false,

      operate_mode: "create",
      dialogFormVisible: false,
      rightTabOpened: false,
      teacher_avatar_man: require("@/assets/img/teacher_1.png"),
      teacher_avatar_woman: require("@/assets/img/teacher_0.png"),
      dialogStudentPickerVisible: false
    };
  },
  computed: {
    ...mapState({
      clazzList: state => state.clazz.clazzListVisibled.data || {},
      current_school: state => state.current_user.current_school,
      teacher_info: state => state.clazz.teacherInfo.data || {},
      course: state => state.order.course.data || [],
      currentClazz: state => state.clazz.selectedClazz.data
    }),
    ...mapGetters([
      "terms",
      "subjects",
      "class_types",
      "grades",
      "course_settings"
    ]),
    tab_arrow_class() {
      return this.rightTabOpened
        ? "el-icon-d-arrow-right"
        : "el-icon-d-arrow-left";
    },
    card() {
      return this.$shoppingCard.items;
    },
    rightTabWidth() {
      let width = this.rightTabOpened ? "340px" : "65px";
      return width;
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
  watch: {
    current_school(val, old) {
      if (val.id != old.id) {
        this.search();
      }
    }
  },
  mounted() {
    this.currentPage =
      this.$route.params.page > 0 ? parseInt(this.$route.params.page) : 1;
    this.searchForm = Object.assign(
      {
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
      this.$route.query
    );

    this.search();
  },
  methods: {
    ...mapActions({
      getClazzList: "searchVisibledClazzList",
      getTeacherInfo: "getTeacherInfo",
      getClazzById: "getClazzById",
      fetchCourseLesson: "fetchCourseLesson",
      getProduct: "getProduct"
    }),

    handleEnrollmentClick(data) {
      this.$refs["shoppingCard"].addClazzToCard(data);

      // this.$router.push({ name: "create_order", query: { clazz_id: data.id } });
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
    },
    onToggleTabOpen() {
      this.rightTabOpened = !this.rightTabOpened;
    },
    onPurchase() {
      this.dialogStudentPickerVisible = true;
    },
    confirmToPurchase() {
      this.$router.push({ name: "create_order" });
    }
  },
  components: {
    CourseFilterBox,
    ShoppingCard,
    StudentPicker
  }
};
</script>

<style lang="stylus" scoped>
.clazz {
  min-width: 800px;
}

.el-select {
  max-width: 110px;
}

.clazz .el-dropdown-link {
  line-height: 32px;
  margin: 0 10px;
  display: inline-block;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  border-radius: 4px;
  padding: 0 15px;
}

.clazz .el-dropdown-menu__item a.active {
  color: #409EFF;
}

.img-circle {
  background-color: #EBEEF5;
  border: 1px solid #E4E7ED;
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 50%;
  text-align: center;
  vertical-align: middle;
}

.img-circle.small {
  width: 28px;
  height: 28px;
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
  line-height: 30px;
  margin-left: 5px;
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

.right-tab {
  position: fixed;
  top: 51px;
  right: 0;
  width: 65px;
  z-index: 800;
  height: 100%;
  text-align: center;
  background-color: #eee;
  transition: all 0.3s;
  box-shadow: -3px 0 11px rgba(0, 0, 0, 0.2);
}

.shopping-card-container {
  height: inherit;
  position: relative;
  overflow-y: auto;
}

.right-tab:hover .right-tab_arrow {
  opacity: 1;
}

.right-tab.open {
  width: 268px;
}

.right-tab .right-tab_arrow {
  opacity: 0;
  background-color: #eee;
  border-left: 1px solid #eee;
  border-top: 1px solid #eee;
  border-right: 1px solid #cecece;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  display: inline-block;
  width: 16px;
  height: 92px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  margin-top: -46px;
  left: -18px;
  -webkit-box-shadow: -7px 0 11px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: -7px 0 11px rgba(0, 0, 0, 0.2);
  box-shadow: -7px 0 11px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.right-tab .right-tab_arrow .icon-bar {
  padding: 39px 0px;
  font-size: 12px;
  color: #909399;
}
</style>