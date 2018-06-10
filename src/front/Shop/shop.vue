<template>
    <div class="outerbox">
        <!-- 商品展示 -->
        <div>
            <section class="mainWrap">
                <!-- 轮播图 -->
                <section class="imgRun">
                    <el-carousel :interval="4000" type="card" height="380px">
                        <el-carousel-item v-for="item in lunbo" :key="item.imgurl">
                            <img style="width:100%;height:380px" :src="item.imgurl" alt="">
                        </el-carousel-item>
                    </el-carousel>
                </section>
                <!-- banner -->
                <section class="yjf"><img src="/static/yjf.jpg" alt=""></section>
                <!-- 商品列表-->
                <section>
                    <p style="font-size:35px;text-align:center;">积分商城，兑换你所爱-<i style="color:red" class=" fa fa-heart"></i></p>
                </section>
                <section class="goodsList">
                    <div class="groupSearch">
                        <span style="color:deepskyblue;background:white">分类：</span>
                        <el-radio-group v-model="goodsType" size="medium" >
                            <el-radio-button v-for="item in typeList" :label="item.name" :key="item.typeid" />
                        </el-radio-group>
                        <el-input style="width:23%;float:right;" placeholder="请输入商品关键字" v-model="searchkeyword" class="input-with-select">
                            <span style="color:deepskyblue;background:white" slot="prepend">搜索 </span>
                            <el-button style="color:deepskyblue;background:white" @click="searchGood(1,pageSize,goodsType,searchkeyword)" slot="append" class="fa fa-search"></el-button>
                        </el-input>
                    </div>
                    <div style="color:red;text-align:center;width:100%;font-size:25px;border:solid red 1px;">{{goodsList.length?'':'架上暂无商品'}}</div>
                    <div class="goods" v-for="item in goodsList" :key="item.gid">
                        <img :src="item.imgUrl" alt="">  
                        <div class="title">{{item.title}}</div>
                        <span class="date">上架日期：{{item.createtime.split('T')[0]}}</span>
                        <div class="basicInfo12">
                            <h6>需积分：<el-tag type="primary">{{item.score}}</el-tag></h6>
                            <h6>数量：<el-tag type="danger">{{item.num}}</el-tag></h6>
                            <h6>已兑换：<el-tag type="success">{{item.buyers}}</el-tag></h6><hr>
                        </div>
                        <div>
                            <el-button size="small" @click="showDetail(item.gid)"><i class="fa fa-eye"></i>查看详情</el-button>
                            <el-button size="small" @click="addToCart(userInfo.uid,item.gid)" type="danger"><i class="fa fa-money "></i> 加入购物车</el-button>
                        </div>
                    </div>
                    <div class="block">
                        <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page.sync="page" :page-size="pageSize"
                            layout="total, prev, pager, next" :total="total">
                        </el-pagination>
                    </div>
                </section>
                <!-- banner -->
                <section v-if="true" class="csb"><img src="/static/csb.jpg" alt=""></section>
            </section>
            
        </div>
    </div>
</template>

<script type="text/javascript">
    import {ajax, storage} from 'utils';
    import common from 'common';
    export default {
        name: 'shop',
        data () {
            return {
               //商品信息：
                imgSrc:'/static/hamburger.png',
                currentDate: new Date(),
                page:1,
                pageSize:30,
                total:0,
                goodsType: '全部',
                typeList:[{typeid:-1,name:'全部'}],
                searchkeyword:'',
                //轮播图
                lunbo:[],
                goodsList:[],
                userInfo:{username:'',uid:''}

            }
        },
        methods: {
            //查看详情
            showDetail(gid){window.open('/goodsdetail/'+gid);},
            //改变页码
            handleCurrentChange(val) {this.searchGood(this.page,this.pageSize,this.goodsType,'')},
            //分页查询商品列表
            searchGood(page=1,pageSize=30,type,keyword){
                if(type=='全部'){type='';}
                let where =`type like '%${type}%' and title `;
                let whereval = `'%${keyword}%'`;
                ajax.call(this,'/searchGoodCondition',{page:page,pageSize:pageSize,where,whereval},(res,err)=>{
                    console.log(res)
                    this.goodsList=res.res.data;
                    this.page =res.res.page;
                    this.total = res.res.total;
                })
            },
            //初始化轮播图
            initLunBoTu(){
                ajax.call(this,'/searchPicCondition',{page:1,pageSize:6,where:'type',whereval:`1`},(res,err)=>{
                    if(!err){this.lunbo=res.res.data;}else{this.error('初始化轮播图失败')}
                })
            },
            //初始化商品分类列表
            initGoodsTypeList(){
                ajax.call(this,'/getAllgtype',{},(res,err)=>{
                    if(!err){this.typeList.push(...res.res)}else{this.error('初始化商品分类出错')}
                })
            },

            addToCart(uid,gid){
                ajax.call(this,'/addCart',{uid,gid},(res,err)=>{
                    if(!err){
                        this.success('( •̀ ω •́ )y添加购物车成功');
                    }else{
                        this.error('添加购物车失败');
                    }
                })
            },
             checkLogin(){
                ajax.call(this,'/isLogin',{},(res,err)=>{
                    if(!err){
                        this.userInfo.username = res.username;
                        this.userInfo.uid = res.uid
                    }
                });
            },
        },created(){
            this.checkLogin();
            this.searchGood(this.page,this.pageSize,'','');
            this.initGoodsTypeList();
            this.initLunBoTu();
        },watch:{
            goodsType(val){this.searchGood(1,this.pageSize,val,'')},
            searchkeyword(val){this.searchGood(1,this.pageSize,this.goodsType,val.replace(/ /g,""))}
        },
        mixins:[common.mixin],

    }
</script>
<style lang="less" scoped> 
   //幻灯片
   .imgRun{
       background: #fff;;
       .el-carousel__item:nth-child(2n) {background-color: #99a9bf;}
       .el-carousel__item:nth-child(2n+1) {background-color: #d3dce6;}
   }

  //自 商品列表
  .goodsList{
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      width:100vw;
      height: auto;
      flex-wrap: wrap;
    //   padding:2vw;
      .groupSearch{width:100%;margin: 0 20px;padding:5px;

       }
      .goods{
          display: flex;
          justify-content: center;
          align-content: flex-start;
          flex-wrap: wrap;
          transition:all 0.5s ease;
          background: white;
          width:19vw;
          height:330px;
          border:solid #ccc 1px;
          margin: 10px 0.5vw;
          box-shadow: 3px 3px 5px 1px #ccc;
          img{width:100%;height:200px;display: block;}
          .title{width:100%;display: flex;justify-content: center;margin:5px 0;color:#222;font-size: 18px;}
          .basicInfo12{width:100%;display: flex;justify-content: center;margin:5px 0;color:#666;
          }
          .date{width:100%;display: flex;justify-content: center;color:#666;font-size: 13px;}
      }
      .goods:hover{
          transform:translate(5px,5px);
          box-shadow: none;
          cursor: pointer;
          .descLayer{display:flex;justify-content: center;padding:10px;}
      }
      .block{
          border: solid 1px #ccc;
          width: 100vw;
          text-align: right;
          padding-right:30px;
      }
      
  }
  .yjf,.csb{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      img{
          width: 100%;
      }
  }
    .detail-wrap{
        padding:10px 50px;
        background: #FFFFF0;
        .backToshop{padding:2px;}
        .detail-top{
            background: white;
            .goodsimg{width:400px;height:400px;}
            .basicGoodDetailInfo{
                 background: white;
                .title{color:#666;line-height: 2em;text-align: center;font-size:30px;}
                ul{
                    list-style: none;padding:0 0 10px 20px;
                    li{margin:10px;
                        .eltag{min-width: 120px;}
                    }
                }
                .btnaddCart{width:200px;margin:10px 100px;}
                span{margin:5px;}
                
            }
        }
        .detial-bottom{
            background: white;
        }
    }
 
</style>
