<template>
  <!--定义面包屑样式-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{path: '/'}">主页</el-breadcrumb-item>
    <el-breadcrumb-item>检测操作</el-breadcrumb-item>
    <el-breadcrumb-item>图片检测</el-breadcrumb-item>
  </el-breadcrumb>

  <div id="annotator" element-loading-text="annotatorLoadingText" v-loading.fullscreen.lock="fullscreenLoading">
    <!--设置点击重置按钮提示对话框-->
    <el-dialog v-model="isResetDialog" title="提示" width="30%" :show-close="false">
      <h3>{{ resetDialogMessage }}</h3>
      <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="isResetDialog = false">取消</el-button>
                </span>
        <span class="dialog-footer">
                    <el-button type="primary" @click="handleResetButton">确认</el-button>
                </span>
      </template>
    </el-dialog>

    <!--设置提交检测之后弹出的提示对话框-->
    <el-dialog v-model="isDetectionDialog" title="提示" width="30%" :show-close="false">
      <h3>{{ detectionDialogMessage }}</h3>
      <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="isDetectionDialog = false">取消</el-button>
                </span>
        <span class="dialog-footer">
                    <el-button type="primary" @click="handleDetectionConfirm">确认</el-button>
                </span>
      </template>
    </el-dialog>

    <!--设置是否跳过当前图片的提示框-->
    <el-dialog v-model="isSkipPictureDialog" title="提示" width="30%" :show-close="false">
      <h3>{{ skipPictureDialogMessage }}</h3>
      <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="isSkipPictureDialog = false">取消</el-button>
                </span>
        <span class="dialog-footer">
                    <el-button type="primary" @click="handleSkipPictureConfirm">确认</el-button>
                </span>
      </template>
    </el-dialog>

    <!--设置一个通用提示框元素-->
    <el-dialog v-model="isUniversalDialog" title="提示" width="30%" :show-close="false">
      <h3>{{ universalDialogMessage }}</h3>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="isUniversalDialog = false">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!--设置加载图片的标签-->
    <!--设置图片对象，是为了确定标注页面中的背景图片-->
    <img class="image-loader" ref="imageLoader"/>

    <!--设置标注图片操作容器-->
    <div id="annotator-surface-container" ref="surface" :style="{ width: `${surfaceWidth}%` }">
      <AnnotationSurface/>
    </div>

    <div id="annotator-control-panel">
      <!--设置对图像局部放大的展示面板-->
      <div id="annotator-zoom-panel-container">
        <ZoomPanel/>
      </div>

      <!--设置图片总体属性选择面板-->
      <ContextSelectionPanel ref="contextSelectionPanel"/>

      <el-button
          type="danger"
          class="reset-button"
          :disabled="store.state.pictureDetectionAbout.globalDisabled"
          @click="onClickResetButton">重置图片属性
      </el-button>

      <div id="annotate-action-buttons">
        <el-button
            :disabled="store.state.pictureDetectionAbout.globalDisabled"
            type="primary"
            @click="submitToDetection">提交云端检测
        </el-button>

        <el-button type="primary" @click="onClickSkipButton">获取下一张</el-button>

        <el-button
            :disabled="!store.state.pictureDetectionAbout.globalDisabled"
            type="danger"
            @click="submitToManualRecheck">提交人工复检框
        </el-button>
      </div>
    </div>
  </div>

</template>

<script>
//引入组件
import AnnotationSurface from "@/components/picturedetection-components/AnnotationSurface"
import ZoomPanel from "@/components/picturedetection-components/ZoomPanel"
import ContextSelectionPanel from "@/components/picturedetection-components/ContextSelectionPanel"

//引入vue中的函数等
import {ref, onMounted} from 'vue'
import {useStore} from 'vuex'

export default {
  name: "PictureDetection",
  components: {
    AnnotationSurface,
    ZoomPanel,
    ContextSelectionPanel
  },
  //设置setup函数
  setup() {
    //设置标注页面加载时的提示文字
    const annotatorLoadingText = ref("")
    //控制检测对话框变为加载状态
    const fullscreenLoading = ref(false)
    //定义使用store
    const store = useStore()
    //获得store中存放的state数据
    const DevStore = store.state;

    //定义imageLoader ref对象
    const imageLoader = ref()
    //定义contextSelectionPanel ref对象
    const contextSelectionPanel = ref()

    //定义标注需要的变量
    const surfaceWidth = 70;

    //定义控制提示对话框显示与否的变量
    const isResetDialog = ref(false)
    //定义重置按钮需要的提示文字
    const resetDialogMessage = ref("")

    //定义控制验证注释提示框
    const isDetectionDialog = ref(false)
    //定义控制提交检测需要的提示文字
    const detectionDialogMessage = ref("")

    //定义控制显示跳过当前图片对话框的变量
    const isSkipPictureDialog = ref(false)
    const skipPictureDialogMessage = ref("")


    //定义控制通用提示框
    const isUniversalDialog = ref(false)
    const universalDialogMessage = ref("")

    //组件挂载时，向后传递imageLoader组件对象，并访问服务器拍摄一张图片
    onMounted(() => {
      // 重置部分状态，当页面再次渲染时调用该action函数
      store.dispatch("pictureDetectionAbout/resetPictureDetectionStatus")
      store.dispatch("pictureDetectionAbout/fetchState", imageLoader).then((res) => {
        isUniversalDialog.value = true
        universalDialogMessage.value = "初始化完成，message : " + res
      }).catch((err) => {
        isUniversalDialog.value = true
        universalDialogMessage.value = "初始化失败，message : " + err
      })
    });

    //设置上下文选择面板
    function getContextSelectionPanel() {
      return contextSelectionPanel;
    }

    //设置点击按钮之后重置标注数组对象
    function onClickResetButton() {
      //设置对话框显示
      isResetDialog.value = true
      //设置对话框提示文字
      resetDialogMessage.value = "想要重置已选图片属性么?"
    }

    //设置在打开的对话框中点击'确定重置'按钮之后的处理函数
    function handleResetButton() {
      //调用contextSelectionPanel中的重置函数逻辑
      contextSelectionPanel.value.resetContextSelections();
      isResetDialog.value = false
    }

    //控制弹出检测对话框
    function submitToDetection() {
      //控制确认提交检测对话框显示
      isDetectionDialog.value = true
      //设置提交检测对话框中message
      detectionDialogMessage.value = "是否提交到远程服务器检测？"
    }

    //处理用户点击提交检测标注按钮之后的逻辑
    function handleDetectionConfirm() {
      //保存检测之前，判断图片属性是否已选择
      if (contextSelectionPanel.value.environmentSelection != null
          && contextSelectionPanel.value.viewPointSelection != null
          && contextSelectionPanel.value.qualitySelection != null) {
        //表示有垃圾，则可以提交检测
        if (contextSelectionPanel.value.isHasDetection === true) {
          //创建向服务器端传输的图片属性数据
          const curr_picture_properties = {
            shooting_environment: contextSelectionPanel.value.environmentSelection,
            shooting_direction: contextSelectionPanel.value.viewPointSelection,
            shooting_quality: contextSelectionPanel.value.qualitySelection
          }
          //设置对话框变为加载状态
          fullscreenLoading.value = true
          annotatorLoadingText.value = "正在检测，请稍后..."
          //提交到后台进行检测和保存
          store.dispatch("pictureDetectionAbout/detectionPicture", curr_picture_properties).then(res => {
            //设置对话框消失
            isDetectionDialog.value = false
            //设置加载状态消失
            fullscreenLoading.value = false
            //设置检测成功提示框显示
            isUniversalDialog.value = true
            universalDialogMessage.value = "远程检测图片成功，message : " + res
          }).catch(err => {
            //设置检测失败提示框
            isUniversalDialog.value = true
            //设置加载状态消失
            fullscreenLoading.value = false
            universalDialogMessage.value = "远程检测图片失败，message : " + err
          })
        } else if (contextSelectionPanel.value.isHasDetection === false) {//表示没有垃圾，则不提交检测
          isUniversalDialog.value = true
          //设置加载状态消失
          fullscreenLoading.value = false
          universalDialogMessage.value = "初步判定图片中不包含缺陷，不允许提交检测！"
        }
      } else {
        isUniversalDialog.value = true
        universalDialogMessage.value = "请将图片属性补充完整再检测！"
      }
    }

    //处理点击跳过的按钮
    function onClickSkipButton() {
      //显示是否跳过当前图片
      isSkipPictureDialog.value = true
      skipPictureDialogMessage.value = "获取下一张图片？"
    }

    //获得下一张图片的逻辑函数
    function handleSkipPictureConfirm() {
      //设置对话框变为加载状态
      fullscreenLoading.value = true
      annotatorLoadingText.value = "正在从远程服务器获取新图片，请稍后..."
      //重置图片属性
      contextSelectionPanel.value.resetContextSelections();
      //重置部分变量和状态
      store.dispatch("pictureDetectionAbout/resetPictureDetectionStatus")
      //重新获得图片
      store.dispatch("pictureDetectionAbout/fetchState", imageLoader).then((res) => {
        //设置跳过图片对话框不可见
        isSkipPictureDialog.value = false
        //设置加载下一张图片时显示的loading为不可见
        fullscreenLoading.value = false
        //设置全局对话框可见
        isUniversalDialog.value = true
        //给全局对话框设置提示文字
        universalDialogMessage.value = "获得新图片成功，message : " + res
      }).catch((err) => {
        isSkipPictureDialog.value = false
        //设置全局对话框可见
        isUniversalDialog.value = true
        //给全局对话框设置提示文字
        universalDialogMessage.value = "获得新图片失败，error : " + err
      });
    }

    //设置图片复检
    function submitToManualRecheck() {
      //console.log("点击了...")
      //设置全屏加载页面
      fullscreenLoading.value = true
      annotatorLoadingText.value = "正在提交您的复检标定框，请稍后..."

      //调用后端action逻辑进行复检的提交
      store.dispatch("pictureDetectionAbout/submitToManualRecheckAction").then(res => {
        console.log("submitToManualRecheck success : ", res)
        fullscreenLoading.value = false
        universalDialogMessage.value = res
        isUniversalDialog.value = true
      }).catch(err => {
        fullscreenLoading.value = false
        universalDialogMessage.value = err
        isUniversalDialog.value = true
        console.log("submitToManualRecheck err : ", err)
      })
    }

    //无论是变量还是函数，都需要返回return
    return {
      //定义使用store
      store,
      //获得store中存放的state数据
      DevStore,
      //定义imageLoader ref对象
      imageLoader,
      //定义contextSelectionPanel ref对象
      contextSelectionPanel,
      //定义标注需要的变量
      surfaceWidth,
      //定义控制提示对话框显示与否的变量
      isResetDialog,
      //定义重置按钮需要的提示文字
      resetDialogMessage,
      //定义控制提交检测对话框显示与否的函数
      isDetectionDialog,
      //定义控制显示跳过当前图片对话框的变量
      isSkipPictureDialog,
      skipPictureDialogMessage,
      detectionDialogMessage,
      fullscreenLoading,
      annotatorLoadingText,
      isUniversalDialog,
      universalDialogMessage,

      //设置上下文选择面板
      getContextSelectionPanel,
      //处理检测对话框确定逻辑
      handleDetectionConfirm,
      //设置点击按钮之后重置标注数组对象
      onClickResetButton,
      //设置在打开的对话框中点击'确定重置'按钮之后的处理函数
      handleResetButton,
      //提交进行图片检测
      submitToDetection,
      //处理点击跳过的按钮
      onClickSkipButton,
      //处理跳过当前图片逻辑函数
      handleSkipPictureConfirm,
      submitToManualRecheck
    }
  }
}
</script>

<style scoped>
/*设置el-button的总体属性*/
.el-button {
  margin: 10px;
}

.image-loader {
  display: none;
}

#annotator {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  height: 80vh;
}

#annotator-surface-container {
  height: auto;
  background: rgb(60, 60, 60);
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#annotator-control-panel {
  display: flex;
  flex: 1;
  margin-left: 15px;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  max-width: 400px;
}

#annotator-zoom-panel-container {
  width: 100%;
  flex-basis: 40%;
  margin-bottom: 10px;
  background: rgb(60, 60, 60);
  border: 1px solid rgb(25, 25, 25);
}

.flexColumnFullWidth {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#annotate-action-buttons {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* #annotate-action-buttons *:not(:last-child) {
    margin-bottom: 0.25em;
} */

.reset-annotations {
  color: grey;
  cursor: pointer;
  font-size: 0.6em;
  margin-left: 0.5em;
}

</style>
