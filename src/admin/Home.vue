<template>
    <section class="mainWrap">
        <!--s: 顶部 -->
        <div class="el-row" >
            <!-- logo -->
            <el-menu theme="dark" @select="handleSelect"  :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router>
                <el-menu-item index="/end"><img src="../assets/scs_logo.png" alt="" srcset=""></el-menu-item>
                <el-menu-item  index="/admin/userlist">用户管理</el-menu-item>
                <el-submenu index="2">
                    <template slot="title">问卷</template>
                    <el-menu-item  index="/admin/questionlist">问卷管理</el-menu-item>
                    <el-menu-item  index="/admin/qstypelist">问卷类别管理</el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">商品</template>
                    <el-menu-item index="/admin/goodslist" >积分商品管理</el-menu-item>
                    <el-menu-item index="/admin/goodstypeList" >商品类别管理</el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">图库</template>
                    <el-menu-item index="/admin/pictureList" >图库管理</el-menu-item>
                </el-submenu>
                <el-submenu index="5">
                    <template slot="title">评论</template>
                    <el-menu-item index="/admin/commentList">评论管理</el-menu-item>
                </el-submenu>
                <el-submenu index="6">
                    <template slot="title">订单</template>
                    <el-menu-item index="/admin/orderList" >订单管理</el-menu-item>
                </el-submenu>
                <el-menu-item v-if="!isLogin" key="login" index="/login"  style="float:right">
                    <el-button type="primary"  >登录</el-button>
                </el-menu-item>
                 <el-submenu v-if="isLogin" style="float:right" index="">
                    <template slot="title">欢迎，<i class="fa fa-user-circle"></i>{{userInfo.username}}</template>
                    <el-menu-item style="color:#222;" index="/"><i class="fa fa-backward"></i> 前台首页</el-menu-item>
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
                userInfo: {username:'', uid:'',role:''},
                isLogin:false,
                headerCurRouter:"",
                activeIndex:'/admin/userlist',
                routes:[],
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
            handleSelect(key, keyPath) {
                this.activeIndex=key;
                console.log(key, keyPath);
            },
            checkLogin(){
                console.log('islogin')
                ajax.call(this,'/isLogin',{},(res,err)=>{
                    if(!err){
                        this.isLogin=res.loginStatus;
                        console.log(this.isLogin)
                        if(!this.isLogin){
                            this.warn('未登录')
                            this.$router.replace('/login');
                        }else if(res.role=='普通用户'){
                            this.$router.replace('/E404');
                            return;
                        }
                        this.userInfo.username = res.username;
                        this.userInfo.uid = res.uid;
                        this.userInfo.role = res.role;
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
        },
        mixins:[common.mixin],

    }
</script>

<style lang="less" scoped>
@keyColor: #ff7d2e;
@bgColor: #054572; /*#373a42;*/
    .mainWrap{position: relative; overflow: hidden;}
    .footer{
        position: relative;background-color: #324157;height: 100px;width:100%;color:white;font-size: 16px;padding:40px 0 0 50px;
        ul,li{width:auto;display: inline-block;list-style: none;}
        ul{float: right;padding-right:30px;}
        ul li:hover{cursor: pointer;color:dodgerblue;}
        img{position: absolute;display: inline-block;width:60px;height: 60px;right: 300px;top: 20px;}
        img:hover{transition: all 1s ease;transform: scale(2) translate(15px,-10px);}
    }
</style>
