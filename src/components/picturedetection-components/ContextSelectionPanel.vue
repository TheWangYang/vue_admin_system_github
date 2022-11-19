<template>
    <div id="context-selection-panel">
      <el-tag size="large"><h1>选择拍摄图片属性</h1></el-tag>
        <div class="context-group">
            <p class="context-group-title">拍摄环境选择</p>
          <!--设置拍摄周围环境的按钮列表-->
          <el-radio-group
              v-model="environmentSelection"
              size="small"
              v-for="(item, index) in environmentOptionsContext"
              :key="index"
          >
            <el-radio-button :label="item.value">{{item.text}}</el-radio-button>
          </el-radio-group>
        </div>

        <div class="context-group">
            <p>拍摄方向选择</p>
          <el-radio-group
              v-model="viewPointSelection"
              size="small"
              v-for="(item, index) in viewPointOptionsContext"
              :key="index"
          >
            <el-radio-button :label="item.value">{{item.text}}</el-radio-button>
          </el-radio-group>
        </div>

      <!--拍摄的图片质量选择列表-->
        <div class="context-group">
            <p>图片质量选择</p>
          <el-radio-group
              v-model="qualitySelection"
              size="small"
              v-for="(item, index) in qualityOptionsContext"
              :key="index"
          >
            <el-radio-button :label="item.value">{{item.text}}</el-radio-button>
          </el-radio-group>
        </div>

      <!--如果没有缺陷直接点击该按钮即可-->
      <div class="context-group">
        <p>图片是否有缺陷？</p>
        <el-radio-group
            v-model="isHasDetection"
            size="small">
          <el-radio-button :label="true">有</el-radio-button>
          <el-radio-button :label="false">没有</el-radio-button>
        </el-radio-group>
      </div>

    </div>
</template>
<script>
//引入ref组件
import {ref, watch} from 'vue'
import { environmentOptions, viewPointOptions, qualityOptions } from "@/models";
import {useStore} from 'vuex'

export default {
  setup(){
    //得到store对象
    const store = useStore()
    const environmentSelection = ref(null)
    const viewPointSelection = ref(null)
    const qualitySelection = ref(null)
    const isHasDetection = ref(null)

    const environmentOptionsContext = ref(environmentOptions)
    const viewPointOptionsContext  =ref(viewPointOptions)
    const qualityOptionsContext = ref(qualityOptions)

    //定义函数
    //监听上述部分变量变化，并及时提交到后端的commit中进行实时更新
    watch([environmentSelection, viewPointSelection, qualitySelection, isHasDetection],
        ([newEnvironmentSelection, newViewPointSelection, newQualitySelection, newIsHasDetection]) => {
      store.commit("pictureDetectionAbout/setContextSelections",{
        //将变换后的新对象提交给后端action中
        quality: newQualitySelection,
        viewPoint: newViewPointSelection,
        environment: newEnvironmentSelection,
        isHasDetection: newIsHasDetection
      })
    })

    //重置上下文选择的函数
    function resetContextSelections() {
      environmentSelection.value = null;
      qualitySelection.value = null;
      viewPointSelection.value = null;
      isHasDetection.value = null;

      //调用提交到action的函数
      store.commit("pictureDetectionAbout/resetContextSelections");
    }


    //返回对象和函数
    return{
      //返回对象变量
      environmentSelection,
      viewPointSelection,
      qualitySelection,
      environmentOptionsContext,
      viewPointOptionsContext,
      qualityOptionsContext,
      isHasDetection,

      //返回函数对象
      resetContextSelections

    }
  }
  
}
</script>

<style scoped>
.context-group-title p {
    margin-bottom: 0.2em;
    font-size: 1rem;
}

.context-group p {
  margin: 10px;
  font-weight: bold;
}

#context-selection-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 94%;
}
</style>
