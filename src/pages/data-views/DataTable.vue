<template>
  <!--定义面包屑样式-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
    <el-breadcrumb-item>数据操作</el-breadcrumb-item>
    <el-breadcrumb-item>数据列表</el-breadcrumb-item>
  </el-breadcrumb>
  <h1>
    图片数据列表
  </h1>
  <h4>最后更新时间：{{ new Date() }}</h4>

  <div>
    <!--设置提示信息对话框-->
<!--    <el-dialog v-model="isTableDialog" title="提示" width="30%" :show-close="false">-->
<!--      <h3>{{ tableDialogMessage }}</h3>-->
<!--      <template #footer>-->
<!--                <span class="dialog-footer">-->
<!--                    <el-button type="primary" @click="isTableDialog = false">确认</el-button>-->
<!--                </span>-->
<!--      </template>-->
<!--    </el-dialog>-->

    <!--设置删除对话框-->
    <el-dialog v-model="isDeletePictureDialog" title="删除图片提示" width="30%">
      <h3>是否删除此图片数据？</h3>
      <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="confirmDeletePictureDialog">确认</el-button>
                </span>
      </template>
    </el-dialog>
  </div>

  <div>
    <el-input v-model="search" size="large" placeholder="请输入您想要筛选的条件..." style="width: 800px;"/>
    <el-button type="primary" @click="addPicture">点击添加图片</el-button>
  </div>
  <el-table :data="displayTableData" v-loading="isTableLoading"
            element-loading-text="tableLoadingText"
            style="width: 100%;height: 70vh;" :stripe="true" :fit="true" :border="true">
    <el-table-column align="center" prop="picture_id" label="图片Id" fixed/>
    <el-table-column align="center" prop="picture_name" label="图片名称"/>
    <el-table-column align="center" sortable prop="created_time" label="获得时间"/>
    <el-table-column align="center" sortable prop="update_time" label="更新时间"/>
    <el-table-column align="center" prop="picture_width" label="图片宽度"/>
    <el-table-column align="center" prop="picture_height" label="图片高度"/>
    <el-table-column align="center" prop="picture_size" label="图片大小"/>
    <el-table-column align="center" prop="picture_format" label="图片格式"/>
    <el-table-column align="center" prop="uploader_id" label="上传者Id"/>
    <el-table-column align="center" prop="uploader_name" label="上传者姓名"/>
    <el-table-column align="center" prop="description" label="图片描述"/>
    <el-table-column align="center" prop="is_test" label="是否被检测" width="100"
                     :filters="[{ text: '是', value: '是' }, { text: '否', value: '否' },]"
                     :filter-method="filterIsTest"
                     filter-placement="bottom-end">
      <template #default="scope">
        <el-tag :type="scope.row.is_test === '是' ? '' : 'success'" disable-transitions>{{ scope.row.is_test }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column align="center" prop="save_path" label="保存路径"/>
    <el-table-column align="center" prop="result_path" label="检测结果保存路径"/>

    <el-table-column align="center" prop="save_path" label="原始图片">
      <template #default="scope">
        <div class="demo-image__error">
          <div class="block demo-image__lazy">
            <el-image :src="server_prefix + scope.row.save_path"
                      :preview-src-list="[server_prefix + scope.row.save_path]" lazy
                      style="width: 100px; height: 100px" :preview-teleported="true" :hide-on-click-modal="true">
              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <icon-picture/>
                  </el-icon>
                </div>
              </template>
            </el-image>
          </div>
        </div>
      </template>
    </el-table-column>

    <el-table-column align="center" prop="save_path" label="检测结果图片">
      <template #default="scope">
        <div class="demo-image__error">
          <div class="block demo-image__lazy">
            <el-image :src="server_prefix + scope.row.result_path"
                      :preview-src-list="[server_prefix + scope.row.result_path]"
                      lazy
                      style="width: 100px; height: 100px" :preview-teleported="true" :hide-on-click-modal="true">
              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <icon-picture/>
                  </el-icon>
                </div>
              </template>
            </el-image>
          </div>
        </div>
      </template>
    </el-table-column>

    <el-table-column align="center" prop="shooting_environment" label="拍摄环境"/>
    <el-table-column align="center" prop="shooting_direction" label="拍摄角度"/>
    <el-table-column align="center" prop="shooting_quality" label="拍摄质量"/>
    <el-table-column align="center" prop="is_detection" label="是否包含缺陷"/>

    <el-table-column label="操作" align="center" width="160">
      <template #default="scope">
        <el-button link type="danger" size="small" @click.prevent="deletePicture(scope.$index, scope.row)">删除
        </el-button>
        <el-button text @click="editPicture(scope.$index, scope.row)" type="primary" size="small">编辑</el-button>
        <el-button text @click="detectionPicture(scope.$index, scope.row)" type="primary" size="small">检测该图片
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!--设置的分页footer-->
  <div class="demo-pagination-block">
    <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
                   :small="small" :disabled="disabled" :background="background" layout="sizes, prev, pager, next"
                   :total="filterTableData.length" @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"/>
  </div>

  <!--设置的默认隐藏的编辑图片数据表单，可视化与否由boolean类型变量控制-->
  <el-dialog v-model="dialogFormVisible" title="图片编辑（只允许修改图片描述）">
    <el-form :model="editFormData">
      <el-form-item label="图片描述" :label-width="formLabelWidth">
        <el-input v-model="editFormData.description" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmEditPicture">确认修改</el-button>
            </span>
    </template>
  </el-dialog>

</template>

<script>
import {computed, ref, reactive, onMounted} from 'vue'
//使用store
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import {Picture as IconPicture} from '@element-plus/icons-vue'

export default {
  name: "DataTable",
  components: {
    IconPicture
  },

  setup() {
    //得到路由跳转对象
    const router = useRouter()
    //定义访问的服务器请求接口前缀
    const server_prefix = ref("http://localhost:8001")
    //定义表格中删除图片选项的处理对话框配置
    const isDeletePictureDialog = ref(false)
    //定义表格处理完成逻辑之后的dialog对话框显示配置
    const isTableDialog = ref(false)
    const tableDialogMessage = ref("")
    //定义的表格loading需要的变量
    const tableLoadingText = ref("")
    const isTableLoading = ref(false)

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

    //设置挂载时访问得到图片数据
    onMounted(() => {
      //先设置表格处于记载状态
      isTableLoading.value = true
      tableLoadingText.value = "正在从服务器加载图片列表，请稍后..."
      //访问图片数据接口action
      store.dispatch('pictureAbout/getPictureDataAction').then(response => {
        //设置表格处于非加载状态
        isTableLoading.value = false
        //设置提示框
        isTableDialog.value = true
        tableDialogMessage.value = response
      }).catch(error => {
        //设置表格处于非加载状态
        isTableLoading.value = false
        isTableDialog.value = true
        tableDialogMessage.value = error
      })
    })

    //获得完整的服务器端数据，但是来自vuex的store仓库
    const pictureData = computed(() => store.state.pictureAbout.pictureList)

    //计算过滤之后的属性，使用计算属性computed()
    const filterTableData = computed(() =>
        //首先使用搜索条件对数据进行过滤
        pictureData.value.filter((data) =>
            !search.value || data.picture_id.toLowerCase().includes(search.value.toLowerCase())
        ),
    )

    //截取对应的数据展示到列表中
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

    //-----------------------------定义过滤图片是否被检测函数-----------------------
    function filterIsTest(value, row) {
      return row.is_test === value
    }

    //-----------------------------设置图片编辑功能相关变量和函数-------------------
    const dialogFormVisible = ref(false)
    const formLabelWidth = '140px'

    //设置的弹出式编辑表格属性
    const editFormData = reactive({
      index: "",
      picture_id: "",
      picture_name: "",
      description: "",
    })

    //设置的检测图片处理函数
    function detectionPicture(index, row) {
      console.log("detectionPicture,index :", index, "row : ", row)
      //得到对应将被检测图片
      const toBeDetectedPicture = store.state.pictureAbout.pictureList[index]
      //向pictureDetectionAbout的store中设置初始化图片url
      store.state.pictureDetectionAbout.detectionPictureUri = server_prefix.value + toBeDetectedPicture.save_path
      //将该图片路径直接赋值给store中的路径变量
      store.state.pictureDetectionAbout.detectionPictureSavePath = toBeDetectedPicture.save_path
      //设置路由跳转到检测图片页面
      router.push({path: "/picture-detection"})
    }

    //------------------------------设置添加图片函数---------------------------------
    function addPicture() {
      console.log("addPicture被调用了...")
      //设置表格loading为true，给用户提示
      isTableLoading.value = true
      tableLoadingText.value = "正在新增图片，请稍后..."
      //调用dispatch定向到actions中的对应增加图片函数
      store.dispatch("pictureAbout/addPictureAction").then(res => {
        console.log("addPicture res is :", res)
        tableLoadingText.value = "正在重新获得图片列表，请稍后..."
        //重新请求获得图片列表
        store.dispatch("pictureAbout/getPictureDataAction").then(res => {
          console.log(res)
          //设置表格loading为false
          isTableLoading.value = false
          //设置表格dialog对话框显示
          isTableDialog.value = true
          //设置显示文字，新增图片数据成功
          tableDialogMessage.value = "重新加载图片列表成功，success message : " + res
        }).catch(err => {
          //设置表格loading为false
          isTableLoading.value = false
          //设置表格dialog对话框显示
          isTableDialog.value = true
          //设置显示文字，新增图片数据失败
          tableDialogMessage.value = "重新加载图片列表失败，error message : " + err
          console.log(err)
        })
      }).catch(error => {
        //设置表格loading为false
        isTableLoading.value = false
        //设置表格dialog对话框显示
        isTableDialog.value = true
        //设置显示文字，新增图片数据成功
        tableDialogMessage.value = "增加图片失败，error message : " + error
        console.log("addPicture front error : ", error)
      })
    }

    //---------------设置图片删除功能相关变量和函数-----------------------
    //设置的删除图片函数
    function deletePicture(index, row) {
      //console.log("deletePicture, index :", index, "row : ", row)
      //将得到的当前图片数据放入到store仓库中
      store.state.pictureAbout.deletePictureNeedOptions.index = index
      store.state.pictureAbout.deletePictureNeedOptions.row = row
      //打开删除确认对话框
      isDeletePictureDialog.value = true
    }

    //--------------------------设置对话框处理逻辑函数-------------------------
    function confirmDeletePictureDialog() {
      //设置删除图片对话框隐藏
      isDeletePictureDialog.value = false
      //设置图片列表处于加载状态
      isTableLoading.value = true
      tableLoadingText.value = "正在删除图片，请稍后..."
      //表示用户点击了确认删除，那么直接调用删除逻辑即可
      store.dispatch("pictureAbout/deletePictureAction", store.state.pictureAbout.deletePictureNeedOptions).then(res => {
        console.log("deletePicture front res: ", res)
        tableLoadingText.value = "正在重新加载图片列表，请稍后..."
        //重新请求获得图片列表
        store.dispatch("pictureAbout/getPictureDataAction")
            .then(res => {
              console.log(res)
              //设置表格loading为false
              isTableLoading.value = false
              //设置表格dialog对话框显示
              isTableDialog.value = true
              //设置显示文字，新增图片数据成功
              tableDialogMessage.value = "重新加载图片列表成功，success message : " + res
            })
            .catch(err => {
              //设置表格loading为false
              isTableLoading.value = false
              //设置表格dialog对话框显示
              isTableDialog.value = true
              //设置显示文字，新增图片数据失败
              tableDialogMessage.value = "重新加载图片列表失败，error message : " + err
              console.log(err)
            })
      }).catch(error => {
        console.log(error)
        isTableLoading.value = false
        //设置表格dialog对话框显示
        isTableDialog.value = true
        //设置显示文字，新增图片数据失败
        tableDialogMessage.value = "删除图片数据失败，error message : " + error
      })
    }

    //设置的编辑图片函数
    function editPicture(index, row) {
      console.log("editPicture,index :", index, "row : ", row)
      //给弹出的表单赋值
      //将index传递给后端函数，便于更新数组
      editFormData.index = index
      //将picture_id赋值给弹出对象，便于后续更新数组
      editFormData.picture_id = row.picture_id
      editFormData.picture_name = row.picture_name
      editFormData.description = row.description
      //设置弹出表格可显示
      dialogFormVisible.value = true
    }

    //确认修改图片名称和图片描述函数
    function confirmEditPicture() {
      //设置表格loading为false
      isTableLoading.value = true
      tableLoadingText.value = "正在修改图片数据，请稍后..."
      //调用actions中的修改图片函数，并传入修改后的数据作为参数
      store.dispatch('pictureAbout/editPictureAction', editFormData).then(res => {
        //console.log(res)
        //设置显示表单与否变量为false，表示隐藏弹出表单
        dialogFormVisible.value = false
        tableLoadingText.value = "正在重新获取图片列表，请稍后..."
        //重新请求获得图片列表
        store.dispatch("pictureAbout/getPictureDataAction").then(res => {
          //console.log(res)
          //设置表格loading为false
          isTableLoading.value = false
          //设置表格dialog对话框显示
          isTableDialog.value = true
          //设置显示文字，新增图片数据成功
          tableDialogMessage.value = "重新加载图片列表成功，success message : " + res
        }).catch(err => {
          //设置显示表单与否变量为false，表示隐藏弹出表单
          dialogFormVisible.value = false
          //设置表格loading为false
          isTableLoading.value = false
          //设置表格dialog对话框显示
          isTableDialog.value = true
          //设置显示文字，新增图片数据成功
          tableDialogMessage.value = "重新加载图片列表失败，error message : " + err
          console.log(err)
        })
      }).catch(err => {
        //设置表格loading为false
        isTableLoading.value = false
        //设置表格dialog对话框显示
        isTableDialog.value = true
        //设置显示文字，新增图片数据成功
        tableDialogMessage.value = "修改图片失败，error message : " + err
        console.log(err)
      })
    }

    //最后，在Vue3中，凡是定义在setup函数中的，无论是数据还是函数都需要最后返回
    return {
      //返回数据
      search,
      filterTableData,
      dialogFormVisible,
      formLabelWidth,
      editFormData,
      currentPage,
      pageSize,
      small,
      background,
      disabled,
      displayTableData,
      isTableLoading,
      isTableDialog,
      tableDialogMessage,
      isDeletePictureDialog,
      tableLoadingText,
      server_prefix,


      //返回函数
      deletePicture,
      editPicture,
      filterIsTest,
      addPicture,
      confirmEditPicture,
      confirmDeletePictureDialog,
      handleSizeChange,
      handleCurrentChange,
      detectionPicture
    }

  }
}


</script>


<style scoped>
/**设置表格中显示图片的样式**/
/**设置图片缓加载**/
.demo-image__lazy {
  overflow-y: auto;
}

.demo-image__lazy .el-image {
  display: block;
}

.demo-image__lazy .el-image:last-child {
  margin-bottom: 0;
}


/**设置图片加载失败时的错误显示方式**/
.demo-image__error .block {
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: auto;
  box-sizing: border-box;
  vertical-align: center;
}

.demo-image__error .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.demo-image__error .el-image {
  width: 100%;
  height: 100%;
}

.demo-image__error .image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}

.demo-pagination-block .demo-pagination-block {
  margin-top: 30px;
}

.demo-pagination-block {
  margin-top: 0px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
