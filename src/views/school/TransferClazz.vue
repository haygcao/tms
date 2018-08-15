<template>
    <div class="transfer-clazz">
    <el-tabs tab-position="top" v-model="tabValue" style="height: 200px;" @tab-click="onTabClick">
    <el-tab-pane label="转班" name="transfer">
        <div class="info-block text-info" style="margin-top:20px;padding:5px;">
            <p>转班仅限于同年份，同年级，同学期，同学科，同班型，目标班有剩余名额的班级</p>
            </div>
        <el-row>
                <el-steps :active="step" finish-status="success" simple :align-center="true">
                <el-step title="选择要转出的班级"></el-step>
                <el-step title="选择要转入的班级"></el-step>
                <el-step title="完成"></el-step>
                </el-steps>
            </el-row>
            <el-row v-show="step==0">
                <el-col style="padding:10px" :xs="24" :sm="12" :md="12" :lg="6" v-for="clazz in clazzList" :key="clazz.id">
                    <clazz-info-card :clazz="clazz">
                    <span slot="header">
                        <el-radio v-model="transfer_form.clazz_id" :label="clazz.id">
                        <span>{{clazz.year}}{{clazz.subject|subjectName}}<span>{{clazz.grade|grade}}</span>{{clazz.term|terms}}{{clazz.class_type|classType}}</span>
                        </el-radio>
                    </span>
                    </clazz-info-card>
                </el-col>
            </el-row>
            <el-row v-show="step==1">
                <el-col style="padding:10px" :xs="24" :sm="12" :md="12" :lg="6" v-for="clazz in toClazzList" :key="clazz.id">
                    <clazz-info-card :clazz="clazz">
                    <span slot="header">
                        <el-radio v-model="transfer_form.to_clazz_id" :label="clazz.id">
                        <span>{{clazz.year}}{{clazz.subject|subjectName}}<span>{{clazz.grade|grade}}</span>{{clazz.term|terms}}{{clazz.class_type|classType}}</span>
                        </el-radio>
                    </span>
                    </clazz-info-card>
                </el-col>
            </el-row>
            <el-row v-if="step==2">
                <div class="clazz-transfer-line" style="">
                <div>
                    <p>转出班级</p>
                    <clazz-info-card :clazz="fromClazz">
                    </clazz-info-card>
                </div>
                <div>
                    <span class="el-icon-d-arrow-right text-info arrow"></span>
                </div>
                <div>
                    <p>转入班级</p>
                    <clazz-info-card :clazz="toClazz">
                    </clazz-info-card>
                </div>
                </div>
            </el-row>
            <el-row v-if="step==3" v-loading.lock="loadding">
                <h1 v-if="transfer_result&&transfer_result.code==0" class="text-center"><i class="el-icon-success text-success"></i><span>提交成功</span></h1>
                <h1 v-else class="text-center"><i class="el-icon-error text-error"></i><span>提交失败</span></h1>
            </el-row>
            <el-row>
                <div style="float:right">
                <el-button v-if="step>0 && step<3" type="" @click="preStep"><i class="el-icon-d-arrow-left">上一步</i></el-button>
                <el-button v-if="step==0" :disabled="transfer_form.clazz_id==null" type="danger" @click="nextStep(1)"><span>下一步<i class="el-icon-d-arrow-right"></i></span></el-button>
                <el-button v-if="step==1" :disabled="transfer_form.to_clazz_id==null" type="danger" @click="nextStep(2)"><span>下一步<i class="el-icon-d-arrow-right"></i></span></el-button>
                <el-button v-if="step==2" :disabled="transfer_form.to_clazz_id==null" type="danger" @click="nextStep(3)"><span>提交</span></el-button>
                <el-button v-if="step==3" type="danger" @click="nextStep(4)"><span>关闭</span></el-button>
                </div>
            </el-row>
     </el-tab-pane>
    <el-tab-pane label="转班历史" name="transfer_log">
        <div v-loading.lock="loadding">
        <el-table
      :data="transferLog.rows"
      style="width: 100%">
      <el-table-column
        label="转出班级"
        width="">
          <template slot-scope="scope">
          <div><span>{{scope.row.clazz.year}}{{scope.row.clazz.subject|subjectName}}<span>{{scope.row.clazz.grade|grade}}</span>{{scope.row.clazz.term|terms}}{{scope.row.clazz.class_type|classType}}</span></div>
           <div class="clazz-item-p1">
            <strong>{{scope.row.clazz.begin_date|formatDateTime(' M月D日')}}-{{scope.row.clazz.finish_date|formatDateTime(' M月D日')}}</strong>
            <strong>
              <span v-if="scope.row.clazz.class_type=='1'||scope.row.clazz.class_type=='2'">{{scope.row.clazz.begin_date|weekDay}}</span>
              <span v-if="scope.row.clazz.class_type=='3'||scope.row.clazz.class_type=='4'">每天</span>
              {{scope.row.clazz.class_begin_time|toShortTimeString}}-{{scope.row.clazz.class_finish_time|toShortTimeString}}
              </strong>
          </div>
          <div><span class="text-info">授课老师:</span>{{scope.row.to_clazz.teacher_name}}</div>
        </template>
      </el-table-column>
      <el-table-column
        
        label="转入班级"
        width="">
        <template slot-scope="scope">
          <div><span>{{scope.row.to_clazz.year}}{{scope.row.to_clazz.subject|subjectName}}<span>{{scope.row.to_clazz.grade|grade}}</span>{{scope.row.to_clazz.term|terms}}{{scope.row.to_clazz.class_type|classType}}</span></div>
           <div class="clazz-item-p1">
            <strong>{{scope.row.to_clazz.begin_date|formatDateTime(' M月D日')}}-{{scope.row.to_clazz.finish_date|formatDateTime(' M月D日')}}</strong>
            <strong>
              <span v-if="scope.row.to_clazz.class_type=='1'||scope.row.to_clazz.class_type=='2'">{{scope.row.to_clazz.begin_date|weekDay}}</span>
              <span v-if="scope.row.to_clazz.class_type=='3'||scope.row.to_clazz.class_type=='4'">每天</span>
              {{scope.row.to_clazz.class_begin_time|toShortTimeString}}-{{scope.row.to_clazz.class_finish_time|toShortTimeString}}
              </strong>
          </div>
          <div><span class="text-info">授课老师:</span>{{scope.row.to_clazz.teacher_name}}</div>
      </template>
      </el-table-column>
      <el-table-column
        label="操作日期">
        <template slot-scope="scope">
            {{scope.row.created_at|formatDateTime("YYYY-MM-DD H:mm")}}
          </template>
      </el-table-column>
    </el-table>
        </div>
        <div class="page-block text-center" v-if="transferLog.count>0">
        <el-pagination
        background
            @current-change="handleCurrentChange"
            layout=" prev, pager, next"
            :page-size="pageSize"
            :total="transferLog.count">
            </el-pagination>
        </div>
    </el-tab-pane>
  </el-tabs>
    </div>
</template>
<script>
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
import ClazzInfoCard from "@/components/ClazzInfoCard.vue";
import moment from "moment";
export default {
  props: {
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
      tabValue: "transfer",
      clazzList: [],
      toClazzList: [],
      //   transferLog: {},
      transfer_form: {
        clazz_id: undefined,
        to_clazz_id: undefined
      },
      transfer_result: undefined,
      loadding: false,
      page: 1,
      pageSize: 10
    };
  },
  async created() {
    await this.init();
  },
  computed: {
    ...mapState({
      current_school: state => state.current_user.current_school,
      transferLog: state => state.transfer_clazz.transferLogs.data || {}
    }),
    fromClazz() {
      return this.clazzList.find(c => c.id == this.transfer_form.clazz_id);
    },
    toClazz() {
      return this.toClazzList.find(c => c.id == this.transfer_form.to_clazz_id);
    }
  },
  methods: {
    ...mapActions({
      getStudentTransferClazzList: "getStudentTransferClazzList",
      searchClazzListToTransfer: "searchClazzListToTransfer",
      transferClazz: "transferClazz",
      getStudentTransferClazzLog: "getStudentTransferClazzLog"
    }),
    async init() {
      this.loadding = false;
      this.clazzList = [];
      this.step = 0;
      this.transfer_result = null;
      this.transfer_form = {
        clazz_id: undefined,
        to_clazz_id: undefined
      };
      this.tabValue = "transfer";
      this.page = 1;
      let clazzListRes = await this.getStudentTransferClazzList({
        student_id: this.student.id
      });
      if (clazzListRes.code > 0) {
        this.$message.error("获取学员所报班级失败");
      }
      this.clazzList = (clazzListRes.data || []).filter(
        c => c.state < 2 || c.total_lesson_number > c.current_lesson_number
      );
    },
    async preStep() {
      this.step--;
    },
    async nextStep(next) {
      this.step = next;
      if (this.step == 1) {
        const toClazzList = await this.searchClazzListToTransfer({
          clazz_id: this.transfer_form.clazz_id
        });
        if (toClazzList.code > 0) {
          this.$message.error("无法获取转入班级列表");
        } else {
          this.toClazzList = toClazzList.data || [];
        }
      }
      if (this.step == 2) {
        //do nothing
      }
      if (this.step == 3) {
        this.loadding = true;
        this.transfer_result = await this.transferClazz(
          Object.assign(this.transfer_form, { student_id: this.student.id })
        );
        this.loadding = false;
      }
      if (this.step > 3) {
        this.$emit("finished");
      }
    },
    async onTabClick(tab) {
      if (tab.name == "transfer_log") {
        this.loadding = true;
        let log = await this.getStudentTransferClazzLog({
          student_id: this.student.id,
          limit: this.pageSize,
          offset: (this.page - 1) * this.pageSize
        });
        this.loadding = false;
        if (log.code > 0) {
          this.$message.error("获取数据失败");
        }
      } else {
        await this.init();
      }
    },
    async handleCurrentChange(val) {
      this.page = val;
      this.loadding = true;
      let log = await this.getStudentTransferClazzLog({
        student_id: this.student.id,
        limit: this.pageSize,
        offset: (this.page - 1) * this.pageSize
      });
      this.loadding = false;
      if (log.code > 0) {
        this.$message.error("获取数据失败");
      }
    }
  },
  components: {
    ClazzInfoCard
  }
};
</script>
<style scoped>
.el-aside {
  border-right: none !important;
}
.clazz-transfer-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  /* justify-content: center; */
}
/* .clazz-transfer-line > div {
  flex: 1;
} */
.arrow {
  font-size: 44px;
  line-height: 44px;
}
.clazz-transfer-line .el-card {
  width: 320px;
}
.page-block {
  padding: 10px;
  margin: 0 auto;
}
</style>


