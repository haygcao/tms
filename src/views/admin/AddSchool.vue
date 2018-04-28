<template>
<div>
<el-header>
<h3>创建校区</h3>
</el-header>
<el-main>
<el-form ref="form" :model="form" label-width="180px" class="create-form">
  <el-form-item label="名称" prop="name" :rules="[
      { required: true, message: '请输入名称', trigger: 'blur' },
    ]">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
   <el-form-item label="英文名称"  prop="name">
    <el-input v-model="form.name_en"></el-input>
  </el-form-item>
  <el-form-item label="所在城市"  prop="region" :rules="[
      { required: true, message: '选择所在城市', trigger: 'blur' },
    ]">
   <el-cascader filterable placeholder="选择所在城市" :options="region_options" v-model="form.region" @change="handleRegionItemChange" :props="props"></el-cascader>
  </el-form-item>
  <el-form-item label="签约日期"  prop="signed_date" :rules="[
      { required: true, message: '签约日期不能为空', trigger: 'blur' },
    ]">
      <el-date-picker type="date" placeholder="签约日期" v-model="form.signed_date" ></el-date-picker>
  </el-form-item>
   <el-form-item label="授权到期日"  prop="signed_expire_date" :rules="[
      { required: true, message: '授权到期日不能为空', trigger: 'blur' },
    ]">
      <el-date-picker type="date" placeholder="授权到期日" v-model="form.signed_expire_date" ></el-date-picker>
  </el-form-item>
  <el-form-item label="投资人"  prop="investor" :rules="[
      { required: true, message: '请填写投资人', trigger: 'blur' },
    ]">
    <el-input type="text" v-model="form.investor"></el-input>
  </el-form-item>
  <el-form-item label="手机号(用作登录账号)"  prop="mobile" :rules="[
      { required: true, message: '请填写手机号', trigger: 'blur' },
      { pattern : /^1[34578]\d{9}$/, message: '只支持中国大陆的手机号码', trigger: 'blur' },
    ]">
    <el-input type="text" v-model="form.mobile"></el-input>
  </el-form-item>
  <el-form-item label="投资人邮箱"  prop="email" :rules="[
      { type :'email', message: '请填写有效的邮箱', trigger: 'blur' },
    ]">
    <el-input type="text" v-model="form.email"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">立即创建</el-button>
  </el-form-item>
</el-form>
</el-main>
</div>
</template>


<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "create_school",
  data() {
    return {
      region_options: [],
      props: {
        label: "label",
        value: "value",
        children: "cities"
      },
      form: {
        name: "",
        name_en: "",
        region: [],
        signed_date: "",
        signed_expire_date: "",
        investor: "",
        mobile: null,
        email: null
      }
    };
  },
  computed: {
    ...mapState({
      createResult: state => state.franchisee.createResult
    }),
    ...mapGetters(["provinceList"])
  },
  created() {
    this.getRegions();
  },
  watch: {
    provinceList() {
      this.region_options = this.provinceList.slice();
    },
    createResult(c, o) {
        // debugger;
      if (c.code == 0) {
        this.$message({
          message: "恭喜你，创建成功",
          type: "success"
        });
      } else {
        this.$message.error("创建失败");
      }
    }
  },
  mounted() {},
  methods: {
    ...mapActions({
      getRegions: "getRegions",
      createFranchisee: "createFranchisee"
    }),

    handleRegionItemChange(val) {
      console.log(val);
    },
    toolTip(type, msg) {
      this.$message({
        message: msg || "恭喜你，创建成功",
        type: type || "success"
      });
    },
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let payload = this.form;
          payload.province_code = this.form.region[0];
          payload.city_code = this.form.region[1];
          this.createFranchisee(payload);
        } else {
          //   console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style>
.create-form .line {
  text-align: center;
}
</style>
