<template>
    <section class="wrap">
        <header class="header">
            <img class="thumbnail" :src="userInfo.userthumbnail" alt="">
            <ul class="baseInfo">
                <li><h3>{{qsWord}}<small style="color:#ccc;font-size:12px">我的积分：<el-tag type="success">{{score.total}}分</el-tag></small></h3></li>
                <li> <el-tag type="primary">用户名:{{userInfo.account}}</el-tag></li>
                <li><el-tag type="info">邮箱： {{userInfo.email?userInfo.email:'暂未完善'}}</el-tag></li>
                <li><el-tag type="info">手机号： {{userInfo.phone?userInfo.phone:'暂未完善'}}</el-tag></li>
                <li><el-tag type="info">地址： {{userInfo.address?userInfo.address:'暂未完善'}}</el-tag></li>
                <li><el-tag type="info">邮政编码： {{userInfo.postcode?userInfo.postcode:'暂未完善'}}</el-tag></li>
            </ul>
            <div class="infoEdit">
                <el-button type="info" size="medium"> <i class="fa fa-list"></i> 我的问卷</el-button>
                <el-button type="info" size="medium" @click="routeToOrder"><i class="fa fa-rebel"></i> 我的积分兑换</el-button>
                <el-button type="info" size="medium" @click="userinfoEdit" ><i class="fa fa-edit"></i> 编辑个人信息</el-button>
            </div>
        </header>
        <section class="section">
            <div :style="bgone"><span @click="scoreBaseInfo = true" class="button">积分基本信息</span></div>
            <div :style="bgtwo"><span @click="qsBaseInfo = true" class="button">问卷基本信息</span></div>
            <div :style="bgthree"><span @click="guide = true" class="button">操作指南</span></div>
        </section>
        <footer class="footer">
            <!-- 我的积分兑换 -->
            <!--编辑个人信息 -->
            <el-dialog title="编辑个人信息" :visible.sync="editUserInfo">
                <el-form :model="userInfo" :rules="rules" ref="editUser" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="账号" prop="account">
                        <el-input v-model="userInfo.account" :disabled="!editUserInfoisOk" placeholder="输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="userInfo.password" :disabled="!editUserInfoisOk" placeholder="输入密码">
                            <template slot="append">
                                <el-tooltip effect="dark" content="显示密码" placement="top">
                                    <i v-show="!isSeePwd" class="fa fa-eye" @click="isSeePwd = true"></i>
                                </el-tooltip>
                                <el-tooltip effect="dark" content="隐藏密码" placement="top">
                                    <i v-show="isSeePwd" class="fa fa-eye-slash" @click="isSeePwd = false"></i>     
                                </el-tooltip>
                            </template>    
                        </el-input>
                        <div v-if="isSeePwd" style="border:solid 1px #ccc;">显示密码：{{userInfo.password}}</div>
                    </el-form-item>
                    <el-form-item label="姓名" prop="realname">
                        <el-input v-model="userInfo.realname" :disabled="!editUserInfoisOk" placeholder="输入真实姓名（用户积分兑换）"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="userInfo.email" :disabled="!editUserInfoisOk" placeholder="输入邮箱号(用于积分兑换)"  ></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="phone">
                        <el-input v-model="userInfo.phone" :disabled="!editUserInfoisOk" placeholder="输入手机号（用于积分兑换）"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="userInfo.address" :disabled="!editUserInfoisOk" placeholder="输入地址（用户积分兑换）"></el-input>
                    </el-form-item>
                    <el-form-item label="邮政编码" prop="postcode">
                        <el-input v-model="userInfo.postcode" :disabled="!editUserInfoisOk" placeholder="邮政编码（用于积分兑换"></el-input>
                    </el-form-item>
                    <el-form-item label="密保设置" prop="mibao">
                        问题：<el-input v-model="userInfo.question" :disabled="!editUserInfoisOk" placeholder="输入密保问题（用于找回密码）"></el-input>
                        答案：<el-input v-model="userInfo.answer" :disabled="!editUserInfoisOk" placeholder="输入密保答案（用于找回密码）"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="" @click="editUserInfo = false;editUserInfoisOk = false">取消</el-button>
                    <el-button v-if="!editUserInfoisOk" type="success" @click="editUserInfoisOk = true">开启编辑</el-button>
                    <el-button v-if="editUserInfoisOk" type="success" @click="submitUserInfo('editUser')">提交修改</el-button>
                </div>
            </el-dialog>
            <!-- 积分基本信息 -->
            <el-dialog title="积分基本信息" :visible.sync="scoreBaseInfo">
                剩余积分：<el-input  disabled v-model="score.total"></el-input>
                已使用积分：<el-input  disabled v-model="score.used"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="scoreBaseInfo = false">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 问卷基本信息 -->
            <el-dialog title="问卷基本信息" :visible.sync="qsBaseInfo">
                我的问卷总数：<el-input  disabled v-model="score.score_total"></el-input>
                已发布问卷数：<el-input  disabled v-model="score.score_total"></el-input>
                已结束问卷数：<el-input  disabled v-model="score.score_total"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="qsBaseInfo = false">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 操作指南 -->
            <el-dialog title="操作指南" :visible.sync="guide">
               这是操作指南
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="guide = false">确 定</el-button>
                </div>
            </el-dialog>
        </footer>
    </section>
</template>
<script>
import {ajax,storage} from 'utils'
import common from 'common'
import wolf from '../../assets/wolf.jpg'
export default {
  data(){
      return {
        qsWord:'花儿问卷，花儿般多姿多彩！',
        bgone:'background:url('+require('../../assets/clock.jpg')+') 100% 100% no-repeat;',
        bgtwo:'background:url('+require('../../assets/sky.jpg')+') 100% 100% no-repeat;',
        bgthree:'background:url('+require('../../assets/wolf.jpg')+') 100% 100% no-repeat;',

        scoreBaseInfo:false,
        qsBaseInfo:false,
        guide:false,
        formLabelWidth: '120px',
        editUserInfo:false,

        //用户信息
        editUserInfoisOk:false,
        isSeePwd: false,
        userInfo:{
            uid:'',
            account:'',
            password:'',
            logthird:'',
            realname:'',
            address:'',
            postcode:'',
            email:'',
            phone:'',
            question:'',
            answer:'',
            userthumbnail:""
        },
        score:{
            total:0,
            used:0
        },
        rules: {
          account: [
            { required: true, message: '请输入账户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' }
          ]
        }
      }
  },
  methods:{
      routeToOrder(){
           this.$router.replace('/order/'+this.userInfo.uid)
      },
      //提交编辑个人信息
      submitUserInfo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let user = JSON.stringify(this.userInfo);
            ajax.call(this,'/updateUserById',{user:user},(res,err)=>{
                if(!err){
                    this.editUserInfo = false;
                    this.editUserInfoisOk = true;
                    this.$message({type:'success',message:'更新成功'})
                }
            })
          } else {
            this.$message({type:'error',message:'表单必填项存在未填。'})
            return false;
          }
        });
      },
      //打开用户信息编辑
      userinfoEdit(){ this.editUserInfo = true;},

      initUserInfo(uid){
          ajax.call(this,'/getUserInfoById',{uid:uid},(res, err)=>{
              if(!err){
                  this.userInfo = res[0];
              }else{
                  this.$router.replace('/500')
              }
          });
      },
      getUserScore(uid){
          ajax.call(this,'/getScoreById',{uid:uid},(res,err)=>{
              if(!err){
                 this.score=res[0]?res[0]:this.score;
             }else{
                 this.$router.replace('/500')
             }
          })
      }

  },
  created(){
    //   this.user_id = this.$route.params.id;
      this.initUserInfo(this.$route.params.id);
      this.getUserScore(this.$route.params.id);
  },
  mounted(){

  },
  mixins:[common.mixin]
}
</script>
<style lang="less" scoped>
    .wrap{
        padding:0;margin:0 0 10px 0;
        border-bottom:solid 1px #ccc; 
        .header{
            padding:10px;
            img.thumbnail{display:inline-block;position: relative;width:100px;border-radius: 100px;border:solid #ccc 1px;}
            .baseInfo{
                list-style: none;
                display: inline-block;
                padding:10px;
                li{font-size: 20px;}
                li:first-child{margin-bottom: 10px;}
                li:nth-child(n+2){display: inline-block;margin:20px 10px 0 5px;}
            }
            .infoEdit{
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }
        }
        .section{
            display: flex;
            justify-content: center;
            align-items: center;
            div{width:30vw;height: 300px;margin: 10px;display:flex;justify-content: center;align-items: center; border: solid 1px #ccc;
               
               span{width:80%;height:50px;display: flex;justify-content: center;align-items: center;transition: all 0.5s ease}
               span:nth-child(1){background:rgba(0,0,0,0.5);color: white;font-size:30px;}
               span:hover{color:deepskyblue;cursor:pointer;background: rgba(0,0,0,1);border-radius:15px;}
            }

        }
         
    }
</style>
