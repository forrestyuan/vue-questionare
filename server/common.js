//前、后台共用变量
export default {
    web_name:'花儿问卷调查',
    web_domain:'http://127.0.0.1:3001',//访问域名,
    adminpaths:['/'],
    baseSet: {
          
    },
    //这里不可使用ES6语法
    mixin:{
        methods:{
        routeToNoAuth:function(path){
          this.$router.replace(`/${path}`)
        },
          //消息提示 success warn info error
          success:function(str) {
            this.$notify({
              title: '成功',
              message: str,
              type: 'success'
            });
          },
    
          warn:function(str) {
            this.$notify({
              title: '警告',
              message: str,
              type: 'warning'
            });
          },
    
          info:function(str) {
            this.$notify.info({
              title: '消息',
              message: str
            });
          },
    
          error:function(str) {
            this.$notify.error({
              title: '错误',
              message: str
            });
          }
        }
    }
}
