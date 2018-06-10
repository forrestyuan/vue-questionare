<template>
  <section class="mainWrap" v-loading.fullscreen.lock="fullLoading">
    <br><div><h3>图库管理：</h3></div><br>
    <!-- 类型搜索区域 -->
    <div class="left">
        <!-- 问卷类别列表 -->
        <el-table :data="imgList" style="width: 100%" border>
            <el-table-column type="index" width="80"/>
            <el-table-column align="center" label="ID" prop="imgid" width="80" />
            <el-table-column align="center"  label="预览" :minWidth="80">
                <template slot-scope="scope">
                    <img style="width:100px;height:100px;" :src="scope.row.imgurl" alt="">
                </template>
            </el-table-column>
            <el-table-column align="center"  label="分类"  width="80">
                <template slot-scope="scope">
                    <el-tag type="primary">{{typemap[scope.row.type]}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center"  label="操作" width="80">
                <template slot-scope="scope">
                    <el-button @click="delImage(scope.$index,scope.row)" type="danger" size="mini">删除</el-button>
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
    </div>
    <!-- 添加分类 -->
    <div class="right">
        <!-- 图片上传 -->
        <div style="text-align:center;font-size:22px;border:solid 1px #777;">新增图片</div>
        <form style="border:dashed 1px #777; position:relative;overflow:hidden" @submit="setimgUrl()" action="/api/upload" method="post" enctype="multipart/form-data" target="target">  
          <img style="width:100%;min-height:280px;float:right;padding-right:5px;" :src="upimgUrl" alt="点击下方按钮选择新图片">
          <iframe v-show="false" name="target" id="target" width="250px" height="100px" frameborder="0"></iframe>
          <span v-show="imgurl"><i class="fa fa-check"></i>上传成功，文件名：{{imgurl.split('/')[3]}}</span>
          <input style="border:none;width:200px;font-size:16opx;height:25px;color:#222;margin-left:20%;margin-top:10px;" id="file" type="file" name="file"/>  
          <div>
            <label for="type">图片类型：</label>
            <el-select id="type" v-model="type" placeholder="选择图片类型">
                <el-option label="首页" value="0" />
                <el-option label="商城" value="1" />
                <el-option label="商品" value="2" />
            </el-select> 
          </div>
          <el-input  :disabled="!upimgUrl" type="submit" value="开始上传"/> 
        </form>
    </div>
  </section>
</template>
<script>
  import {ajax, storage} from 'utils';
  import common from 'common';
  export default {
    data() {
      return {
        upimgUrl:'', 
        typemap:['首页','商城','商品','头像'],
        fullLoading:false,
        type:'0',
        imgurl:'',
        imgList: [],
        keyword:'' ,
        page:1,total:0,pageSize:15,
        //更新和添加

      }
    },methods:{
        //上传商品图片
        setimgUrl(){
          this.fullLoading=true;
          setTimeout(()=>{
            let obj=document.getElementById("target").contentWindow;  
            let jsonStr = obj.document.body.querySelector('pre').innerHTML;
            let json = JSON.parse(jsonStr);
            this.imgurl=json.filename;
            ajax.call(this,'/addImage',{imgurl:this.imgurl,type:this.type},(res,err)=>{
              if(!err){
                this.searchPicCondition(this.page,this.pageSize,this.keyword)
              }
            });
            this.fullLoading=false;
          },2500);
          return true;
        },
        //删除
        delImage(index,row){
          this.$confirm('是否删除图片', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
          .then(() => {
            ajax.call(this,'/delImage',{imgid:row.imgid},(res,err)=>{ 
              if(!err){
                this.success("删除成功");
                this.imgList.splice(index,1);
              }
            })
          }).catch(() => {});
        },
        //查询
        searchPicCondition(page,pageSize,keyword){
          ajax.call(this,'/searchPicCondition',{page:page,pageSize:pageSize,where:'imgurl',whereval:`'%${keyword}%'`},(res,err)=>{
            this.total = res.res.total;
            this.imgList=res.res.data;
            this.page =res.res.page;
          })
        },
        handlePageChange(val){this.searchPicCondition(this.page,this.pageSize,this.keyword);},
    },created(){
       this.searchPicCondition(this.page,this.pageSize,'');
    },mounted(){
      let file = document.getElementById('file');
      file.onchange=()=>{try { this.upimgUrl = window.URL.createObjectURL(file.files[0]);} catch (error) {this.upimgUrl = "";}
      }
    },mixins:[common.mixin]
  }
</script>
<style lang="less" scoped>
  .mainWrap{overflow: hidden;padding:0 20px 50px 20px;
    .left{width:60%;float:left;}
    .right{width:40%;float:right}
  }  
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>