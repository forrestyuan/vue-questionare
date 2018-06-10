<template>
    <div class="outerbox">
        <!-- 顶部信息 -->
        <section class="topinfo">
            <h1 class="headtitle">选择问卷模板</h1><br>
            <div class="wrapsearch">
                <el-input  placeholder="请输入检索内容" v-model="searchkeyword" class="input-with-select">
                    <el-select  v-model="searchtype" slot="prepend" placeholder="请选择检索前置条件">
                        <el-option label="类别检索" value="type"></el-option>
                        <el-option label="题目检索" value="title"></el-option>
                    </el-select>
                    <el-button slot="append" class="fa fa-search" @click="searchModule()"></el-button>
                </el-input>
                <el-button  class="newwjbtn"> <i class="fa fa-plus"></i> 新建问卷</el-button>
            </div>
            <div class="wjnumtip">~当前拥有问卷模板<h3>{{searchData.total}}</h3>套~</div>
        </section>

        <!-- 模板列表 -->
        <el-table :data="tableData5" highlight-current-row style="width: 100%;">
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
                            <div class="operationbtn">
                                <!-- <el-button type="success" @click="tijiaoWenjuan(props.row.timu,props.row.qid)">提交</el-button> -->
                                <el-button type="success" @click="handleBeModule(props.index,props.row)">选择此模板</el-button>
                            </div>
                        </div>
                    </section>
                </template>
            </el-table-column>
            <el-table-column  label="编号"  prop="qid"> </el-table-column>
            <el-table-column  label="类别"  prop="type"> </el-table-column>
            <el-table-column   label="标题"  prop="title"></el-table-column>
            <el-table-column label="题目数">
                <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                        <el-tag sortable type='primary' size="medium">{{ scope.row.timu.length }} 题</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="积分奖励">
                <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">
                        <el-tag sortable type='success' size="medium">{{ scope.row.score }} 分</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" :minWidth="120">
                <template fixed slot-scope="scope" >
                    <el-tooltip class="item" effect="dark" content="选择作为模板" placement="right">
                        <el-button  size="medium" type="success" @click="handleBeModule(scope.$index, scope.row)"><i  class="fa fa-sticky-note"></i>选择模板</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination  @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-size="searchData.pageSize" layout="prev, pager, next" :total="searchData.total"></el-pagination>
        </div>
    </div>
</template>

<script type="text/javascript">
    import {ajax, storage} from 'utils';
    import common from 'common';
    export default {
        name: 'qstemplate',
        data () {
            return {
                /*  
                    //颜色选择
                    color(){return {title:"我是题目",type:"color",answer:"#f0f",isrequire:true,tmp:''}},
                    //单选
                    radio(){return {title:"我是题目",type:"radio",answer:"",isrequire:true,options:["goodtimuoption","twotimuoption"],tmp:''}},
                    //多选
                    checkbox(){return {title:"我是题目",type:"checkbox",answer:[],isrequire:true,options:["goodtimuoption","twotimuoption"],tmp:''}},
                    //单行文本
                    input(){return {title:"我是题目",type:"text",answer:"",isrequire:true}},
                    //多行文本
                    textarea(){return {title:"我是题目",type:"textarea",answer:"",isrequire:true}},
                    //下拉单选
                    select(){return {title:"我是题目",type:"select",answer:"",isrequire:true,options:["goodtimuoption","twotimuoption"],tmp:''} },
                    //下拉多选
                    multiSelect(){return {title:"我是题目",type:"selectmulti",answer:[],isrequire:true,options:["goodtimuoption","twotimuoption"],tmp:''}},
                    //滑动条
                    bar(){return {title:"我是题目",type:"bar",isrequire:true,options:[{label:'巴拉巴拉',answer:0},{label:'巴拉巴拉',answer:0},{label:'巴拉巴拉',answer:0}]}},
                    //评分题
                    rate(){return {title:"我是题目",type:"rate",isrequire:true,options:[{answer:null,texts:['极差', '失望', '一般', '满意', '惊喜']}]}},
                    rateBasic(){return {title:"我是题目",type:"rateBasic",isrequire:true,options:[{answer:null,texts:['极差', '失望', '一般', '满意', '惊喜']}]}},
                */
               searchData:{
                   page:0,
                   pageSize:15,
                   total:20,
               },
                searchtype:'title',
                searchkeyword:'',
                tableData5:[],
              
            }
        },
        methods: {
             qscreate(){
                 ajax.call(this,'/isLogin',{},(res,err)=>{if(!err){
                   if(res.loginStatus){
                       this.$router.replace('/qscreate/'+this.userInfo.uid)
                   }else{
                       this.$router.replace('/login')
                   }
               }})
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                // this.initQsList('questionare',this.searchData.page,this.searchData.pageSize);
            },
            searchModule(){
                console.log(this.searchtype,this.searchkeyword)
                this.searchData.page=1;
                this.tableData5=[];
                ajax.call(this,'/searchAllQS',{table:'questionare',page:1,pageSize:15,where:`${this.searchtype}`,whereval:`'%${this.searchkeyword}%'`},(res,err)=>{
                    if(!err){
                        res.res.data.forEach(val=>{
                            val.timu=JSON.parse(val.timu);
                            this.tableData5.push(val);
                        })
                        this.searchData.page=res.page;
                        this.searchData.total=res.total;
                        console.log(res);
                    }
                })
            },
           //选择模板
           handleBeModule(index,row){
               ajax.call(this,'/isLogin',{},(res,err)=>{if(!err){
                   if(res.loginStatus){
                       this.$router.push(`/qscreate/${res.uid}/${row.qid}/mod`)
                   }else{
                       this.$router.replace('/login')
                   }
               }})
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
                       this.searchData.page=res.res.page;
                       this.searchData.total=res.res.total;
                   }
               })
           },
        },
        created(){
            this.initQsList('questionare',this.searchData.page,this.searchData.pageSize);
        },
        mixins:[common.mixin],

    }
</script>
<style lang="less" scoped>

.outerbox{
    padding:20px 100px;
    margin:0;
    .wenjuanmuban{width:80%;margin:0 auto;min-height:300px;overflow: scroll;color:#333;position: relative;background:none;box-shadow:3px 3px 6px 2px #ccc;
        img{width:100%;height:100%;position:absolute;z-index:5}
        .wjcontent{background:rgba(255,255,249,0.9);position:relative;width:80%;height:100%;z-index:20;margin:10px auto;}
        .wenjuantitle{text-align: center;font-size: 30px;}
        .wenjuandesc{display:flex;justify-content: center;align-items: center;width:80%;min-height: 80px;border:solid 1px #888;margin:10px auto;}
        .timutitle{font-size:20px;background:#ccc;color:#222;width:80%;margin:0 auto;}
        .timuwrap{border: solid 1px #ccc;padding:5px 20px;width:80%;margin:0 auto;}
        .operationbtn{text-align: center;margin:20px;}
    }
    .topinfo{
        .headtitle{font-size:30px;text-align:center;}
        .wrapsearch{display:flex;padding: 30px 0; justify-content:center; background:#7ba7ab;
            .el-input{width:35%;border:2px solid #324b4e;}
            .el-select{width:105px;color:#324b4e;background:#F9F0DA}
            .el-button{ background:#F9F0DA;color:#324b4e}
            .newwjbtn{color:#F9F0DA;background:#324b4e;margin-left: 20px;}
            .el-input__inner {width: 130px;}
        }
        .wjnumtip{display:flex;justify-content:center; width:100%;background:#7ba7ab;color:white;h3{color:red;}}
    }
}



</style>
