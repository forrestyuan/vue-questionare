<template>
    <div class="outerbox" v-loading="loading">
        <!-- 单件商品详情 -->
        <div class="detail-wrap">
            <div class="backToshop" ><el-button type="text">商品详情</el-button></div>
            <div class="detail-top" style="display:flex;border:solid 1px #ccc;padding:5px;justify-content:center;align-items:flex-start;box-shadow:2px 3px 3px 2px #ccc">
                <img class='goodsimg'  :src="goodsDetail.imgUrl" alt="">
                <div class="basicGoodDetailInfo">
                    <h1 class="title">{{goodsDetail.title}}</h1>
                    <ul >
                        <li>原价&nbsp;&nbsp; ：<el-tag class="eltag">{{+goodsDetail.score+Math.floor(Math.random()*1500)}}积分</el-tag></li>
                        <li>现价&nbsp;&nbsp; ：<el-tag class="eltag" type="success">{{goodsDetail.score}}积分</el-tag></li>
                        <li>库存&nbsp;&nbsp; ：<el-tag class="eltag" type="primary">{{goodsDetail.num}}件</el-tag></li>
                        <li>销售量：<el-tag class="eltag" type="primary">{{goodsDetail.buyers}}件</el-tag></li>

                        <li>问卷优惠 <i class="fa fa-check-square-o" style="color:green"></i></li>
                    </ul>
                    <el-button class="btnaddCart" @click="addToCart(userInfo.uid,goodsDetail.gid)" type="danger" size="large">加入购物车</el-button>
                    {{'购物车数量：'+buynum+' 件'}}
                    <div>
                        <span>服务承诺:</span>
                        <span><i class="fa fa-truck" style="color:green"></i> 退货补运费</span>
                        <span><i class="fa fa-thumbs-up" style="color:green"></i> 7天无理由退货</span>
                        <span><i class="fa fa-globe" style="color:green"></i> 全国包邮</span>
                        <span><i class="fa fa-calendar-check-o" style="color:green"></i> 72小时发货</span>
                    </div>
                    <div>
                        <span>支付方式：</span><el-tag type="success">积分兑换</el-tag>
                    </div>
                </div>
            </div>
            <div style="background: white;border:solid 1px #ccc;box-shadow:2px 3px 3px 2px #ccc">
                <el-tabs v-model="tabs" style="border:solid #ccc 1px;padding:10px;margin-top:20px;">
                    <el-tab-pane label="商品描述" name="1">
                        <el-tag><h2>描述：</h2></el-tag>
                        <div class="goodsDesc" v-html="goodsDetail.desc"></div>
                        <el-tag><h2>实物图：</h2></el-tag><br>
                        <div style="text-align:center;">
                            <img style="width:720px;height:420px;" :src="goodsDetail.imgUrl" alt="">
                        </div>
                    </el-tab-pane>
                    <!-- 用户评价 -->
                    <el-tab-pane label="用户评价" name="2">
                        <div><el-tag><h2>用户评价：</h2></el-tag></div><br>
                        <section class="comments">
                            <div v-if="!commentList.length" style="text-align:center">暂无评论</div>
                            <article class="comment" v-for="item in commentList" :key="item.cid">
                                <a class="comment-img">
                                    <img :src="item.userthumbnail" alt="" width="50" height="50">
                                </a>
                                <div class="comment-body">
                                    <div class="text">
                                        <p>{{item.comment}}</p>
                                    </div>
                                    <p class="attribution">来自： <el-tag type="primary">{{item.username}}</el-tag> 于 <el-tag type="info">{{item.time}}</el-tag> 发表</p>
                                </div>
                            </article>
                        </section>
                    </el-tab-pane>
                </el-tabs>
            </div>
            
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
                tabs:'1',
                loading:false,
                userInfo:{username:'',uid:''},
                goodsDetail:{},
                commentList:[],
                buynum:0,
            }
        },
        methods: {
           addToCart(uid,gid){
                ajax.call(this,'/addCart',{uid,gid},(res,err)=>{
                    if(!err){
                        this.success('( •̀ ω •́ )y添加购物车成功');
                        this.countGoodIncart(uid,gid);
                    }else{this.error('添加购物车失败');}
                })
            },
           initgoodsDetail(gid){
               this.loading=true;
               ajax.call(this,'/searchGoodCondition',{page:1,pageSize:1,where:'gid',whereval:`${gid}`},(res,err)=>{
                   this.loading=false;
                   if(!err){
                       if(res.res.data.length){
                           this.goodsDetail = res.res.data[0];
                           this.initCommentDetail(this.goodsDetail.gid);
                       }else{ this.warn('无商品详情数据') }
                   }else{this.error("请求数据出错")}
               })
           },
           initCommentDetail(gid){
               this.loading=true;
               ajax.call(this,'/searchCommentCondition',{page:1,pageSize:100,where:'gid',whereval:`${gid}`},(res,err)=>{
                   this.loading=false;
                   if(!err){this.commentList = res.res.data; }else{this.error("请求数据出错")}
               })
           },
            countGoodIncart(uid,gid){
                ajax.call(this,'/countGoodIncart',{uid,gid},(res,err)=>{
                    if(!err){
                        this.buynum=res.res[0].num;
                    }
                });
            },
            checkLogin(gid){
                ajax.call(this,'/isLogin',{},(res,err)=>{
                    if(!err){
                        this.userInfo.username = res.username;
                        this.userInfo.uid = res.uid;
                        this.countGoodIncart(res.uid,gid)
                    }
                });
            },
        },created(){
            let gid = this.$route.params.id;
            if(gid!='undefined'){
                this.checkLogin(gid);
                this.initgoodsDetail(gid);
            }else{
                console.log('非法参数did')
                this.warn('非法参数商品编号');
            }
        },
        mixins:[common.mixin],

    }
</script>

<style lang="less" scoped> 
.detail-wrap{ padding:10px 150px;background: #FFFFF0;
    .backToshop{padding:2px;}
    .detail-top{background: white;
        .goodsimg{width:400px;height:400px;}
        .basicGoodDetailInfo{background: white;
            .title{color:#666;line-height: 2em;text-align: center;font-size:30px;}
            ul{ list-style: none;padding:0 0 10px 20px;
                li{margin:10px;
                    .eltag{min-width: 120px;}
                }
            }
            .btnaddCart{width:200px;margin:10px 100px;}
            span{margin:5px;}
        }
    }
    .detial-bottom{ }
    .goodsDesc{line-height:2em;font-size:15px;color:#444;padding:0 20px;text-indent:2em;margin-bottom:20px;border-bottom: dashed 2px #777;}
}
//liuyna
article, aside, figure, footer, header, hgroup, menu, nav, section { display: block; }
body {width: 500px;margin: 20px auto;font: 16px/1.4 Arial, sans-serif;background: #f3eee9;}
p {margin: 0 0 1em;}
.comment {overflow: hidden; padding: 0 0 1em; border-bottom: 1px solid #ddd;margin: 0 0 1em; *zoom: 1;.text { padding: 10px; border: 1px solid #e5e5e5; border-radius: 5px;background: #fff; }   .text p:last-child {margin: 0;}.attribution {margin: 0.5em 0 0;font-size: 14px; color: #666;} }
.comment-img { float: left; margin-right: 33px; border-radius: 5px; overflow: hidden; img{display: block;}}
.comment-body {overflow: hidden;}
/* Decoration */
.comments,.comment {position: relative;}
.comments:before,.comment:before,.comment .text:before {content: ""; position: absolute; top: 0; left: 65px;}
.comments:before { width: 3px;top: -20px;  bottom: -20px; background: rgba(0,0,0,0.1);}
.comment:before {  width: 9px;  height: 9px; border: 3px solid #fff; border-radius: 100px; margin: 16px 0 0 -6px; box-shadow: 0 1px 1px rgba(0,0,0,0.2), inset 0 1px 1px rgba(0,0,0,0.1); background: #ccc;}
.comment:hover:before {background: orange;}
.comment .text:before { top: 18px; left: 78px;width: 9px; height: 9px; border-width: 0 0 1px 1px; border-style: solid; border-color: #e5e5e5;background: #fff; transform: rotate(45deg);}
</style>
