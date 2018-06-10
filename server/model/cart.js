//后台路由配置
import config from '../config.js'
import mysql from 'mysql2/promise'
import base from './Base.js'

//读取购物车
async function getCartByUid(ctx){
    const data = ctx.request.body;
    let uid = data.uid;
    console.log('---',uid)
    const connection = await mysql.createConnection(config.mysqlDB);
    let [gidlist] =await connection.execute(`select cartid,gid from cart where uid =${uid}`);
    if(gidlist.length){
        let goodsSql = 'select * from goods where gid = ';
        for(let i = 0; i<gidlist.length; i++){
            if(i<gidlist.length-1){
                goodsSql+=gidlist[i].gid+' or gid = ';
            }else{
                goodsSql+=gidlist[i].gid;
            }
        }
        console.log(goodsSql);
        let [res] = await connection.execute(goodsSql);
        await connection.end();
        ctx.body={ data:{res,gidlist}}
    }else{
        ctx.body={data:{res:[],gidlist:[]}}
    }
}

//添加购物车
async function addCart(ctx){
    const data = ctx.request.body;
    let uid = data.uid;
    let gid = data.gid;
    let sql = `insert into cart (uid,gid) values (${uid},${gid})`;
    await base.runsql(sql);
    ctx.body={data:{}}
}

//删除购物车
async function delCart(ctx){
    const data = ctx.request.body;
    let cidList =JSON.parse(data.cidList);
    let sql='delete from cart where cartid in ('+cidList.join(',')+')';
    console.log(sql)
    await base.runsql(sql);
    ctx.body={data:{}}
}
//统计某件商品数量
async function countGoodIncart(ctx){
    const data = ctx.request.body;
    let uid = data.uid;
    let gid = data.gid;
    let sql =`select count(*) as num from cart where uid=${uid} and gid=${gid}`;
    console.log(sql)
    let res = await base.runsql(sql);
    ctx.body={data:{res}}
}
//分页条件查询
// async function searchGoodsTypeCondition(ctx){
//     const data = ctx.request.body;
//     let page = data.page;
//     let pageSize = data.pageSize;
//     let where = data.where;
//     let whereval = data.whereval;
//     let res = await base.pageSearchCondition('goodstype', page, pageSize,' where '+ where +' like '+whereval);
//     ctx.body={data:{res}}
// }


export default{
    getCartByUid,
    addCart,
    delCart,
    countGoodIncart
}