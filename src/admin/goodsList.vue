<template>
  <section style="padding:0 10px;" v-loading.fullscreen.lock="fullLoading">
  <br><div><h3>积分商品管理：</h3></div><br>
  <!-- 商品搜索区域 -->
  <div>
    <el-input style="width:350px;" v-model="keyword" placeholder="请输入商品名查询，支持模糊查询" >
        <el-select style="width:105px;" v-model="type" slot="prepend">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in goodstypeList" :key="item.typeid" :label="item.name" :value="item.name"/>
        </el-select>
    </el-input> 
    <el-button @click="searchGood(1,pageSize,keyword)" type="info">查询</el-button>
    <el-button @click="showAdd=true" >添加商品</el-button>
  </div>
  <!-- 商品列表 -->
  <el-table :data="goodsList" style="width: 100%" border>
    <el-table-column type="expand">
      <template slot-scope="props">
          <h3>商品详情：<small>支持h5详情展示：</small></h3>
          <div v-html="props.row.desc"></div>
      </template>
    </el-table-column>
    <el-table-column type="index" width="80"/>
    <el-table-column align="center" label="商品编号" prop="gid" />
    <el-table-column align="center"  label="商品名" prop="title"/>
    <el-table-column align="center"  label="商品类型" prop="type"/>
    <el-table-column align="center"  label="商品图片" :minWidth="105">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" style="width:100px;height:100px;">
        </template>
    </el-table-column>
    <el-table-column align="center"  label="商品单价">
      <template slot-scope="scope"><el-tag type="primary">{{scope.row.score}}积分</el-tag></template>
    </el-table-column>
    <el-table-column align="center"  label="商品数量" prop="num"/>
    <el-table-column align="center"  label="销售数量" prop="buyers"/>
    <el-table-column align="center"  label="上架时间" prop="createtime"/>
    <el-table-column align="center"  label="操作" :minWidth="100">
      <template slot-scope="scope">
        <el-button @click="handleEdit(scope.$index,scope.row)" type="primary" size="mini">编辑</el-button>
        <el-button @click="delGood(scope.$index,scope.row)" type="danger" size="mini">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination @current-change="handlePageChange" :current-page.sync="page" :page-size="pageSize" layout="total, prev, pager, next" :total="total"/>
    <!-- 添加商品-->
    <div class="addGoodBox"  v-show="showAdd || isEdit">
      <div class="innerBoxAdd">
        <!-- 图片上传 -->
        <form class="picform" @submit="setimgUrl()" action="/api/upload" method="post" enctype="multipart/form-data" target="target">  
        <el-button type="text">商品图片上传区域：</el-button>
          <!-- 新上传预览 -->
          <img v-show="upimgUrl" class="picpreview" :src="upimgUrl">
          <!-- 编辑下图片预览 -->
          <img v-if="isEdit" class="picpreview" :src="goods.imgUrl">
          <!-- 图库选择预览 -->
          <img v-show="goods.imgUrl" class="picpreview" :src="goods.imgUrl">
          <iframe v-show="false" name="target" id="target" width="250px" height="100px" frameborder="0"></iframe>
          <span v-show="goods.imgUrl" style="font-size:12px;"><i class="fa fa-check"></i>上传成功，文件名：{{goods.imgUrl.split('/')[3]}}</span>
          <div v-show="!upimgUrl" >
            从图库选择：
            <el-select class="imgselect"  clearable  v-model="goods.imgUrl" slot="prepend" >
              <el-option style="width:205px;height:205px;"  v-for="item in picList" :key="item.imgid" :label="item.imgurl" :value="item.imgurl">
                <img style="width:205px;height:205px;" :src="item.imgurl" alt="">
              </el-option>
            </el-select>
          </div>
          <div v-show="!goods.imgUrl" >上传：<input class="submitimg" id="file" type="file" name="file"/></div>
          <el-input  :disabled="!upimgUrl || goods.imgUrl.includes('/static')" type="submit" value="开始上传"/> 
        </form>
        <el-form>
          <el-form-item label="商品名称" >
            <el-input v-model="goods.title" placeholder="输入商品名称"  />
          </el-form-item>
          <el-form-item label="商品分类" >
            <el-select v-model="goods.type" placeholder="请选择">
              <el-option v-for="item in goodstypeList"  :key="item.typeid" :label="item.name" :value="item.name"/>
            </el-select>
          </el-form-item>
          <el-form-item label="商品描述" >
            <el-input type="textarea" v-model="goods.desc" placeholder="输入商品描述"/>
          </el-form-item>
          <el-form-item label="商品数量" >
            <el-input-number v-model="goods.num" :min="1" />
          </el-form-item>
          <el-form-item label="商品积分" >
            <el-input-number v-model="goods.score" :min="1" />
          </el-form-item>
        </el-form>
        <div style="position:absolute;bottom:10px;right:10px">
          <el-button @click="showAdd = false;goods.imgUrl='',upimgUrl='';isEdit=false;">取 消</el-button>
          <el-button v-if="isEdit" :disabled="!isEdit" @click="updateGoods" type="primary">更新</el-button>
          <el-button v-if="!isEdit" :disabled="!goods.imgUrl" @click="addGood" type="primary">确 定</el-button>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  import {ajax, storage} from 'utils';
  import common from 'common';
  export default {
    data() {
      return {
        fullLoading:false,
        upimgUrl:"",
        goodstypeList:[],//分类列表
        goodsList:[],//商品列表
        picList:[],
        goods:{
          gid:'',title:'',type:'',desc:'', imgUrl:'',score:10, num:1, buyers:0,  createtime:'',
        },
        isEdit:false,
        showAdd:false,
        keyword:'' ,
        type:'',
        page:1,total:0,pageSize:15,

      }
    },methods:{
      //上传商品图片
        setimgUrl(){
          this.fullLoading=true;
          setTimeout(()=>{
            let obj=document.getElementById("target").contentWindow;  
            let jsonStr = obj.document.body.querySelector('pre').innerHTML;
            let json = JSON.parse(jsonStr);
            this.goods.imgUrl=json.filename;
            console.log(json,this.goods.imgUrl)
            ajax.call(this,'/addImage',{imgurl:this.goods.imgUrl,type:2},(res,err)=>{});
            this.fullLoading=false;
          },3000);
          return true;
        },
        //编辑
        handleEdit(index,row){
          this.upimgUrl="";
          this.goods=this.goodsList[index];
          this.isEdit = true;
        },
        //更新商品信息
        updateGoods(){
          this.fullLoading=true;
          ajax.call(this,'/updateGoods',{goods:JSON.stringify(this.goods)},(res,err)=>{this.fullLoading=false; if(!err){this.isEdit=false;}})
        },
        //增加商品
        addGood(){
          this.$confirm('是否添加新商品', '提示', { confirmButtonText: '添加',cancelButtonText: '取消', type: 'warning'
          }).then(() => {
            ajax.call(this,'/addGood',{goods:JSON.stringify(this.goods)},(res,err)=>{
              if(!err){this.success('添加成功');this.showAdd=false;this.searchGood(1,this.pageSize,'')}
            });
            
          }).catch(() => {});
        },  
        //删除商品
        delGood(index,row){
           this.$confirm('是否删除该商品', '提示', { confirmButtonText: '删除',cancelButtonText: '取消', type: 'warning'
          }).then(() => {
            ajax.call(this,'/delGood',{gid:row.gid},(res,err)=>{
              if(!err){this.success('删除商品成功');this.goodsList.splice(index,1);}
            });
          }).catch(() => {});
        },
        //初始化商品分类列表
        initGoodsTypeList(){
          ajax.call(this,'/getAllgtype',{},(res,err)=>{
            if(!err){this.goodstypeList = res.res}else{this.error('初始化商品分类出错')}
          })
        },
        //初始化图库
        initPicList(){
          ajax.call(this,'/getAllimg',{type:2},(res,err)=>{
            if(!err){this.picList=res.res}else{this.error('初始化图库出错')}
          })
        },
        //分页查询商品列表
        searchGood(page=1,pageSize=30,keyword){
          let where =`title `;
          if(this.type){
            where =`type like '%${this.type}%' and title `;
          }
          let whereval = `'%${this.keyword}%'`;
          ajax.call(this,'/searchGoodCondition',{page:page,pageSize:pageSize,where,whereval},(res,err)=>{
            this.goodsList=res.res.data;
            this.page =res.res.page;
            this.total = res.res.total;
          })
        },
        handlePageChange(val){  this.searchGood(val,this.pageSize,this.keyword); },
    },created(){
      this.searchGood(1,this.pageSize,'');
      this.initGoodsTypeList();
      this.initPicList();
    },mounted(){
      let file = document.getElementById('file');
      file.onchange=()=>{
        try { this.upimgUrl = window.URL.createObjectURL(file.files[0]);} catch (error) {this.upimgUrl = "";}
      }
    },updated(){
      console.log('goodsimgurl',this.goods.imgUrl)
      console.log('upimg',this.goods.imgUrl)
    },watch:{
        keyword(val){if(val==''){this.searchGood(1,this.pageSize,val)}}
    },mixins:[common.mixin]
  }
</script>
<style lang="less" scoped>
  .addGoodBox{
    position:fixed;width:100vw;height:100vh;background:rgba(0,0,0,0.5);left:0;top:0;z-index:100;overflow:scroll;
    .innerBoxAdd{position:relative;width:60%;height:auto;margin:0 auto;margin:10% 20%;padding:30px;background:#fff;}
  }
  .picform{border:dashed 1px #777; position:relative;overflow:hidden;
    .picpreview{width:170px;height:160px;float:right;padding-right:5px;}
    .submitimg{border:none;width:200px;font-size:16opx;height:25px;color:#222;margin-top:10px;}
    .imgselect{width:205px;}
  }
  .demo-table-expand {font-size: 0;}
  .demo-table-expand label { width: 90px;color: #99a9bf;}
  .demo-table-expand .el-form-item { margin-right: 0; margin-bottom: 0; width: 50%;}
</style>