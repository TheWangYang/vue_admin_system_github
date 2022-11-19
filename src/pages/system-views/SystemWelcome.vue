<template>
    <!--设置警告提示框-->
    <!-- <el-alert v-show="isShowAlert" title="warning alert" type="warning" description="对不起，您无权限访问，请先登录！" show-icon /> -->
    <h1>欢迎来到端云一体的缺陷检测系统</h1>
  <el-carousel :interval="4000" type="card" height="200px">
    <el-carousel-item v-for="item in 6" :key="item">
      <h3 text="2xl" justify="center">{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>

</template>

<script>
    //引入组件
    // import {ref} from 'vue'

    export default {
    name:"SystemWelcome",
    //通过路由规则离开该组件时被调用
    // beforeRouteLeave (to, from, next) {
    //     console.log('离开之前进入了beforeRouteLeave...')
    //     //判断即将进入的from对应组件是否有isAuth属性
    //     if(to.meta.isAuth){
    //         this.isShowAlert = true
    //     }else{
    //         this.isShowAlert = false
    //         next()
    //     }
    // },
    //vue3中配置的数据和函数对象
    setup(){

        return{

        }
    }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
