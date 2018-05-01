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
  computed: {
    // ...mapGetters({
    //   loginResult: "regions"
    // })
  },
  components: {},
  created() {},
  mounted() {
    if (this.$auth.isAuthenticated()) {
      this.$auth.logout();
    }
    // let ar = this.getAreas();
  },
  methods: {
    ...mapActions({
      login: "login",
      fetchUser: "profile"
    }),
    submitForm(formName) {
      let self = this;
      this.loginResult.error = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login(this.loginForm).then(res => {
            // console.log("login=====>", res);
            if (res.token) {
              let me = {
                username: this.loginForm.mobile,
                rememberMe: this.loginForm.rememberMe
              };
              this.$auth.login(res.token, me);
              this.fetchUser();
              this.$router.replace(this.$route.query.redirect || "/");
            } else {
              this.loginResult.error = true;
              this.loginResult.message = res.message || "登录失败";
            }
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
