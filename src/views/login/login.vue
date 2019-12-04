<template>
  <div id="login">
    <h4 class="title">欢迎使用易木云</h4>
    <div class="x_input" ref="ac">
      <input
        class="int"
        placeholder="请输入用户名"
        type="text"
        v-model="account"
        @focus="foc('ac')"
        @blur="blu('ac')"
      />
      <i v-if="account" @click="account=''" class="iconfont iconqingchu" style="font-size: 0.4rem;"></i>
    </div>
    <div class="x_input" v-if="loginStyle===1" ref="pw">
      <input
        class="int"
        placeholder="请输入密码"
        :type="showPassword?'text':'password'"
        v-model="password"
        @focus="foc('pw')"
        @blur="blu('pw')"
      />
      <i
        v-if="password"
        v-show="showPassword"
        @click="showPassword=!showPassword"
        class="iconfont iconkejian"
      ></i>
      <i
        v-if="password"
        v-show="!showPassword"
        @click="showPassword=!showPassword"
        class="iconfont iconbukejian"
      ></i>
    </div>
    <div class="x_input" v-else ref="co">
      <input
        class="int i"
        placeholder="请输入验证码"
        type="password"
        @focus="foc('co')"
        @blur="blu('co')"
      />
      <div class="code">
        <p v-if="num>0">{{num}}秒</p>
        <button v-else class="codeBtn" @click="reCode">获取验证码</button>
      </div>
    </div>
    <button class="changeLS" v-if="loginStyle===1" @click="loginStyle=2">短信登录</button>
    <button class="changeLS" v-else @click="loginStyle=1">账号登录</button>
    <button class="loginBtn mainBtn" @click="login">登录</button>
    <div class="line">
      <span>第三方登录</span>
    </div>
    <div class="wxLogin">
      <i class="iconfont icon-weixingongzhonghao"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginStyle: 1,
      account: '',
      password: '',
      showPassword: false,
      canCode: false,
      num: 0,
      disabled: false,
    }
  },
  methods: {
    // 60秒后重新获取
    reCode() {
      this.canCode = true;
      this.num = 60;
      setInterval(() => {
        this.num--;
      }, 1000)
    },
    //获取焦点
    foc(e) {
      this.$refs[e].style = 'border-bottom-color:#3482EE'
    },
    //失去焦点
    blu(e) {
      this.$refs[e].style = 'border-bottom-color:#E6E6E6'
    },
    //login
    async login() {
      const res = await this.$axios.post('http://192.168.0.199:8066/wx/logins',
        {
          headers: {
            'Authorization': 'Basic eW91bXU6eW91bXU=',
          },
        })
      console.log(res)
      if (res && res.data.data) {
        this.$store.commit('login', JSON.stringify(res.data.data));
        this.$store.commit('saveRole', JSON.stringify(res.data.data));
        this.$router.push({ name: 'home' })
      } else {
        this.disabled = false;
        this.$message.error('获取权限失败！')
      }
    }
  },
  mounted() {
    let code = sessionStorage.getItem('youmuUser')
    if (code) {
      sessionStorage.clear()
    }
  }
}
</script>

<style scoped lang="scss">
#login {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.69rem;
  .title {
    font-size: 0.4rem;
    line-height: 0.4rem;
    color: #333333;
    height: 0.42rem;
    margin-bottom: 0.6rem;
  }
  .x_input {
    border-bottom: 2px solid #e6e6e6;
    margin-bottom: 0.2rem;
    position: relative;
    .int {
      height: 1rem;
      width: 100%;
      font-size: 0.23rem;
      color: #333333;
      padding: 0 0.4rem 0 0.2rem;
    }
    .int.i {
      padding-right: 1.4rem;
    }
    i {
      position: absolute;
      right: 0;
      width: 0.4rem;
      height: 1rem;
      line-height: 1rem;
      font-size: 0.3rem;
      text-align: center;
    }
    .code {
      position: absolute;
      right: 0;
      top: 0;
      width: 1.4rem;
      height: 1rem;
      line-height: 0.95rem;
      p {
        text-align: center;
        font-size: 0.25rem;
      }
    }
    .codeBtn {
      background-color: rgba(0, 0, 0, 0);
      color: #45a0e7;
      font-size: 0.28rem;
    }
  }
  .changeLS {
    background-color: #ffffff;
    color: #333333;
    font-size: 0.28rem;
    margin-bottom: 0.8rem;
  }
  .loginBtn {
    height: 0.9rem;
    width: 100%;
    border-radius: 0.9rem;
    font-size: 0.32rem;
  }
  .line {
    width: 4rem;
    height: 2px;
    margin: 2rem auto 0.5rem;
    background-color: rgba(0, 0, 0, 0.1);
    text-align: center;
    span {
      font-size: 0.24rem;
      background-color: #ffffff;
      padding-left: 0.1rem;
      padding-right: 0.1rem;
      transform: translate(-50%, -50%);
      position: absolute;
    }
  }
  .wxLogin {
    width: 100%;
    text-align: center;
    i {
      height: 0.84rem;
      display: inline-block;
      font-size: 0.95rem;
      color: #23c93e;
      text-align: center;
    }
  }
}
</style>
