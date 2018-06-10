<template>
    <div class="wrapCart" v-loading="loading">
        <!-- 购物车区域 -->
        <section v-show="!isPay" class="cartLeft" >
            <h1 class="topTitle">我的购物车<i class="fa fa-shopping-cart"></i></h1>
            <el-table style="box-shadow:2px 2px 3px 2px #ccc;" height="380" tooltip-effect="dark" @selection-change="handleSelectionChange" :data="tableData" highlight-current-row  border width="100%">
                <el-table-column  type="selection" width="55"/> 
                <el-table-column align="center"  prop="cartid" label="cart编号" :minWidth="35"/>
                <el-table-column align="center" prop="gid" label="商品编号" :minWidth="35"/>
                <el-table-column align="center" label="商品图片"  :minWidth="50"> 
                    <template slot-scope="scope"><img style="width:80px;height:60px;" :src="scope.row.imgUrl"></template>
                </el-table-column>
                <el-table-column align="center" prop="gname"  label="商品名称"  :minWidth="80"></el-table-column>
                <el-table-column align="center" label="商品数量" :minWidth="100">
                    <template slot-scope="scope">
                        <el-button type="info" size="small" class="fa fa-minus" @click="(scope.row.gnum-1 > 0)?scope.row.gnum--:scope.row.gnum=1;getTotalScore()" />
                        <el-input  style="width:80px;" type="number" @change="scope.row.gnum<0?scope.row.gnum=1:scope.row.gnum;" v-model="scope.row.gnum"/>
                        <el-button type="info"  size="small" class="fa  fa-plus" @click="scope.row.gnum++;getTotalScore()"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商品单件所需积分"  :minWidth="80">
                    <template slot-scope="scope"> <el-tag type="success">{{scope.row.gscore}}积分</el-tag></template>
                </el-table-column>
                <el-table-column align="center" label="操作"  :minWidth="50">
                    <template slot-scope="scope">
                        <el-button type="danger" size="small" @click="handleDelete(scope.index,scope.row)"><i class="fa fa-trash"></i>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="tableBottom">
                <span>已选商品 <span> {{multipleSelection.length}} </span> 件</span>&nbsp;&nbsp;&nbsp;&nbsp;
                <span>合计（不计运费）：<span>{{sumScore}} 积分&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
                <el-button :disabled="!multipleSelection.length" @click="isPay = true;" type="success">前 往 结 算 </el-button>
            </div>
        </section>
        <!-- 支付区域 -->
        <section v-show="isPay" class="cartRight">
            <h1 class="topTitle">积分支付兑换商品<i class="fa fa-shopping-cart"></i></h1>
            <el-steps :active="process" align-center finish-status="success">
                <el-step title="查看订单"></el-step><el-step title="支付积分"></el-step><el-step title="等待收货"></el-step>
            </el-steps>
            <!-- 查看订单 -->
            <section v-show="process==1">
                <el-table  ref="multipleTable" tooltip-effect="dark" :data="multipleSelection" border style="width: 100%;text-align:center">
                    <el-table-column  prop="cartid" label="cart编号" :minWidth="35"/>
                    <el-table-column  prop="gid" label="商品编号" :minWidth="35"/>
                    <el-table-column  label="商品图片"  :minWidth="50"> 
                        <template slot-scope="scope"><img style="width:80px;height:60px;" :src="scope.row.imgUrl"/></template>
                    </el-table-column>
                    <el-table-column prop="gname"  label="商品名称"  :minWidth="80"/>
                    <el-table-column prop="gnum" label="商品数量" :minWidth="100">
                        <template slot-scope="scope"><el-button type="info" size="small">{{scope.row.gnum}} 件</el-button></template>
                    </el-table-column>
                    <el-table-column  label="该商品所需总积分"  :minWidth="80">
                        <template slot-scope="scope"> <el-tag type="success">{{scope.row.gscore*scope.row.gnum}}积分</el-tag> </template>
                    </el-table-column>
                </el-table>
                <div class="basicInfo">
                    <div class="one">
                        <el-tag type="info">邮寄信息：</el-tag><br>
                        <div>寄送至：{{userInfo.address}}</div>
                        <div>邮政编码：{{userInfo.postcode}}</div>
                        <div>收件人：{{userInfo.realname}}--{{userInfo.phone}}</div>
                        <h6 style="color:#777">提示：如果要修改信息，前往我的主页修改个人信息。<a :href="'/user/'+userInfo.uid">前往>>></a></h6>
                    </div>
                    <div class="two">
                        <el-tag type="info">备注信息：</el-tag>
                        <el-input placeholder="输入备注信息" v-model="orderTip"/>
                    </div>
                </div>
                <div class="tableBottom">
                    <span>商品总数 <span> {{multipleSelection.length}} </span> 件</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>合计（不计运费）：<span >{{sumScore}} 积分&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
                    <el-button @click="goback()" type="primary" size="large">返回购物车</el-button>
                    <el-button :disabled="!multipleSelection.length" @click="createOrder" type="danger">提 交 订 单 </el-button>
                </div>
            </section>
            <!-- 支付订单 -->
            <section v-show="process==2">
                选择支付方式：
                <el-radio-group v-model="payType">
                    <el-radio :label="1">积分</el-radio>
                    <el-radio :label="2">微信</el-radio>
                    <el-radio :label="3">支付宝</el-radio>
                </el-radio-group>
                <!-- 积分支付 -->
                <div v-show="payType==1">
                    <div class="wrapscoreinfo">
                        <span class="myscore">
                           <span style="font-size:14px;">拥有</span>{{userscoreLeft}}<span style="font-size:16px;">分</span>
                        </span>
                        <span class="needscore">
                            <span style="font-size:14px;">需支付</span>{{sumScore}}<span style="font-size:16px;">分</span>
                        </span>
                        <span v-if="userscoreLeft-sumScore>0" class="needscore">
                            <span style="font-size:18px;">支付后剩：</span>{{userscoreLeft-sumScore}}<span style="font-size:16px;">分</span>
                        </span>
                        <span v-if="userscoreLeft-sumScore<0" class="needscore">
                            <span style="font-size:18px;">还差</span>{{sumScore-userscoreLeft}}<span style="font-size:16px;">分</span>
                            <div style="font-size:12px;color:#666;">提示：积分不够，可用现金代替(扫描微信、支付宝二维码)，100积分 / 1元</div>
                            <span ><span style="font-size:18px;">需支付RMB：</span>{{(sumScore-userscoreLeft)/100}}元</span>
                        </span>
                    </div>
                    <div  v-if="userscoreLeft-sumScore<0" class="wrapscoreinfo">
                        <img src="/static/weixin.png" alt="">
                        <img src="/static/zhifubao.jpg" alt="">
                    </div>
                </div>
                <!-- 微信支付 -->
                <div v-show="payType==2">
                    <div class="wrapscoreinfo">
                        <span class="needscore">
                            <span style="font-size:18px;">需积分</span>{{sumScore}}<span style="font-size:16px;">分</span>
                            <div style="font-size:12px;color:#666;">提示：积分不够，可用现金代替，100积分 / 1元</div>
                            <span ><span style="font-size:18px;">需支付RMB：</span>{{sumScore/100}}元</span>
                        </span>
                        <img src="/static/weixin.png" alt="">
                    </div>
                </div>
                <!-- 支付宝支付 -->
                <div v-show="payType==3">
                    <div class="wrapscoreinfo">
                        <span class="needscore">
                            <span style="font-size:18px;">需积分</span>{{sumScore}}<span style="font-size:16px;">分</span>
                            <div style="font-size:12px;color:#666;">提示：积分不够，可用现金代替，100积分 / 1元</div>
                            <span ><span style="font-size:18px;">需支付RMB：</span>{{sumScore/100}}元</span>
                        </span>
                        <img src="/static/zhifubao.jpg" alt="">
                    </div>
                </div>
                <el-button @click="goback()" type="primary" size="large">返回购物车</el-button>
                <el-button @click="payScore()" type="danger" size="large">完成支付</el-button>
            </section>
            <!-- 等待收货 -->
            <section v-show="process==3">
                <div class="endPay">
                    <h2> <i class="fa fa-check-circle"></i></h2>
                    <h1> 棒吔 ^_^！！积分兑换成功，商品正在赶来的路上！</h1>
                    <div style="width:100%;text-align:center;"><h3>记得去填问卷赚积分，赢取更多大礼！！</h3></div>
                </div>
                <el-button @click="routeToOrder()" type="primary" size="large" >查看订单列表</el-button>
            </section>
        </section>
    </div>
</template>
<script>
    import { ajax, storage } from "utils";
    import common from "common";
import index from "vue";
    module.exports = {
        name: "cart",
        data() {
            return {
                loading:false,
                //购物和结算界面切换：
                isPay:false,
                //支付类型
                payType:1,
                //已选择的商品
                multipleSelection: [],
                //总价格
                sumScore:0,
                orderTip:'',
                //购物车数据
                tableData:[],
                //用户信息 用户名，用户id，用户积分
                userInfo: {uid:'',account:'',realname:'',address:'',postcode:'',phone:''}, 
                userscoreLeft:0,
                //提交订单支付流程
                process:1,
                orderName:'',
                orderData:{}
            };
        },
        methods: {
            //求总积分
            getTotalScore(){this.sumScore=0;return this.multipleSelection.forEach(val=>this.sumScore+=val.gscore*val.gnum)},
            //选择商品
            handleSelectionChange(val) { this.multipleSelection = val;},
             //删除商品
            handleDelete(index, row) {
                let cartid = row.cartid;
                this.$confirm("此操作将删除购物车此商品, 是否继续?", "警告", {confirmButtonText: "确定",cancelButtonText: "取消",type: "warning"}).then(() => {
                    
                }).catch(() => {});
            },
            //初始化购物车
            initCartInfo(uid){
                this.loading=true;
                ajax.call(this,'getCartByUid',{uid},(res,err)=>{
                    this.loading=false;
                    if(!err){
                        let gidlist = res.gidlist
                        res.res.forEach(val=>{
                            for(let i=0;i<gidlist.length;i++){
                                if(gidlist[i].gid==val.gid){
                                   this.tableData.push({cartid:gidlist[i].cartid, gid:val.gid,imgUrl:val.imgUrl, gname:val.title, gnum:1,gscore:val.score})
                                    gidlist.splice(i,1);
                                    break;
                                }
                            }
                        });
                    }
                })
            },
            //返回购物车
            goback(){ this.process=1; this.isPay = false; },
            //构造订单： ---------------------------
            createOrder(){
                if(this.orderTip==''){
                    this.$message({type:'error',message:'请输入备注！'})
                    return;
                }
                let date= new Date();
                let data = {
                    uid:this.userInfo.uid,
                    score:this.sumScore,
                    name:date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日'+date.getHours()+'时'+date.getMinutes()+'分'+date.getSeconds()+'秒'+this.userInfo.account+'的订单',
                    extend:'备注：'+this.orderTip,
                    status:'待收货',
                    goods:JSON.stringify(this.multipleSelection)
                }
                this.orderData=data;
                this.process ++;
            },
            //支付积分；
            payScore(){
                this.process++;
                this.loading=true;
                let cidList=[];
                for(let i =0;i<this.multipleSelection.length;i++){
                    let cartid = this.multipleSelection[i].cartid;
                    for(let j =0;j<this.tableData.length;j++){
                        if(this.tableData[j].cartid == cartid){
                            //远程请求删除数据库中的数据。
                           cidList.push(cartid);
                           this.tableData.splice(j, 1);
                        }
                    }
                }
                //删除购物车
                ajax.call(this,'/delCart',{cidList:JSON.stringify(cidList)},(res,err)=>{
                    this.loading=false;
                    if(!err){
                        //添加到订单列表
                        ajax.call(this,'/addOrder',{order:JSON.stringify(this.orderData)},(res,err)=>{
                            if(!err){
                                let score = 0;
                                if(this.userscoreLeft > this.sumScore){ score = this.userscoreLeft;}
                                //抵扣积分
                                ajax.call(this,`/subScoreById`,{uid:this.userInfo.uid,score:score},(res,err)=>{
                                    if(!err){ this.success('支付成功'); }
                                });
                            }
                        })
                    }
                });
                this.multipleSelection=[];
            },
            //前往订单列表
            routeToOrder(){this.$router.replace('/order/'+this.userInfo.uid);},
            //获取登录信息用户名和用户id-----------------------
            checkLogin(){
                this.loading=true;
                ajax.call(this,'/isLogin',{},(res,err)=>{
                    if(!err){
                        if(res.loginStatus){
                            this.initCartInfo(res.uid)
                            ajax.call(this,'/getUserInfoById',{uid:res.uid},(res,err)=>{
                                this.loading=false;
                                if(!err){
                                    this.userInfo=res[0];
                                    ajax.call(this,'/getScoreById',{uid:res[0].uid},(res,err)=>{
                                        if(!err){this.userscoreLeft = res.data[0].total;}
                                    });
                                }else{this.error('初始化用户信息错误')}
                            });
                        }else{this.$router.replace('/login') }
                    }
                });
            },
        },
        created(){
            this.checkLogin();
        },
        watch:{
            multipleSelection(newval,oldval){this.getTotalScore();}
        },mixins:[common.mixin]
        
    }
</script>
<style lang="less" scoped>
html,body{margin: 0;padding:0;}
.wrapCart{
    margin:0;padding:0;
    // background: red;
    .tableBottom{background-color:#eee;text-align:right;span{span{color:red;font-size:23px;}}}
    .topTitle{text-align:center;font-size:24px;i{color:deepskyblue}}
    .cartLeft,.cartRight{padding:20px 50px;}
    // .cartLeft{background: yellow;}
    .cartRight{background:burlywood;
        section{ width:100%; min-height:530px; }
        .wrapscoreinfo{display: flex;justify-content: center;align-items: center;}
        .myscore,.needscore{color:red;font-size:35px;display:inline-block;width:300px;height:300px;border: solid 2px #ccc;background: white;text-align: center;padding-top:125px;}
        .endPay{flex-wrap:wrap;display: flex;justify-content: center;align-items: center;color:white;font-size: 30px;height: 300px;h2{display:block;font-size: 70px;color:lightgreen;text-align: center;}}
    }
    .basicInfo{display: flex;background: white;padding:20px;right:0;border:dashed 2px #ccc;margin: 10px 0 10px 45%; .one,.two{display: inline-block}}
}
.el-select .el-input { width: 130px;}
.input-with-select .el-input-group__prepend { background-color: #fff;}

</style>
