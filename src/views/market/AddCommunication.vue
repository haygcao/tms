<template>
    <div v-loading="loading" element-loading-spinner="loading-index" style="padding:5px 20px;">
        <!-- <el-row><a style="float:right;padding:5px;" @click="onCancel">&times;</a></el-row> -->
        <el-form v-if="!loading" size="mini" :model="createForm" :rules="createFormRules" ref="createForm" label-width="100px" >
            <el-form-item prop="student_id" label="孩子">
                <el-radio-group v-model="createForm.student_id"  >
                <el-radio v-for="item in customer.students" :key="item.id" :label="item.id" border>{{item.name}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="student_parent_id" label="家长">
                <el-radio-group v-model="createForm.student_parent_id">
                <el-radio v-for="item in customer.student_parents" :key="item.id" :label="item.id" border>{{item.name}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="communication_type" label="沟通方式">
                <el-radio-group v-model="createForm.communication_type">
                <el-radio  v-for="item in Object.keys(communication_types)" :key="item" :label="parseInt(item)">{{communication_types[item]}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="customer_type" label="客户意向">
                <el-radio-group v-model="createForm.customer_type">
                    <el-radio  v-for="item in Object.keys(customer_types)" :key="item" :label="item">{{customer_types[item]}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="content" label="沟通内容">
                <el-input maxlength="100" type="textarea"  v-model="createForm.content" placeholder="如客户意向为’无效‘，请相惜描述沟通内容"></el-input>
            </el-form-item>
            <el-form-item prop="next_communication_time" label="提醒日期">
                <el-date-picker
                v-model="createForm.next_communication_time"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions1">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  props: {
    customer_id: { type: String, required: true }
  },
  data() {
    return {
      submitting: false,
      loading: true,
      customer: undefined,
      createForm: {
        communication_type: 0,
        student_name: undefined,
        student_id: undefined,
        student_parent_id: undefined,
        student_parent_name: undefined,
        content: undefined,
        customer_type: undefined,
        next_communication_time: undefined
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        shortcuts: [
          {
            text: "明天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "下周",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      createFormRules: {
        communication_type: [
          {
            required: true,
            message: "选择沟通方式",
            trigger: ["change"]
          }
        ],
        customer_type: [
          {
            required: true,
            message: "选择客户意向",
            trigger: ["change"]
          }
        ],
        student_id: [
          {
            required: true,
            message: "选择成交意向",
            trigger: ["change"]
          }
        ],
        student_parent_id: [
          {
            required: true,
            message: "选择家长",
            trigger: ["change"]
          }
        ]
      },
      communication_types: {
        0: "电话",
        1: "面谈",
        2: "QQ",
        3: "微信",
        4: "其它"
      },
      customer_types: {
        A: "A意向强烈",
        B: "B有意向",
        C: "C一般",
        D: "无效"
      }
    };
  },
  computed: {
    ...mapState({
      //   schoolConsultants: state => state.school.schoolConsultants.data || [],
      current_school: state => state.current_user.current_school
    })
  },
  async mounted() {
    this.loading = true;
    try {
      let res = await this.getCustomerById({
        id: this.customer_id,
        school_id: this.current_school.id
      });
      if (res && res.code == 0) {
        this.customer = res.data;
        this.createForm.student_id=this.customer.students[0].id;
        this.createForm.student_parent_id=this.customer.student_parents[0].id;
      } else {
        this.customer = null;
      }
    } catch (err) {
      this.customer = null;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    ...mapActions({
      //   getRegions: "getRegions",
      getCustomerById: "getCustomerById",
      createCommunication: "createCommunication"
    }),
    onSubmit() {
      let self = this;
      this.submitting = true;
      this.$refs["createForm"].validate(valid => {
        if (valid) {
          let payload = self.createForm;
          payload.customer_id=this.customer_id;
          payload.school_id = self.current_school.id;
          payload.student_name = this.customer.students.find(
            v => v.id == payload.student_id
          ).name;
          payload.student_parent_name = this.customer.student_parents.find(
            v => v.id == payload.student_parent_id
          ).name;
          self
            .createCommunication(payload)
            .then(res => {
              if (res.code == 0) {
                self.$emit("create-success");
              } else {
                self.$emit("create-error");
              }
            })
            .catch(error => {
                self.$emit("create-error");
            })
            .finally(_ => {
              this.submitting = false;
            });
        } else {
          this.submitting = false;
        }
      });
    },
    onCancel() {
      this.$emit("cancel");
    }
  }
};
</script>

