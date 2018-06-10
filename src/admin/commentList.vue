<template>
  <section style="padding:0 10px;" v-loading.fullscreen.lock="fullLoading">
  <br><div><h3>积分商品管理：</h3></div><br>
  <!-- 评论搜索区域 -->
  <div>
    <el-input style="width:350px;" v-model="keyword" placeholder="请输入用户名查询，支持模糊查询" />
    <el-button @click="searchComment(1,pageSize,keyword)" type="info">查询</el-button>
  </div>
  <!-- 商品列表 -->
  <el-table :data="commentList" style="width: 100%" border>
    <el-table-column type="expand">
      <template slot-scope="props">
          <h3>评论内容</h3><div v-html="props.row.comment"></div>
      </template>
    </el-table-column>
    <el-table-column type="index" width="80"/>
    <el-table-column align="center" label="评论ID" prop="cid" />
    <el-table-column align="center"  label="商品ID" prop="gid"/>
    <el-table-column align="center"  label="评论用户" prop="username"/>
    <el-table-column align="center"  label="评论时间" prop="time"/>
    <el-table-column align="center"  label="操作" :minWidth="100">
      <template slot-scope="scope">
        <el-button @click="readImg(scope.$index,scope.row)" type="primary" size="mini">查看</el-button>
        <el-button @click="delComment(scope.$index,scope.row)" type="danger" size="mini">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination @current-change="handlePageChange" :current-page.sync="page" :page-size="pageSize" layout="total, prev, pager, next" :total="total"/>
  <!-- 图片预览区 -->
    <el-dialog title=" 商品评价" :visible.sync="showimg">
      <el-button type="text">图片</el-button>
      <img style="width:100%; height:300px;" :src="imgReadUrl">
      <el-button type="text">评论</el-button>
      <h3>{{pingjia}}</h3>
    </el-dialog>
  </section>
</template>
<script>
  import {ajax, storage} from 'utils';
  import common from 'common';
  export default {
    data() {
      return {
        fullLoading:false,
        commentList:[],//商品列表
        keyword:'' ,
        imgReadUrl:'',
        pingjia:'',
        showimg:false,
        page:1,total:0,pageSize:15,

      }
    },methods:{
        //删除商品
        delComment(index,row){
           this.$confirm('是否删除该评论', '提示', { confirmButtonText: '删除',cancelButtonText: '取消', type: 'warning'
          }).then(() => {
            ajax.call(this,'/delComment',{cid:row.cid},(res,err)=>{
              if(!err){this.success('删除评论成功');this.commentList.splice(index,1);}
            });
          }).catch(() => {});
        },
        //分页查询评论列表
        searchComment(page=1,pageSize=30,keyword){
          ajax.call(this,'/searchCommentCondition',{page:page,pageSize:pageSize,where:'username',whereval:`'%${keyword}%'`},(res,err)=>{
            this.commentList=res.res.data;
            this.page =res.res.page;
            this.total = res.res.total;
          })
        },
        readImg(index,row){
          ajax.call(this,'/getGoodsImg',{gid:row.gid},(res,err)=>{
            if(!err){
              this.showimg=true;
              this.imgReadUrl=res.res[0].imgUrl;
              this.pingjia = row.comment;
              console.log(res);
            }
          })
        },
        handlePageChange(val){  this.searchComment(val,this.pageSize,this.keyword); },
    },created(){
      this.searchComment(1,this.pageSize,'');
    },watch:{
        keyword(val){if(val==''){this.searchComment(1,this.pageSize,val)}}
    },mixins:[common.mixin]
  }
</script>
<style lang="less" scoped>
  .demo-table-expand {font-size: 0;}
  .demo-table-expand label { width: 90px;color: #99a9bf;}
  .demo-table-expand .el-form-item { margin-right: 0; margin-bottom: 0; width: 50%;}
</style>