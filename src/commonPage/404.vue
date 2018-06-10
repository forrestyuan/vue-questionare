<template>
    <div style="width:100vw;display:flex;justify-content:center;align-items:center;font-size:30px;color:white;">
        <h2 style="text-align:center;">404页面没找到!!</h2>
        <router-link to="/"><el-button type="primary" size="large"><i class="fa fa-home"></i> 返回首页</el-button></router-link>
    </div>
</template>

<script>
    export default { };
</script>

<style lang="less" scoped>
    div{
        font-size:20px;
        line-height: 50px;
        color:#555;
        max-width:900px;
        margin:auto;
        height:100%;
        width:100%;
        background: url('../assets/404.jpg');
        background-position: right top, center center;
        background-repeat: no-repeat, repeat;
        background-size: cover, auto;
    }
</style>
