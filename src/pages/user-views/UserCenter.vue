<template>
  <!--定义面包屑样式-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
    <el-breadcrumb-item>用户操作</el-breadcrumb-item>
    <el-breadcrumb-item>用户中心</el-breadcrumb-item>
  </el-breadcrumb>
  <h1>用户中心</h1>

  <div v-loading="isUserUpdateLoading" element-loading-text="userUpdateLoadingText">
    <span>在这里可以对您的个人信息进行修改</span>

    <el-divider content-position="left"><h3>用户名</h3></el-divider>
    <div class="innerOption">
      <el-input style="width: 200px;" v-model="currUser.user_name" :disabled="true"></el-input>
      <el-button type="danger" size="small">无法修改</el-button>
    </div>

    <el-divider content-position="left"><h3>登录名</h3></el-divider>
      <el-input style="width: 200px;" v-model="currUser.login_name"></el-input>
      <el-button type="primary" @click="updateLoginName">点击修改</el-button>

    <el-divider content-position="left"><h3>用户密码</h3></el-divider>
      <el-input style="width: 200px;" v-model="currUser.login_password"></el-input>
      <el-button type="primary" @click="updateUserPassword">点击修改</el-button>

    <el-divider content-position="left"><h3>手机号</h3></el-divider>
      <el-input style="width: 200px;" v-model="currUser.phone_number"></el-input>
      <el-button type="primary" @click="updateUserPhone">点击修改</el-button>

    <el-divider content-position="left"><h3>用户信息</h3></el-divider>
      <el-input style="width: 200px;" v-model="currUser.info"></el-input>
      <el-button type="primary" @click="updateUserInfo">点击修改</el-button>

    <el-divider content-position="left"><h3>用户身份</h3></el-divider>
      <el-input style="width: 200px;" v-model="currUser.identification" :disabled="true"></el-input>
      <el-button type="danger" size="small">无法修改</el-button>

    <el-divider content-position="left"><h3>最后登录时间</h3></el-divider>
      <el-input style="width: 200px;" v-model="currUser.lastLoginTime" :disabled="true"/>
      <el-button type="danger" size="small">无法修改</el-button>


    <el-divider content-position="left"><h3>注册时间</h3></el-divider>
      <el-input style="width: 200px;" v-model="currUser.register_time" :disabled="true"/>
      <el-button type="danger" size="small">无法修改</el-button>

  </div>

  <div>
    <!--设置提示信息对话框-->
    <el-dialog v-model="isUserUpdateDialog" title="提示" width="30%" :show-close="false">
      <h3>{{userInfoDialogMessage}}</h3>
      <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="isUserUpdateDialog = false">确认</el-button>
                </span>
      </template>
    </el-dialog>
  </div>

</template>

<script>
//引入useStore
import { useStore } from 'vuex'
import {useRouter} from 'vue-router'
import { ref } from 'vue'

export default {
  name:"UserCenter",
  setup() {
    //设置用户等待服务器更新时显示loading的文本变量
    const userUpdateLoadingText = ref("正在更新用户信息，请稍后...")
    //设置关于用户信息修改弹窗的变量
    const isUserUpdateDialog = ref(false)
    const userInfoDialogMessage = ref("")
    const isUserUpdateLoading = ref(false)

    //得到store属性变量
    const store = useStore()
    // const router = useRouter()
    //创建当前页面对象
    const currUser = ref({})

    //获得当前用户信息
    //判断是否存在于localStorage中
    if(localStorage.userInfo !== null) {
      currUser.value = JSON.parse(localStorage.userInfo)
    }

    //定义修改用户数据的函数
    function updateLoginName(){
      console.log("updateLoginName被调用了...")
      //设置loading显示
      isUserUpdateLoading.value = true
      //直接调用action中的函数
      store.dispatch("userAbout/updateLoginNameAction", currUser.value.login_name).then(res => {
        console.log("then res : ",res)
        //弹出对话框，告知用户已经修改完毕
        userInfoDialogMessage.value = "更新用户信息成功"
        isUserUpdateDialog.value = true
        //设置loading不显示
        isUserUpdateLoading.value = false
      }).catch(res => {
        console.log("catch res : ", res)
        userInfoDialogMessage.value = "更新用户信息失败"
        isUserUpdateDialog.value = true
        //设置loading不显示
        isUserUpdateLoading.value = false
      })
    }

    //更新用户，密码实现了
    function updateUserPassword(){
      console.log("更新用户密码...")

    }


    //更新用户手机号，需要接收验证码短信服务
    function updateUserPhone(){
      console.log("更新用户手机号...")
    }

    //更新用户info数据
    function updateUserInfo(){
      console.log("更新用户手机号...")

      //设置loading显示
      isUserUpdateLoading.value = true
      //直接调用action中的函数
      store.dispatch("userAbout/updateUserInfoAction", currUser.value.info).then(res => {
        console.log("then res : ",res)
        //弹出对话框，告知用户已经修改完毕
        userInfoDialogMessage.value = "更新用户信息成功"
        isUserUpdateDialog.value = true
        //设置loading不显示
        isUserUpdateLoading.value = false
      }).catch(res => {
        console.log("catch res : ", res)
        userInfoDialogMessage.value = "更新用户信息失败"
        isUserUpdateDialog.value = true
        //设置loading不显示
        isUserUpdateLoading.value = false
      })



    }



    //最后无论是变量还是函数都需要返回出去
    return{
      isUserUpdateDialog,
      userInfoDialogMessage,
      //返回变量
      store,
      currUser,
      isUserUpdateLoading,
      userUpdateLoadingText,

      //返回修改用户信息的函数
      updateLoginName,
      updateUserPassword,
      updateUserPhone,
      updateUserInfo

    }

  }
}
</script>

<style scoped>
.el-input{
  margin: 10px;
}

</style>
