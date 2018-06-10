<template>
    <div style="padding:20px 50px;" >
        <h1>订单管理：</h1>
        <div>
            <el-input style="width:250px;" v-model="keyword" placeholder="请输入订单名查询，支持模糊查询" /> 
            <el-button @click="searchOrder(1,pageSize,keyword)" type="info">查询</el-button>
        </div>
        <el-row class="grid-table">
            <el-table :data="tableData" border  style="width: 100%;">
                <el-table-column type="index"  label="订单编号" width="80"/>
                <el-table-column align="center" prop="oid" sortable  label="订单ID" width="80"/>
                <el-table-column align="center" prop="uid" sortable  label="用户ID" width="80"/>
                <el-table-column align="center" prop="name" sortable  label="订单名" :minWidth="50"/>
                <el-table-column align="center" prop="score" sortable  label="订单积分" :minWidth="60"/>
                <el-table-column align="center" prop="status" label="状态" :width="80" :filters="filterText" :filter-method="filterTag"  filter-placement="bottom-end"> 
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper"><el-tag :type='statusBg[scope.row.status]' size="medium">{{ scope.row.status }}</el-tag></div>
                    </template>
                </el-table-column>
                <el-table-column align="center"  prop="createtime" sortable  label="订单提交时间" :minWidth="80"/>
                <el-table-column align="center" label="操作" :minWidth="100">
                    <template fixed slot-scope="scope" >
                        <el-button  size="mini" type="primary"  @click="handleRead(scope.$index,scope.row)">查看</el-button>
                        <el-button v-if="scope.row.status == '已收货' || scope.row.status == '已评价'|| scope.row.status == '待评价'"  size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <el-pagination
                @current-change="handlePageChange"
                :current-page.sync="page"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="total">
            </el-pagination>
        </el-row>
        <!-- 订单详情展示 -->
        <el-dialog title="收货地址 & 商品信息" width="80%"  :visible.sync="isShowDetail">
            <div class="basicInfo">
                <div class="one">
                    <el-tag type="info">邮寄信息：</el-tag><br>
                    <div>寄送至：{{userInfo.address}}</div>
                    <div>邮政编码：{{userInfo.postcode}}</div>
                    <div>收件人：{{userInfo.realname}}--{{userInfo.phone}}</div>
                </div>
                <div class="two">
                    <el-tag type="info">备注信息：</el-tag><el-input  disabled v-model="beizhu"></el-input>
                </div>
            </div>
            <el-table  ref="multipleTable" tooltip-effect="dark" :data="gridData" border style="width: 100%;text-align:center">
                <el-table-column  prop="gid" label="商品编号" :minWidth="35"></el-table-column>
                <el-table-column  label="商品图片"  :minWidth="50"> 
                    <template slot-scope="scope"><img style="width:80px;height:60px;" :src="scope.row.imgUrl"></template>
                </el-table-column>
                <el-table-column prop="gname"  label="商品名称"  :minWidth="80"></el-table-column>
                <el-table-column prop="gnum" label="商品数量" :minWidth="100">
                    <template slot-scope="scope"><el-button type="info" size="small">{{scope.row.gnum}} 件</el-button></template>
                </el-table-column>
                <el-table-column  label="该商品所需总积分"  :minWidth="80">
                    <template slot-scope="scope"><el-tag type="success">{{scope.row.gscore*scope.row.gnum}}积分</el-tag></template>
                </el-table-column>
            </el-table>
            <div>
                <el-button @click="isShowDetail=false;gridData=[];">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
    import {ajax,storage} from 'utils';
    import common from 'common';
    module.exports = {
        name: 'Orderlist',
        data() {
            return {
                userInfo: { uid:'', account:'', realname:'', address:'',postcode:'', phone:'' },
                //类型
                statusBg:{'待评价':'warning','待收货':'','已收货':'success','已评价':'primary'},
                filterText:[{text:'待收货',value:'待收货'},{text:'已收货',value:'已收货'},{text:'待评价',value:'待评价'},{text:'已评价',value:'已评价'}],
                //订单表格数据
                tableData:[{oid:'',uid:'',score:0,name:'',status:'',createtime:'',extends:' ',goods:''},],
                //订单详情
                gridData: [{cartid:1,gid: 152,imgUrl: '/static/hamburger.png', gname: '上海', gnum:1,gscore: 20180,pingjia:''}],
                beizhu:'',
                isShowDetail: false,
                
                keyword:'',
                page:1,
                pageSize:20,
                total:0,
            }
        },
        methods: {
            filterTag(value, row) {return row.status === value;},
            //删除
            handleDelete(index, row) { 
                this.$confirm('删除该订单吗?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消',type: 'warning' }).then(() => {
                    //请求数据删除数据
                    ajax.call(this,'/delOrder',{oid:row.oid},(res,err)=>{
                        if(!err){
                            this.tableData.splice(index,1);
                            this.$message({ type: 'success', message: '删除成功!'});
                        }
                    });
                }).catch(() => {});
            },
            //查看
            handleRead(index, row){       
                let data =JSON.parse(row.goods);
                this.gridData = data;
                this.getUserInfo(row.uid);
                this.beizhu = row.extend;
                this.isShowDetail = true;
            },
            searchOrder(page,pageSize,keyword){
                ajax.call(this,'/searchOrderCondition',{page:page,pageSize:pageSize,where:'name',whereval:`'%${keyword}%'`},(res,err)=>{
                    if(!err){
                        this.total = res.res.total;
                        this.tableData=res.res.data;
                        this.page =res.res.page;
                    }else{this.error('初始化订单信息出错')}
                })
            },
             //获取用户信息
            getUserInfo(uid){
                this.userInfo.uid =uid;
                ajax.call(this,'/getUserInfoById',{uid},(res,err)=>{
                    this.userInfo.account=res[0].account;
                    this.userInfo.address=res[0].address;
                    this.userInfo.phone=res[0].phone;
                    this.userInfo.postcode=res[0].postcode;
                    this.userInfo.realname=res[0].realname;
                });    
            },
            handlePageChange(val){this.searchOrder(this.page,this.pageSize,this.keyword); },
        },
        created(){
            this.searchOrder(this.page,this.pageSize,'')
        },watch:{
            keyword(val){if(val.trim(' ')==''){this.searchOrder(1,this.pageSize,'')}}
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
            &:first-child{ .el-input{ margin-right:25px;}}
            &:last-child{overflow: hidden;white-space: nowrap; vertical-align: bottom;}
        }
        .el-pagination{margin-top:5px;text-align: right;}
        .el-cascader--small .el-cascader__label{line-height: 40px;}
    }
</style>
