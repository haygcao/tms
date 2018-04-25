<template>
<div class="login-page">
 <el-container >
<el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" class="login-container ">
  <el-alert v-if="loginResult.error"
    :title="loginResult.message"
    type="error"
    show-icon>
  </el-alert>
  <el-form-item label="手机号" prop="mobile" label-position="labelPosition">
    <el-input type="text" v-model="loginForm.mobile"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password" label-position="labelPosition">
    <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" class="login-button" @click="submitForm('loginForm')">登录</el-button>
  </el-form-item>
</el-form>

 </el-container>
 </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapState, mapActions } from "vuex";
// import { decodeBase64 } from "@/lib/util";
export default {
  name: "home",
  data: function() {
    return {
      labelPosition: "top",
      loginForm: {
        mobile: "",
        password: "",
        rememberMe: true
      },
      loginResult: { message: "", error: false },
      rules: {
        mobile: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请输入手机号"));
              }
              let pattern = /^1[34578]\d{9}$/;
              if (pattern.test(value)) {
                callback();
              } else {
                callback(new Error("只支持中国大陆的手机号码"));
              }
            }
          }
        ],
        password: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请输入登录密码"));
              }
              return callback();
            }
          }
        ]
      },
      showLoading: false,
      startLogoShow: false
    };
  },
  components: {},
  created() {},
  mounted() {
    let ar = this.getAreas();
  },
  methods: {
    ...mapActions({
      getAreas: "getAreas"
    }),
    getPayload(token) {
      //const token = this.storage.getItem(this.tokenName);

      if (token && token.split(".").length === 3) {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace("-", "+").replace("_", "/");
          return JSON.parse(decodeBase64(base64));
        } catch (e) {}
      }
    },
    loginSuccess(res) {
      let self = this;
      this.loginResult.error=false;
      if (res.data.token) {
        self.$auth.token(self.$auth.tokenDefaultName, res.data.token);
        self.$auth.user(self.getPayload(res.data.token) || {});
      }
      // self.$auth.fetch().then(user=>{
      //   console.log(user);
      // })
      console.log(res.data);
    },
    loginError(res) {
      console.log(res);
      
      this.loginResult.message = res.response.data.error || "登录失败";
      this.loginResult.error=true;
    },
    async submitForm(formName) {
      let self = this;
      this.loginResult.error=false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var redirect = this.$auth.redirect();
          this.$auth.login({
            url: "/account/token",
            body: this.loginForm, // Vue-resource
            data: this.loginForm, // Axios
            rememberMe: this.loginForm.rememberMe,
            redirect: { name: redirect ? redirect.from.name : "default" },
            fetchUser: false,
            success: self.loginSuccess,
            error: self.loginError
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.login-container {
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 160px auto;
  width: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 10px #cac6c6;
  background: -o-linear-gradient(top, #fff, #6495ed);
}
.login-page {
  height: 100%;
  background-image: url("../assets/img/login-bg.jpg");
  background-position: center;
}
.login-button {
  width: 100%;
}
</style>
