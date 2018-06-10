//后台配置文件
export default {
    //数据库配置
    mysqlDB: {
        host: "localhost",
        user: "root",
        password: "root",  //root
        database: "flowerqs" //flowerqs
    },
    githubSecret:'81ecafc7cd69c038e6cc691539503347bf9c003e',
    keys:['key4tms'],
 
    // 存放sessionId的cookie配置
    cookie :{
        maxAge: 1800000, // cookie有效时长
        expires: '',  // cookie失效时间
        path: '', // 写cookie所在的路径
        domain: '', // 写cookie所在的域名
        httpOnly: '', // 是否只用于http请求中获取
        overwrite: true,  // 是否允许重写
        secure: '',
        sameSite: '',
        signed: '',
    },
    //公用：获取客户端IP
    getClientIP: function(ctx) {
        let req = ctx.request;
        let ip =
            ctx.ip ||
            req.headers["x-forwarded-for"] ||
            req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress ||
            "";
        let arr = ip.match(/(\d{1,3}\.){3}\d{1,3}/);
        return arr ? arr[0] : "";
    }
};
