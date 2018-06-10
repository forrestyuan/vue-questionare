<template>
  <section style="padding:0 10px;">
  
  <br><div><h3>用户管理：</h3></div><br>
  <!-- 用户搜索区域 -->
  <div>
    <el-input style="width:250px;" v-model="keyword" placeholder="请输入用户名查询，支持模糊查询" /> 
    <el-button @click="searchUser(1,pageSize,keyword)" type="info">查询</el-button>
    <el-button :type="isEdit?'danger':''" @click="handleEdit">{{isEdit?'取消编辑':'编辑用户信息'}}</el-button>
    <el-button @click="showAdd=true" >添加用户</el-button>
  </div>
  <!-- 用户列表 -->
  <el-table :data="userList" style="width: 100%" border>
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <div v-show="isEdit" >
            <el-form-item :label="index" v-for="(item,index) in userList[props.$index]" :key="index">
                <el-input  v-model="userList[props.$index][index]" />
            </el-form-item>
            <el-button @click="updateUser(props.$index)" type="success">提交更改</el-button>
          </div>
          <div v-show="!isEdit">
            <el-form-item label="用户编号">{{ props.row.uid }}</el-form-item>
            <el-form-item label="用户账号">{{ props.row.account }}</el-form-item>
            <el-form-item label="用户密码">{{ props.row.password }}</el-form-item>
            <el-form-item label="用户真名">{{ props.row.realname}}</el-form-item>
            <el-form-item label="用户住址">{{ props.row.address}}</el-form-item>
            <el-form-item label="用户邮政编码">{{ props.row.postcode}}</el-form-item>
            <el-form-item label="用户邮箱">{{ props.row.email}}</el-form-item>
            <el-form-item label="用户手机">{{ props.row.phone}}</el-form-item>
            <el-form-item label="用户密保问题">{{ props.row.question}}</el-form-item>
            <el-form-item label="用户密保答案">{{ props.row.answer}}</el-form-item>
            <el-form-item label="用户头像">
                <el-tooltip class="item" effect="dark" placement="right">
                <img style="width:100px;height:100px;" :src="props.row.userthumbnail" slot="content">
                <span>{{ props.row.userthumbnail}}</span>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="用户状态">{{ props.row.status==1?'激活':'冻结'}}</el-form-item>
            <el-form-item label="用户角色">{{ props.row.role}}</el-form-item>
          </div>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column type="index" width="80"/>
    <el-table-column align="center" label="用户编号" prop="uid" />
    <el-table-column align="center"  label="用户账号" prop="account"/>
    <el-table-column align="center"  label="用户状态" prop="status"/>
    <el-table-column align="center"  label="用户角色" prop="role"/>
    <el-table-column align="center"  label="操作" :minWidth="100">
      <template slot-scope="scope">
        <el-button v-if="scope.row.status==1" @click="lockUser(scope.$index,scope.row,true)" type="" size="small">冻结</el-button>
        <el-button v-if="scope.row.status==0" @click="lockUser(scope.$index,scope.row,false)" type="" size="small">激活</el-button>
        <el-button @click="delUser(scope.$index,scope.row)" type="danger" size="small">删除</el-button>
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
      <el-dialog title="添加用户" :visible.sync="showAdd">
        <el-form>
          <el-form-item label="账号" >
            <el-input v-model="useradd.account" placeholder="输入用户名"  />
          </el-form-item>
          <el-form-item label="密码" >
            <el-input v-model="useradd.password" type="password"  placeholder="输入密码"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAdd = false">取 消</el-button>
          <el-button type="primary" @click="addUser()">确 定</el-button>
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
        isEdit:false,
        showAdd:false,
        userList: [],
        keyword:'' ,
        page:1,total:0,pageSize:15,
        useradd:{account:'',password:''}

      }
    },methods:{
        handleEdit(){this.isEdit = !this.isEdit},
        //更新用户信息
        updateUser(index){
          let user = this.userList[index];
          ajax.call(this,'/updateUserById',{user:JSON.stringify(user)},(res,err)=>{ if(!err){this.isEdit=false;}})
        },
        delUser(index,row){
          console.log(row.uid)
          this.$confirm('是否删除改用户！', '提示', {
            confirmButtonText: '删除', cancelButtonText: '取消',type: 'warning'
          }).then(() => {
            ajax.call(this,'/delUser',{id:row.uid},(res,err)=>{
              if(!err){
                this.success('删除成功')
                this.userList.splice(index,1);
              }
            });  
          }).catch(() => {});
        },
        searchUser(page=1,pageSize=30,keyword){
          ajax.call(this,'/searchUserCondition',{page:page,pageSize:pageSize,where:'account',whereval:`'%${keyword}%'`},(res,err)=>{
            this.userList=res.res.data;
            this.page =res.res.page;
            this.total = res.res.total;
          })
        },
        lockUser(index,row,isLock){
          ajax.call(this,'/lockUser',{uid:row.uid,isLock},(res,err)=>{
            if(!err){isLock?this.userList[index].status=0:this.userList[index].status=1}
          })
        },
        addUser(){
          let username=this.useradd.account,password = this.useradd.password;
          ajax.call(this,'/registValid',{username,password},(res,err)=>{
            if(!err){ 
               this.success('添加用户成功');this.showAdd=false;this.searchUser(1,this.pageSize,'');
               this.useradd.account='';this.useradd.password='';
          }})
        },
        handlePageChange(val){ 
          this.searchUser(val,this.pageSize,this.keyword);
        },
    },created(){
      this.searchUser(1,this.pageSize,'');
      },watch:{
        keyword(val){if(val==''){this.searchUser(1,this.pageSize,val)}}
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