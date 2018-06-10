//后台路由配置
import config from './config.js'
import mysql from 'mysql2/promise'
let http = require('http');
const os = require('os');
//公用：获取客户端IP
async function getClientIP(ctx) {
        let req = ctx.request;
    let ip = ctx.ip ||
        req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    let arr = ip.match(/(\d{1,3}\.){3}\d{1,3}/);
    ctx.body={data:{arr:arr[0]}}
}
async function getServerIP(ctx){    
    let networkInterfaces=os.networkInterfaces();
    let ip=networkInterfaces['WLAN'][1].address;
    ctx.body={data:{ip}}
}
//登录
async function login(ctx){
    let data =ctx.request.query;
    let code = data.code;
    let state = data.state;
    let url =`http://github.com/login/oauth/authorize?client_id=a50329b708fde4960520&code=${code}&client_secret=${config.githubSecret}&redirect_uri=http://127.0.0.1:3001/api/githubOAuth`;
    console.log(data.access_token,url)
    if(data.access_token !=undefined ){
        请求用户信息
        http.get(`https://api.github.com/user?access_token=${data.access_token}`,function(req,res){  
            let html='';  
            req.on('data',function(datas){  
                html+=datas;  
            });  
            req.on('end',function(){  
                console.info(html);  
            });  
        }); 
    }else{
        http.get(url,function(req,res){
            let html='';  
            req.on('data',function(datas){  
                html+=datas;  
            });  
            req.on('end',function(){  
                console.info(html);  
            });  
        });
    }
}

export default {
    getClientIP,
    getServerIP,
    login,
}
