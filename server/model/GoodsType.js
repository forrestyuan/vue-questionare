//后台路由配置
import config from '../config.js'
import mysql from 'mysql2/promise'
import base from './Base.js'

//查询
async function getAllgtype(ctx){
    let res = await base.runsql('select * from goodstype order by typeid');
    ctx.body={data:{res}}
}

//增加分类
async function addGoodsType(ctx){
    const data = ctx.request.body;
    let name = data.name;
    let sql = `insert into goodstype (name) values ('${name}')`;
    await base.runsql(sql);
    ctx.body={data:{}}
}

//分页条件查询
async function searchGoodsTypeCondition(ctx){
    const data = ctx.request.body;
    let page = data.page;
    let pageSize = data.pageSize;
    let where = data.where;
    let whereval = data.whereval;
    let res = await base.pageSearchCondition('goodstype', page, pageSize,' where '+ where +' like '+whereval);
    ctx.body={data:{res}}
}
//更新分类
async function updateType(ctx){
    const data = ctx.request.body;
    let typeid = data.typeid;
    let name = data.name;
    let sql = `update goodstype set name = '${name}' where typeid = ${typeid}`;
    let isok = await base.update(sql);
    ctx.body={data:{isok}}
}

//删除
async function delType(ctx){
    const data = ctx.request.body;
    let typeid = data.typeid;
    let sql =`delete from goodstype where typeid = ${typeid}`;
    let isok = await base.runsql(sql);
    ctx.body={data:{isok}}
}

export default{
    searchGoodsTypeCondition,
    addGoodsType,
    getAllgtype,
    delType,
    updateType
}