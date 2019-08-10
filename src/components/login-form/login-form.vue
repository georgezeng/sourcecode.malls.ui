<style lang="less">
  .errMsg {
    position: relative;
    top: -15px;
    color: red;
  }

  .registerBtn:hover {
    color: palevioletred;
  }

  .registerBtn {
    color: orangered;
  }
</style>
<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
      <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
      <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <span class="errMsg">{{ errorMsg }}</span>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
    <!--<a @click="go('Register')" class="registerBtn">注册</a>
    <a @click="go('ForgetPassword')" class="float-right">忘记密码?</a>-->
  </Form>
</template>
<script>

  export default {
    name: 'LoginForm',
    data() {
      let checkPassword = (rule, value, callback) => {
        this.$store.commit('showErrMsg', {msgs: ['']})
        if (value === '') {
          callback(new Error('密码不能为空'));
        } else {
          callback();
        }
      }
      return {
        form: {
          userName: '',
          password: ''
        },
        rules: {
          userName: [
            {required: true, message: '账号不能为空', trigger: 'change'}
          ],
          password: [
            {required: true, validator: checkPassword, message: '密码不能为空', trigger: 'change'}
          ]
        }
      }
    },
    computed: {
      errorMsg() {
        return this.$store.state.user.errorMsg
      }
    },
    methods: {
      handleSubmit() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.$emit('on-success-valid', {
              userName: this.form.userName,
              password: this.form.password
            })
          }
        })
      },
      go(name) {
        this.$router.push({
          name
        })
      }
    }
  }
</script>
