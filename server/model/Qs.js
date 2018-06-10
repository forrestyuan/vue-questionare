import base from './Base.js'

//分页查询模板
async function searchAllTemplate(ctx){
    const data = ctx.request.body;
    let table = data.table;
    let page = data.page;
    let pageSize = data.pageSize;
    let res = await base.pageSearch(table, page, pageSize);
    ctx.body={
        data:{res}
    }
}
//发布问卷： 回收中 状态
async function onlineQS(ctx){
    let data = ctx.request.body;
    let qid = data.qid;
    let sql = `update questionare set status = '回收中' where qid = ${qid}`;
    await base.runsql(sql);
    ctx.body={data:{data:true}}
}
//停止回收， 未发布 状态
async function offlineQS(ctx){
    let data = ctx.request.body;
    let qid = data.qid;
    let sql = `update questionare set status = '未发布' where qid = ${qid}`;
    await base.runsql(sql);
    ctx.body={data:{data:true}}
}
//删除问卷
async function delQS(ctx){
    let data = ctx.request.body;
    let qid = data.qid;
    let res = await base.delById('questionare','qid',qid);
    ctx.body={data:{data:res}};
}
//更新问卷
async function updateQS(ctx){
    let data = ctx.request.body;
    let type= data.type,
        title= data.title,
        desc= data.desc,
        bgimg= data.bgimg,
        timu= data.timu,
        score= data.score,
        expiretime= data.expiretime;
    let sql ="update questionare set type ='"+type+"',title='"+title+"',`desc`='"+desc+"',bgimg='"+bgimg+"',timu='"+timu+"',score='"+score+"',expiretime='"+expiretime+"'";
    let res = await base.add(sql);
    ctx.body={data:{data:res}}
}
//添加问卷
async function addQS(ctx){
    let data = ctx.request.body;
    let uid = data.uid,
        type= data.type,
        title= data.title,
        desc= data.desc,
        bgimg= data.bgimg,
        timu= data.timu,
        score= data.score,
        status= data.status,
        expiretime= data.expiretime,
        createtime= data.createtime;

    let sql='insert into questionare (uid,type,title,`desc`,bgimg,timu,score,`status`,expiretime,createtime)'+`
             values (${uid},'${type}','${title}','${desc}','${bgimg}','${timu}','${score}','${status}','${expiretime}','${createtime}')`;
    let res = await base.add(sql);
    ctx.body={data:{data:res}}
}
//根据id 获得问卷
async function getQSByid(ctx){
    let data = ctx.request.body;
    let qid = data.qid;
    let res = await base.findOne('questionare','qid',qid);
    ctx.body={data:{data:res}}
}
//分页条件查询发布问卷 --
async function searchAllQS(ctx){
    const data = ctx.request.body;
    let table = data.table;
    let page = data.page;
    let pageSize = data.pageSize;
    let where = data.where;
    let whereval = data.whereval;
    let res = await base.pageSearchCondition(table, page, pageSize,' where '+ where +' like '+whereval);
    ctx.body={data:{res}}
}



async function countQs(ctx){
    let sql = `select count(*) as total from questionare`;
    let res = await base.runsql(sql);
    ctx.body={data:{res}}
}
//
export default{
    searchAllTemplate,
    searchAllQS,
    delQS,
    addQS,
    onlineQS,
    offlineQS,
    getQSByid,
    updateQS,
    countQs
    
}
