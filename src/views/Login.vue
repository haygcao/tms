<template>
  <div class="login-page">
    <vue-headful title="欢迎-睿乐教育" description="睿乐教育" />
    <div class="bg-cover" :class="{'fade-in':loaded}"></div>
    <div class="login-container-wrap" :class="{'active':loaded}">
      <div class="login-container login-box-animate">
        <div class="header">
          <img class="logo" src="../assets/logo2.png">
        </div>
        <div class="login-box">
          <el-form :model="loginForm" :rules="rules" ref="loginForm">
            <div>
              <el-alert v-if="loginResult.error" :title="loginResult.message" type="error" show-icon>
              </el-alert>
            </div>
            <el-form-item prop="mobile" label-position="labelPosition">
              <el-input prefix-icon="iconfont icon-user" auto-complete="off" type="text" clearable="" placeholder="手机号" v-model="loginForm.mobile"></el-input>
            </el-form-item>
            <el-form-item prop="password" label-position="labelPosition">
              <el-input prefix-icon="iconfont icon-password" type="password" placeholder="密码" clearable v-model="loginForm.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button :loading="logining" type="danger" class="login-button" @click="submitForm('loginForm')">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
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
            },
            trigger: ""
          }
        ],
        password: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请输入登录密码"));
              }
              return callback();
            },
            trigger: ""
          }
        ]
      },
      loaded: false,
      logining:false,
    };
  },
  computed: {
    // ...mapGetters({
    //   loginResult: "regions"
    // })
  },
  components: {},
  created() {
    this.$nextTick(() => {
      if(window.login_page_loaded){
        this.loaded = true;
      }
      document.onreadystatechange = () => {
        if (document.readyState == "complete") {
          this.loaded = true;
          window.login_page_loaded=true;
        }
      };
    });
  },
  mounted() {
    if (this.$auth.isAuthenticated()) {
      this.$auth.logout();
    }
   
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
          this.logining=true;
          this.login(this.loginForm).then(res => {
             
            // console.log("login=====>", res);
            if (res.token) {
              let me = {
                username: this.loginForm.mobile,
                rememberMe: this.loginForm.rememberMe
              };
              this.$auth.login(res.token, me);
              this.fetchUser().then(user => {
                if (user.data) {
                  this.$auth.userInfo(user.data);
                }
                this.$router.replace(this.$route.query.redirect || "/");
              });
            } else {
              this.logining=false;
              this.loginResult.error = true;
              this.loginResult.message = res.message || "登录失败";
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  destroyed() {
    document.onreadystatechange = undefined;
  }
};
</script>
<style scoped>
.header {
  background-color: #d4151a;
  border-bottom: 1px solid #d4151a;
  height: 50px;
  padding: 0 20px;
  text-align: center;
}

.header .logo {
  height: 60px;
  margin-top: 10px;
}

.login-container {
  border-radius: 3px;
  background-clip: padding-box;
  margin: 160px auto;
  width: 350px;
  background: #fff;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.3);
  position: absolute;
  left: 50%;
  margin-left: -175px;
  transform: translate(-50%, 0);
}

.login-box {
  padding: 35px 35px 15px;
  transition: height 0.3s ease 0.15s;
}

.login-page {
  height: 100%;
}

.login-button {
  width: 100%;
  background-color: #d4151a;
  border-color: #d4151a;
  font-size: 20px;
  padding-top: 9px;
  padding-bottom: 9px;
  letter-spacing: 5px;
  font-weight: 400;
}

.login-button:hover {
  background-color: rgba(212, 21, 26, 0.8);
}

.bg-cover {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  background-image: url("../assets/img/login-bg.jpg");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  filter: blur(20px) drop-shadow(0px 40px 0);
  filter: progid: DXImageTransform.Microsoft.Blur(PixelRadius='20') drop-shadow(0px 40px 0);
  transition: filter 1s ease-in;
}

.fade-in {
  background-image: url("../assets/img/login-bg.jpg");
  filter: blur(0px) drop-shadow(0px 0 0);
}

.login-box-animate {
  backface-visibility: hidden;
  animation: front 0.35s linear forwards;
}

.login-container-wrap {
  display: none;
}

.login-container-wrap.active {
  display: block;
}

.active .login-box-animate {
  backface-visibility: hidden;
  animation: back 0.35s linear forwards;
}

@keyframes front {
  0% {
    transform: rotateY(0deg);
    opacity: 1;
  }

  30% {
    transform: rotateY(60deg);
  }

  70% {
    transform: rotateY(120deg);
  }

  100% {
    transform: rotateY(180deg);
    opacity: 0;
  }
}

@keyframes back {
  0% {
    transform: rotateY(-180deg);
    opacity: 0;
  }

  30% {
    transform: rotateY(-120deg);
  }

  70% {
    transform: rotateY(-60deg);
  }

  100% {
    transform: rotateY(0deg);
    opacity: 1;
  }
}
</style>