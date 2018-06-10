//后台路由配置
import config from '../config.js'
import mysql from 'mysql2/promise'
import base from './Base.js'
//添加图片
async function addImage(ctx){
    const data = ctx.request.body;
    let imgurl = data.imgurl;
    let type = data.type;
    let sql= `insert into imgsetting (imgurl,type) values ('${imgurl}',${type})`;
    let isok = await base.runsql(sql);
    ctx.body={data:{isok}};
}
//删除图片
async function delImage(ctx){
    const data = ctx.request.body;
    let imgid = data.imgid;
    let sql = `delete from imgsetting where imgid = ${imgid}`;
    let isok = await base.runsql(sql);
    ctx.body={data:{isok}}
}
//查询
async function getAllimg(ctx){
    const data = ctx.request.body;
    let type = data.type;
    let res = await base.runsql(`select * from imgsetting where type = ${type} order by imgid`);
    ctx.body={data:{res}}
}
//分页条件查询
async function searchPicCondition(ctx){
    const data = ctx.request.body;
    let page = data.page;
    let pageSize = data.pageSize;
    let where = data.where;
    let whereval = data.whereval;
    let res = await base.pageSearchCondition('imgsetting', page, pageSize,' where '+ where +' like '+whereval);
    ctx.body={data:{res}}
}
export default {
    addImage,
    delImage,
    getAllimg,
    searchPicCondition
}