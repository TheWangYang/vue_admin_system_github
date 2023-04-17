<template>
  <div class="common-layout">
    <!--设置主页面布局-->
    <el-container>
      <!--设置的登陆页面侧边栏-->
      <el-aside width="800px">侧边栏</el-aside>

      <!--设置的登录表单布局-->
      <el-main>
        <el-header style="text-align:center;">
          <h1>登录</h1>
        </el-header>

        <el-form v-loading="isLoading" element-loading-text="loginLoadingText" ref="ruleFormRef" :model="ruleForm"
                 :rules="rules" label-width="120px"
                 class="demo-ruleForm" :size="formSize" status-icon label-position="top">
          <el-form-item label="登录名" prop="loginName" label-width="200px">
            <el-input v-model="ruleForm.login_name" placeholder="请输入登录名"/>
          </el-form-item>

          <el-form-item label="登录密码" prop="loginPassword" label-width="200px">
            <el-input v-model="ruleForm.login_password" placeholder="请输入登录密码"/>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :disabled="isClick" @click="submitForm(ruleFormRef)">登录</el-button>
            <el-button type="danger" :disabled="isClick" @click="resetForm(ruleFormRef)">重置</el-button>
          </el-form-item>

        </el-form>

        <!--设置提示框-->
        <el-alert title="提示" v-show="isErrorAlertDisplay" type="error" :center="true" description="用户信息不存在"
                  show-icon/>
        <el-alert title="提示" v-show="isSuccessAlertDisplay" type="success" :center="true"
                  description="获得用户信息成功"
                  show-icon/>
      </el-main>

    </el-container>
  </div>
</template>

<script>
//引入组件
import {reactive, ref} from 'vue'
//引入useStore
import {useStore} from 'vuex'
//引入use-router组件
import {useRouter} from 'vue-router'

export default {
  name: "UserLogin",

  setup() {
    //设置控制登录表单的两个按钮是否可以点击的逻辑变量
    const isClick = ref(false)

    //定义用户登录时等待服务器返回结果的过程中的loading提示文字
    const loginLoadingText = ref("正在从服务器获得用户信息，请稍后...")
    //定义是否展示提示框对象变量
    const isErrorAlertDisplay = ref(false)
    const isSuccessAlertDisplay = ref(false)

    //定义是否缓冲对象变量
    const isLoading = ref(false)
    //得到store对象
    const store = useStore()
    //得到路由对象
    const router = useRouter()

    //定义表单组件需要的变量
    const formSize = ref('large')
    const ruleFormRef = ref()

    const ruleForm = reactive({
      login_name: '',
      login_password: ''
    })

    //设置对用户输入值的约束规则
    const rules = reactive({
      login_name: [
        {required: true, message: '请输入您的登录名', trigger: 'blur'},
        {min: 3, max: 20, message: '长度（包含空格）应当在3到20个字符之间', trigger: 'blur'},
      ],
      login_password: [
        {required: true, message: '请输入您的登录密码', trigger: 'blur'},
        {min: 6, max: 8, message: '长度应当在6到8个字符之间', trigger: 'blur'},
      ]
    })

    //提交表单
    const submitForm = (formEl) => {
      if (!formEl) return
      //模拟请求服务器过程中设置表单无法点击，且显示缓冲
      isLoading.value = true
      //设置登录表单的两个按钮无法点击
      isClick.value = true
      //将表单进行验证判断
      formEl.validate((valid, fields) => {
        if (valid) {
          // 验证成功，调用store中存储的函数
          store.dispatch('userAbout/userIsExistAction', ruleForm).then(response => {
            //请求成功，设置变量isLoading的值为false
            isLoading.value = false
            isSuccessAlertDisplay.value = true
            //设置一个新的定时器，在显示了成功获得用户信息框之后才跳转
            setTimeout(function () {
              // 实现路由跳转，使用push的方法实现路由组件的跳转
              router.push({path: "/"})
            }, 2000)
            console.log("success response : ", response)
          }).catch(error => {
            //请求失败，设置变量isLoading的值为false
            isLoading.value = false
            //请求失败，展示提示框
            isErrorAlertDisplay.value = true
            //设置登录表单的两个按钮可以继续点击
            isClick.value = false
            console.log("error response : ", error)
          })

        } else {
          console.log('error submit!', fields)
        }
      })
    }

    //重置表单
    const resetForm = (formEl) => {
      formEl.resetFields()
    }

    return {
      //返回变量
      isClick,
      formSize,
      ruleFormRef,
      ruleForm,
      rules,
      isLoading,
      isErrorAlertDisplay,
      isSuccessAlertDisplay,
      loginLoadingText,
      //返回函数
      submitForm,
      resetForm
    }
  }
}

</script>

<style scoped>
/*设置提示框样式*/
.el-alert {
  margin: 20px 0 0;
}

.el-alert:first-child {
  margin: 0;
}

.el-header {
  margin-top: 200px;
  /* margin-bottom: 200px; */
}

.el-main {
  justify-content: center;
  background-color: skyblue;
}

/* .el-form{

} */

.el-aside {
  background-color: skyblue;
  background-image: url("../../assets/img/userlogin_aside_bgc.jpg");
  width: 60%;
  height: 100%;
}

.el-container {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
</style>
