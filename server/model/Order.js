import config from '../config.js'
import mysql from 'mysql2/promise'
import base from './Base.js'
    //添加订单
    async function addOrder(ctx){
        const data = ctx.request.body;
        let json = JSON.parse(data.order);
        let date =new Date();
        let time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        let sql = 'insert into `order` (uid,score,name,extend,`status`,goods,createtime) values ';
            sql+=`(${json.uid},${json.score},'${json.name}','${json.extend}','${json.status}','${json.goods}','${time}')`;
        console.log(sql)
        await base.runsql(sql);
        ctx.body={data:{}}
    }
    //分页查询
    async function searchOrderCondition(ctx){
        const data = ctx.request.body;
        let page = data.page;
        let pageSize = data.pageSize;
        let where = data.where;
        let whereval = data.whereval;
        let res = await base.pageSearchCondition('`order`', page, pageSize,' where '+ where +' like '+whereval);
        ctx.body={data:{res}}
    }
    //删除
    async function delOrder(ctx){
        const data = ctx.request.body;
        let oid = data.oid;
        let sql =`delete from`+ '`order`'+` where oid = ${oid}`;
        let isok = await base.runsql(sql);
        ctx.body={data:{isok}}
    }
    //更新订单状态
    async function updateOrder(ctx){
        const data = ctx.request.body;
        let orderName = data.orderName;
        let status = data.status;
        let sql = 'update `order` set `status` = "'+status+'" where name = '+ `'${orderName}'`;
        let isok = await base.runsql(sql);
        ctx.body={data:{isok}};
    }
export default{
    searchOrderCondition,
    addOrder,
    delOrder,
    updateOrder
}