<template>
  <section style="padding:0 10px;">
  
  <br><div><h3>商品分类管理：</h3></div><br>
  <!-- 类型搜索区域 -->
  <div>
    <el-input style="width:250px;" v-model="keyword" placeholder="请输入分类名查询，支持模糊查询" /> 
    <el-button @click="searchgoodsType(1,pageSize,keyword)" type="info">查询</el-button>
    <el-button @click="showAdd=true;name=''" >添加问卷类别</el-button>
  </div>
  <!-- 问卷类别列表 -->
  <el-table :data="typeList" style="width: 100%" border>
    <el-table-column type="index" width="80"/>
    <el-table-column align="center" label="商品类别编号" prop="typeid" />
    <el-table-column align="center"  label="分类名称" prop="name"/>
    <el-table-column align="center"  label="操作" :minWidth="100">
      <template slot-scope="scope">
        <el-button @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
        <el-button @click="delType(scope.$index,scope.row)" type="danger" size="small">删除</el-button>
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
    <!-- 添加分类 -->
    <div>
      <el-dialog title="添加商品分类" :visible.sync="showAdd">
        <el-form>
          <el-form-item label="分类名" ><el-input v-model="name" placeholder="输入新分类名" /></el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAdd = false">取 消</el-button>
          <el-button type="primary" @click="addType()">添 加</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 更新分类 -->
    <div>
      <el-dialog title="更新商品分类" :visible.sync="showUpdate">
        <el-form>
          <el-form-item label="分类编号" ><el-input disabled v-model="typeid"/></el-form-item>
          <el-form-item label="分类名" ><el-input v-model="name"/></el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showUpdate = false">取 消</el-button>
          <el-button type="primary" @click="updateType()">更 新</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>
<script>
  import {ajax, storage} from 'utils';
  import common from 'common';
  export default {
    data() {
      return {
        showAdd:false,
        showUpdate:false,
        typeList: [],
        keyword:'' ,
        page:1,total:0,pageSize:15,
        //更新和添加
        name:'',
        typeid:'',
        index:0,

      }
    },methods:{
        handleEdit(index,row){
          this.index = index;
          this.showUpdate=true;
          this.typeid = row.typeid;
          this.name = row.name;
        },
        //更新用户信息
        updateType(){
          this.$confirm('是否更新商品分类', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
          .then(() => {
            let typeid = this.typeid;
            let name = this.name;
            ajax.call(this,'/updateType',{typeid,name},(res,err)=>{ 
              if(!err){
                this.showUpdate = false;
                this.typeList[this.index].name= name;
                this.success("更新分类成功")
              }
            })
          }).catch(() => {});
        },
        //删除
        delType(index,row){
          this.$confirm('是否删除商品分类', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
          .then(() => {
            ajax.call(this,'/delType',{typeid:row.typeid},(res,err)=>{ 
              if(!err){
                this.success("删除成功");
                this.typeList.splice(index,1);
              }
            })
          }).catch(() => {});
        },
        //查询
        searchgoodsType(page,pageSize,keyword){
          ajax.call(this,'/searchGoodsTypeCondition',{page:page,pageSize:pageSize,where:'name',whereval:`'%${keyword}%'`},(res,err)=>{
            this.total = res.res.total;
            this.typeList=res.res.data;
            this.page =res.res.page;
          })
        },
        //添加分类
        addType(){
          let name  = this.name;
          ajax.call(this,'/addGoodsType',{name},(res,err)=>{
            if(!err){ 
               this.success('添加分类成功');this.showAdd=false;this.searchgoodsType(1,this.pageSize,'');
          }})
        },
        handlePageChange(val){ 
          this.searchgoodsType(this.page,this.pageSize,this.keyword);
        },
    },created(){
       this.searchgoodsType(this.page,this.pageSize,'');
      },watch:{
        keyword(val){if(val==''){this.page=1;this.searchgoodsType(1,this.pageSize,val)}}
      },mixins:[common.mixin]
  }
</script>
<style scoped>
  
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