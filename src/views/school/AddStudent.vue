<template>
     <div class="student-form">
       <slot name="title"></slot>
            <div class="box-card">
                <el-form size="small" :inline="true" :model="createStudentForm" :rules="createStudentFormRules" ref="createStudentForm" >
                <el-row>
                <h4 class="clearfix">
                    <span>手机号</span><small class="text-info ml-15"><i class="el-icon-info"></i>用于登录睿乐应用的唯一账号</small>
                </h4>
                
                    <el-form-item v-if="mode=='create'" prop="mobile" :inline-message="true">
                        <el-input v-model="createStudentForm.mobile" style="width:280px;" placeholder="填写一个家长手机号用于登录睿乐应用"></el-input>
                    </el-form-item>
                    <el-form-item v-if="mode!='create'" prop="mobile" :inline-message="true">
                        <label>{{createStudentForm.mobile}}</label>
                    </el-form-item>
                </el-row>
                <el-row>
                <h4 class="clearfix">
                    <span>孩子信息</span>
                </h4>
                    <el-col :span="24">
                    <el-form-item prop="name">
                        <el-input v-model="createStudentForm.name" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item prop="name_en">
                        <el-input v-model="createStudentForm.name_en" placeholder="英文名"></el-input>
                    </el-form-item>
                    <el-form-item prop="nickname">
                        <el-input v-model="createStudentForm.nickname" placeholder="昵称"></el-input>
                    </el-form-item>
                    <el-form-item prop="gender">
                        <el-select style="width:178px;" v-model="createStudentForm.gender" placeholder="性别">
                            <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="birthday">
                        <el-date-picker style="width:178px;" value-format="yyyy-MM-dd" type="date" placeholder="生日" v-model="createStudentForm.birthday"></el-date-picker>
                    </el-form-item>
                    <el-form-item> <span class="text-danger">{{createStudentForm.birthday|age}}</span></el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <h4 class="clearfix">
                        <span>家长信息</span>
                    </h4>
                       <el-col :span="24" v-for="(parentForm ,index) in createStudentForm.parents" :key="index">
                        <el-form-item :prop="'parents.' + index + '.relation'" :rules="[{required:true, message:'请填写与孩子的关系'}]">
                            <el-select style="width:178px;" v-model="parentForm.relation" placeholder="与孩子关系">
                                <el-option v-for="item in parentRelations" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :prop="'parents.' + index + '.name'" >
                            <el-input v-model="parentForm.name" placeholder="姓名"></el-input>
                        </el-form-item>
                        <el-form-item :prop="'parents.' + index + '.mobile'" :rules="[{required:true, message:'请填写家长的联系电话'}]">
                            <el-input v-model="parentForm.mobile" placeholder="手机号"></el-input>
                        </el-form-item>
                        <el-form-item :prop="'parents.' + index + '.email'">
                            <el-input v-model="parentForm.email" placeholder="邮箱"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="danger" @click="onAddParent()" icon="el-icon-plus"></el-button>
                            <el-button type="default" v-if="createStudentForm.parents.length>1" icon="el-icon-minus" @click="onRemoveParent(index)"></el-button>
                        </el-form-item>
                       </el-col>
                </el-row>
                <el-row>
                    <div class="mt-15">
                    <el-button size="medium"  type="primary" @click="onSubmit()"> &nbsp;&nbsp; 保存 &nbsp;&nbsp; </el-button>
                    <el-button size="medium" type="" @click="onCancel()">取消</el-button>
                    </div>
                </el-row>
                </el-form>
            </div>
        </div>
</template>
<script>
import { ClassType, SubjectName, Terms, Grade } from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  props: {
    school: String,
    studentId: String,
    mobile: String,
    mode: String
  },
  data() {
    return {
      parentRelations: ["爸爸", "妈妈", "爷爷", "奶奶", "姥爷", "姥姥", "其他"],
      //   parentForm:{},
      createStudentForm: {
        id: undefined,
        name: undefined,
        name_en: undefined,
        nickname: undefined,
        mobile: undefined,
        gender: undefined,
        birthday: undefined,
        parents: [
          {
            student_id: undefined,
            name: undefined,
            relation: "妈妈",
            mobile: undefined,
            email: undefined
          }
        ]
      },
      createStudentFormRules: {
        name: [
          {
            required: true,
            message: "请填写孩子姓名",
            trigger: "blur，change"
          }
        ],
        gender: [
          {
            required: true,
            message: "请填写性别",
            trigger: "blur"
          }
        ],
        birthday: [
          {
            required: true,
            message: "请填写生日",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请填写生日"));
              }
              if (Date.now() - new Date(value) < 0) {
                return callback(new Error("请填写正确的生日"));
              }
              return callback();
            },
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请填写手机号",
            trigger: "blur"
          },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "只支持中国大陆手机号码",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请输入手机号"));
              }
              if (this.mode != "create") {
                return callback();
              }
              this.checkStudentExist({
                mobile: value
              }).then(res => {
                if (res && res.code == 0 && res.data != null) {
                  return callback(new Error("该学员已存在，请更换一个手机号"));
                } else {
                  return callback();
                }
              });
            },
            trigger: "blur"
          }
        ]
      }
    };
  },

  computed: {
    ...mapState({
      student: state => state.student.current.data || {},
      current_school: state => state.current_user.current_school
    }),
    ...mapGetters(["genders"])
  },
  created() {
    console.log("created+++++++++++++++++")
    let self = this;
    if (this.mode != "create") {
      this.getStudentById({ id: this.studentId }).then(res => {
        if (res.data) {
          self.createStudentForm.id = res.data.id;
          self.createStudentForm.mobile = res.data.mobile;
          self.createStudentForm.gender = res.data.gender;
          self.createStudentForm.name = res.data.name;
          self.createStudentForm.name_en = res.data.name_en;
          self.createStudentForm.birthday = res.data.birthday;
          self.createStudentForm.nickname = res.data.nickname;
          if (res.data.parents) {
            for (let i = 0; i < res.data.parents.length; i++) {
              self.createStudentForm.parents.unshift(res.data.parents[i]);
              self.createStudentForm.parents.pop();
            }
          }
        }
      });
    }
  },
  methods: {
    ...mapActions({
      getStudentById: "getStudentById",
      checkStudentExist: "checkStudentExist",
      createStudent: "createStudent",
      updateStudent: "updateStudent",
      addStudentParent: "addStudentParent"
    }),
    onAddParent() {
      this.createStudentForm.parents.push({
        id: undefined,
        student_id: undefined,
        name: undefined,
        relation: undefined,
        mobile: undefined,
        email: undefined
      });
    },
    onRemoveParent(idx) {
      this.createStudentForm.parents.splice(idx, 1);
    },
    onCancel() {
      this.$emit("cancel");
    },
    onSubmit() {
      if (this.mode == "create") {
        this.onSubmitCreateStudent();
      } else {
        this.onUpdateStudent();
      }
    },
    onUpdateStudent() {
      let self = this;
      this.$refs["createStudentForm"].validate(valid => {
        if (valid) {
          let payload = self.createStudentForm;
          payload.school_id = self.school || self.current_school.id;

          self.updateStudent(payload).then(res => {
            if (res.code == 0) {
              self.$message.success("保存成功！");
              self.$emit("success", self.createStudentForm.mobile);
            } else {
              self.$message.error(res.message || "保存失败！");
            }
          });
        }
      });
    },
    onSubmitCreateStudent() {
      let self = this;

      this.$refs["createStudentForm"].validate(valid => {
        if (valid) {
          let payload = self.createStudentForm;
          payload.school_id = self.school || self.current_school.id;

          self.createStudent(payload).then(res => {
            if (res.code == 0) {
              self.$message.success("添加学员成功！");
              self.$emit("success", self.createStudentForm.mobile);
            } else {
              self.$message.error(res.message || "添加学员失败！");
            }
          });
        }
      });
    },
    
    beforeDestroy() {
      console.log("beforeDestroy++++++++++")
    }
  }
};
</script>
<style lang="stylus" scoped>
.box-card {
  margin: 0 auto;
  max-width: 1024px;
}

.box-card .el-row {
  border-top: 1px dashed #DCDFE6;

  &:first-child {
    border-top: none;
  }
}

.mt-15 {
  margin-top: 15px;
}

.ml-15 {
  margin-left: 15px;
}
</style>





