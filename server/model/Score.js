import config from '../config.js'
import mysql from 'mysql2/promise'
import base from './Base.js'

//
async function getScoreById(ctx){
    let data = ctx.request.body;
    let list =await base.findOne('score','uid',data.uid);
    ctx.body={
        data:{data:list}
    }
}

//
async function addScore(ctx){
    let data = ctx.query.body;
    let user_id = data.user_id;
    let score = data.score;
    let sql = `update score set total = total + ${score} where sid = ${uid}`;
    const result = await base.update(sql);
    if(result.affectRows>0){
        ctx.body={
            data:{data:true}
        }
    }else{
        ctx.body={
            data:{data:false}
        }
    }
}

async function subScoreById(ctx){
    let data = ctx.request.body;
    let uid = data.uid;
    let score = data.score;
    let sql = `update score set total = total - ${score},used = used + ${score} where uid = ${uid}`;
    const result = await base.update(sql);
    if(result.affectRows>0){
        ctx.body={
            data:{data:true}
        }
    }else{
        ctx.body={
            data:{data:false}
        }
    }
}

async function zeroScoreById(ctx){
    let data = ctx.query.body;
    let uid = data.uid;
    let score = data.score;
    let sql = `update score set total = 0 where uid = ${uid}`;
    const result = await base.update(sql);
    if(result.affectRows>0){
        ctx.body={
            data:{data:true}
        }
    }else{
        ctx.body={
            data:{data:false}
        }
    }
}




export default{
    zeroScoreById,
    subScoreById,
    addScore,
    getScoreById
}