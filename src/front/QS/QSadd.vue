<template>
    <section class="main" v-loading="loading">
      <div class="left">
        <el-button style="width:100%;" type="warning">题目模板</el-button>
        <el-collapse v-model="activeNames" >
          <el-collapse-item title="选项题" name="1">
            <el-tooltip placement="right" content="点击添加选择单选题">
              <li @click="addRadio"><i class="fa fa-dot-circle-o"></i> 单选题</li>
            </el-tooltip>
             <el-tooltip placement="right" content="点击添加多选题">
            <li @click="addCheckbox"><i class="fa fa-check-square-o"></i> 多选题</li>
            </el-tooltip>
          </el-collapse-item>
          <el-collapse-item title="文本题" name="2">
            <el-tooltip placement="right" content="点击添加单行文本题">
              <li @click="addInput"><i class="fa fa-edit"></i> 单行文本题</li>
            </el-tooltip>
            <el-tooltip placement="right" content="点击添加多行文本题">
              <li @click="addTextarea"><i class="fa fa-edit"></i> 多行文本题</li>
            </el-tooltip>
          </el-collapse-item>
          <el-collapse-item title="下拉题" name="3">
            <el-tooltip placement="right" content="点击添加下拉单选">
              <li @click="addSelect"><i class="fa fa-caret-square-o-down"></i> 下拉单选</li>
            </el-tooltip>
            <el-tooltip placement="right" content="点击添加下拉多选">
              <li @click="addMultiSelect"><i class="fa fa-caret-square-o-down"></i> 下拉多选</li>
            </el-tooltip>
          </el-collapse-item>
          <el-collapse-item title="评分题" name="4">
            <el-tooltip placement="right" content="点击添加基础评分题">
              <li @click="addRateBasic"><i class="fa fa-circle"></i> 基础评分题</li>
            </el-tooltip>
            <el-tooltip placement="right" content="点击添加星形评分题">
              <li @click="addRate"><i class="fa fa-star-half-empty"></i> 星形评分题</li>
            </el-tooltip>
          </el-collapse-item>
          <el-collapse-item title="滚动条" name="5">
            <el-tooltip placement="right" content="点击添加滚动条题">
              <li @click="addBar"><i class="fa fa-bars"></i> 滚动条题</li>
            </el-tooltip>
          </el-collapse-item>
          <el-collapse-item title="个性题" name="6">
            <el-tooltip placement="right" content="点击添加颜色选择题">
              <li @click="addColor"><i class="fa fa-eyedropper"></i> 颜色选择题</li>
            </el-tooltip>
          </el-collapse-item>
        </el-collapse>
      </div>     
      <div class="right">
        <div class="bgBox">
            <h3>选取背景图片</h3>
            <div class="bgselect">
                <el-radio-group v-model="wj.bgimg">
                  <el-tooltip placement="top">
                    <div slot="content"><img style="width:400px;height:400px" src="/static/wjbg/wjbg1.jpg"></div>
                    <el-radio-button label="/static/wjbg/wjbg1.jpg"><img style="width:80px;height:80px;" src="/static/wjbg/wjbg1.jpg"></el-radio-button>
                  </el-tooltip> 
                  <el-tooltip placement="top">
                    <div slot="content"><img style="width:400px;height:400px" src="/static/wjbg/wjbg2.jpg"></div>
                    <el-radio-button label="/static/wjbg/wjbg2.jpg"><img style="width:80px;height:80px;" src="/static/wjbg/wjbg2.jpg"></el-radio-button>
                  </el-tooltip> 
                  <el-tooltip placement="top">
                    <div slot="content"><img style="width:400px;height:400px" src="/static/wjbg/wjbg3.jpg"></div>
                    <el-radio-button label="/static/wjbg/wjbg3.jpg"><img style="width:80px;height:80px;" src="/static/wjbg/wjbg3.jpg"></el-radio-button>
                  </el-tooltip> 
                  <el-tooltip placement="top">
                    <div slot="content"><img style="width:400px;height:400px" src="/static/wjbg/wjbg4.jpg"></div>
                    <el-radio-button label="/static/wjbg/wjbg4.jpg"><img style="width:80px;height:80px;" src="/static/wjbg/wjbg4.jpg"></el-radio-button>
                  </el-tooltip> 
                  <el-tooltip placement="top">
                    <div slot="content"><img style="width:400px;height:400px" src="/static/wjbg/wjbg5.jpg"></div>
                    <el-radio-button label="/static/wjbg/wjbg5.jpg"><img style="width:80px;height:80px;" src="/static/wjbg/wjbg5.jpg"></el-radio-button>
                  </el-tooltip> 
                  <el-tooltip placement="top">
                    <div slot="content"><img style="width:400px;height:400px" src="/static/wjbg/wjbg6.jpg"></div>
                    <el-radio-button label="/static/wjbg/wjbg6.jpg"><img style="width:80px;height:80px;" src="/static/wjbg/wjbg6.jpg"></el-radio-button>
                  </el-tooltip> 
                  <el-tooltip placement="top">
                    <div slot="content"><img style="width:400px;height:400px" src="/static/wjbg/wjbg7.jpg"></div>
                    <el-radio-button label="/static/wjbg/wjbg7.jpg"><img style="width:80px;height:80px;" src="/static/wjbg/wjbg7.jpg"></el-radio-button>
                  </el-tooltip> 
                  <el-tooltip placement="top">
                    <div slot="content"><img style="width:400px;height:400px" src="/static/wjbg/wjbg8.jpg"></div>
                    <el-radio-button label="/static/wjbg/wjbg8.jpg"><img style="width:80px;height:80px;" src="/static/wjbg/wjbg8.jpg"></el-radio-button>
                  </el-tooltip> 
                  <el-tooltip placement="top">
                    <div slot="content"> <el-tag type="success">无背景</el-tag> </div>
                    <el-radio-button label=""><span style="display:flex;justify-content:center;align-items:center; width:80px;height:80px;">无背景</span></el-radio-button>
                  </el-tooltip> 
                </el-radio-group>
            </div>
        </div>
        <div class="questionPaper">
            <h3>创建问卷</h3>
             <section  class="wenjuanmuban">
                  <img :src="wj.bgimg">
                  <div class="wjcontent">
                      <!-- 问卷标题  -->
                      <input type="text" class="wenjuantitle" v-model="wj.title">
                      <!-- 问卷描述 -->
                      <textarea type="text" class="wenjuandesc" v-model="wj.desc"></textarea><br>
                      <!-- 每一道题 数组中保存 -->
                      <div class="timuwrap" style="text-align:center;" v-if="!wj.timu.length"> <el-tag type="danger">提示： 您还没有添加题目，从左边点击题目模板添加题目!!!</el-tag></div>
                      <div v-if="wj.timu.length"  v-for="(item,index) in wj.timu" :key=index>
                          <!-- 题目标题 -->
                          <div class="timutitle">
                            <span  style="color:red" v-if="item.isrequire">*</span>{{index+1}}、<input type="text" class="input" v-model="item.title"> 
                            <span style="float:right;padding:0 5px 15px 0;">
                              <el-tooltip v-if="item.isrequire" placement="top" content="点击设置为非必填">
                                <el-button style="font-size:12px;" type="danger" size="mini" @click="notRequireTimu(index)">必填</el-button>
                              </el-tooltip>
                              <el-tooltip v-if="!item.isrequire" placement="top" content="点击设置为必填">
                                <el-button style="font-size:12px;" type="warning" size="mini" @click="requireTimu(index)">可填</el-button>
                              </el-tooltip>
                              <el-tooltip placement="top" content="删除题目">
                                <el-button style="font-size:12px;" type="danger" size="mini" class="fa fa-trash" @click="deleteTimu(index)"/>
                              </el-tooltip>
                              <el-tooltip placement="top" content="下移题目">
                                <el-button style="font-size:12px;" type="primary" size="mini" class="fa fa-arrow-down" @click="downTimu(index)"/>
                              </el-tooltip>
                              <el-tooltip placement="top" content="上移题目">
                                <el-button style="font-size:12px;" type="primary" size="mini" class="fa fa-arrow-up" @click="upTimu(index)"/>
                              </el-tooltip>
                            </span>
                          </div>
                          <div class="timuwrap">
                              <!-- 颜色选择器 -->
                              <el-color-picker v-if="item.type=='color'" v-model="item.answer"/>
                              <!-- 单选 -->
                              <el-radio-group v-if="item.type=='radio'" v-model="item.answer" >
                                  <el-radio  v-for="opt in item.options" :key="opt"  :label="opt"/>
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
                              <el-slider v-if="item.type=='bar'" v-model="item.answer" />
                              <!-- 评分 星星-->
                              <el-rate v-if="item.type=='rate'" v-model="item.answer" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" show-text/>
                              <!-- 评分 单选 -->
                              <div v-if="item.type=='rateBasic'">
                                  <el-radio-group v-model="item.answer" >
                                      <el-radio  v-for="txt in item.options" :key="txt" :label="txt"/>
                                  </el-radio-group>
                              </div>
                              <div v-if="item.type=='radio' || item.type =='checkbox' || item.type=='select' || item.type=='selectmulti' || item.type=='rateBasic'">
                                  <el-button size="mini" @click="addOption(item)">添加选项</el-button>
                                  <el-button size="mini" @click="deleteOption(item)">删除选项</el-button>
                              </div>
                          </div>
                      </div>
                      <div class="operationbtn">
                          <div>
                            <span class="demonstration">设置截止日期:</span>
                            <el-date-picker v-model="wj.expiretime" type="date" placeholder="选择停止日期"/>
                            <el-tooltip content="(系统提供奖励积分,但每发布一次问卷扣除用户积分1分)" placement="top">
                              <span>设置奖励分</span>
                            </el-tooltip>
                              <el-select style="width:100px" v-model="wj.score">
                                <el-option label="2分" value="2"/>
                                <el-option label="3分" value="3"/>
                                <el-option label="4分" value="4"/>
                                <el-option label="5分" value="5"/>
                                <el-option label="6分" value="6"/>
                                <el-option label="7分" value="7"/>
                                <el-option label="8分" value="8"/>
                                <el-option label="9分" value="9"/>
                                <el-option label="10分" value="10"/>
                              </el-select>
                              <span>问卷类型：</span>
                              <el-select style="width:100px" v-model="wj.type">
                                <el-option v-for="item in qstypelist" :key="item.qstypeid" :label="item.typename" :value="item.typename"/>
                              </el-select>
                          </div>
                          <el-button v-if="!isEdit" type='primary' :disabled="wj.timu.length==0 || wj.expiretime=='' || wj.type ==''" @click="saveQS()" >保存问卷</el-button>
                          <el-button v-if="!isEdit" type="success" :disabled="wj.timu.length==0 || wj.expiretime=='' || wj.type==''" @click="saveQS('回收中')">立即发布</el-button>
                          <el-button style="margin:20px;" v-if="isEdit" type="success" :disabled="wj.timu.length==0 || wj.expiretime=='' || wj.type==''" @click="updateQS()">立即更新</el-button>
                      </div>
                  </div>
              </section>
        </div>
      </div>
    </section>
</template>

<script>
import {ajax,storage} from 'utils'
import common from 'common'
export default {
  name:'qsadd',
  data(){
      return {
        loading:false,
        //题目列表
        activeNames: ['1'],
        //问卷-------问卷 数据模型
        wj:{
          uid:'',
          title:'点击输入问卷标题',
          status:'回收中', 
          score:'2', 
          bgimg:'/static/wjbg/wjbg1.jpg',
          type:'', 
          desc:'点击输入问卷描述', 
          timu:[],
          expiretime:'',
          createtime:''
        },
         qstypelist:[],
         userInfo:{uid:'' },

         //编辑模式
         isEdit:false

      }
  },methods:{
    //题型：
    color(){   return {title:"我是颜色题目",type:"color",answer:"#ff00ff",isrequire:true}},
    input(){   return {title:"我是文本题目",type:"text",answer:"",isrequire:true}},
    textarea(){return {title:"我是多行文本题目",type:"textarea",answer:"",isrequire:true}},
    bar(){     return {title:"我是滑动题目",type:"bar",isrequire:true,answer:20}},
    rate(){    return {title:"我是星形评分题目",type:"rate",isrequire:true,answer:''}},
    radio(){   return {title:"我是单选题目",type:"radio",answer:"",isrequire:true,options:["goodtimuoption","twotimuoption"]}},
    checkbox(){return {title:"我是多选题目",type:"checkbox",answer:[],isrequire:true,options:["goodtimuoption","twotimuoption"]}},
    select(){  return {title:"我是下拉单选题目",type:"select",answer:"",isrequire:true,options:["goodtimuoption","twotimuoption"]} },
    multiSelect(){return {title:"我是下拉多选题目",type:"selectmulti",answer:[],isrequire:true,options:["goodtimuoption","twotimuoption"]}},
    rateBasic(){return {title:"我是基础评分题目",type:"rateBasic",isrequire:true,answer:'',options:['极差', '失望', '一般', '满意', '惊喜']}},

    //添加题目
    addRadio(){ this.wj.timu.push(this.radio()) },
    addCheckbox(){ this.wj.timu.push(this.checkbox()) },
    addInput(){ this.wj.timu.push(this.input()) },
    addTextarea(){ this.wj.timu.push(this.textarea()) },
    addSelect(){ this.wj.timu.push(this.select()) },
    addMultiSelect(){ this.wj.timu.push(this.multiSelect()) },
    addRate(){ this.wj.timu.push(this.rate()) },
    addRateBasic(){ this.wj.timu.push(this.rateBasic()) },
    addBar(){ this.wj.timu.push(this.bar()) },
    addColor(){ this.wj.timu.push(this.color()) },
    //题目操作 增、删、移动、是否必填
    deleteTimu(index){ this.wj.timu.splice(index,1); },
    downTimu(index){
      let obj = this.wj.timu.splice(index,1);
      this.wj.timu.splice(index+1,0,obj[0]);
    },
    upTimu(index){
      let obj = this.wj.timu.splice(index,1);
      this.wj.timu.splice(index-1,0,obj[0]);
    },
    requireTimu(index){
      this.wj.timu[index].isrequire = true;
    },
    notRequireTimu(index){
      this.wj.timu[index].isrequire = false;
    },
    //选项操作
    addOption(item){
        this.$prompt('请输入选项值', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', }).then(({ value }) => {
           item.options.push(value);
         }).catch(() => {});
    },
    deleteOption(item,type=""){
        this.$prompt('请输入删除选项的序号（1到n）', '提示', { confirmButtonText: '确定',cancelButtonText: '取消',
           inputPattern: /[1-9]+/, inputErrorMessage: '只能输入数字且大于0'
          }).then(({ value }) => {
           item.options.splice(value-1,1);
         }).catch(() => {});
    },
    //问卷保存
    saveQS(status='未发布'){
      this.loading=true;
      let wj = JSON.parse(JSON.stringify(this.wj));
      wj.createtime = new Date().getTime();
      wj.expiretime = this.wj.expiretime.getTime();
      wj.uid = this.userInfo.uid;
      wj.timu = JSON.stringify(this.wj.timu);
      wj.status=status;
      ajax.call(this,'/addQS',wj,(res,err)=>{
        this.loading=false;
        if(!err){
          this.$router.replace('/qslist/'+this.userInfo.uid);
        }
      })
    },
    //用户信息
    initUserInfo(uid){
      ajax.call(this,'/getUserInfoById',{uid:uid},(res, err)=>{
        if(!err){
          this.userInfo = res[0];
        }else{
          this.$router.replace('/500')
        }
      });
    },
    //初始化问卷类型
    initqstypeList(){
      ajax.call(this,'/operType',{operType:'get'},(res,err)=>{
        if(!err){
          this.qstypelist = res.data;
          // console.log(res.data);
        }
      })
    },
    updateQS(){
      this.wj.expiretime = this.wj.expiretime.getTime();
      this.wj.timu=JSON.stringify(this.wj.timu)
       ajax.call(this,'/updateQS',this.wj,(res,err)=>{
        if(!err){
          this.wj={};
          this.$router.replace('/qslist/'+this.userInfo.uid)
          this.success('更新成功')
        }else{
          this.error('更新失败')
        }
      });
    }
  },created(){
    this.initUserInfo(this.$route.params.id);
    this.initqstypeList()
    if(this.$route.params.qid && !this.$route.params.mod){
      this.isEdit=true;
      ajax.call(this,'/getQSByid',{qid:this.$route.params.qid},(res,err)=>{
        if(!err){
          res.data[0].timu = JSON.parse(res.data[0].timu);
          this.wj=res.data[0];
          this.wj.expiretime = '';
        }
      })
    }else if(this.$route.params.qid && this.$route.params.mod){
      this.isEdit=false;
      ajax.call(this,'/getQSByid',{qid:this.$route.params.qid},(res,err)=>{
        if(!err){
          res.data[0].timu = JSON.parse(res.data[0].timu);
          this.wj=res.data[0];
          this.wj.expiretime = '';
          this.wj.createtime='';
          console.log(res);
        }
      })
    }
  },mixins:[common.mixin]
}
</script>
<style lang="less" scoped> 
  .main{display: flex;justify-content: flex-start;align-items: flex-start;
    .left{color: #333;width:200px;height:100vh;border-bottom: solid 1px #ccc; border-right: solid 1px #ccc;overflow:scroll;
      ul,li{display: inline-block;list-style: none;padding:0;margin:0;}
      li{padding:10px 0;width:100%;text-align: center;font-size: 18px;border-bottom: solid 1px #ccc;cursor: pointer;}
      li:hover{background: skyblue;color:wheat;}
    }
    .right{width:100%;height:100vh;overflow: scroll;
        .bgBox{border: dashed 1px #ccc;padding:5px;
          .bgselect{display: flex;justify-content: center;}
        } 
      .wenjuanmuban{width:80%;margin:0 auto;min-height:500px;overflow: scroll;color:#333;position: relative;background:none;box-shadow:3px 3px 6px 2px #ccc;
            img{width:100%;height:100%;position:absolute;z-index:5}
            .wjcontent{background:rgba(255,255,249,0.9);position:relative;width:80%;height:100%;z-index:20;margin:10px auto;}
            .wenjuantitle{text-align: center;font-size: 35px;padding:10px 0;border: none;background: none;font-weight: bolder;width: 100%}
            .wenjuandesc{display:flex;width:80%;text-align:center;min-height: 80px;border:dashed 1px #888;margin:10px auto;resize: none;font-size: 18px;background: none}
            .timutitle,input{font-size:20px;background:#eee;color:#222;width:80%;height:35px;margin:0 auto;border: none; input{width:65%}}
            .timuwrap{border: solid 1px #ccc;padding:5px 20px;width:80%;margin:0 auto;}
            .operationbtn{text-align: center;margin:20px;}
            .optinput{background: none;border: none;}
        }
    }
  }
</style>

