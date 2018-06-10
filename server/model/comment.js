    //后台路由配置
    import config from '../config.js'
    import mysql from 'mysql2/promise'
    import base from './Base.js'

    //分页查询
    async function searchAllComment(ctx){
        const data = ctx.request.body;
        let page = data.page;
        let pageSize = data.pageSize;
        let res = await base.pageSearch('comment', page, pageSize);
        ctx.body={
            data:{res}
        }
    }

    //添加评论
    async function addcomment(ctx){
        const data = ctx.request.body;
        let gid = data.gid;
        let comment = data.comment;
        let username = data.username;
        let date = new Date();
        let time =date.getFullYear()+'-'+date.getMonth()+'-'+(date.getDate()+1)+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        let sql = `insert into comment (gid,`+'`comment`'+`,username,time) values (${gid},'${comment}','${username}','${time}')`;
        await base.runsql(sql);
        ctx.body={data:{}}
    }
    //分页条件查询
    async function searchCommentCondition(ctx){
        const data = ctx.request.body;
        let page = data.page;
        let pageSize = data.pageSize;
        let where = data.where;
        let whereval = data.whereval;
        let res = await base.pageSearchCondition('comment', page, pageSize,' where '+ where +' like '+whereval);
        const connection =await mysql.createConnection(config.mysqlDB);
        let sql2='';
        for(let i = 0;i<res.data.length;i++){
            sql2=`select userthumbnail from user where account ='${res.data[i].username}'`;
            let [thumb] = await connection.execute(sql2);
            res.data[i]['userthumbnail']=thumb[0].userthumbnail;
        }
        await connection.end();
        ctx.body={data:{res}}
    }
    //删除
    async function delComment(ctx){
        const data = ctx.request.body;
        let cid = data.cid;
        let sql =`delete from comment where cid = ${cid}`;
        let isok = await base.runsql(sql);
        ctx.body={data:{isok}}
    }

    export default{
        searchAllComment,
        addcomment,
        searchCommentCondition,
        delComment
    }