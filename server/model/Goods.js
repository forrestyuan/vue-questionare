//后台路由配置
import config from '../config.js'
import mysql from 'mysql2/promise'
import base from './Base.js'

//分页查询
async function searchAllGoods(ctx){
    const data = ctx.request.body;
    let page = data.page;
    let pageSize = data.pageSize;
    let res = await base.pageSearch('goods', page, pageSize);
    ctx.body={
        data:{res}
    }
}


//购买量增加
async function addBuyers(ctx){
    const data = ctx.request.body;
    let gid = data.gid;
    let sql = `update goods set buyers + 1 where gid = ${gid}`;
    await base.runsql(sql);
    ctx.body={data:{}}
}
//增加商品
async function addGood(ctx){
    const data = ctx.request.body;
    let json = JSON.parse(data.goods);
    let date = new Date();
    let time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    let sql = 'insert into goods (title,type,`desc`,imgUrl,score,num,buyers,createtime) values ';
        sql+= `('${json.title}','${json.type}','${json.desc}','${json.imgUrl}',${json.score},${json.num},0,'${time}')`;
    let isok = await base.runsql(sql);
    ctx.body={data:{}};
}
//更新商品
async function updateGoods(ctx){
    const data = ctx.request.body;
    let json = JSON.parse(data.goods);
    let sql ="update goods set title='"+json.title+"',type='"+json.type+"',`desc`='"+json.desc+"',";
        sql+=`imgUrl='${json.imgUrl}',score=${json.score},num=${json.num} where gid = ${json.gid}`;
    console.log(sql);
    await base.runsql(sql);
    ctx.body={data:{}};
}
//增加商品数量
async function operGoodNum(ctx){
    const data = ctx.request.body;
    let gid = data.gid;
    let isadd = data.isadd;
    let sql = `update goods set num -1 where gid = ${gid}`;
    if(isadd){
        sql =`update goods set num +1 where gid = ${gid}`
    }
    await base.runsql(sql);
    ctx.body={data:{}}
}
//分页条件查询
async function searchGoodCondition(ctx){
    const data = ctx.request.body;
    let page = data.page;
    let pageSize = data.pageSize;
    let where = data.where;
    let whereval = data.whereval;
    let res = await base.pageSearchCondition('goods', page, pageSize,' where '+ where +' like '+whereval);
    ctx.body={data:{res}}
}

//删除
async function delGoods(ctx){
    const data = ctx.request.body;
    let gid = data.gid;
    let sql =`delete from goods where gid = ${gid}`;
    await base.runsql(sql);
    ctx.boyd={data:{}}
}
async function countGoods(ctx){
    let sql = `select count(*) as total from goods`;
    let res = await base.runsql(sql);
    ctx.body={data:{res}}
}
async function getGoodsImg(ctx){
    const data =ctx.request.body;
    let gid = data.gid;
    let sql = `select imgUrl from goods where gid = ${gid}`;
    let res = await base.runsql(sql);
    ctx.body={data:{res}}
}

export default{
    searchAllGoods,
    addBuyers,
    searchGoodCondition,
    delGoods,
    addGood,
    operGoodNum,
    countGoods,
    updateGoods,
    getGoodsImg
}