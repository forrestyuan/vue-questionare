<template>
    <div class="outerbox" style="background:url(/static/bg.png) no-repeat ;background-size:cover;">
        <!-- 顶部信息 -->
        <section class="topinfo" >
            <h1 class="headtitle">填问卷，赚积分，兑换大礼，等着你！！！</h1><br>
            <div class="wrapsearch">
                <el-input  placeholder="请输入检索内容" v-model="searchkeyword" class="input-with-select">
                    <el-select  v-model="searchtype" slot="prepend" placeholder="请选择检索前置条件">
                        <el-option label="类别检索" value="type"></el-option>
                        <el-option label="题目检索" value="title"></el-option>
                    </el-select>
                    <el-button slot="append" class="fa fa-search" @click="searchModule()"></el-button>
                </el-input>
                <el-button  class="newwjbtn" @click="qscreate()"> <i class="fa fa-plus"></i> 创建我的问卷</el-button>
            </div>
            <div class="wjnumtip">~当前在线发布的问卷有 <h3>{{searchData.total}}</h3>套~</div>
        </section>
        <!-- 问卷列表 -->
        <section class="wjlist">
            <div v-show="!wjinfo.length" style="text-align:center;color:red"><h3>暂时没有数据</h3></div>
            <div v-show="wjinfo.length" class="left">
                <div class="item" v-for="item in wjinfo" :Key="item.qid">
                    <img class="item-img" :src="item.bgimg">
                    <div class="item-info">
                        <h2 class="item-title">{{item.title}}</h2>
                        <p class="item-desc">{{item.desc.substring(0,50)}}</p>
                        <div class="item-basicinfo">
                            <span> 状态：<el-tag type="success">{{item.status}}</el-tag></span>&nbsp;&nbsp;
                            <span>奖励：<el-tag type="success">{{item.score}}分</el-tag></span>&nbsp;&nbsp;
                            <span>分类：<el-tag type="primary">{{item.type}}</el-tag></span>&nbsp;&nbsp;
                            <span>创建：<el-tag type="warning">{{new Date(+item.createtime).toLocaleDateString()}}</el-tag></span>&nbsp;&nbsp;
                            <span>截止：<el-tag type="danger">{{new Date(+item.expiretime).toLocaleDateString()}}</el-tag></span>&nbsp;&nbsp;
                        </div>
                    </div>
                    <div class="item-btn">
                        <el-button size="medium" type="success"><a style="text-decoration:none;color:white;" target="_blank" :href="'/qsonline/'+item.uid+'/'+item.qid">填问卷,赚积分</a></el-button>
                    </div>
                </div>
                <el-pagination  @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-size="searchData.pageSize" layout="prev, pager, next, jumper" :total="searchData.total"></el-pagination>
            </div>
        </section>
    </div>
</template>

<script type="text/javascript">
    import {ajax, storage} from 'utils';
    import common from 'common';
    export default {
        name: 'qsshop',
        data () {
            return {
               searchData:{
                   page:1,
                   pageSize:15,
                   total:0,
               },
                searchtype:'title',
                searchkeyword:'',
              wjinfo:[],
            }
        },
        methods: {
            qscreate(){
                ajax.call(this,'/isLogin',{},(res,err)=>{if(!err){
                   if(res.loginStatus){
                       this.$router.replace('/qscreate/'+this.userInfo.uid)
                   }else{
                       this.$router.replace('/login')
                   }
               }})
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.initQsList('questionare',this.searchData.page,this.searchData.pageSize,'status',`'回收中'`);
            },
            searchModule(){
                console.log(this.searchtype,this.searchkeyword)
                this.initQsList('questionare',0,this.searchData.pageSize,this.searchtype,`'%${this.searchkeyword}%'`)
            },
           initQsList(table,page,pageSize,where,whereval){
               ajax.call(this,'/searchAllQS',{table,page,pageSize,where,whereval},(res,err)=>{
                   if(!err){
                       this.wjinfo = [];
                        res.res.data.forEach(val=>{
                            val.timu=JSON.parse(val.timu);
                            this.wjinfo.push(val);
                        })
                       this.searchData.page=res.res.page;
                       this.searchData.total=res.res.total;
                   }
               })
           },
        },created(){
            this.initQsList('questionare',this.searchData.page,this.searchData.pageSize,'status',`'回收中'`);
        },
        watch:{
            searchkeyword(newval,oldval){
                if(newval!=oldval){
                    this.initQsList('questionare',0,this.searchData.pageSize,this.searchtype,`'%${this.searchkeyword}%'`)
                }
            }
        },
        mixins:[common.mixin],

    }
</script>
<style lang="less" scoped>

.outerbox{
    padding:20px 100px;
    margin:0;
    .topinfo{width:1000px;margin:0 auto;
        .headtitle{font-size:30px;text-align:center; color: #555;}
        .wrapsearch{display:flex;padding: 30px 0; justify-content:center;
            .el-input{width:35%;border:2px solid #324b4e;}
            .el-select{width:105px;color:#324b4e;background:#F9F0DA}
            .el-button{ background:#F9F0DA;color:#324b4e}
            .newwjbtn{color:#F9F0DA;background:#324b4e;margin-left: 20px;}
            .el-input__inner {width: 130px;}
        }
        .wjnumtip{display:flex;justify-content:center; width:100%;color:blue;h3{color:red;}}
    }
    .wjlist{
        padding:5px;overflow: hidden;width:1000px;margin :0 auto;
        .left{
            .item{overflow: hidden;background:white;box-shadow:3px 3px 15px 1px #222;margin:5px 0;width:99%;smargin:0 auto;
                .item-img{display: inline-block;float: left;width:120px;height:120px;margin:10px;}
                .item-info{display: inline-block;float:left;margin:10px;height:120px;
                    .item-title{text-align: center;padding:5px;}
                    .item-desc{text-align: center;display: flex;justify-content: center;align-items: center;flex-wrap: wrap;}
                    .item-basicinfo{display: flex;align-items: flex-end;margin-top:20px;padding-top:10px;span{font-size: 12px;color:#888;}}
                }
                .item-btn{width:150px;display: flex;justify-content: center;align-items: center;flex-wrap:wrap;margin-top:30px;border-left:solid 1px #ccc;float:right;.el-button{margin:5px;}}
            }
        }
    }
}



</style>
