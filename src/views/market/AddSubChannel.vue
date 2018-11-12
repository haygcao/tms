<template>
    <div class="create-channel">
        <el-form size="small" :model="createForm" :rules="createRules" ref="createForm" label-width="100px">
                <el-form-item prop="parent_channel_id" label="父渠道">
                    <label>{{parent_channel.name}}</label>
                    <!-- <el-select v-model="createForm.parent_channel_id" placeholder="父渠道">
                        <el-option disabled="" :label="parent_channel.name" :value="parent_channel.id"></el-option>
                    </el-select> -->
                </el-form-item>
                <el-form-item prop="name" label="子渠道名称">
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
  props: {
    parent_channel: { type: Object, required: true }
  },
  data() {
    return {
      createForm: {
        parent_channel_id: undefined,
        name: undefined,
        state: 1
      },
      createRules: {
        parent_channel_id: [
          { required: true, message: "请选择父渠道", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入渠道名称", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 3 到 50 个字符",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请输入渠道名称"));
              }
              this.getMarketSubChannelByName({
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
  mounted() {
    this.createForm.parent_channel_id = this.parent_channel.id;
  },
  methods: {
    ...mapActions({
      createMarketSubChannel: "createMarketSubChannel",
      getMarketSubChannelByName: "getMarketSubChannelByName"
    }),
    onSubmit() {
      this.$refs["createForm"].validate(valid => {
        if (valid) {
          this.createMarketSubChannel(
            Object.assign(
              { school_id: this.current_school.id },
              this.createForm
            )
          )
            .then(res => {
              if (res && res.code == 0) {
                this.$emit("success");
              } else {
                this.$message.error(res.message || "保存失败");
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
