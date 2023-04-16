<template>

  <!--定义面包屑样式-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
    <el-breadcrumb-item>用户操作</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
  <h1>
    用户管理
  </h1>
  <h4>最后更新时间：{{ new Date() }}</h4>
  <!--设置修改用户身份之后的提示对话框-->

  <div>
    <el-input v-model="search" size="large" placeholder="请输入您想要筛选的条件..." style="width: 800px;" />
    <el-button type="primary" @click="toOpenAddUserForm">点击添加用户</el-button>
  </div>

  <!--设置的显示用户数据的表格-->
  <el-table :data="displayTableData" v-loading="isTableLoading" element-loading-text="tableLoadingText"
            style="width: 100%; height: 70vh;" :stripe="true" :fit="true">
    <el-table-column align="center" sortable prop="user_id" label="用户Id" fixed />
    <el-table-column align="center" prop="user_name" label="用户名" />
    <el-table-column align="center" prop="login_name" label="登录名" />
    <el-table-column align="center" prop="login_password" label="密码" />
    <el-table-column align="center" prop="phone_number" label="手机号" />
    <el-table-column align="center" prop="info" label="用户详情"/>
    <el-table-column align="center" prop="identification" label="用户身份" />
    <el-table-column align="center" width="200px" sortable prop="lastLoginTime" label="最后登录时间" />
    <el-table-column align="center" width="200px" sortable prop="register_time" label="注册时间" />
    <!--设置对用户数据的操作列-->
    <el-table-column label="操作" align="center" width="160">
      <template #default="scope">
        <el-button link type="danger" size="small" @click.prevent="deleteUser(scope.$index, scope.row)">删除
        </el-button>
        <el-button text @click="editUser(scope.$index, scope.row)" type="primary" size="small">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!--设置的分页footer-->
  <div class="demo-pagination-block">
    <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
                   :small="small" :disabled="disabled" :background="background" layout="sizes, prev, pager, next"
                   :total="filterTableData.length" @size-change="handleSizeChange"
                   @current-change="handleCurrentChange" />
  </div>


  <!--设置弹出对话框-->
  <div>
    <!--设置删除用户时弹出的对话框-->
    <el-dialog v-model="isDeleteUserDialog" title="删除用户提示" width="30%">
      <h3>是否删除用户数据？（此操作不可逆，请谨慎选择）</h3>
      <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="confirmDeleteUserDialog">确认</el-button>
                </span>
      </template>
    </el-dialog>

    <!--设置的默认隐藏的编辑图片数据表单，可视化与否由boolean类型变量控制-->
    <el-dialog v-model="dialogEditUserFormVisible" title="用户数据编辑">
      <el-form :model="userFormData">
        <el-form-item label="用户身份" :label-width="formLabelWidth">
          <el-input v-model="userFormData.identification" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogEditUserFormVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmEditUser">确认修改</el-button>
            </span>
      </template>
    </el-dialog>

    <!--设置新增加用户输入表单-->
    <el-dialog v-model="dialogAddUserFormVisible" title="新增用户信息">
      <el-form ref="addUserFormRef" :model="addUserForm" :rules="addUserFormRules" label-width="120px"
               class="demo-ruleForm" :size="addUserFormSize" status-icon label-position="right"
               v-loading="isAddUserFormLoading" element-loading-text="正在请求服务器添加用户信息，请稍后...">
        <el-form-item label="用户名" prop="user_name" label-width="200px">
          <el-input v-model="addUserForm.user_name" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="登录名" prop="login_name" label-width="200px">
          <el-input v-model="addUserForm.login_name" placeholder="请输入登录名" />
        </el-form-item>

        <el-form-item label="登录密码" prop="login_password" label-width="200px">
          <el-input v-model="addUserForm.login_password" placeholder="请输入登录密码" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone_number" label-width="200px">
          <el-input v-model="addUserForm.phone_number" placeholder="请输入手机号码" />
        </el-form-item>

        <el-form-item label="用户详情" prop="info" label-width="200px">
          <el-input v-model="addUserForm.info" placeholder="请输入用户详情" />
        </el-form-item>

        <el-form-item label="用户身份" prop="identification" label-width="200px">
          <el-input v-model="addUserForm.identification" placeholder="请输入用户身份" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitAddUserForm(addUserFormRef)">提交表单</el-button>
          <el-button type="danger" @click="resetAddUserForm(addUserFormRef)">重置表单</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <!--设置给用户友好提示信息对话框-->
    <el-dialog v-model="isAlert" title="提示" width="30%" :show-close="false">
      <h3>{{alertMessage}}</h3>
      <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="isAlert = false">确认</el-button>
                </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
//引入函数等
import {computed, ref, reactive, onMounted} from 'vue'
//引入store
import { useStore } from 'vuex'

export default {
  name: "UserManage",

  setup() {
    //定义新增加用户表单的ref配置项
    const addUserFormRef = ref()
    //定义新增用户配置
    const dialogAddUserFormVisible = ref(false)

    //设置新增用户表单对应的数据
    const addUserForm = reactive({
      // "user_id": "",
      "user_name": "",
      "login_name": "",
      "login_password": "",
      "phone_number": "",
      "info": "",
      "identification": "",
      "lastLoginTime": "",
      "register_time": ""
    })

    //定义对增加用户表单填充时的检查
    const addUserFormRules = reactive({
      user_name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 4, message: '长度（包含空格）应为3或4个字符', trigger: 'blur' },
      ],
      login_name: [
        { required: true, message: '请输入用户登录名', trigger: 'blur' },
        { min: 3, max: 6, message: '长度应当在6到8个字符之间', trigger: 'blur' },
      ],
      login_password: [
        { required: true, message: '请输入用户登录密码', trigger: 'blur' },
        { min: 6, max: 10, message: '长度应当在6到10个字符之间', trigger: 'blur' },
      ],
      phone_number: [
        { required: true, message: '请输入用户手机号', trigger: 'blur' },
        { min: 11, max: 11, message: '长度应为11个数字', trigger: 'blur' },
      ],
      info: [
        { required: true, message: '请输入用户描述', trigger: 'blur' },
        { min: 6, max: 20, message: '长度应当在6到20个字符之间', trigger: 'blur' },
      ],
      identification: [
        { required: true, message: '请输入用户身份', trigger: 'blur' },
        { min: 3, max: 10, message: '长度应当在3到10个字符之间', trigger: 'blur' },
      ],
    })
    //定义新增用户表单大小变量
    const addUserFormSize = ref('large')
    //定义表格中删除图片选项的处理对话框配置
    const isDeleteUserDialog = ref(false)
    //定义表格处理完成逻辑之后的dialog对话框显示配置
    const isAlert = ref(false)
    //设置的显示处理用户数据之后的弹窗显示message
    const alertMessage = ref("")
    //定义的表格loading需要的变量
    const tableLoadingText = ref("正在添加请稍后...")
    //定义的展示表格是否加载变量
    const isTableLoading = ref(false)
    //设置控制增加用户表单是否loading变量
    const isAddUserFormLoading = ref(false)
    //-----------------------设置分页所需要的变量和函数-----------------------
    const currentPage = ref(1)//记录当前页面为第几页的变量，初始化时和每次过滤之后都为1，其他时间随用户动作而变化
    //默认设置每页数据量为10条
    const pageSize = ref(10)
    const small = ref(false)
    const background = ref(false)
    const disabled = ref(false)

    //定义开始和结束起点，设置默认开始index为0
    const beginDataIndex = ref(0)
    //设置默认结束值为页面展示数量 - 1
    const endDataIndex = ref(pageSize.value - 1)

    //---------------------------加载页面数据------------------------------
    //获得仓库store对象
    const store = useStore()
    //定义搜索关键字变量
    const search = ref("")

    //=====================================访问服务器获得用户列表数据开始====================================
    //设置挂载时访问得到图片数据
    onMounted(() => {
      //先设置表格处于加载状态
      isTableLoading.value = true
      tableLoadingText.value = "正在从服务器加载用户列表，请稍后..."
      //访问图片数据接口action
      store.dispatch('userManageAbout/getUserListAction').then(response => {
        //设置表格处于非加载状态
        isTableLoading.value = false
        console.log("UserManage onMounted response: ", response)
      }).catch(error => {
        //设置表格处于非加载状态
        isTableLoading.value = false
        console.log("ERROR: ", error)
      })
    })

    //=====================================访问服务器获得用户列表数据结束=====================================
    //获得完整的服务器端数据，这里设置为vuex的store仓库数据
    const userData = computed(() => store.state.userManageAbout.userList)
    //计算过滤之后的属性，使用计算属性computed()
    //条件设置为用户Id
    const filterTableData = computed(() =>
        //首先使用搜索条件对数据进行过滤
        userData.value.filter((data) =>
            !search.value || data.user_id.toLowerCase().includes(search.value.toLowerCase())
        ),
    )
    //选择对应的用户数据展示到列表中
    const displayTableData = computed(() =>
        //对filterTableData进行截取
        filterTableData.value.slice(beginDataIndex.value, endDataIndex.value)
    )
    //分页中每页数据量变化时的监听函数，得到单页数据量大小
    const handleSizeChange = (val) => {
      console.log("pagesize is : ", pageSize.value)
    }
    //得到当前页index
    const handleCurrentChange = (val) => {
      // console.log(`current page: ${val}`)
      //首先判断是否只有1页，如果不是，那么继续判断逻辑
      beginDataIndex.value = (val - 1) * pageSize.value
      if (val * pageSize.value > filterTableData.value.length) {
        endDataIndex.value = filterTableData.value.length
      } else {
        endDataIndex.value = val * pageSize.value
      }
    }

    //------------------------------------------------设置增加用户的函数------------------------------------------------
    function toOpenAddUserForm() {
      console.log("toOpenAddUserForm被调用了...")
      //打开新增加用户表单对话框
      dialogAddUserFormVisible.value = true
    }

    //设置提交新增用户表单的函数，提交新增用户表单
    const submitAddUserForm = (addUserFormRef) => {
      //如果不存在，直接返回
      if (!addUserFormRef) return

      //设置用户列表loading为true，给用户提示
      isTableLoading.value = true
      //设置新增用户表单loading为true，给用户更加友好的提示
      isAddUserFormLoading.value = true

      //将新增用户表单进行验证判断
      addUserFormRef.validate((valid, fields) => {
        if (valid) {
          // 验证成功，调用store中存储的函数
          store.dispatch('userManageAbout/addUserAction', addUserForm).then(res => {
            console.log("addUser res is :", res)
            //请求成功，设置变量isTableLoading的值为false
            isTableLoading.value = false
            isAddUserFormLoading.value = false
            //设置给用户请求成功的友好提示框
            isAlert.value = true
            alertMessage.value = "添加用户成功"
            //关闭新增加用户表单
            dialogAddUserFormVisible.value = false

            //重新请求服务器获得当前最新的用户列表
            isTableLoading.value = true
            tableLoadingText.value = "正在从服务器加载用户列表，请稍后..."
            //访问图片数据接口action
            store.dispatch('userManageAbout/getUserListAction').then(response => {
              //设置表格处于非加载状态
              isTableLoading.value = false
              console.log("UserManage onMounted response: ", response)
            }).catch(error => {
              //设置表格处于非加载状态
              isTableLoading.value = false
              console.log("ERROR: ", error)
            })
          }).catch(res => {
            //添加失败，去除新增加用户表单loading和表格loading
            isTableLoading.value = false
            isAddUserFormLoading.value = false
            //弹出增加用户失败提示框
            isAlert.value = true
            //给出增加用户失败提示文字
            alertMessage.value = "增加用户失败，请稍后重试！"
            console.log("UserManage addUserFormRef catch inner res : ", res)
          })
        } else {
          console.log('error submit!', fields)
        }
      })
    }

    //设置重置新增用户表单的函数
    const resetAddUserForm = (addUserFormRef)=>{
      addUserFormRef.resetFields()
    }

    //-------------------------------------------------设置用户删除功能相关变量和函数-------------------------------------------------------
    //设置的删除用户数据函数
    function deleteUser(index, row) {
      console.log("deleteUser, index :", index, "row : ", row)
      //将准备删除用户数据放入到store仓库对应的列表中
      store.state.userManageAbout.deleteUserNeedOptions.index = index
      store.state.userManageAbout.deleteUserNeedOptions.row = row
      // 在删除之前打开对话框
      isDeleteUserDialog.value = true
    }

    //----------------------------------------------------设置删除用户对话框提示-------------------------------------------------------------
    function confirmDeleteUserDialog() {
      //表示用户点击了确认删除，那么直接调用删除逻辑即可
      //调用store库中的删除图片actions函数
      store.dispatch('userManageAbout/deleteUserAction', store.state.userManageAbout.deleteUserNeedOptions.row).then(response => {
        console.log("UserManage deleteUser response: ", response)
        //设置删除用户对话框隐藏
        isDeleteUserDialog.value = false
        //设置删除用户成功提示
        isAlert.value = true
        alertMessage.value = "删除用户成功"

        //重新请求服务器获得当前最新的用户列表
        isTableLoading.value = true
        tableLoadingText.value = "正在从服务器加载用户列表，请稍后..."
        //访问图片数据接口action
        store.dispatch('userManageAbout/getUserListAction').then(response => {
          //设置表格处于非加载状态
          isTableLoading.value = false
          console.log("UserManage onMounted response: ", response)
        }).catch(error => {
          //设置表格处于非加载状态
          isTableLoading.value = false
          console.log("ERROR: ", error)
        })
      }).catch(error => {
        //设置删除用户对话框隐藏
        isDeleteUserDialog.value = false
        alertMessage.value = "删除用户失败: " + error
        console.log("ERROR: ", error)
      })
    }

    //--------------------------------------------------------设置用户编辑功能相关变量和函数------------------------------------------------------
    const dialogEditUserFormVisible = ref(false)
    const formLabelWidth = '140px'

    //设置的弹出式编辑表格属性
    const userFormData = reactive({
      identification:"",
      row:""
    })

    //设置的编辑用户函数
    function editUser(index, row) {
      console.log("editUser, index :", index, "row : ", row)
      //给userFormData的row属性设置row变量的值
      userFormData.row = row
      //给弹出的表单赋值
      //将用户身份设置给userFormData中的identification
      userFormData.identification = row.identification
      //设置弹出表格可显示
      dialogEditUserFormVisible.value = true
    }

    //确认修改用户身份函数
    function confirmEditUser() {
      //表示用户点击了确认修改，那么直接调用修改逻辑即可】
      console.log("userFormData: ", userFormData)
      console.log("user_id: ", userFormData.row['user_id'])

      //调用store库中的修改图片actions函数
      store.dispatch('userManageAbout/editUserAction', userFormData).then(response => {
        console.log("UserManage editUserAction response: ", response)
        //设置修改用户表单隐藏
        dialogEditUserFormVisible.value = false
        //设置编辑用户身份成功提示
        isAlert.value = true
        alertMessage.value = "修改用户身份成功"

        //重新请求服务器获得当前最新的用户列表
        isTableLoading.value = true
        tableLoadingText.value = "正在从服务器加载用户列表，请稍后..."
        //访问图片数据接口action
        store.dispatch('userManageAbout/getUserListAction').then(response => {
          //设置表格处于非加载状态
          isTableLoading.value = false
          console.log("UserManage onMounted response: ", response)
        }).catch(error => {
          //设置表格处于非加载状态
          isTableLoading.value = false
          console.log("ERROR: ", error)
        })
      }).catch(error => {
        //设置修改用户表单隐藏
        dialogEditUserFormVisible.value = false
        alertMessage.value = "修改用户身份信息失败: " + error
        console.log("ERROR: ", error)
      })
    }


    //最后，在Vue3中，凡是定义在setup函数中的，无论是数据还是函数都需要最后返回
    return {
      //返回数据
      search,
      filterTableData,
      dialogEditUserFormVisible,
      dialogAddUserFormVisible,
      formLabelWidth,
      userFormData,
      currentPage,
      pageSize,
      small,
      background,
      disabled,
      displayTableData,
      isTableLoading,
      isAlert,
      alertMessage,
      isDeleteUserDialog,
      tableLoadingText,
      addUserForm,
      addUserFormRules,
      addUserFormSize,
      isAddUserFormLoading,
      addUserFormRef,

      //返回函数
      deleteUser,
      editUser,
      toOpenAddUserForm,//设置的打开新增用户表单的函数
      confirmEditUser,
      confirmDeleteUserDialog,
      handleSizeChange,
      handleCurrentChange,
      submitAddUserForm,
      resetAddUserForm

    }

  }
}


</script>


<style scoped >
/*设置头部提示*/
.header-alert{
  position: absolute;
  width: 80%;
  top:0;
  left:0;
  right:0;
  margin:auto;
}

.demo-pagination-block .demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block {
  margin-top: 0px;
}

.el-button--text {
  margin-right: 15px;
}

.el-input {
  width: 80%;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
