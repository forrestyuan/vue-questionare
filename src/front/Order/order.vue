<template>
    <div style="padding:20px 50px;" >
        <h1>我的订单列表：</h1>
        <el-row class="grid-table">
            <el-table :data="tableData" border  style="width: 100%;">
                    <el-table-column prop="oid" sortable  label="订单编号" width="80"></el-table-column>
                    <el-table-column prop="uid" sortable  label="用户编号" width="80"></el-table-column>
                    <el-table-column prop="name" sortable  label="订单名" :minWidth="100"></el-table-column>
                    <el-table-column prop="score" sortable  label="订单积分" width="80"></el-table-column>
                    <el-table-column prop="status" label="状态" :width="80" :filters="[{text:'待收货',value:'待收货'},{text:'已收货',value:'已收货'},{text:'待评价',value:'待评价'},{text:'已评价',value:'已评价'}]" :filter-method="filterTag"  filter-placement="bottom-end"> 
                        <template slot-scope="scope">
                            <div slot="reference" class="name-wrapper">
                                <el-tag sortable :type='statusBg[scope.row.status]' size="medium">{{ scope.row.status }}</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column sortable label="提交时间" width="110">
                        <template slot-scope="scope">
                            <span>{{scope.row.createtime.split('T')[0]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" :minWidth="110">
                        <template fixed slot-scope="scope" >
                            <el-tooltip v-if="scope.row.status=='待收货'" class="item" effect="dark" content="确认收货" placement="top">
                                <el-button  size="mini" type="success"  @click="handleRecieve(scope.$index,scope.row)"><i  class="fa fa-eye"></i>确认收货</el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="查看订单详情" placement="top">
                                <el-button  size="mini" type="primary"  @click="handleRead(scope.$index,scope.row)"><i  class="fa fa-eye"></i>查看订单</el-button>
                            </el-tooltip>
                            <el-tooltip v-if="scope.row.status=='已收货'" class="item" effect="dark" content="评价" placement="top">
                                <el-button  size="mini" type="warning"  @click="handleLeaveWord(scope.$index,scope.row)"><i  class="fa fa-thumbs-up"></i>评价</el-button>
                            </el-tooltip>

                            <!-- 删除 -->
                            <el-tooltip class="item" v-if="scope.row.status == '已收货' || scope.row.status == '已评价'" effect="dark" content="删除完成订单记录" placement="top">
                                <el-button  size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"><i  class="fa fa-trash"></i>删除</el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
            </el-table>
        </el-row>
        <!-- 订单详情展示 -->
        <section>
            <el-dialog title="收货地址 & 商品信息" :visible.sync="isShowDetail">
                <div class="basicInfo">
                    <div class="one">
                        <el-tag type="info">邮寄信息：</el-tag><br>
                        <div>寄送至：{{userInfo.address}}</div>
                        <div>邮政编码：{{userInfo.postcode}}</div>
                        <div>收件人：{{userInfo.realname}}--{{userInfo.phone}}</div>
                    </div>
                    <div class="two">
                        <el-tag type="info">备注信息：</el-tag>
                        <el-input  disabled v-model="beizhu"></el-input>
                    </div>
                </div>
               <el-table  ref="multipleTable" tooltip-effect="dark" :data="gridData" border style="width: 100%;text-align:center">
                    <el-table-column  prop="gid" label="商品编号" :minWidth="35"></el-table-column>
                    <el-table-column  label="商品图片"  :minWidth="50"> 
                        <template slot-scope="scope">
                            <img style="width:80px;height:60px;" :src="scope.row.imgUrl">
                        </template>
                    </el-table-column>
                    <el-table-column prop="gname"  label="商品名称"  :minWidth="80"></el-table-column>
                    <el-table-column prop="gnum" label="商品数量" :minWidth="100">
                        <template slot-scope="scope">
                                <el-button type="info" size="small">{{scope.row.gnum}} 件</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column  label="该商品所需总积分"  :minWidth="80">
                        <template slot-scope="scope">
                            <el-tag type="success">{{scope.row.gscore*scope.row.gnum}}积分</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </section>
        <!-- 商品留言区域 -->
        <section>
            <el-dialog title=" 商品评价" :visible.sync="isShowGoodVal">
               <el-table  ref="multipleTable" tooltip-effect="dark" :data="gridData" border style="100%">
                    <el-table-column  prop="gid" label="ID" :minWidth="35"/>
                    <el-table-column  label="图片"  :minWidth="40"> 
                        <template slot-scope="scope">
                            <img style="width:50px;height:50px;" :src="scope.row.imgUrl">
                        </template>
                    </el-table-column>
                    <el-table-column prop="gname"  label="名称"  :minWidth="45"/>
                    <el-table-column label="评价" :minWidth="100">
                        <template slot-scope="scope">
                            <el-input type="textarea" :rows="2" placeholder="请 输 入 评 价 语 ^_^" v-model="scope.row.pingjia"/>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" :minWidth="60">
                        <template slot-scope="scope" >
                            <el-button  size="mini" type="warning"  @click="goodVal(scope.$index,scope.row)"><i  class="fa  fa-thumbs-up"></i>提交评价</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </section>
    </div>
</template>
<script type="text/javascript">
    import {ajax,storage} from 'utils';
    import common from 'common';
    module.exports = {
        name: 'list',
        data() {
            return {
                radioType: '全部',
                //类型
                statusBg:{'待评价':'warning','待收货':'','已收货':'success','已评价':'primary'},
                //订单表格数据
                tableData:[],
                //订单详情
                gridData: [],
                beizhu:'',
                isShowDetail: false,
                //留言区域
                isShowGoodVal:false,
                 //用户信息 用户名，用户id，用户积分
                userInfo: {
                    uid:'',
                    account:'',
                    realname:'',
                    address:'',
                    postcode:'',
                    phone:''
                },
            }
        },
        methods: {
            filterTag(value, row) {return row.status === value; },
            //删除
            handleDelete(index, row) { 
                let oid = row.oid;  
                this.$confirm('删除订单记录吗?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消',type: 'warning' }).then(() => {
                    //请求数据删除数据
                    ajax.call(this,'/delOrder',{oid:row.oid},(res,err)=>{
                        this.tableData.splice(index,1);
                        this.$message({ type: 'success', message: '删除成功!'});
                    })
                }).catch(() => {});
            },
            //查看
            handleRead(index, row){
                try{
                    let data =JSON.parse(row.goods);
                    for(let i in data){ data[i].pingjia=''; }
                    this.gridData = data;
                    this.beizhu = row.extend;
                    this.isShowDetail = true;
                }catch(err){this.info('此订单没有商品')}
            },
            //评价
            handleLeaveWord(index,row){
                try{
                    let data =JSON.parse(row.goods);
                    for(let i in data){ data[i].pingjia=''; }
                    this.gridData = data;
                    this.beizhu = row.extend;
                    this.isShowGoodVal=true;
                }catch(err){this.info('此订单没有商品')}
            },
            //提交评价
            goodVal(index,row){
                console.log(row.pingjia)
                ajax.call(this,'/addcomment',{gid:row.gid,comment:row.pingjia,username:this.userInfo.account},(res,err)=>{
                    if(!err){
                        this.success('添加评论成功');
                        this.isShowGoodVal=false;
                    }
                });
            },
            //确认收货  
            handleRecieve(index,row){
                ajax.call(this,'/updateOrder',{orderName:row.name,status:'已收货'},(res,err)=>{
                    if(!err){
                         this.success('感谢您的购买！！');
                         row.status="已收货"
                    }
                })
            },
            searchOrder(uid){
                ajax.call(this,'/searchOrderCondition',{page:1,pageSize:Math.max(),where:'uid',whereval:`${uid}`},(res,err)=>{
                    if(!err){
                        this.tableData=res.res.data;
                    }else{this.error('初始化订单信息出错')}
                })
            },
             //获取登录信息用户名和用户id-----------------------
            checkLogin(){
                ajax.call(this,'/isLogin',{},(res,err)=>{
                    if(!err){
                        if(res.loginStatus){
                            this.userInfo.uid = res.uid;
                            this.searchOrder(res.uid);
                            ajax.call(this,'/getUserInfoById',{uid:this.userInfo.uid},(res,err)=>{
                                this.userInfo.account=res[0].account;
                                this.userInfo.address=res[0].address;
                                this.userInfo.phone=res[0].phone;
                                this.userInfo.postcode=res[0].postcode;
                                this.userInfo.realname=res[0].realname;
                            });
                            ajax.call(this,'/getScoreById',{uid:this.userInfo.uid},(res,err)=>{
                                if(!err){
                                    this.userscoreLeft = res.data[0].total;
                                }
                            });
                        }else{
                            this.$router.replace('/login')
                        }
                    }
                });
            },
        },
        created(){
            this.checkLogin();
        },
        mixins:[common.mixin],
    }
</script>
<style lang="less">
.basicInfo{display: flex;background: white;padding:20px;right:0;border:dashed 2px #ccc;margin: 10px 0 10px 0; .one,.two{display: inline-block}}
    .grid-table{
        .el-form-item{
            display: inline-block;
            max-height:240px;
            width:~'calc(24% - 10px)';
            &:first-child{
                .el-input{
                    margin-right:25px;
                }
            }
            &:last-child{
                overflow: hidden;
                white-space: nowrap;
                vertical-align: bottom;
            }
        }
        .el-pagination{
            margin-top:5px;
            text-align: right;
        }
        .el-cascader--small .el-cascader__label{
            line-height: 40px;
        }
    }
</style>
