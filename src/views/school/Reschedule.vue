<template>
    <div class="reschedule">
    <el-row>
        <el-steps :active="step" finish-status="success" simple :align-center="true">
        <el-step title="选择要调课的班级"></el-step>
        <el-step title="选择要调课次"></el-step>
        <el-step title="选择要调入的班级"></el-step>
        <el-step title="完成"></el-step>
        </el-steps>
    </el-row>
    <el-container style="margin-top:20px;">
        <el-aside  style="width:300px; border-right:1px solid #EBEEF5;padding:0 10px">
        <div v-if="step>0&&scheduleForm.clazz_id">
        <h4>已选择</h4>
            <clazz-info-card :clazz="sheduleClazz">
                <div slot="footer" style="padding:10px 20px" v-if="scheduleForm.curriculum_no!=undefined&&step>=1">
                <el-card shadow="never" style="text-align:center;margin:0 auto;">
                    <div style="margin-bottom:10px;" >第<strong style="font-size:24px">{{selected_curriculum.curriculum_no}}</strong>次课</div>
                    <div class="text-info text-small">{{selected_curriculum.class_date|formatDateTime('MM/DD')}}</div>
                </el-card>
                </div>
            </clazz-info-card>
        </div>
        <div class="info-block text-info" style="margin-top:20px;">
            <p class="text-center">调课须知</p>
            <ol class="">
            <li>调课仅限于同年份，同年级，同学期，同学科，同班型，目标班有剩余名额的班级</li>
            <li>开课前24小时以内不可调课</li>
            </ol>
            
        </div>
        </el-aside>
   <el-main>
    <el-row  v-show="step==0">
        <div style="margin:0 auto;margin-left:-10px;margin-right:-10px;" class="clearfix">
            <el-col style="padding:10px" :xs="24" :sm="24" :md="12" :lg="8" v-for="clazz in clazzList" :key="clazz.id">
                <clazz-info-card :clazz="clazz">
                <span slot="header">
                    <el-radio v-model="scheduleForm.clazz_id" :label="clazz.id">
                    <span>{{clazz.year}}{{clazz.subject|subjectName}}<span>{{clazz.grade|grade}}</span>{{clazz.term|terms}}{{clazz.class_type|classType}}</span>
                    </el-radio>
                </span>
                </clazz-info-card>
            </el-col>
        </div>
        

    </el-row>
    <el-row  v-show="step==1">
        <div style="padding: 10px 0px;">
            
                <div style="padding:0 10px 10px 10px">
                <el-alert 
                    title="点击选择调课课次"
                    type="warning">
                </el-alert>
                </div>
                <el-card v-for="c in curriculum_list" :key="c.curriculum_no" shadow="hover" style="display:inline-block;width:80px; margin:0 10px 10px 10px;text-align:center">
                    <div style="margin-bottom:10px;" ><el-radio :disabled="!validScheduleDate(c)" v-model="scheduleForm.curriculum_no" :label="c.curriculum_no"><strong style="font-size:24px">{{c.curriculum_no}}</strong></el-radio></div>
                    <div class="text-info text-small">{{c.class_date|formatDateTime('MM/DD')}}</div>
                </el-card>
        </div>
    </el-row>
    <el-row  v-show="step==2">
         <div style="margin:0 auto;margin-left:-10px;margin-right:-10px;" class="clearfix">
            <el-col style="padding:10px" :xs="24" :sm="12" :md="12" :lg="8" v-for="clazz in clazzListToReschedule" :key="clazz.id">
                <clazz-info-card :clazz="clazz">
                <span slot="header">
                    <el-radio v-model="scheduleForm.to_clazz_id" :label="clazz.id">
                    <span>{{clazz.year}}{{clazz.subject|subjectName}}<span>{{clazz.grade|grade}}</span>{{clazz.term|terms}}{{clazz.class_type|classType}}</span>
                    </el-radio>
                </span>
                </clazz-info-card>
            </el-col>
        </div>
    </el-row>
    <el-row style="border-top:1px solid #EBEEF5"></el-row>
    <el-row>
        <div style="float:right">
        <el-button v-if="step>0" type="" @click="preStep"><i class="el-icon-d-arrow-left">上一步</i></el-button>
        <el-button type="danger" @click="nextStep"><span v-if="step<3">下一步</span><span v-if="step==3">提交</span><span v-if="step==4">关闭</span><i class="el-icon-d-arrow-right"></i></el-button>
        </div>
    </el-row>
   </el-main>
    </el-container>
    
    </div>
</template>
<script>
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
import ClazzInfoCard from "@/views/school/ClazzInfoCard.vue";
import moment from "moment";
export default {
  props: {
    // studentId: { type: String },
    student: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      step: 0,
      clazzList: [],
      scheduleForm: {
        clazz_id: undefined,
        to_clazz_id: undefined,
        curriculum_no: undefined
      }
    };
  },
  computed: {
    ...mapState({
      current_school: state => state.current_user.current_school,
      clazzListToReschedule: state =>
        state.reschedule.clazzListToReschedule.data || []
    }),
    sheduleClazz() {
      return this.clazzList.find(c => c.id == this.scheduleForm.clazz_id);
    },

    curriculum_list() {
      if (!this.sheduleClazz) {
        return [];
      }
      return (this.sheduleClazz.schedules || []).filter(
        v => v.curriculum_no > this.sheduleClazz.current_lesson_number
      );
    },
    selected_curriculum() {
      if (!this.curriculum_list || this.curriculum_list.length == 0) {
        return {};
      }
      return this.curriculum_list.find(
        v => v.curriculum_no == this.scheduleForm.curriculum_no
      );
    },
    toClazz() {
      return this.clazzList.find(c => c.id == this.scheduleForm.to_clazz_id);
    }
  },
  created() {},
  activated() {
    console.log("activated");
    this.getStudentClazzList({ student_id: this.student.id }).then(res => {
      if (res.code > 0) {
        this.$message("获取学员所报班级失败");
      }
      this.clazzList = (res.data || []).filter(
        c => c.state < 2 || c.total_lesson_number > c.current_lesson_number
      );
      // this.loadStudentReschedules({
      //   student_id: this.student.id,
      //   clazz_id_list: this.clazzList.map(v => v.id)
      // }).then(res => {
      //   if (res && res.code == 0) {
      //     let reschedule_list = res.data||[];
      //     this.clazzList.map(v=>{
      //       v.total_reschedule
      //       return 
      //     })
      //   }
      // });
    });
  },
  deactivated() {
    console.log("deactivated");
    this.clazzList = [];
    this.step == 0;
    this.scheduleForm = {
      clazz_id: undefined,
      to_clazz_id: undefined,
      curriculum_no: undefined
    };
  },
  methods: {
    ...mapActions({
      getStudentClazzList: "getStudentClazzListAndRescheduleInfo",
      findClazzListToReschedule: "findClazzListToReschedule",
      createStudentReschedule: "createStudentReschedule",
      loadStudentReschedules: "loadStudentReschedules"
    }),
    validScheduleDate(curriculum) {
      let isBef1Day =
        moment(`${curriculum.class_date} ${curriculum.start_time}`).diff(
          moment()
        ) > 86400000;
      return isBef1Day;
    },
    nextStep() {
      if (this.step == 0) {
        if (!this.scheduleForm.clazz_id) {
          this.$message.warning("请选择要调课的班级");
          return;
        }
        this.step++;
        return;
      }
      if (this.step == 1) {
        if (!this.scheduleForm.clazz_id) {
          this.step = 0;
        }
        if (!this.scheduleForm.curriculum_no) {
          this.$message.warning("选择要调课次");
          return;
        }
        let payload = {
          term: this.sheduleClazz.term,
          year: this.sheduleClazz.year,
          subject: this.sheduleClazz.subject,
          grade: this.sheduleClazz.grade,
          class_type: this.sheduleClazz.class_type,
          curriculum_no: this.scheduleForm.curriculum_no,
          school_id: this.current_school.id,
          clazz_id: this.scheduleForm.clazz_id
        };
        this.findClazzListToReschedule(payload).then(res => {
          if (res.code > 0) {
            this.$message.error("获取可调入班级失败");
          }
          //   this.ClazzListToReschedule = res.data;
        });
        this.step++;
        return;
      }
      if (this.step == 2) {
        if (!this.scheduleForm.clazz_id) {
          this.step = 0;
          return;
        }
        if (!this.scheduleForm.curriculum_no) {
          this.step = 1;
          return;
        }
        if (!this.scheduleForm.to_clazz_id) {
          this.$message.warning("选择要调入的班级");
          return;
        }
        let payload = Object.assign({}, this.scheduleForm, {
          student_id: this.student.id
        });
        this.createStudentReschedule(payload).then(res => {
          if (res.code == 0) {
            this.$message.success("提交成功");
            this.step++;
          } else {
            this.$message.error("提交失败");
          }
        });
        return;
      }
    },
    preStep() {
      if (this.step > 0) {
        this.step--;
      }
    }
  },
  components: {
    ClazzInfoCard
  }
};
</script>

