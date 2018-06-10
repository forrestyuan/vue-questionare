<template>
    <div class="outerBox">
     <section class="backHome">
         <router-link to="/">
            <el-button size="large" type="info"><i class="fa fa-home"></i> 返回首页</el-button>
         </router-link>
     </section>
     <section class="box">
         <h1 style="color:#555;">花儿问卷</h1>
         <div class="boxStatus">
            <span :style="!isReg?active:''" >登录</span>
            <el-switch v-model="isReg"></el-switch>
            <span :style="isReg?active:''">注册</span>
         </div>
         <div class="thirdLog">
            <el-tooltip class="item" effect="dark" content="github 账号登录" placement="top">
                <img @click="gitLog" src="../assets/github.png" alt="">
            </el-tooltip>
         </div>
         <!-- 登录 -->
         <div v-if="!isReg" class="logBox">
             <el-form  :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="70px" class="demo-ruleForm">
                <el-form-item label=" " prop="username">
                    <el-input v-model="ruleForm2.username" placeholder="请输入用户名">
                        <template slot="prepend"><i class=" fa fa-user"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item label=" " prop="pass">
                    <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" placeholder="请输入密码">
                        <template slot="prepend"><i class=" fa fa-eye-slash"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="width:200px" type="success" @click="login('ruleForm2')"> 登 录 </el-button>
                </el-form-item>
             </el-form>
         </div>
         <!-- 注册 -->
         <div v-if="isReg" class="regBox">
             <el-form :model="ruleForm3" status-icon :rules="rules3" ref="ruleForm3" label-width="70px" class="demo-ruleForm">
                <el-form-item label=" " prop="username">
                    <el-input v-model="ruleForm3.username" placeholder="请输入用户名">
                        <template slot="prepend"><i class=" fa fa-user"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item label=" " prop="pass">
                    <el-input type="password" v-model="ruleForm3.pass" auto-complete="off" placeholder="请输入密码">
                        <template slot="prepend"><i class=" fa fa-eye-slash"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item label=" " prop="checkPass">
                    <el-input type="password" v-model="ruleForm3.checkPass" auto-complete="off" placeholder="请再次输入密码">
                        <template slot="prepend"><i class=" fa fa-eye-slash"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="width:200px;" type="primary" @click="regist('ruleForm3')"> 注 册 </el-button>
                </el-form-item>
             </el-form>
         </div>
     </section>
     <img class="bg" src="../assets/loginBg.jpg" alt="">
    </div>
</template>
<script>
import {ajax, storage} from 'utils';
import common from 'common';
export default {
  data(){
      return {
        isReg:false,
        active:{color:'deepskyblue'},
        ruleForm2: {pass: '',username: ''},
        ruleForm3:{pass: '',checkPass: '',username: ''},
        rules2: {
            pass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }]
        },
        rules3: {
            pass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            checkPass: [{ required: true, message: '请再次输入密码', trigger: 'blur' }],
            username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }]
        }
    }
  },
  methods:{
      gitLog(){
          //处理第三方登录
          window.location.href=(`https://github.com/login/oauth/authorize?client_id=a50329b708fde4960520&state=ILoveFlower&redirect_uri=http://127.0.0.1:3001/api/githubOAuth`);
      },
      //提交登录表单
      login(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            ajax.call(this,'/loginValid',{username:this.ruleForm2.username,password:this.ruleForm2.pass},(res,err)=>{
                if(!err){
                    if(res.data){
                        this.$router.replace('/');
                        this.$message({type:'success',message:'登录成功！'})
                    }else{
                        this.$message({type:'error',message:'用户不存在'})
                    }
                }else{
                    this.$router.replace('/500')
                }
            })
          } else {
            this.$message({type:'error',message:'密码或用户名存在错误或空缺！！'});
            return false;
          }
        });
      },
      regist(formName){
          this.$refs[formName].validate((valid) => {
          if (valid) {
              if(this.ruleForm3.pass !== this.ruleForm3.checkPass){
                  this.error('输入的两次密码不相同！！！');
                  return;
              }
            ajax.call(this,'/registValid',{username:this.ruleForm3.username,password:this.ruleForm3.pass},(res,err)=>{
                if(!err){
                    if(res.data){
                       this.$message({type:'success',message:'注册成功，去登录吧！'})
                       this.isReg=false;
                       this.$refs[formName].resetFields();
                    }else{
                        this.$message({type:'error',message:res.message})
                    }
                }else{
                    this.$router.replace('/500')
                }
            })
          } else {
            this.$message({type:'error',message:'密码或用户名存在错误或空缺！！'});
            return false;
          }
        })
      }
    },
    mixins:[common.mixin]
}
</script>
<style lang="less" scoped>
    .outerBox{
        display: flex;justify-content: center;align-items:center;width:100vw;height:100vh;padding:0;margin:0;
        .bg{position: fixed;width: 100vw;height:100vh;z-index: -1;}
        .backHome{position: fixed;right:30px;top:40px;}
        .box{
            display: flex;justify-content: center;align-items: flex-start;background-color: #fff;padding:0;margin:0;flex-wrap: wrap;
            padding: 15px;border:solid 1px #ccc;box-shadow:4px 4px 6px 2px #222;width:400px;height:500px;margin:0 auto;
            .boxStatus{width:100%;color:#aaa;border-bottom: dotted 1px #ccc; text-align: center;padding-bottom: 10px;}
            .thirdLog{display:flex;align-items:flex-start; img{width:50px;width:50px;}img:hover{cursor: pointer;}}
            .logBox{display:flex;padding:30px 0;width: 100%;text-align: center;}
            .regBox{display:flex;padding:30px 0;width:100%;text-align: center;}
        }
    }
</style>
