<template>
  <section>
      <div class="wrapmain">
        <div class="qsAttr">
            <div style="text-align:center;font-size:22px;margin-top:10px">{{qsInfo.title}}</div>
            <div style="font-size:14px;color:#999;text-align:center">类型：{{qsInfo.type}}</div><hr><br>
        </div>
        <div style="text-align:right">
            <el-radio-group v-model="chartType" size="meidum">
                <el-radio-button label="折线图"/>
                <el-radio-button label="柱形图"/>
                <el-radio-button label="雷达图"/>
                <el-radio-button label="极坐标图"/>
                <el-radio-button label="横向柱形图"/>
            </el-radio-group>
        </div>
        <div class="timu" v-for="(item,index) in timus" :key="index">
            <div class="left">   
                <el-card style="width:100%">
                    <div slot="header">
                        <el-tag>{{'题目'+(index+1)+':'}}</el-tag>
                        <span>{{item.lineName}}   <el-tag type="success">{{getSum(item.datas)}}回答</el-tag></span>
                    </div>
                    <div v-for="(val,i) in item.labels" :key="i">
                        <el-tag style="width:80%;height:25px;margin:5px 0;font-size:16px;">{{i+1+'、'+val}}</el-tag>
                    </div>
                </el-card>    
            </div>
            <div class="right">
                <chartjs-line v-if="chartType=='折线图'" :datalabel="item.lineName" :labels="item.labels" :data="item.datas" :width="400" :height="350" :fill="true" pointbordercolor="#f35009"/>
                <chartjs-bar v-if="chartType=='柱形图'" :datalabel="item.lineName" :labels="item.labels" :data="item.datas" :width="400" :height="350" :fill="true" />
                <chartjs-horizontal-bar v-if="chartType=='横向柱形图'" :datalabel="item.lineName" :labels="item.labels" :data="item.datas" :width="400" :height="350" :fill="true" />
                <chartjs-radar v-if="chartType=='雷达图'" :datalabel="item.lineName" :labels="item.labels" :data="item.datas" :width="400" :height="350" :fill="true" />
                <chartjs-polar-area v-if="chartType=='极坐标图'" :datalabel="item.lineName" :labels="item.labels" :data="item.datas" :width="400" :height="350" :fill="true"  />
            </div>
         </div>
      </div>
  </section>
</template>
<script type="text/javascript">
    import {ajax} from 'utils';
    import common from 'common';
    module.exports = {
        name: 'dataview',
        data() {
            return {
                chartType:'折线图',
                qsInfo:{title:'问卷系统测试问卷表',type:'社会观点'},
                timus:[
                    {lineName:"你的性别？",labels:["男","女"],datas:[50,25]},
                    {lineName:"选择你的幸运色",labels:['红色','粉色','蓝色','紫色','黄色','黑色','白色'],datas:[15,100,58,44,5,68,75,15]},
                    {lineName:"你认为影响就业的因素有哪些？",labels:["专业知识","工作经验","学科优势","外语能力","学校知名度","其它"],datas:[150,110,150,200,50,210,30]},
                    {lineName:"你希望在哪个城市工作？",labels:['深圳','广州','北京','杭州'],datas:[80,60,50,10]},
                    {lineName:"你期望的月薪是？",labels:["2000元及以下","2001-3000元","3001-5000元","5001-7000元","7001-10000元","10000元以上"],datas:[150,600,410,80,150,33]},
                    {lineName:"你择业时优先考虑哪些因素？",labels:["工作环境","社会地位","工作稳定性","发展机会","工作地点","薪酬待遇","专业对口","其它"],datas:[15,25,800,600,120,30,10,20]},
                    {lineName:"你对当前工作环境评价如何？",labels:["极差","失望","一般","满意","惊喜"],datas:[0,1,25,100,50]},
                    {lineName:"你对自身专业能力的评价？",labels:['很好','一般','满意'],datas:[25,500,200]},   
                    {lineName:"请描述你的工作意向？",labels:['计算机相关','产品经理','销售','运维'],datas:[520,250,630,52]},
                    {lineName:"你对当前就业环境的期望值为？",labels:['90分','85分','45分'],datas:[15,25,900]},
                ]
            }
        },
        methods:{
            getSum(datas){
                let sum = 0;
                datas.forEach(val=>sum+=val);
                return sum;
            }
        },
        created(){
        },
        mixins:[common.mixin]
    }
</script>
<style lang="less" scoped>
.wrapmain{
    position: relative;background: #eee;box-shadow: 3px 3px 3px 2px #ccc;border:solid #ccc 1px;width:80vw;margin:0 auto;
    .timu{display:flex;border:solid 1px #ccc;margin:10px;
        .left{display: flex;flex-grow: 1.5;}
    }
}
</style>
