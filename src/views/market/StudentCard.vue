<template>
    <el-card shadow="hover" class="student-box-card ">
        <div class="tool-bar">
            <slot name="toolbar"></slot>
        </div>
        <div class="content student-item">
        
                <div class="col-1">
                  <img class="img-circle" :src="student.avatar_url?student.avatar_url:(student.gender==1?student_avatar_boy:student_avatar_girl)">
                  <!-- <i style="float:right" :class="[student.gender==1 ? 'icon-gender-male student-gender-male' : 'icon-gender-female student-gender-female']" class="emp-gender icon iconfont "></i> -->
                  <div class="student-fileds">{{student.name}}</div>
                  <!-- <div class="student-fileds">{{student.nickname}}</div> -->
                </div>
                <div class="col-2">
                  <div class="student-fileds"><span class="text-info">性别:</span><span>{{student.gender|gender}}</span></div>
                  <div class="student-fileds"><span class="text-info">昵称:</span><span>{{student.nickname}}</span></div>
                  <div class="student-fileds"><span class="text-info">英文名:</span><span>{{student.nickname}}</span></div>
                  <div class="student-fileds"><span class="text-info">生日:</span><span>{{student.birthday}}<span class="text-danger">({{student.birthday|age}})</span></span></div>
                </div>
        </div>
        <div class="footer extra">
            <slot name="footer"></slot>
        </div>
      </el-card>
</template>
<script>
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
      student_avatar_girl: require("@/assets/img/student_0.png"),
      student_avatar_boy: require("@/assets/img/student_1.png")
    };
  }
};
</script>
<style scoped>
.footer {
  margin-top: 10px;
  line-height: 12px;
}
.img-circle {
  background-color: #ebeef5;
  border: 1px solid #e4e7ed;
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 50%;
  text-align: center;
  vertical-align: middle;
}
.student-item {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  overflow: hidden;
  color: #606266;
  position: relative;
}

.student-item:last-child {
  margin-bottom: 0px;
}
.student-item .col-1 {
  width: 120px !important;
  text-align: center;
  border-right: 1px solid #ebeef5;
  padding-left: 0px !important;
  order: 1;
}
.student-item .col-2 {
  width: 200px;
  order: 2;
}
.student-item .col-3 {
  flex: 1;
  order: 3;
  border-right: 1px solid #ebeef5;
}
.student-item .col-4 {
  border-right: 1px solid #ebeef5;
  width: 160px !important;
  order: 1;
}
.student-item .col-5 {
  align-self: center;
  text-align: center;
  order: 5;
}
.student-item .student-fileds .fileds-title {
  width: 80px;
  display: inline-block;
}
.student-item .student-fileds .fileds-counter {
  font-size: 20px;
  line-height: 12px;
}
.student-item div[class^="col-"] {
  padding-left: 15px;
  padding-right: 15px;
  width: 200px;
}
.student-item .student-fileds {
  padding: 8px 0px;
  overflow: hidden;
  white-space: nowrap;
  word-break: normal;
  text-overflow: ellipsis;
}
.student-item:not(.disabled) .student-gender-male {
  color: #409eff;
  color: rgba(64, 158, 255, 0.5);
}

.student-item:not(.disabled) .student-gender-female {
  color: #f56c6c;
  color: rgba(245, 108, 108, 0.5);
}
.parent-item{
    padding: 10px;
}
.parent-item:not(:last-child){
    border-bottom: 1px dashed #E4E7ED;
}
.student-box-card:hover .tool-bar {
  display: block;
}
.student-box-card{
    position: relative;
}
.student-box-card .tool-bar {
  display: none;
  position: absolute;
  color: #909399;
  top: 2px;
  right: 10px;
  transition: all 0.3s;
}
</style>


