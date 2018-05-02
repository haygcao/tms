<template>

<div v-if="current_franchisee.data!=null" class="admin-form">
    <el-row >
        <h3><label class="back"  @click="goback()"><i class="el-icon-back"></i>返回</label></h3>
    </el-row>
    <el-row>
        <el-form ref="form" :model="form" label-width="180px" class="create-form">
        <el-form-item label="商户" >
           <label >{{current_franchisee.data.name}}</label>
        </el-form-item>
        <el-form-item label="名称" prop="name" :rules="[
            { required: true, message: '请输入名称', trigger: 'blur' },
            ]">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="所在城市"  prop="region" :rules="[
            { required: true, message: '选择所在城市', trigger: 'blur' },
            ]">
        <el-cascader filterable placeholder="选择所在城市" :options="region_options" v-model="form.region" @active-item-change="handleRegionItemChange" :props="props"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"  prop="address" :rules="[
            { required: true, message: '请输入详细地址', trigger: 'blur' },
            ]">
            <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="签约日期"  prop="signed_date" :rules="[
            { required: true, message: '签约日期不能为空', trigger: 'blur' },
            ]">
            <el-date-picker  value-format="yyyy-MM-dd" type="date" placeholder="签约日期" v-model="form.signed_date" ></el-date-picker>
        </el-form-item>
        <el-form-item label="授权到期日"  prop="signed_expire_date" :rules="[
            { required: true, message: '授权到期日不能为空', trigger: 'blur' },
            ]">
            <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="授权到期日" v-model="form.signed_expire_date" ></el-date-picker>
        </el-form-item>
        <el-form-item label="校区创办日期" prop="founding_date">
            <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="校区创办日期" v-model="form.founding_date" ></el-date-picker>
        </el-form-item>
        <el-form-item label="联系人"  prop="contact">
            <el-input type="text" placeholder="校区联系人" v-model="form.contact"></el-input>
        </el-form-item>
        <el-form-item label="联系电话"  prop="contact_tel">
            <el-input type="text" v-model="form.contact_tel" placeholder="(多个电话以“,”分割)"></el-input>
        </el-form-item>
        <el-form-item label="城市等级"  prop="level">
            <el-select v-model="form.level" placeholder="选择城市等级">
                <el-option
                v-for="item in city_level_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button><el-button type="default" @click="goback">返回</el-button>
        </el-form-item>
        </el-form>
    </el-row>

</div>
</template>


<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "create_school",
  data() {
    return {
      region_options: [],
      city_level_options: [
        { label: "L1", value: 1 },
        { label: "L2", value: 2 },
        { label: "L3", value: 3 }
      ],
      props: {
        label: "label",
        value: "value",
        children: "children"
      },
      form: {
        name: "",
        region: [],
        signed_date: null,
        signed_expire_date: null,
        founding_date: null,
        contact: "",
        contact_tel: undefined,
        level: 1,
        address: undefined
      },
      franchisee_id: ""
    };
  },
  computed: {
    ...mapState({
      regions: state => state.region.regions,
      createResult: state => state.franchisee.createSchoolResult,
      current_franchisee: state => state.franchisee.current_franchisee
    })
  },
  created() {
    this.getRegions();
    this.getFranchisee({ franchisee_id: this.$route.params.franchisee_id });
  },
  watch: {
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
  mounted() {
    if (
      this.current_franchisee.data == null ||
      this.current_franchisee.data.id == null
    ) {
      return this.$router.replace({ name: "404" });
    }
    this.region_options = this.getProvinceList();
    this.franchisee_id=this.current_franchisee.data.id;
  },
  methods: {
    ...mapActions({
      getRegions: "getRegions",
      addSchool: "addSchool",
      getFranchisee: "getFranchisee"
    }),
    goback() {
      this.$router.push({
        name: "franchisee_detail",
        params: this.$router.params
      });
    },
    getProvinceList() {
      let province = this.regions.filter(region => region.parent_id == "1");
      let list = province.map(v => {
        return {
          label: v.region_name,
          value: v.region_code,
          id: v.region_id,
          children: []
        };
      });
      for (let i = 0; i < list.length; i++) {
        let cities = this.regions.filter(p => p.parent_id === list[i].id);
        list[i].children = cities.map(v => {
          return {
            label: v.region_name,
            value: v.region_code,
            id: v.region_id,
            children: []
          };
        });
      }
      return list;
    },
    handleRegionItemChange(val) {
      //省市2级提前加载；
      if (val.length < 2) {
        return;
      }
      let province = this.region_options.find(v => v.value == val[0]);
      let city = province.children.find(c => c.value == val[1]);
      let children = this.regions.filter(r => r.parent_id == city.id);
      children.forEach(v => {
        city.children.push({
          label: v.region_name,
          value: v.region_code,
          id: v.region_id
        });
      });
    },
    toolTip(type, msg) {
      this.$message({
        message: msg || "恭喜你，创建成功",
        type: type || "success"
      });
    },
    onSubmit() {
      let self = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          let payload = self.form;
          let province = self.region_options.find(
            r => r.value == self.form.region[0]
          );
          let city = province.children.find(r => r.value == self.form.region[1]);
          let area = city.children.find(r => r.value == self.form.region[2]);
          payload.province_code = province.value;
          payload.province_name = province.label;
          payload.city_code = self.form.region[1];
          payload.city_name = city.label;
          payload.area_code = self.form.region[2];
          payload.area_name = area.label;
          payload.franchisee_id = self.franchisee_id;
          self.addSchool(payload);
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
.admin-form .el-form {
  max-width: 600px;
}
.admin-form .create-form .el-cascader {
  width: 100%;
}
</style>
