<template>
  <section style="padding:0 10px;">
  
  <br><div><h3>问卷管理：</h3></div><br>
  <!-- 用户搜索区域 -->
  <div>
    <el-input style="width:400px;" v-model="keyword" placeholder="请输入问卷名查询，支持模糊查询" >
        <el-select style="width:115px;" v-model="qstype" slot="prepend">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in qsTypeList" :key="item.qstypeid" :label="item.typename" :value="item.typename"></el-option>
        </el-select>
    </el-input> 
    <el-button @click="searchQS(1,pageSize,keyword)" type="info">查询</el-button>
    <el-button @click="$router.replace('/qscreate/'+userInfo.uid)" type="info">创建问卷</el-button>
  </div>
  <!-- 用户列表 -->
  <!-- 模板列表 -->
    <el-table :data="tableData5" highlight-current-row border style="width: 100%;">
        <el-table-column type="expand">
            <template slot-scope="props">
                <h3>预览问卷</h3>
                <section  class="wenjuanmuban">
                    <img :src="props.row.bgimg">
                    <div class="wjcontent">
                        <h3 class="wenjuantitle">{{props.row.title}}</h3>
                        <p class="wenjuandesc">{{props.row.desc}}</p><br>
                        <div  v-for="(item,index) in props.row.timu" :key=index>
                            <div class="timutitle"><span style="color:red" v-if="item.isrequire">*</span>{{index+1}}、{{item.title}}</div>
                            <div class="timuwrap">
                                <!-- 题目 -->
                                <!-- 颜色选择器 -->
                                <el-color-picker v-if="item.type=='color'" v-model="item.answer"/>
                                <!-- 单选 -->
                                <el-radio-group v-if="item.type=='radio'" v-model="item.answer" >
                                    <el-radio  v-for="opt in item.options" :key="opt" :label="opt"/>
                                </el-radio-group>
                                <!-- 复选 -->
                                <el-checkbox-group  v-if="item.type=='checkbox'"  v-model="item.answer">
                                    <el-checkbox v-for="opt in item.options" :key="opt" :label="opt"/>
                                </el-checkbox-group>
                                <!-- 单行文本 -->
                                <el-input v-if="item.type=='text'" v-model="item.answer" placeholder="输入您的回答"/>
                                <!-- 多行文本 -->
                                <el-input type="textarea"  v-if="item.type=='textarea'" v-model="item.answer" placeholder="输入您的回答"/>
                                <!-- 下拉单选 -->
                                <el-select v-if="item.type=='select'" v-model="item.answer" placeholder="请选择">
                                    <el-option v-for="opt in item.options" :key="opt" :label="opt" :value="opt"/>
                                </el-select>
                                <!-- 下拉多选 -->
                                <el-select v-if="item.type=='selectmulti'" multiple  v-model="item.answer" placeholder="请选择(多选)">
                                    <el-option v-for="opt in item.options" :key="opt" :label="opt" :value="opt"/>
                                </el-select>
                                <!-- 动条 连续 -->
                                <div v-if="item.type=='bar'">
                                    <el-slider v-model="item.answer" />
                                </div>
                                <!-- 评分 星星-->
                                <div v-if="item.type=='rate'">
                                    <el-rate v-model="item.answer" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" show-text/>
                                </div>
                                <!-- 评分 单选 -->
                                <div v-if="item.type=='rateBasic'">
                                    <el-radio-group v-model="item.answer" >
                                        <el-radio  v-for="txt in item.options" :key="txt" :label="txt"/>
                                    </el-radio-group>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </template>
        </el-table-column>
        <el-table-column  label="问卷编号"  prop="qid" width="80"/>
        <el-table-column  label="用户编号"  prop="uid" width="80"/>
        <el-table-column  label="类别"  prop="type" width="100"/>
        <el-table-column   label="标题"  prop="title" :minWidth="100"/>
        <el-table-column label="题目数" width="100">
            <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                    <el-tag sortable type='primary' size="medium">{{ scope.row.timu.length }} 题</el-tag>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="积分奖励" width="100">
            <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                    <el-tag sortable type='success' size="medium">{{ scope.row.score }} 分</el-tag>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
            <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                    <el-tag sortable :type="scope.row.status=='未发布'?'':'success'" size="mini">{{ scope.row.status }}</el-tag>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作" :minWidth="140">
            <template slot-scope="scope" >
                <el-button v-if="scope.row.status=='未发布'" size="mini" type="success" @click="online(scope.$index, scope.row)">发布</el-button>
                <el-button v-if="scope.row.status=='回收中'" size="mini" type="warning" @click="offline(scope.$index, scope.row)">停止回收</el-button>
                <el-button size="mini" type="primary" @click="dataView(scope.$index, scope.row)">数据</el-button>
                <el-button v-if="scope.row.status=='回收中'" size="mini" type="primary" ><a style="color:white;text-decoration:none;" :href="'/qsonline/'+scope.row.uid+'/'+scope.row.qid" target="_blank">查看</a></el-button>
                <el-button size="mini"  @click="edit(scope.$index, scope.row)">编辑</el-button>
                <el-button v-if="scope.row.status=='回收中'" size="mini"  @click="share(scope.$index, scope.row)">分享</el-button>
                <el-button size="mini" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="block">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="page" :page-size="pageSize" layout="total,prev, pager, next" :total="total"></el-pagination>
    </div>
    <!-- 分享窗口 -->
    <el-dialog title=" 分享问卷" :visible.sync="showShare">
        <p>分享二维码或复制链接进行问卷填写</p>
        <el-button type="text">生成二维码</el-button>
        <div style="display:flex;justify-content:center;">
            <vue-q-art :download="download" :config="config"></vue-q-art>
        </div>
        <el-button type="text">生成链接</el-button>
        <div style="display:flex;justify-content:center;">
            <el-input :value="shareLink"/>
        </div><br>
    </el-dialog>
  </section>
</template>
<script>
  import {ajax, storage} from 'utils';
  import common from 'common';
  import VueQArt from 'vue-qart'
  export default {
    components:{VueQArt},
    data() {
      return {
        //生成二维码配置
        config: {
            value: '',
            imagePath: '/static/flower.jpg',
            filter: 'color'
        },
        download: {
            visible: true,
            text: "下载二维码",
            style: {
                fontSize: "16px",color:"white",background:"green",border:"none",padding:"2px",boxshadow:"3px 3px 3px 2px #ccc",
                cursor:"pointer"
            }
        },
        //分享链接
        showShare:false,
        shareLink:'',   
        page:1, 
        pageSize:20,
        total:0,

        qstype:'',
        keyword:'',
        tableData5:[],
        qsTypeList:[],
        userInfo:{uid:''}
      }
    },methods:{
        handleCurrentChange(val) {
            this.initQsList('questionare',this.page,this.pageSize);
        },
        //数据
        dataView(index,row){
            console.log(this.tableData5[index].timu);
            this.$router.push('/qsdata')
        },
        //编辑
        edit(index,row){this.$router.push(`/qscreate/${row.uid}/${row.qid}`);},
        //分享
        share(index,row){
            ajax.call(this,'/getServerIP',{},(res,err)=>{
                if(!err){
                    console.log(res.ip)
                    this.shareLink=`${res.ip}:3000/qsonline/${row.uid}/${row.qid}`;
                    this.config.value = this.shareLink;
                    this.showShare=true;

                }else{
                    this.error('获取本地IP 失败');
                }
            })
        },
        //删除
        del(index,row){
            this.$confirm('此操作将删除该问卷, 是否继续?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
                ajax.call(this,'/delQS',{qid:row.qid},(res,err)=>{
                    if(!err){this.success('删除成功');this.tableData5.splice(index,1);this.searchData.total--;}
                    else this.error('删除失败')
                });
            }).catch(() => {});
        },
        //发布
        online(index,row){
           console.log(index, row)
           ajax.call(this,'/onlineQS',{qid:row.qid},(res,err)=>{
                if(!err){
                    this.tableData5[index].status='回收中';
                    this.success('已发布');
                }
            })
        },
        //停止回收
        offline(index,row){
            console.log(index,row)
            ajax.call(this,'/offlineQS',{qid:row.qid},(res,err)=>{
                if(!err){
                    this.tableData5[index].status='未发布';
                    this.success('已暂停问卷发布');
                }
            })
        },
        //初始化我的问卷列表
        initQsList(table,page,pageSize){
            ajax.call(this,'/searchAllTemplate',{table,page,pageSize},(res,err)=>{
                if(!err){
                    this.tableData5 = [];
                    res.res.data.forEach(val=>{
                        val.timu=JSON.parse(val.timu);
                        this.tableData5.push(val);
                    })
                    this.page=res.res.page;
                    this.total=res.res.total;
                }
            })
        },   
        //查询问卷
        searchQS(){
            this.page=1;
            this.pageSize=20;
            let where =`title `;
            if(this.qstype){
                where =`type like '%${this.qstype}%' and title `;
            }
            let whereval = `'%${this.keyword}%'`;
            ajax.call(this,'/searchAllQS',{table:'questionare',page:this.page,pageSize:this.pageSize,where,whereval},(res,err)=>{
                if(!err){
                    this.tableData5 = [];
                    res.res.data.forEach(val=>{
                        val.timu=JSON.parse(val.timu);
                        this.tableData5.push(val);
                    })
                    this.page=res.res.page;
                    this.total=res.res.total;
                }
            })
        },   
        //问卷类型
        initQsType(){
            ajax.call(this,'/operType',{operType:'get'},(res,err)=>{
                if(!err){
                    this.qsTypeList = res.data;
                }
            })
        },
        checkLogin(){
            ajax.call(this,'/isLogin',{},(res,err)=>{
                this.userInfo.uid= res.uid;
            })
        }       
    },created(){
        this.checkLogin()
        this.initQsList('questionare',this.page,this.pageSize);
        this.initQsType();
    },watch:{
        keyword(val){if(!val){this.pageSize=20;this.initQsList('questionare',1,20)}}
    },mixins:[common.mixin]
  }
</script>
<style lang="less" scoped>
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
.wenjuanmuban{width:80%;margin:0 auto;min-height:300px;overflow: scroll;color:#333;position: relative;background:none;box-shadow:3px 3px 6px 2px #ccc;
        img{width:100%;height:100%;position:absolute;z-index:5}
        .wjcontent{background:rgba(255,255,249,0.9);position:relative;width:80%;height:100%;z-index:20;margin:10px auto;}
        .wenjuantitle{text-align: center;font-size: 30px;}
        .wenjuandesc{display:flex;justify-content: center;align-items: center;width:80%;min-height: 80px;border:solid 1px #888;margin:10px auto;}
        .timutitle{font-size:20px;background:#ccc;color:#222;width:80%;margin:0 auto;}
        .timuwrap{border: solid 1px #ccc;padding:5px 20px;width:80%;margin:10px auto;}
    }
</style>