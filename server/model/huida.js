//后台路由配置
import config from '../config.js'
import mysql from 'mysql2/promise'
import base from './Base.js'


async function searchHuida(ctx){
    const data = ctx.request.body;
    const connection = await mysql.createConnection(config.mysqlDB);
    let qid = data.qid;
    let [qres] = await connection.execute(`select * from questionare where qid = ${qid}`);
    let questionare = qres[0];//问卷
    let timu = JSON.parse(qres[0].timu);//题目
    let [huidaList] = await connection.execute(`select content from huida where qid = ${qid}`);//回答
    let tmphuidaList  =[];
        huidaList.forEach((val,index)=>{tmphuidaList.push(JSON.parse(val.content))});
        huidaList=tmphuidaList;
        // console.log(JSON.stringify(huidaList));
        // console.log(JSON.stringify(timu));
        let timuList = [];
        for(let i = 0;i < huidaList.length; i++){
            let huida = huidaList[i];
            timu.forEach((val,index)=>{
                timu[index].answer=huida[index];
            })
            timuList.push(timu);
        }

    //遍历回答(hi 问卷数)
    // huidaList.forEach((hval,hi)=>{
    //     let tmpOpt = [];//
    //     //遍历每张问卷的题目
    //     timu.forEach((val,i)=>{
    //         let opts = val.options; //该题目选项列表
    //         let ans = huidaList[i]; //改题目答案
    //         //初始化每一题的选项选择数量
    //         opts.forEach((v,k)=>{
    //             tmpOpt[k]=0;
    //         });
    //         //
    //         opts.forEach((oval,oi)=>{
    //             if(oval == ans){
    //                 tmpOpt[oi]+=1;
    //             }
    //         })
    //     });
    // });
    await connection.end();
    ctx.body={data:{timu,huidaList}}
}

//获取所有回答的结果并展示出来根据qid

async function getAllHuidaByQid(ctx){
    const data = ctx.request.body;
    const connection = await mysql.createConnection(config.mysqlDB);
    let qid = data.qid;
    let [qres] = await connection.execute(`select * from questionare where qid = ${qid}`);
    let questionare = qres[0];//问卷
    let timu = JSON.parse(qres[0].timu);//题目
        questionare.timu = JSON.parse(qres[0].timu);
    let [huidaList] = await connection.execute(`select content from huida where qid = ${qid}`);//回答
    let tmphuidaList  =[];
        huidaList.forEach((val,index)=>{tmphuidaList.push(JSON.parse(val.content))});
        huidaList=tmphuidaList;
        let timuList = [];
        for(let i = 0;i < huidaList.length; i++){
            let huida = huidaList[i];
            let tmptimu = JSON.parse(JSON.stringify(timu))
            tmptimu.forEach((val,index)=>{
                tmptimu[index].answer=huida[index];
            })
            timuList.push(tmptimu);
        }
    await connection.end();
    ctx.body={data:{timuList,questionare}}
}
//------------回答相关
async function operHuida(ctx){
    const data = ctx.request.body;
    let operType = data.operType;
    let qid = data.qid;
    let hid = data.hid;
    let content=data.content;
    let res;
    switch(operType){
        case 'add':
            let sql =`insert into huida (qid,content) values (${qid},'${content}')`;
           res = await base.add(sql);
            break;
        case 'delByqid':
            res = await base.delById('huida','qid',`${qid}`);
            break;
        case 'delByhid':
            res = await base.delById('huida','hid',`${hid}`);
        case 'getByqid':
           res =  await base.runsql('select * from huida where qid = '+qid);
            break;
        case 'getAll':
           res =  await base.findAll('huida');
           break;
    }
    ctx.body={data:{data:res}}
}

export default{
    operHuida,
    searchHuida,
    getAllHuidaByQid
}