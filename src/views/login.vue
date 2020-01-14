<template>
  <div class="login">
    <div class="container">
      <img src="../assets/avatar.jpg" class='avatar' alt="">
      <el-form
        :model="loginfrom"
        :rules="rules"
        ref="loginfrom"
        class="demo-ruleForm"
      >
        <el-form-item  prop="username">
          <el-input v-model="loginfrom.username" placeholder="请输入用户名" prefix-icon='icon-user'></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginfrom.password" placeholder="请输入密码" type='password' prefix-icon='icon-key'></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type='primary' class="login-btn" @click="loginSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {login} from '@/apis/user.js'
export default {
    data(){
        return{
            loginfrom:{
                username:'10086',
                password:'123'
            },
            rules:{
                username:[
                    {required:true,message: '输入用户名', trigger: 'blur'}
                ],
                password:[
                    {required: true,message: '请输入密码', trigger: 'blur'},
                    {min: 3, max: 16, message: '请输入3-16位的密码', trigger: 'blur'}
                ]
            }
        }
    },
    methods:{
       async loginSubmit(){
        // let res = await login(this.loginfrom);
        // //console.log(res)
        // if(res.data.message === '登录成功'){
        //   localStorage.setItem('login_token',res.data.data.token)
        //   this.$router.push({name:'Index'})
        // }else{
        //   this.$message.error(res.data.message)
        // }

        this.$refs.loginfrom.validate(async valid =>{
          if(valid){
            let res = await login(this.loginfrom)
            console.log(res)
            if(res.data.message === '登录成功'){
              localStorage.setItem('login_token',res.data.data.token)
              this.$router.push({name:'Index'})
            }else{
              this.$message.error(res.data.message)
            }
          }else{
            this.$message.warning('数据输入不合法');
            return false
          }
        })
      }
    }
};
</script>

<style lang='less' scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>