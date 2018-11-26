<template>
     <div class="gray-bg">
            <el-row class="page-header" style="">
                <!-- <div class="page-breadcrumb clearfix">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/market/customer/1' }">客户管理</el-breadcrumb-item>
                        <el-breadcrumb-item>添加客户</el-breadcrumb-item>
                    </el-breadcrumb>
                </div> -->
                 <!-- <h2>添加客户</h2> -->
            </el-row>
            <div class="create-customer main-content">
                <el-form style="margin-left:50px"  size="small" :model="createCustomerForm" :rules="createCustomerFormRules" ref="createCustomerForm" >
                <el-row>
                <h4 class="clearfix">
                    <span>孩子信息</span>
                </h4>
                <el-card class="box-card" v-for="(studentForm ,index) in createCustomerForm.students" :key="index">
                    <i class="text-info">{{index+1}}</i>
                        <el-form-item :prop="'students.' + index + '.name'" :rules="createCustomerFormRules.student_rule.name">
                            <el-input maxlength="20" v-model="studentForm.name" placeholder="孩子姓名"></el-input>
                        </el-form-item>
                    <el-col  :xs="24" :sm="12">
                        <el-form-item  :prop="'students.' + index + '.name_en'">
                        <el-input maxlength="50" v-model="studentForm.name_en" placeholder="英文名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col  :xs="24" :sm="12">
                        <el-form-item  :prop="'students.' + index + '.nickname'">
                            <el-input maxlength="10" v-model="studentForm.nickname" placeholder="昵称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col  :xs="24" :sm="24" :md="12" :lg="12">
                        <el-form-item  :prop="'students.' + index + '.gender'" :rules="createCustomerFormRules.student_rule.gender">
                            <el-select v-model="studentForm.gender" placeholder="性别">
                                <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col  :xs="24" :sm="24" :md="12" :lg="12">
                        <el-form-item :prop="'students.' + index + '.birthday'" :rules="createCustomerFormRules.student_rule.birthday">
                        <el-date-picker  value-format="yyyy-MM-dd" type="date" placeholder="生日" v-model="studentForm.birthday"></el-date-picker>
                        </el-form-item>
                        <el-form-item> <span class="text-danger">{{studentForm.birthday|age}}</span></el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item>
                            <el-button type="" circle v-if="createCustomerForm.students.length>1" icon="el-icon-delete" @click="onRemoveStudent(index)"></el-button>
                        </el-form-item>
                    </el-col>   
                </el-card>
                <el-button size="small" plain type="primary" @click="onAddStudent()" icon="el-icon-plus">添加孩子</el-button>
                </el-row>
                
                <el-row>
                    <h4 class="clearfix">
                        <span>家长信息</span>
                    </h4>
                    
                       <el-card class="box-card" v-for="(parentForm ,index) in createCustomerForm.student_parents" :key="index">
                        <el-col  :xs="12" :sm="8" :md="6" :lg="6">
                        <el-form-item :prop="'student_parents.' + index + '.relation_type'" :rules="createCustomerFormRules.parents_rule.relation_type">
                            
                            <el-select v-model="parentForm.relation_type" :key="parentForm.id"  placeholder="与孩子关系">
                                <el-option v-for="(item,idx) in Object.keys(parentRelations)" :key="idx" :label="parentRelations[item]" :value="parseInt(item)"></el-option>
                            </el-select>
                        </el-form-item>
                        </el-col>
                         <el-col  :xs="12" :sm="16" :md="18" :lg="18">
                        <el-form-item :prop="'student_parents.' + index + '.name'" :rules="createCustomerFormRules.parents_rule.name">
                            <el-input maxlength="20" v-model="parentForm.name" placeholder="姓名"></el-input>
                        </el-form-item>
                         </el-col>
                        <el-col  :span="24">
                        <el-form-item :prop="'student_parents.' + index + '.mobile'" :rules="createCustomerFormRules.parents_rule.mobile">
                            <el-input v-model="parentForm.mobile" placeholder="手机号"></el-input>
                        </el-form-item>
                        </el-col>
                         <el-col :span="24">
                        <el-form-item :prop="'student_parents.' + index + '.email'">
                            <el-input maxlength="100" v-model="parentForm.email" placeholder="邮箱"></el-input>
                        </el-form-item>
                         </el-col>
                        <el-col  :span="24">
                        <el-form-item :prop="'student_parents.' + index + '.wechat'">
                            <el-input maxlength="50" v-model="parentForm.wechat" placeholder="微信"></el-input>
                        </el-form-item> 
                        </el-col>
                        <el-col>
                        <el-form-item>
                            <el-button type="default" circle v-if="createCustomerForm.student_parents.length>1" icon="el-icon-delete" @click="onRemoveParent(index)"></el-button>
                        </el-form-item>
                        </el-col>
                       </el-card>
                    <el-button size="small" plain type="primary" @click="onAddParent()" icon="el-icon-plus">添加家长</el-button>

                </el-row>
                <el-row>
                    <h4 class="clearfix">
                    <span>其它信息</span>
                    </h4>
                    <el-card class="box-card">
                    <el-form-item prop="employee" label="顾问" label-width="100px">
                        <el-select value-key="id" v-model="createCustomerForm.employee"  placeholder="顾问" clearable filterable>
                        <el-option v-for="item in employeeOptions" :key="item.id" :label="item.name" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="origin" label="来源" label-width="100px">
                        
                       <el-select v-model="createCustomerForm.origin" placeholder="客户来源">
                        <el-option v-for="item in channelOriginOptions" :key="item.key" :label="item.value" :value="parseInt(item.key)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label-width="100px" label="渠道" prop="market_channel_id" >
                         <el-select value-key="id" v-model="createCustomerForm.market_channel" placeholder="选择渠道">
                        <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item"></el-option>
                        </el-select>
                        <!-- <el-cascader filterable placeholder="选择渠道" :options="channelList" v-model="createCustomerForm.market_channel"  :props="channelSelectorProps"></el-cascader> -->
                    </el-form-item>
                    <el-form-item v-if="createCustomerForm.market_channel&&createCustomerForm.market_channel.market_sub_channels.length>0"  label-width="100px" label="子渠道" prop="market_sub_channel_id" >
                         <el-select value-key="id" v-model="createCustomerForm.market_sub_channel" placeholder="选择子渠道">
                        <el-option v-for="item in createCustomerForm.market_channel.market_sub_channels" :key="item.id" :label="item.name" :value="item"></el-option>
                        </el-select>
                        <!-- <el-cascader filterable placeholder="选择渠道" :options="channelList" v-model="createCustomerForm.market_channel"  :props="channelSelectorProps"></el-cascader> -->
                    </el-form-item>
                    <el-form-item prop="type" label="客户意向" label-width="100px">
                        <el-radio-group v-model="createCustomerForm.type">
                            <el-radio  v-for="item in Object.keys(customer_types)" :key="item" :label="item">{{customer_types[item]}}</el-radio>
                        </el-radio-group>
                       <!-- <el-select v-model="createCustomerForm.type" placeholder="客户意向">
                        <el-option v-for="item in Object.keys(customer_types)" :key="item" :label="customer_types[item]" :value="item"></el-option>
                        </el-select> -->
                    </el-form-item>
                    
                   <el-form-item  label-width="100px" label="地区" change-on-select prop="region" >
                        <el-cascader filterable placeholder="选择所在城市" :options="cities" v-model="createCustomerForm.region" :props="citiSelectorProps"></el-cascader>
                    </el-form-item>
                    <el-form-item prop="address" label="详细地址" label-width="100px">
                       <el-input maxlength="50" v-model="createCustomerForm.address" placeholder="详细地址,至少填写到街道或校区名称"></el-input>
                    </el-form-item>
                    
                    <el-form-item prop="referrer" label="推荐人" label-width="100px">
                       <el-input maxlength="10" v-model="createCustomerForm.referrer" placeholder="推荐人"></el-input>
                    </el-form-item>
                    
                    <el-form-item prop="description" label="备注" label-width="100px">
                       <el-input maxlength="100" type="textarea"  v-model="createCustomerForm.description" placeholder="备注"></el-input>
                    </el-form-item>
                    </el-card>
                </el-row>
                <el-row>
                    <el-form-item>
                    <el-button :loading="submitting" size="small"  type="primary" @click="onSubmit()"> &nbsp;&nbsp; 保存 &nbsp;&nbsp; </el-button>
                    <el-button size="small" plain type="default" @click="onCancel()">返回客户列表</el-button>
                    </el-form-item>
                </el-row>
                </el-form>
            </div>
        </div>
</template>
<script>
import { MarketChannelOrigin } from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      submitting: false,
      parentRelations: {
        1: "爸爸",
        2: "妈妈",
        3: "爷爷",
        4: "奶奶",
        5: "姥爷",
        6: "姥姥",
        7: "其他"
      },
      customer_types: {
        A: "A意向强烈",
        B: "B有意向",
        C: "C一般",
        D: "无效"
      },
      citiSelectorProps: {
        label: "region_name",
        value: "region_code",
        children: "children"
      },
      channelSelectorProps: {
        label: "name",
        value: "id",
        children: "market_sub_channels"
      },
      createCustomerForm: {
        origin: undefined, //{ type: "int", required: true },
        city_code: undefined, // { type: "string", required: true },
        province_code: undefined, // { type: "string", required: true },
        region: undefined,
        type: "C",
        market_channel: undefined,
        market_sub_channel: undefined,
        employee: {
          name: undefined,
          id: undefined
        },
        students: [
          {
            id: undefined,
            name: undefined,
            name_en: undefined,
            nickname: undefined,
            mobile: undefined,
            gender: undefined,
            birthday: undefined
          }
        ],
        student_parents: [
          {
            student_id: undefined,
            name: undefined,
            relation: "妈妈",
            relation_type: 2,
            mobile: undefined,
            email: undefined
          }
        ]
      },
      createCustomerFormRules: {
        region: [
          {
            required: true,
            message: "选择所在城市",
            trigger: ["blur", "change"]
          }
        ],
        origin: [
          {
            required: true,
            message: "选择来源",
            trigger: ["change"]
          }
        ],
        type: [
          {
            required: true,
            message: "选择成交意向",
            trigger: ["change"]
          }
        ],
        employee: [
          {
            required: true,
            message: "选择顾问",
            trigger: ["change"]
          }
        ],
        students: [
          {
            type: "array",
            required: true,
            message: "请至少填写一个孩子",
            trigger: "change"
          }
        ],
        student_parents: [
          {
            type: "array",
            required: true,
            message: "请至少填写一个家长",
            trigger: "change"
          }
        ],
        student_rule: {
          name: [
            {
              required: true,
              message: "请填写孩子姓名",
              trigger: ["blur", "change"]
            }
          ],
          gender: [
            {
              required: true,
              message: "请填写性别",
              trigger: ["blur", "change"]
            }
          ],
          birthday: [
            // {
            //   required: true,
            //   message: "请填写生日",
            //   trigger: ["blur", "change"]
            // },
            // {
            //   validator: (rule, value, callback) => {
            //     if (!value) {
            //       return callback(new Error("请填写生日"));
            //     }
            //     if (Date.now() - new Date(value) < 0) {
            //       return callback(new Error("请填写正确的生日"));
            //     }
            //     return callback();
            //   },
            //   trigger: "blur"
            // }
          ]
        },
        parents_rule: {
          relation_type: [{ required: true, message: "请填写与孩子的关系" }],
          name: [
            {
              required: true,
              message: "请填写家长姓名",
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
                if (this.createCustomerForm.student_parents.length > 1) {
                  let counter = this.createCustomerForm.student_parents.filter(
                    v => v.mobile == value
                  );
                  if (counter && counter.length > 1) {
                    return callback(new Error("手机号重复"));
                  }
                }
                this.getStudentParentByMobile({
                  mobile: value
                })
                  .then(res => {
                    if (res && res.code == 0 && res.data != null) {
                      return callback(new Error("家长手机号已存在"));
                    } else {
                      return callback();
                    }
                  })
                  .catch(err => {
                    return callback();
                  });
              },
              trigger: "blur"
            }
          ]
        }
      }
    };
  },

  computed: {
    ...mapState({
      schoolConsultants: state => state.school.schoolConsultants.data || [],
      channelList: state => state.market_channel.all.data || [],
      current_school: state => state.current_user.current_school,
      regions: state => state.region.regions || []
    }),
    ...mapGetters(["genders"]),
    channelOriginOptions() {
      let opts = [];
      Object.keys(MarketChannelOrigin).forEach(e => {
        opts.push({ key: e, value: MarketChannelOrigin[e] });
      });
      return opts;
    },
    employeeOptions() {
      return (this.schoolConsultants || []).map(v => {
        return { id: v.id, name: v.name };
      });
    },
    cities() {
      let province = this.regions.filter(region => region.parent_id == "1");
      let list = province.map(v => {
        return Object.assign(
          {
            children: null
          },
          v
        );
      });
      for (let i = 0; i < list.length; i++) {
        let cities = this.regions.filter(
          p => p.parent_id === list[i].region_id
        );
        if (cities) {
          list[i].children = cities;
        }
      }
      return list;
    }
  },
  async created() {
    // console.log("created+++++++++++++++++");
  },
  async mounted() {
    this.getRegions();

    this.getMarketChannelList({ school_id: this.current_school.id });
    this.getConsultants({ school_id: this.current_school.id });
  },
  methods: {
    ...mapActions({
      getRegions: "getRegions",
      getConsultants: "getConsultants",
      getMarketChannelList: "getAllMarketChannelList",
      getStudentById: "getStudentById",
      getStudentParentByMobile: "getStudentParentByMobile",
      createCustomer: "createCustomer"
    }),
    handleRegionItemChange(val) {
      //省市2级提前加载；
      //   if (val.length < 2) {
      //     return;
      //   }
      //   let province = this.region_options.find(v => v.value == val[0]);
      //   let city = province.children.find(c => c.value == val[1]);
      //   let children = this.regions.filter(r => r.parent_id == city.id);
      //   children.forEach(v => {
      //     city.children.push({
      //       label: v.region_name,
      //       value: v.region_code,
      //       id: v.region_id
      //     });
      //   });
    },
    onAddParent() {
      this.createCustomerForm.student_parents.push({
        id: undefined,
        student_id: undefined,
        name: undefined,
        relation_type: undefined,
        mobile: undefined,
        email: undefined
      });
    },
    onRemoveParent(idx) {
      this.createCustomerForm.student_parents.splice(idx, 1);
    },
    onAddStudent() {
      this.createCustomerForm.students.push({
        id: undefined,
        name: undefined,
        name_en: undefined,
        nickname: undefined,
        mobile: undefined,
        gender: undefined,
        birthday: undefined
      });
    },
    onRemoveStudent(idx) {
      this.createCustomerForm.students.splice(idx, 1);
    },

    onCancel() {
      this.$router.replace({
        path: this.$route.query.redirect || "/market/customer/1"
      });
    },
    onSubmit() {
      let self = this;
      this.submitting = true;
      this.$refs["createCustomerForm"].validate(valid => {
        if (valid) {
          let payload = self.createCustomerForm;
          payload.school_id = self.current_school.id;
          payload.province_code = payload.region[0];
          payload.city_code = payload.region[1];
          payload.market_channel_id = (payload.market_channel || {}).id;
          payload.market_sub_channel_id = (payload.market_sub_channel || {}).id;
          self
            .createCustomer(payload)
            .then(res => {
              if (res.code == 0) {
                self.$notify.success("添加成功！");
              } else {
                self.$notify.error(res.message || "添加失败！");
              }
            })
            .finally(_ => {
              this.submitting = false;
            });
        } else {
          self.$notify.error("提交失败，请检查输入信息");
          this.submitting = false;
        }
      });
    },
    beforeDestroy() {
      // console.log("beforeDestroy++++++++++")
    }
  }
};
</script>
<style lang="stylus">
.create-customer {
}

.create-customer .box-card {
    // margin: 0 auto;
    max-width: 600px;
    margin-bottom: 10px;

    & .el-input__inner {
        border-radius: 0px;
        border-top: none;
        border-left: none;
        border-right: none;
        // border-bottom: 1px solid #dcdfe6;
    }
}

.student-form .box-card .el-input__inner {
    border-radius: 0px;
    border: none;
    border-bottom: 1px solid #dcdfe6;
}

// .box-card .el-row {
// border-top: 1px dashed #DCDFE6;

// &:first-child {
// border-top: none;
// }
// }
.mt-15 {
    margin-top: 15px;
}

.ml-15 {
    margin-left: 15px;
}
</style>





