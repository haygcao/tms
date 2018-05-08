<template>
  <div class="classroom">
  <el-row>
      <el-form ref="form"  label-position="top" :model="form" :rules="rules" label-width="180px" class="create-form">
        <el-form-item label="教室名称" prop="name">
            <el-input :maxlength="8" v-model="form.name" placeholder="教室名称(8个字符以内)"></el-input>
        </el-form-item>
        <el-form-item label="教室面积" prop="space">
            <el-input type="number" v-model="form.space" placeholder="教室面积"><template slot="append">平米</template></el-input>
        </el-form-item>
        <el-form-item label="教室类型" prop="types">
        <el-checkbox-group v-model="form.types">
        <el-checkbox size="small" v-for="item in classroom_types" :key="item.key" :label="item.label" border=""></el-checkbox>
        </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注" prop="description">
            <el-input :maxlength="100" type="textarea" v-model="form.description" placeholder="输入备注信息，如:没有窗户..."></el-input>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
      </el-form>
  </el-row>
  </div>
</template>
<script>
import { Classroom_Type } from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  props: {
    mode: String, //'update',
    classroom: String
  },
  data() {
    return {
      form: {
        name: undefined,
        // type: undefined,
        types: [],
        description: undefined,
        space: 20
      },
      rules: {
        name: [{ required: true, message: "请输入教室名称", trigger: "blur" }],
        types: [{ required: true, message: "请选择教室类型", trigger: "blur" }],
        space: [
          { required: true, message: "请输入教室面积", trigger: "blur" },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入一个数字",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      selectedClassroom: state => state.school.selectedClassroom.data,
      current_school: state => state.current_user.current_school,
      createClassroomResult: state => state.school.createClassroomResult,
      updateClassroomResult: state => state.school.updateClassroomResult
    }),
    classroom_types() {
      return Object.keys(Classroom_Type).map(key => {
        return { key: key, label: Classroom_Type[key] };
      });
    }
  },
  watch: {
    selectedClassroom: function(val, old) {
      if (this.mode == "update" && this.classroom) {
        this.form.name = val.name;
        this.form.space = val.space;
        this.form.description = val.description;
        this.form.types = (val.type || "")
          .split(",")
          .map(v => Classroom_Type[v]);
      }
    },
    createClassroomResult(val) {
      if (val && val.code == 0) {
        this.$message.success("保存成功");
        this.$emit("created-success");
        this.resetForm();
      } else {
        this.$message.error("保存失败");
      }
    },
    updateClassroomResult(val) {
      if (val && val.code == 0) {
        this.$message.success("保存成功");
        this.$emit("updated-success");
      } else {
        this.$message.error("保存失败");
      }
    }
  },
  mounted() {
    if (this.mode == "update") {
      this.fetchClassroom({
        classroom_id: this.classroom,
        school_id: this.current_school.id
      });
    }
  },
  methods: {
    ...mapActions({
      fetchClassroom: "fetchClassroom",
      createClassroom: "createClassroom",
      updateClassroom: "updateClassroom"
    }),
    onSubmit() {
      let self = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          let payload = self.form;
          let room_types = self.classroom_types.filter(v =>
            self.form.types.includes(v.label)
          );
          if (room_types) {
            payload.room_types = room_types.map(v => v.key);
          }
          payload.school_id = this.current_school.id;
          if(typeof payload.space=='string'){
            payload.space=parseFloat(payload.space);
          }
          if (this.mode == "create") {
            this.createClassroom(payload);
            return;
          }
          if (this.mode == "update") {
            payload.id = this.classroom;
            this.updateClassroom(payload);
          }
        }
      });
    },
    
    resetForm() {
      this.$refs["form"].resetFields();
    }
  }
};
</script>
<style scoped>
.create-form {
  margin: 0 auto;
  max-width: 450px;
}
</style>


