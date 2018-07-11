<template>
  <div class="classroom">
    <el-row>
      <div class="page-breadcrumb clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>教学管理</el-breadcrumb-item>
          <el-breadcrumb-item>教室管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

    </el-row>
    <el-row>
      <el-button type="danger" @click="onAddClassroom" size="small" icon="el-icon-circle-plus-outline">新建教室</el-button>
    </el-row>
    <el-row>
      <el-card v-for="(classroom , index ) in classroomList" class="box-card" shadow="hover" :key="classroom.id">
        <div slot="header" class="clearfix" style="position: relative;">
          <span style="position: absolute;
          top: -22px;
          left: -18px;
          font-size: 24px;
          color: #ccc;">{{index+1}}</span>
          <span>{{classroom.name}}</span>
          <span style="float: right;">
            <el-tooltip effect="dark" content="修改" placement="top">
              <el-button style="padding: 3px;" @click="handleUpdateClick(classroom)" size="" type="text" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button style="padding: 3px;" @click="handleDelClick(classroom)" size="" type="text" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </span>
        </div>
        <div><span class="text-info text-small">教室类型:</span><strong> {{classroom.type|classroomType}}</strong></div>
        <p><span class="text-info text-small">教室面积:</span><strong> {{classroom.space}}<span class="text-info text-small">平米</span></strong></p>
        <div class="text-classroom-desc text-small"><span class="text-info text-small">备注:</span>
        <span :title="classroom.description"> {{classroom.description}}</span>
        </div>
      </el-card>
      <el-table v-if="false" :data="classroomList" stripe border="" style="width: 100%">

        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="name" width="150" label="教室名称">
        </el-table-column>
        <el-table-column width="200" label="教室类型">
          <template slot-scope="scope">
            {{scope.row.type|classroomType}}
          </template>
        </el-table-column>
        <el-table-column width="120" label="教室面积">
          <template slot-scope="scope">
            {{scope.row.space}}平米
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-popover placement="top" width="300" trigger="click" :content="scope.row.description">
              <p class="text-classroom-desc" slot="reference">{{scope.row.description}}</p>
            </el-popover>

          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleUpdateClick(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="handleDelClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog :visible.sync="dialogFormVisible" fullscreen center>
      <h1 slot="title">{{operate_mode=='create'?'新建':'修改'}}教室</h1>
      <add-classroom v-if="dialogFormVisible" v-bind:mode="operate_mode" :classroom="selected_id" @updated-success="onUpdated"
        @created-success="onCreated"></add-classroom>
    </el-dialog>
  </div>
</template>

<script>
import { Classroom_Type } from "@/lib/constants";
import AddClassroom from "@/views/teaching_manage/AddClassroom.vue";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      pageSize: 20,
      page: 1,
      operate_mode: "create",
      selected_id: "",
      dialogFormVisible: false
    };
  },
  computed: {
    ...mapState({
      classroomList: state => state.school.classroomList.data,
      current_school: state => state.current_user.current_school
    })
  },
  watch: {
    current_school(val, old) {
      if (val.id != old.id) {
        this.getClassroomList({
          school_id: this.current_school.id
        });
      }
    }
  },
  mounted() {
    this.getClassroomList({
      school_id: this.current_school.id
    });
  },
  methods: {
    ...mapActions({
      getClassroomList: "getClassroomList",
      removeClassroom: "removeClassroom"
    }),
    onAddClassroom() {
      //   this.$router.push({ name: "classroom_create" });
      this.operate_mode = "create";
      this.dialogFormVisible = true;
    },
    handleUpdateClick(data) {
      this.operate_mode = "update";
      this.selected_id = data.id;
      this.dialogFormVisible = true;
    },
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
    }
  },
  filters: {
    classroomType: function(value) {
      if (!value) return "";
      let v = value
        .split(",")
        .map(v => Classroom_Type[v] || "")
        .join(",");
      return v;
    }
  },
  components: {
    AddClassroom
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

// .classroom .el-row:not(:first-child) {
//   max-width: 900px;
// }


.box-card {
  width: 340px;
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 15px;
}
</style>