<template>
  <section>
      <!--轮播图 -->
      <div>
        <el-carousel :interval="5000" arrow="always">
          <el-carousel-item style="background:black" v-for="item in lunboContent" :key="item.title">
            <img style="position:absolute;right:3px;top:-35px;z-index:1" src="../assets/qss_header.png" alt="">
            <h2 style="position:absolute;left:150px; top:100px;z-index:5;color:#ccc;">
              {{ item.title }}<br/><br/>
              <small>{{item.subtitle}}</small>
            </h2>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- 层级 -->
      <div class="layer">
        <span style="display:inline-block;font-size:40px;color:deepskyblue">{{userNum}}</span>
        <span style="font-size:20px;color:#777;">个用户正在使用</span>
        <el-button style="float:right;" type='primary' @click="goUse()">马上使用</el-button>
      </div>
      <!-- 层级 -->
      <div class="layer">
        <div class="wrapIntro">
            <div class="imgLeft"><img src="../assets/survey.png" alt="花儿问卷"></div>
            <div class="wordRight">
                <h1>花儿问卷调查</h1>
                <p>在线问卷调查既复杂又简单，我们将诸多强大的功能集成到系统中，把最好的用户体验交给您。</p>
                <div class="wordRight_list">
                  <ul>
                    <li><i class="fa fa-map-marker"></i> 轻松创建问卷</li>
                    <li><i class="fa fa-map-marker"></i> 高效发布问卷</li>
                    <li><i class="fa fa-map-marker"></i> 问卷回收便捷</li>
                  </ul>
                  <ul>
                    <li><i class="fa fa-map-marker"></i> 原始数据下载</li>
                    <li><i class="fa fa-map-marker"></i> 自动生成图表</li>
                  </ul>
                  <div class="wordRight_btn">
                    <el-button type="info">了解花儿问卷</el-button>
                  </div>
                </div>
            </div>
        </div>
      </div>
      <!-- 层级 -->
      <div class="layer">
        <el-card class="box-card">
          <el-row style="text-align:right;">
            <el-button style="float:left" type="text">在线问卷</el-button>
            <router-link to="/home/qsshop"> 查看更多>>></router-link>
          </el-row>
          <el-row>
            {{questionList.length?'':'暂无问卷'}}
            <el-col style="border:solid 1px #ccc;padding:10px;margin:5px 0" v-for="item in questionList" :span="16" :key="item.id">
              <img style="width:140px;hegith:140px;" :src="item.bgimg">
              <div class="questionList" >
                  <a style="color:white;text-decoration:none;" target="_blank" :href="'/qsonline/'+item.uid+'/'+item.qid">
                    <span class="title">{{item.title}}</span>
                  </a>
                  <div style="font-size:12px;color:#555;margin:10px 0">{{item.desc.substring(0,100)}}....</div>
                  <div class="info">
                    <span>状态:<span>{{item.status}}</span></span>/
                    <span>类别: <span>{{item.type}}</span></span> /
                    <span>悬赏积分: <span>{{item.score}}</span></span>
                  </div>
              </div>
            </el-col>
            <el-col :span="7">
              <div class="create-survey dashed-box"><br>
                <div class="count">
                  <span><strong>累计问卷</strong><i>{{total}}</i><b>份</b></span>
                </div>
                <div class="btn-line"><a class="create-survey-btn" @click="goUse()">免费创建一份问卷</a></div><br>
                <img style="width:100%;" src="/static/right.jpg" >
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <!-- 层级 tab -->
      <!-- <div class="layer">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-size:18px;color:#222;">问卷模板</span>
            <el-button @click="moreTemplate" style="float: right; padding: 3px 0" type="text"><router-link to="/home/qstemplate">查看更多>>></router-link></el-button>
          </div>
          <el-row >
            <el-col v-for="item in tabList" :span="3"  :key="item.path" :offset="1">
              <el-card :body-style="templateStyle">
                <div class="templateTabWrap" >
                  <img :src="item.imgSrc" class="image">
                  <router-link :to="item.path">
                    <span class="templateTab">{{item.title}}</span> 
                  </router-link>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </div> -->
      <!-- 层级 兑换 -->
      <div class="layer">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-size:18px;color:#222;">热门积分兑换</span>
            <el-button @click="moreExchange" style="float: right; padding: 3px 0" type="text">查看更多>>></el-button>
          </div>
          <el-row >
            {{exchangeList.length?'':'暂无商品'}}
            <el-col v-for="item in exchangeList" :span="3"  :key="item.gid" :offset="1">
              <el-card :body-style="exchangeStyle">
                <div class="templateTabWrap" >
                  <img :src="item.imgUrl" class="image">
                  <router-link :to="'/home/goodsdetail/'+item.gid">
                    <span class="templateTab" style="color:red; font-size:14px;">{{item.title}}</span> 
                  </router-link>
                  <div class="bottomtip"><span>积分:{{item.score}}</span><span>人气:{{item.buyers}}</span></div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </div>
  </section>
</template>
<script type="text/javascript">
    import {ajax,storage} from 'utils';
    import common from 'common';
    module.exports = {
        name: 'index',
        data() {
            return {
              userNum:0,
              total:0,
              //轮播图内容
              lunboContent:[
                {title:'问卷调研服务',subtitle:'真实样本用户，快速回收问卷数据，调研数据真实、可靠'},
                {title:'免费简约的问卷系统',subtitle:'所有功能全部免费，简约好用，轻松开启在线调查'},
                {title:'多方式创建编辑问卷',subtitle:'自由创建，使用模板,方式随意选择'},
                {title:'数据可视化',subtitle:'回收数据在线统计，图表化展示，清晰直观'},
              ],
              //问卷列表 6个
              questionList:[],
                //兑换信息 6个
                exchangeStyle:{ padding: '15px 0',height:'150px',textAlign:'center' },
                exchangeList:[]
            }
        },
        methods:{
          //查看更多模板
          moreTemplate(){this.$router.replace('/qstemplate')},
          //更对兑换
          moreExchange(){this.$router.replace('/shop') },
          //立即使用
          goUse(){
            ajax.call(this,'/isLogin',{},(res,err)=>{
              if(!err){
                if(res.loginStatus){
                  this.$router.replace('/qscreate/'+res.uid);
                }else{this.$router.replace('/login');}
              }
            })
          },
          countUser(){ajax.call(this,'/userCount',{},(res,err)=>{if(!err){ this.userNum = res.data; }})},
          initQsList(){
            ajax.call(this,'/searchAllQS',{table:'questionare',page:1,pageSize:6,where:'status',whereval:`'回收中'`},(res,err)=>{
              if(!err){ this.questionList=res.res.data;}
            })
          },
          initQsCount(){
            ajax.call(this,'/countQs',{},(res,err)=>{if(!err){this.total=res.res[0].total}});
          },
          initGoodsList(){
            ajax.call(this,'/searchAllGoods',{page:1,pageSize:6},(res,err)=>{
              if(!err){ this.exchangeList=res.res.data;}
            });
          }
        },
        created(){
          this.countUser();
          this.initQsList();
          this.initGoodsList();
          this.initQsCount();
        },
        mixins:[common.mixin]
    }
</script>
<style lang="less" scoped>
  a{text-decoration: none;}
  .el-carousel__item h3 { color: #475669; font-size: 18px; opacity: 0.75;line-height: 300px; margin: 0;}
  .el-carousel__item:nth-child(2n) { background-color: #99a9bf;}
  .el-carousel__item:nth-child(2n+1) {background-color: #d3dce6; }
  .layer{
    padding:20px 8%; height: auto;overflow:hidden;
    .wrapIntro{ overflow: hidden;
      .imgLeft{ float: left; width: 50%; }
      .wordRight{
        float:right; width: 50%;padding: 20px;color:#888;
        h1{ font-size: 2em;padding: 10px;}
        p{ display: inline-block; height: auto; line-height: 1.6em;}
        .wordRight_list{
          ul,li{ display: inline-block; list-style: none; }
          ul{ margin: 10px; width: 150px; }
          li{ margin: 5px; color:#888; font-size: 16px; font-weight:600}
        }
        .wordRight_btn{ margin-top: 50px; }
      }
    }
  }
  .templateTabWrap{
    position: relative; display: inline-block; width: 100%;
    img{ height:80px;width:80px; }
    .templateTab{
      display: inline-block; width:100%;  position: absolute; bottom: -20px;left:0; color:#555; font-size:12px;
    }
    .bottomtip{  font-size: 12px; color:#555; }
  }

  .create-survey { cursor: default;width: 295px;margin-top: 20px;position: absolute;top: 0; right: 0;
    .count { padding: 13px 0;
      span {padding: 0 20px; font-size: 14px; color: #f25d5d; strong {margin-right: 10px;}}
      i {
          width: 20px;
          height: 27px;
          line-height: 27px;
          vertical-align: middle;
          display: inline-block;
          vertical-align: middle;
          text-align: center;
          color: #fff;
          font-size: 24px;
          font-weight: bold;
          background: #b4b5be;
          border: 1px #a7abbb solid;
          -moz-border-radius: 3px;
          -webkit-border-radius: 3px;
          border-radius: 3px;
          text-shadow: #999 0 1px 0;
      }
    }
    .btn-line {
      border-top: 1px #dbdbdb dashed; width: 265px; margin: 0 auto; padding: 22px 0 16px 0;  margin-top: 11px;
      .create-survey-btn {
          width: 200px;
          margin: 0 auto;
          height: 40px;
          line-height: 40px;
          vertical-align: middle;
          text-align: center;
          color: #FFF;
          background: #5691f0;
          display: block;
          font-size: 16px;
          -moz-border-radius: 4px;
          -webkit-border-radius: 4px;
          border-radius: 4px;
      }
    }
}
.dashed-box {
    background: #fff;
    padding: 10px;
    -moz-border-radius: 6px;
    -webkit-border-radius: 6px;
    border-radius: 6px;
    -moz-box-shadow: 0 1px 1px #999;
    -webkit-box-shadow: 0 1px 1px #999;
    box-shadow: 0 1px 1px #999;
}
.questionList{width:70%;float:right; padding: 10px;
  .title{font-size: 25px;color: #333;}
  .info{color: #999;font-size: 12px;margin-top: 15px;
  span{span{color:#333;}}
  }
}
</style>
