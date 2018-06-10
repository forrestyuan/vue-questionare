
import Koa from 'koa';
import koa_router from "koa-router";
import json from  'koa-json';
import logger from 'koa-logger';

import path from 'path';
import serve from 'koa-static';
import historyApiFallback  from 'koa2-history-api-fallback';

import koa_bodyparser from "koa-bodyparser";
import routes_obj  from './server/routes.js';
import conf from './server/config.js'


const app = new Koa();
const router = koa_router();
const session = require('koa-session-minimal')
const MysqlSession = require('koa-mysql-session')


// 配置存储session信息的mysql
let store = new MysqlSession(conf.mysqlDB)
// 使用session中间件 
app.use(session({
  key: 'SESSION_ID',
  store: store,
  cookie: conf.cookie
}))

app.use(koa_bodyparser());
app.use(json());
app.use(logger());
app.keys = conf.keys;


import fs  from 'fs';
function writeLog(data){
    fs.appendFile('./log.txt',data,'utf8',e=>{});
}

app.use(async(ctx, next)=>{
    await next();
});

app.on('error', function (err, ctx) {
    writeLog('server error' + err + '\n' + JSON.stringify(ctx) + '\r\n');
    ctx.body = {
        success: false,
        data:ctx,
        message: err
    };
    console.log('server error', err);
});

router.use('/api', routes_obj.routes.routes());

app.use(router.routes()); // 将路由规则挂载到Koa上。
app.use(historyApiFallback());
app.use(serve(path.resolve('dist'))); // 将webpack打包好的项目目录作为Koa静态文件服务的目录

const port = process.env.PORT || 3001;
const host = process.env.IP || '127.0.0.1';
app.listen(port,host, () => {
    console.log(`Koa is listening in http://${host}:${port}`);
});

export default app;
