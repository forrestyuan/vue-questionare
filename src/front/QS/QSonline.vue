<template>
<section  class="wenjuanmuban">
    <img :src="wj.bgimg">
    <div class="wjcontent" v-show="isFinish" style="width:350px;height:450px;"><h1>感谢您的填写！</h1><br><img style="width:350px;height:350px" src="../../assets/smile.jpg"></div>
    <div class="wjcontent" v-if="!isFinish">
        <el-tag v-if="wj.status=='未发布'" style="font-size:20px">({{wj.status}})问卷已停止回收，无法提交数据</el-tag>
        <el-tag v-if="wj.uid==userInfo.uid" style="font-size:20px">不能给自己创建的问卷提交数据</el-tag>
        <h3 class="wenjuantitle">{{wj.title}}</h3>
        <p class="wenjuandesc">{{wj.desc}}</p><br>
        <div  v-for="(item,index) in wj.timu" :key=index>
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
                    <el-slider v-model="item.answer"/>
                </div>
                <!-- 评分 星星-->
                <div v-if="item.type=='rate'">
                    <el-rate v-model="item.answer"  :colors="['#99A9BF', '#F7BA2A', '#FF9900']" show-text/>
                </div>
                <!-- 评分 单选 -->
                <div v-if="item.type=='rateBasic'">
                    <el-radio-group v-model="item.answer" >
                        <el-radio  v-for="txt in item.options" :key="txt" :label="txt"/>
                    </el-radio-group>
                </div>
            </div>
        </div>
        <div style="text-align:center;margin:20px;">
            <el-button type="success" size="large" :disabled="wj.uid==userInfo.uid || wj.status=='未发布'" @click="submit()">提交问卷</el-button>
            <p style="color:#555">提交问卷后，您将获得：<el-tag type="success">{{wj.score}}积分</el-tag></p>
        </div>
    </div>
</section>
</template>
<script type="text/javascript">
    import {ajax, storage} from 'utils';
    import common from 'common';
    export default {
        name: 'qslist',
        data () {
            return {
                wj:{},
                userInfo:{uid:''},
                isFinish:false
            }
        },
        methods: {
            submit(){
                let answer=[];
                let timu =this.wj.timu;
                let isnot = false;
                timu.forEach(val=>{
                    if(val.isrequire && (val.answer=='' || val.answer.length==0) ){
                        isnot = true;
                    }
                });
                if(isnot){ this.warn('存在必填项未填写，请检查！')}
                else{
                    //提交答案
                    timu.forEach(val=>{answer.push(val.answer);});
                    answer = JSON.stringify(answer);
                    ajax.call(this,'/operHuida',{operType:'add',qid:this.wj.qid,content:answer},(res,err)=>{
                        if(!err){
                            this.isFinish=true;
                            this.success('提交成功，感谢您的参与')
                        }
                    })
                }
            }
        },created(){
            this.userInfo.uid=this.$route.params.id;
            if(this.$route.params.qid){
                ajax.call(this,'/getQSByid',{qid:this.$route.params.qid},(res,err)=>{
                    if(!err){
                        res.data[0].timu = JSON.parse(res.data[0].timu);
                        this.wj=res.data[0];
                    }
                })
            }
        },
        mixins:[common.mixin],
    }
</script>
<style lang="less" scoped>
    .wenjuanmuban{width:100vw;margin:0 auto;min-height:100vh;overflow: scroll;color:#333;position: relative;background:none;box-shadow:3px 3px 6px 2px #ccc;
        img{width:100%;height:100%;position:absolute;z-index:5}
        .wjcontent{background:rgba(255,255,249,0.9);position:relative;width:85%;height:100%;z-index:20;margin:20px auto;padding:50px 0;}
        .wenjuantitle{text-align: center;font-size: 30px;}
        .wenjuandesc{display:flex;justify-content: center;align-items: center;width:80%;min-height: 80px;border:solid 1px #888;margin:10px auto;}
        .timutitle{font-size:20px;background:#ccc;color:#222;width:80%;margin:0 auto;}
        .timuwrap{border: solid 1px #ccc;padding:5px 20px;width:80%;margin:10px auto;}
    }

</style>
