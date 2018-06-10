<template>
    <section class="mainWrap">
        <!--s: 顶部 -->
        <div class="el-row" >
            <!-- logo -->
            <el-menu theme="dark"  @select="handleSelect" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router>
                <el-menu-item index="/home/index"><img src="../assets/scs_logo.png" /></el-menu-item>
                <el-menu-item  index="/qsshop">问卷市场</el-menu-item>
                <el-menu-item  index="/qstemplate">问卷调查模板</el-menu-item>
                <el-menu-item @click="routeTo('shop')" index=" ">积分商城</el-menu-item>
                <el-menu-item @click="routeTo('qscreate/'+userInfo.uid)"  index="  ">创建问卷</el-menu-item>
                <el-menu-item @click="routeTo('qslist/'+userInfo.uid)" index="   ">我的问卷</el-menu-item>
                <el-menu-item v-if="!isLogin" key="login" index="/login"  style="float:right">
                    <el-button type="primary"  >登录</el-button>
                </el-menu-item>
                <el-menu-item v-if="isLogin" key="cart" :index="'/cart/'+userInfo.uid" style="position:absolute;right:200px">
                    <el-button type="info" style="width:100px;height:30px;color:white;font-size:25px;line-height:10px;" size="small" class="fa fa-shopping-cart"> <span style="font-size:14px"> 购物车</span></el-button>
                </el-menu-item>
                 <el-submenu v-if="isLogin" style="float:right" index="">
                    <template slot="title">欢迎，<i class="fa fa-user-circle"></i>{{userInfo.username}}</template>
                    <el-menu-item style="color:#222;border-bottom:solid 2px deepskyblue;" :index="'/user/'+userInfo.uid"><i class="fa fa-home"></i> 我的主页</el-menu-item>
                    <el-menu-item style="color:#222;border-bottom:solid 2px deepskyblue;" index="/end"><i class="fa fa-home"></i> 后台管理</el-menu-item>
                    <el-menu-item style="color:#222;border-bottom:solid 2px deepskyblue;" :index="'/order/'+userInfo.uid"><i class="fa fa-list"></i> 兑换列表</el-menu-item>
                    <el-menu-item style="color:#222;" @click="loginOut" index=""><i class="fa fa-sign-out"></i> 退出登录</el-menu-item>
                </el-submenu>
            </el-menu> 
        </div>
        <!-- end: 顶部 -->
        <!--s: 内容区 -->
        <div  class="content">
            <div>
                <transition name="fade">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
        <!--end:内容区 -->
        <footer class="footer">
            <span>深圳阿狸花儿科技 @copyright Reserved 2018</span>
            <span>Maked By Forresyuan 毕业设计</span>
            <el-tooltip class="item" effect="dark" content="网站作者微信：袁福聪" placement="left">
                <img src="../assets/myweixin.png" alt="微信图片">
            </el-tooltip>
            <ul>
                <li @click="routeTo('foxyuan')">作者信息:YFC</li>
                <li @click="routeTo('contact')">联系我们</li>
                <li @click="routeTo('about')">关于我们</li>
            </ul>
        </footer>
    </section>
</template>

<script type="text/javascript">
    import {ajax, storage} from 'utils';
    import common from 'common';
    export default {
        name: 'home',
        data () {
            const _this = this;
            return {
                //用户信息
                userInfo: {username:'', uid:'', role:""},
                isLogin:false,
                headerCurRouter:"",
                routes:[],
                activeIndex:'/home/index',
                menu:this.$router.options.routes,
            }
        },
        created(){
            this.checkLogin();
        },
        mounted(){
            this.updateCurMenu();
        },
        methods: {
            checkLogin(){
                ajax.call(this,'/isLogin',{},(res,err)=>{
                    if(!err){
                        console.log(res)
                        this.isLogin=res.loginStatus;
                        this.userInfo.username = res.username;
                        this.userInfo.uid = res.uid;
                        this.userInfo.role= res.role;
                    }
                });
            },
            routeTo(path){
                if(this.isLogin){
                    this.$router.replace(`/${path}`)
                }else{
                    this.$router.replace('/login');
                }
            },
            //退出登录
            loginOut(){
                ajax.call(this,'/logout',{},(res, err)=>{
                    if(!err){
                        location.href='/home/index';
                    }else{
                        this.$router.replace('/500')
                    }
                });
            },
            updateCurMenu(route){
                route = route || this.$route;
                if (!route.matched.length) {
                    this.$router.replace('/*');
                    this.headerCurRouter = '/404';
                    document.title = '404 - ' + common.web_name;
                } 
            },
            handleSelect(key, keyPath) {
                this.activeIndex=key;
                console.log(key, keyPath);
            },
        },
        mixins:[common.mixin],

    }
</script>

<style lang="less" scoped>
    .mainWrap{position: relative; }
    .footer{
        position: relative;background-color: #324157;height: 100px;width:100%;color:white;font-size: 16px;padding:40px 0 0 50px;
        ul,li{width:auto;display: inline-block;list-style: none;}
        ul{float: right;padding-right:30px;}
        ul li:hover{cursor: pointer;color:dodgerblue;}
        img{position: absolute;display: inline-block;width:60px;height: 60px;right: 300px;top: 20px;}
        img:hover{transition: all 1s ease;transform: scale(2) translate(15px,-10px);}
    }
</style>
