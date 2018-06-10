<template>
  <section style="padding:0 10px;">
  
  <br><div><h3>问卷分类管理：</h3></div><br>
  <!-- 类型搜索区域 -->
  <div>
    <el-input style="width:250px;" v-model="keyword" placeholder="请输入分类名查询，支持模糊查询" /> 
    <el-button @click="searchqsType(1,pageSize,keyword)" type="info">查询</el-button>
    <el-button @click="showAdd=true;typename=''" >添加问卷类别</el-button>
  </div>
  <!-- 问卷类别列表 -->
  <el-table :data="typeList" style="width: 100%" border>
    <el-table-column type="index" width="80"/>
    <el-table-column align="center" label="问卷类别编号" prop="qstypeid" />
    <el-table-column align="center"  label="分类名称" prop="typename"/>
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
    <!-- 添加用户 -->
    <div>
      <el-dialog title="添加问卷分类" :visible.sync="showAdd">
        <el-form>
          <el-form-item label="分类名" ><el-input v-model="typename" placeholder="输入新分类名" /></el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAdd = false">取 消</el-button>
          <el-button type="primary" @click="addType()">添 加</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 更新用户 -->
    <div>
      <el-dialog title="更新问卷分类" :visible.sync="showUpdate">
        <el-form>
          <el-form-item label="分类编号" ><el-input disabled v-model="qstypeid"/></el-form-item>
          <el-form-item label="分类名" ><el-input v-model="typename"/></el-form-item>
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
        typename:'',
        qstypeid:'',
        index:0,

      }
    },methods:{
        handleEdit(index,row){
          this.index = index;
          this.showUpdate=true;
          this.qstypeid = row.qstypeid;
          this.typename = row.typename;
        },
        //更新用户信息
        updateType(){
          this.$confirm('是否更新问卷分类', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
          .then(() => {
            let qstypeid = this.qstypeid;
            let typename = this.typename;
            ajax.call(this,'/operType',{operType:'update',qstypeid,typename},(res,err)=>{ 
              if(!err){
                this.showUpdate = false;
                this.typeList[this.index].typename= typename;
                this.success("更新分类成功")
              }
            })
          }).catch(() => {});
        },
        //删除
        delType(index,row){
          this.$confirm('是否问卷问卷分类', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
          .then(() => {
            let qstypeid = this.qstypeid;
            let typename = this.typename;
            ajax.call(this,'/operType',{operType:'del',qstypeid:row.qstypeid},(res,err)=>{ 
              if(!err){
                this.success("删除成功");
                this.typeList.splice(index,1);
              }
            })
          }).catch(() => {});
        },
        //查询
        searchqsType(page,pageSize,keyword){
          ajax.call(this,'/searchqsTypeCondition',{page:page,pageSize:pageSize,where:'typename',whereval:`'%${keyword}%'`},(res,err)=>{
            this.total = res.res.total;
            this.typeList=res.res.data;
            this.page =res.res.page;
          })
        },
        //添加分类
        addType(){
          let typename  = this.typename;
          ajax.call(this,'/operType',{operType:'add',typename},(res,err)=>{
            if(!err){ 
               this.success('添加分类成功');this.showAdd=false;this.searchqsType(1,this.pageSize,'');
          }})
        },
        handlePageChange(val){ 
          this.searchqsType(this.page,this.pageSize,this.keyword);
        },
    },created(){
       this.searchqsType(this.page,this.pageSize,'');
      },watch:{
        keyword(val){if(val==''){this.page=1;this.searchqsType(1,this.pageSize,val)}}
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