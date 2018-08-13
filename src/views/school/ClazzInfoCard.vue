<template>
    <el-card shadow="hover" class="box-card">
        <div slot="header" class="clearfix">
            <slot name="header">
          <span>{{clazz.year}}{{clazz.subject|subjectName}}<span class="text-warning">{{clazz.grade|grade}}</span>{{clazz.term|terms}}{{clazz.class_type|classType}}</span>

            </slot>
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
              <strong> {{clazz.student_count}}</strong>/<strong> {{clazz.student_limit||0}}</strong>
            </div>
          </div>
        </div>
        <div class="bottom clearfix">
          <span style="line-height: 20px;" :class="{'text-success':clazz.state==1}">{{clazz.state|classState}}</span>
        </div>
        <div class="footer extra">
            <slot name="footer"></slot>
        </div>
      </el-card>
</template>
<script>
export default {
  props: {
    clazz: {
      type: Object,
      default: function() {
        return {};
      }
    }
  }
};
</script>
<style scoped>
.footer{
  margin-top: 10px;
  line-height: 12px;
}
</style>


