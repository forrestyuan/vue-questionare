import config from '../config.js'
import mysql from 'mysql2/promise'
import base from './Base.js'
const md5 = require('md5');

/*
findOne,findAll, add, delById, update,  search, pageSearch, count
*/

//登录
async function login(ctx){
    const data = ctx.request.body;
    let sql = `select * from user where account = '${data.username}' and password = '${md5(data.password)}'`;
    const list = await base.runsql(sql);
    console.log(list)
    if(list.length){
            if(list[0].status==0){
                ctx.body = {data:{data:false}}
                return;
            }
            ctx.session.username = list[0].account;
            ctx.session.uid = list[0].uid;
            ctx.session.role=list[0].role;
            ctx.body ={data:{data:true}}
            return;
    }
    ctx.body = {data:{data:false}}
}
//注册
async function regist(ctx){
    const data = ctx.request.body;
    let username = data.username;
    let password = data.password;
    const ures = await base.runsql(`select * from user where account = '${username}'`);
    if(ures.length){
        ctx.body={data:{data:false,message:'用户已存在'}};
    }else{
        const list = await base.add(`insert into user (account,password) values ('${username}','${md5(password)}')`);
        if(list){
            let id = await base.runsql(`select uid from user where account = '${username}'`);
            await base.add(`insert into score (uid,total,used) values ('${id[0].uid}', 0 ,0)`);
            ctx.body={data:{data:true,message:'注册成功'}}
        }else{
            ctx.body={data:{data:false,message:'注册失败'}}
        }
    }
}
//退出登录
async function logout(ctx){
    ctx.session.username = null;
    ctx.session.uid = null;
    ctx.body={data:{}}
}
//判登陆
async function  isLogin(ctx){
    if(ctx.session.username){
        console.log(ctx.session)
        ctx.body={ data:{loginStatus:true,username:ctx.session.username,uid:ctx.session.uid,role:ctx.session.role} };
    }else{
        ctx.body={ data:{loginStatus:false,username:ctx.session.username,uid:ctx.session.uid,role:ctx.session.role} };
    }
}
//根据id 获取用户信息
async function getUserInfoById(ctx){
    let data = ctx.request.body;
    let list = await  base.findOne('user','uid',data.uid);
    ctx.body={data:list};
}
//根据username 获取用户头像
async function getUserThumbnail(ctx){
    let data = ctx.request.body;
    let account = data.username;
    let sql =`select userthumbnail from user where account = '${account}'`;
    let res =await base.runsql(sql);
    ctx.body={data:{res}};
}
//更新用户
async function updateUserById(ctx){
    const data =ctx.request.body;
    let user = JSON.parse(data.user);
    let sql = `update user set  
        account='${user.account||""}', 
        password='${user.password||""}',
        realname='${user.realname||""}',
        address='${user.address||""}', 
        postcode='${user.postcode}',
        email='${user.email||""}', 
        phone='${user.phone||""}', 
        question='${user.question||""}',
        userthumbnail='${user.userthumbnail||""}',
        status=${user.status},
        role='${user.role || ""}',
        answer='${user.answer||""}' where uid = ${user.uid}`;
    let isOk =await base.update(sql);
    ctx.body={ data:{}}
}
async function lockUser(ctx){
    const data = ctx.request.body;
    let uid = data.uid;
    let isLock = data.isLock;
    let status = 1;
    if(isLock=='true'){
        status=0;
    }
    let sql =`update user set status = ${status} where uid = ${uid}` ;
    let isOk =await base.update(sql);
    ctx.body={data:{}};
}
async function userCount(ctx){
    let res = await base.count('user');
    ctx.body={data:{data:res}}
}
async function delUser(ctx){
    const data = ctx.request.body;
    let id = data.id;
    let res = await base.delById('user','uid',id)
    ctx.body={data:{res}}
}
//条件查询用户 --
async function searchUserCondition(ctx){
    const data = ctx.request.body;
    let page = data.page;
    let pageSize = data.pageSize;
    let where = data.where;
    let whereval = data.whereval;
    let res = await base.pageSearchCondition('user', page, pageSize,' where '+ where +' like '+whereval);
    ctx.body={data:{res}}
}
//分页查询用户
async function searchAllUser(ctx){
    const data = ctx.request.body;
    let page = data.page;
    let pageSize = data.pageSize;
    let res = await base.pageSearch('user', page, pageSize);
    ctx.body={
        data:{res}
    }
}

export default{
    login,
    logout,
    regist,
    isLogin,
    getUserInfoById,
    updateUserById,
    userCount,
    delUser,
    searchUserCondition,
    searchAllUser,
    lockUser,
    getUserThumbnail

}