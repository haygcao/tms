<template>
    <div class="create-channel">
        <el-form size="small" :model="createForm" :rules="createRules" ref="createForm" label-width="100px">
                <el-form-item prop="origin" label="来源">
                    <el-checkbox-group v-model="createForm.origin" clearable placeholder="来源">
                        <el-checkbox v-for="item in channelOriginOptions" :key="item.key" :label="item.key">{{item.value}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item prop="name" label="渠道名称">
                    <el-input v-model="createForm.name"  :maxlength="10" placeholder="渠道名称"></el-input>
                </el-form-item>
                <el-form-item prop="state" label="是否启用">
                    <el-radio-group v-model="createForm.state">
                        <el-radio :label="0">禁用</el-radio>
                        <el-radio :label="1">启用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click.stop="onSubmit">保存</el-button>
                </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { MarketChannelOrigin } from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      createForm: {
        origin: [],
        name: undefined,
        state: 1
      },
      createRules: {
        name: [
          { required: true, message: "请输入渠道名称", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请输入渠道名称"));
              }
              this.getMarketChannelByName({
                name: value,
                school_id: this.current_school.id
              }).then(res => {
                if (res && res.code == 0 && res.data) {
                  return callback(new Error("渠道名称已存在"));
                } else {
                  return callback();
                }
              });
            },
            trigger: "blur"
          }
        ],
        origin: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个来源",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      current_school: state => state.current_user.current_school
    }),
    channelOriginOptions() {
      let opts = [];
      Object.keys(MarketChannelOrigin).forEach(e => {
        opts.push({ key: e, value: MarketChannelOrigin[e] });
      });
      return opts;
    }
  },
  methods: {
    ...mapActions({
      createMarketChannel: "createMarketChannel",
      getMarketChannelByName: "getMarketChannelByName"
    }),
    onSubmit() {
      this.$refs["createForm"].validate(valid => {
        if (valid) {
          this.createMarketChannel(
            Object.assign(
              { school_id: this.current_school.id },
              this.createForm
            )
          )
            .then(res => {
              if (res && res.code == 0) {
                this.$emit("success");
              } else {
                this.$message.error("保存失败");
              }
            })
            .catch(e => {
              this.$message.error("保存失败");
            });
        }
      });
    }
  }
};
</script>
