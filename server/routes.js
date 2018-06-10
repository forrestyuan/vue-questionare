//后台路由配置
import config from './config.js'
import  api from  './api'
import common from './common'
import koa_router from 'koa-router'
import fs from "fs"

import user from './model/User'
import score from './model/Score'
import order from './model/Order'
import qs from './model/Qs'
import qstype from './model/QStype'
import goods from './model/Goods'
import goodstype from './model/GoodsType'
import comment from './model/comment'
import imgsetting from './model/imgSetting';
import cart from './model/cart';
import huida from './model/huida';
const multer = require('koa-multer');//加载koa-multer模块  

const routes = koa_router();
//文件上传  

//配置  
var storage = multer.diskStorage({  
  //文件保存路径  
  destination: function (req, file, cb) {cb(null, 'static/uploads/')},  
  //修改文件名称  
  filename: function (req, file, cb) {  
    var fileFormat = (file.originalname).split(".");  
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);  
  }  
})  
//加载配置  
var upload = multer({ storage: storage });  

//路由  
routes
    //图片上传
    .all('/upload', upload.single('file'), async (ctx, next) => {  
        ctx.body = {  
            filename: '/static/uploads/'+ctx.req.file.filename//返回文件名  
        }  
    })  
    //获取本机IP  
    .all('/getClientIP',api.getClientIP)
    .all('/getServerIP',api.getServerIP)
    //用户
    // .all('/githubOAuth',api.login)
    .all('/loginValid',user.login)                          //登录
    .all('/registValid',user.regist)
    .all('/isLogin',user.isLogin)
    .all('/logout',user.logout)
    .all('/getUserInfoById',user.getUserInfoById)
    .all('/updateUserById',user.updateUserById)
    .all('/userCount',user.userCount)
    .all('/delUser',user.delUser)
    .all('/searchUserCondition',user.searchUserCondition)
    .all('/searchAllUser',user.searchAllUser)
    .all('/lockUser',user.lockUser)
    .all('/getUserThumbnail',user.getUserThumbnail)

    
    //订单
    .all('/searchOrderCondition',order.searchOrderCondition)
    .all('/delOrder',order.delOrder)
    .all('/addOrder',order.addOrder)
    .all('/updateOrder',order.updateOrder)
    //购物车
    .all('/addCart',cart.addCart)
    .all('/delCart',cart.delCart)
    .all('/getCartByUid',cart.getCartByUid)
    .all('/countGoodIncart',cart.countGoodIncart)
    //积分
    .all('/getScoreById',score.getScoreById)
    .all('/subScoreById',score.subScoreById)
    .all('/zeroScoreById',score.zeroScoreById)
    .all('/addScore',score.addScore)
    //问卷列表
    .all('/searchAllTemplate',qs.searchAllTemplate)
    .all('/searchAllQS',qs.searchAllQS)
    .all('/addQS',qs.addQS)
    .all('/delQS',qs.delQS)
    .all('/onlineQS',qs.onlineQS)
    .all('/offlineQS',qs.offlineQS)
    .all('/getQSByid',qs.getQSByid)
    .all('/updateQS',qs.updateQS)
    .all('/countQs',qs.countQs)
    //回答
    .all('/operHuida',huida.operHuida)
    .all('/searchHuida',huida.searchHuida)
    .all('/getAllHuidaByQid',huida.getAllHuidaByQid)
    
    //商品
    .all('/searchAllGoods',goods.searchAllGoods)
    .all('/addBuyers',goods.addBuyers)
    .all('/addGood',goods.addGood)
    .all('/operGoodNum',goods.operGoodNum)
    .all('/searchGoodCondition',goods.searchGoodCondition)
    .all('/countGoods',goods.countGoods)
    .all('/updateGoods',goods.updateGoods)
    .all('/getGoodsImg',goods.getGoodsImg)
    //商品分类
    .all('/searchGoodsTypeCondition',goodstype.searchGoodsTypeCondition)
    .all('/getAllgtype',goodstype.getAllgtype)
    .all('/addGoodsType',goodstype.addGoodsType)
    .all('/updateType',goodstype.updateType)
    .all('/delType',goodstype.delType)
    //商品评论 
    .all('/searchAllComment',comment.searchAllComment)
    .all('/addcomment',comment.addcomment)
    .all('/searchCommentCondition',comment.searchCommentCondition)
    .all('/delComment',comment.delComment)
    //问卷类别
    .all('/operType',qstype.operType)
    .all('/searchqsTypeCondition',qstype.searchqsTypeCondition)
    //图库
    .all('/addImage',imgsetting.addImage)
    .all('/delImage',imgsetting.delImage)
    .all('/getAllimg',imgsetting.getAllimg)
    .all('/searchPicCondition',imgsetting.searchPicCondition)


export default {
    routes
}
