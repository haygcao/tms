<template>
    <div>
        <el-alert v-if="getClazzError"
            title="无法获取班级信息"
            type="error"
            center
            :closable="false"
            show-icon>
        </el-alert>
       
        <el-card v-for="c in clazz.schedules" :key="c.curriculum_no" shadow="hover" style="display:inline-block;width:120px; margin:0 5px 5px 5px;text-align:center">
             <el-popover
          placement="right"
          width="300"
          trigger="click">
          <h3>调整上课时间</h3>
          <el-form size="small" :model="scheduleForm" :rules="scheduleFormRules" label-position="top" :ref="c.id">
            <el-form-item label="上课日期" prop="class_date">
                <el-date-picker type="date" :picker-options="pickerOptions" v-model="scheduleForm.class_date" value-format="yyyy-MM-dd" placeholder="上课日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="上课时间" prop="start_time">
                <el-time-select v-model="scheduleForm.start_time" :picker-options="{
                            start: '08:30',
                            step: '00:15',
                            end: '20:30'
                        }" placeholder="选择时间">
                </el-time-select>

            </el-form-item> 
            <el-form-item label="下课时间">
                <label>{{scheduleForm.end_time}}</label>
            </el-form-item>           
            <el-form-item>
                <el-button type="danger" @click="editSchedlue(scheduleForm)">确定</el-button>
              </el-form-item>
          </el-form>
          
             <a :class="{'is-disabled':c.curriculum_no<clazz.current_lesson_number}" style="display:block;position:relative" slot="reference" @click="selectSchedule(c)">
                 
                    <div style="margin-bottom:10px;" ><strong style="font-size:24px">{{c.curriculum_no}}</strong></div>
                    <el-tooltip effect="dark" content="点击调整课次时间" placement="right-end">
                        
                    <div class=""><strong>{{c.class_date|formatDateTime('MM/DD')}}</strong>
                    <div  class="text-small text-danger">{{getFestival(c.class_date)}}&nbsp;</div>
                    <div class="text-info text-small">{{c.start_time|toShortTimeString}}-{{c.end_time|toShortTimeString}}</div></div>
                    </el-tooltip>
                    
            </a>
        </el-popover>
        </el-card>
    </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
import moment from "moment";
import calendar from "@/lib/calender";
export default {
  props: {
    clazzId: { type: String }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: function(current) {
          let now = new Date();
          if (
            current.getTime() <
            new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
          ) {
            return true;
          }
          return false;
        }
      },
      clazz: {},
      getClazzError: false,
      scheduleForm: {
        clazz_id: undefined,
        curriculum_no: undefined,
        id: undefined,
        start_time: undefined,
        // end_time: undefined,
        class_date: undefined
      },
      scheduleFormRules: {
        class_date: [
          {
            required: true,
            message: "请选择上课日期",
            trigger: "blur"
          }
        ],
        start_time: [
          {
            required: true,
            message: "请选择上课时间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    "scheduleForm.start_time": {
      handler: function(val, old) {
        if (val == old) {
          return;
        }

        if (!val) {
          this.scheduleForm.end_time = undefined;
          return;
        }
        let lesson_time = this.clazz.lesson_time;
        this.scheduleForm.end_time = this.caluFinishTime(val, lesson_time);
      },
      deep: true
    }
  },
  async mounted() {
    let res = await this.getClazzById({ clazz_id: this.clazzId });
    if (res.code > 0) {
      this.getClazzError = true;
    } else {
      this.clazz = res.data;
    }
  },
  methods: {
    ...mapActions({
      getClazzById: "getClazzById",
      updateCurriculumScheduleTime: "updateCurriculumScheduleTime"
    }),
    getFestival(dateTime) {
      let lunar = this.getLunarInfo(dateTime);
      if (lunar) {
        if (lunar.isLunarFestival || lunar.isGregorianFestival) {
          return lunar.lunar;
        } else {
          return "";
        }
      } else {
      }
    },
    getLunarInfo(dateTime) {
      let y, m, d;
      let date = moment(dateTime);
      y = date.year();
      m = date.month() + 1;
      d = date.date();
      let lunarInfo = calendar.solar2lunar(y, m, d);
      let lunarValue = lunarInfo.IDayCn;
      // console.log(lunarInfo)
      let isLunarFestival = false;
      let isGregorianFestival = false;
      if (
        calendar.festival.lunar[lunarInfo.lMonth + "-" + lunarInfo.lDay] !=
        undefined
      ) {
        lunarValue =
          calendar.festival.lunar[lunarInfo.lMonth + "-" + lunarInfo.lDay];
        isLunarFestival = true;
      } else if (calendar.festival.gregorian[m + "-" + d] != undefined) {
        lunarValue = calendar.festival.gregorian[m + "-" + d];
        isGregorianFestival = true;
      }
      return {
        lunar: lunarValue,
        isLunarFestival: isLunarFestival,
        isGregorianFestival: isGregorianFestival
      };
    },

    toShortTimeString(time) {
      if (!time) return "";
      if (typeof time === "string") {
        time = "1900-01-01 " + time;
      }
      return moment(time).format("H:mm");
    },
    caluFinishTime(startTime, lesson_time) {
      let len = lesson_time;
      //     let formatStr="1970-01-01 "+startTime
      //    let date= new Date(formatStr)
      //    new Date(date.getTime()+len*60*1000).getDate()
      return moment(startTime, "HH:mm")
        .add(len, "m")
        .format("HH:mm");
      // return moment.duration(startTime).add(60, "m");
    },
    selectSchedule(c) {
      this.scheduleForm = Object.assign({}, c);
      this.scheduleForm.start_time = this.toShortTimeString(
        this.scheduleForm.start_time
      );
      this.scheduleForm.end_time = this.toShortTimeString(
        this.scheduleForm.end_time
      );
    },
    async editSchedlue(schedule) {
      let self = this;
      this.$refs[this.scheduleForm.id][0].validate(valid => {
        if (valid) {
          let payload = self.scheduleForm;
          self.updateCurriculumScheduleTime(payload).then(res => {
            if (res.code == 0) {
              this.$message.success({
                message: "保存成功"
              });
              this.getClazzById({ clazz_id: self.clazzId }).then(r => {
                if (r.code > 0) {
                  this.getClazzError = true;
                } else {
                  this.clazz = r.data;
                }
              });
            } else {
              this.$message.error({
                message: "保存失败"
              });
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.is-disabled,
.is-disabled:focus,
.is-disabled:hover {
  color: #c0c4cc;
  pointer-events: none;
  cursor: not-allowed;
  background-image: none;
  background-color: #fff;
  border-color: #ebeef5;
}
</style>


