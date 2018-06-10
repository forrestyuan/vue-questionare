const common =require('common')
//公共页面
import E404 from'./commonPage/404.vue';
import E500 from'./commonPage/500.vue';
//前端页面
import Home from'./front/Home.vue';
import Index from'./front/Index.vue';
import Login from'./front/Login.vue';
//问卷相关
import qsAdd  from'./front/QS/QSadd.vue';
import qsTemplate from './front/QS/QStemplate.vue'
import qsShop from './front/QS/QSshop.vue'
import qsList from './front/QS/QSlist.vue'
import qsOnline from './front/QS/QSonline.vue'
import qsDataView from './front/QS/QSdataView.vue'
import qsHuida from './front/QS/QSHuida.vue'
//用户主页
import UserHome from './front/User/index.vue'
//积分
import Order from './front/Order/order.vue'
import Shop from './front/Shop/shop.vue'
import goodDetail from './front/Shop/detail.vue'
import Cart from './front/Shop/cart.vue'

//后台页面
import adminHome from './admin/Home.vue'
import userList from './admin/userList.vue'
import questionList from './admin/questionList.vue'
import goodsList from './admin/goodsList.vue'
import qstypeList from './admin/qsTypeList.vue'
import goodstypeList from './admin/goodstypeList.vue'
import pictureList from './admin/pictureList.vue'
import commentList from './admin/commentList.vue'
import orderList from './admin/orderList.vue'

//todo 记录
/*
*
* */
export default {
  mode: 'history',
  base: __dirname,
  routes: [
      //front
    {path:'/',component:Home,redirect:'/home/index'},
    {path:'/qsnews',component:Home,redirect:'/home/qsnews'},
    //问卷相关
    {path:'/qslist/:id',component:Home,redirect:'/home/qslist/:id'},
    {path:'/qscreate/:id',component:Home,redirect:'/home/qscreate/:id'},
    {path:'/qscreate/:id/:qid',component:Home,redirect:'/home/qscreate/:id/:qid'},
    {path:'/qscreate/:id/:qid/:mod',component:Home,redirect:'/home/qscreate/:id/:qid/:mod'},
    {path:'/qsonline/:id/:qid',component:qsOnline},
    {path:'/qshuida/:qid',component:qsHuida},
    {path:'/qstemplate',component:Home,redirect:'/home/qstemplate'},
    {path:'/qsshop',component:Home,redirect:'/home/qsshop'},
    {path:'/qsdata/:qid',component:Home,redirect:'/home/qsdata/:qid'},
    //用户
    {path:'/user/:id',component:Home,redirect:'/home/user/:id'},
    //积分
    {path:'/shop',component:Home,redirect:'/home/shop'},
    {path:'/order/:id',component:Home,redirect:'/home/order/:id'},
    {path:'/goodsdetail/:id',component:Home,redirect:'/home/goodsdetail/:id'},
    {path:'/cart/:id',component:Home,redirect:'/home/cart/:id'},         
    //front home 子路由
    {path:'/home',component:Home,children:[
      {path:'index',component:Index},
      // {path:'qsnews',component:AddTagTree},
      {path:'qslist/:id',component:qsList},
      {path:'qscreate/:id',component:qsAdd},
      {path:'qscreate/:id/:qid',component:qsAdd},
      {path:'qscreate/:id/:qid/:mod',component:qsAdd},
      {path:'qstemplate',component:qsTemplate},
      {path:'qsshop',component:qsShop},
      {path:'qsdata/:qid',component:qsDataView},
      {path:'shop',component:Shop},
      {path:'user/:id',component:UserHome},
      {path:'order/:id',component:Order},
      {path:'goodsdetail/:id',component:goodDetail},
      {path:'cart/:id',component:Cart},
    ]},
    // {path: '/data/:num', name: 'qsData',component: qsData},
    // {path: '/fill/:num',name: 'qsFill',component: qsFill},
    // {path: '/edit/:num',name: 'qsEdit', component: qsEdit},
    //公共
    {path:'/login',component:Login},
    {path:'/500',component:E500},
    {path:'*',component: E404},
// admin 管理员
//   {path:'/adminlogin',component:adminLogin},
  {path:'/end',redirect:'/admin/userlist',component:adminHome},
  {path:'/admin',component:adminHome,children:[ 
    {path:'userlist',component:userList},
    {path:'questionlist',component:questionList},
    {path:'qstypelist',component:qstypeList},
    {path:'goodsList',component:goodsList},
    {path:'goodstypeList',component:goodstypeList},
    {path:'pictureList',component:pictureList},
    {path:'commentList',component:commentList},
    {path:'orderList',component:orderList},
  ]}
 ]
}
