<template>
<section  class="wenjuanmuban">
    <img :src="wj.bgimg">
    <div class="wjcontent" >
        <el-tag style="font-size:20px;">第{{timuIndex+1}}个回答/共有{{timuList.length}}个回答</el-tag>
        <h3 class="wenjuantitle">{{wj.title}}</h3>
        <p class="wenjuandesc">{{wj.desc}}</p><br>
        <div  v-for="(item,index) in wj.timu" :key=index>
            <div class="timutitle"><span style="color:red" v-if="item.isrequire">*</span>{{index+1}}、{{item.title}}</div>
            <!-- 题目 -->
            <div class="timuwrap">
                <!-- 颜色选择器 -->
                <span v-if="item.type=='color'" :style="'display:inline-block;width:100px;height:30px;background-color:'+item.answer"></span>
                <el-button v-if="item.type=='color'" type="text">({{item.answer}})</el-button>
                <!-- 单选 -->
                <el-button v-if="item.type=='radio'" >{{item.answer}}</el-button>
                <!-- 复选 -->
                <el-button  v-if="item.type=='checkbox'"  v-for="val in item.answer" :key="val">{{val}}</el-button>
                <!-- 单行文本 -->
                <input  v-if="item.type=='text'" style="height:30px;" disabled type="text" :value="item.answer">
                <!-- 多行文本 -->
                <textarea v-if="item.type=='textarea'" :value="item.answer" disabled cols="50" rows="5"></textarea>
                <!-- 下拉单选 -->
                <el-button v-if="item.type=='select'" >{{item.answer}}</el-button>
                <!-- 下拉多选 -->
                <el-select v-if="item.type=='selectmulti'" multiple  disabled v-model="item.answer" placeholder="请选择(多选)">
                    <el-option v-for="opt in item.options" :key="opt"  :label="opt" :value="opt"/>
                </el-select>
                <!-- 动条 连续 -->
                <div v-if="item.type=='bar'"> <el-slider :max="item.answer+1" :min="item.answer-1" v-model="item.answer"/> </div>
                <!-- 评分 星星-->
                <div v-if="item.type=='rate'"><el-rate v-model="item.answer"  disabled :colors="['#99A9BF', '#F7BA2A', '#FF9900']" show-text/></div>
                <!-- 评分 单选 -->
                <div v-if="item.type=='rateBasic'">
                    <el-radio-group v-model="item.answer"  >
                        <el-radio  v-for="txt in item.options" :disabled="item.answer!=txt" :key="txt" :label="txt"/>
                    </el-radio-group>
                </div>
            </div>
        </div>
        <el-button :disabled="timuIndex<=0" id="prev" @click="previous()" class="fa fa-chevron-left" type="info" size="large"/>
        <el-button :disabled="timuIndex>=timuList.length-1" id="next" @click="next()" class="fa fa-chevron-right" type="info" size="large"/>
    </div>
</section>
</template>
<script type="text/javascript">
    import {ajax, storage} from 'utils';
    import common from 'common';
    export default {
        name: 'qslistread',
        data () {
            return {
                wj:{},
                timuList:[],
                timuIndex:0,
                userInfo:{uid:''},
            }
        },
        methods: {
            //回到顶部
            smoothscroll(){
               var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
                if (currentScroll > 0) {
                    window.requestAnimationFrame(this.smoothscroll);
                    window.scrollTo (0,currentScroll - (currentScroll/5));
                }
            },
            previous(){
                this.timuIndex<=0?this.timuIndex=0:this.timuIndex--;
                this.wj.timu=this.timuList[this.timuIndex];
                this.smoothscroll();
            },
            next(){
                this.timuIndex>=this.timuList.length-1?this.timuIndex=this.timuList.length-1:this.timuIndex++;
                this.wj.timu=this.timuList[this.timuIndex];
                this.smoothscroll();
            }
        },created(){
            this.userInfo.uid=this.$route.params.id;
            if(this.$route.params.qid){
                ajax.call(this,'/getAllHuidaByQid',{qid:this.$route.params.qid},(res,err)=>{
                    if(!err){
                        this.timuList = res.timuList;
                        this.wj = res.questionare;
                        this.wj.timu = this.timuList[0];
                        console.log(this.wj.timu)
                        
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
        .wjcontent{background:rgba(255,255,255,1);position:relative;width:85%;height:100%;z-index:20;margin:20px auto;padding:50px 0;}
        .wenjuantitle{text-align: center;font-size: 30px;}
        .wenjuandesc{display:flex;justify-content: center;align-items: center;width:80%;min-height: 80px;border:solid 1px #888;margin:10px auto;}
        .timutitle{font-size:20px;background:#ccc;color:#222;width:80%;margin:0 auto;}
        .timuwrap{border: solid 1px #ccc;padding:5px 20px;width:80%;margin:10px auto;}

        #prev,#next{position: fixed;top:40vh;width:50px;height:200px;}
        #prev{left:0}
        #next{right:0}
    }

</style>
