<template>
  <!--定义面包屑样式-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
    <el-breadcrumb-item>系统相关</el-breadcrumb-item>
    <el-breadcrumb-item>快速开始</el-breadcrumb-item>
  </el-breadcrumb>
  <h1>快速开始</h1>

  <el-carousel height="800px" :autoplay="false" arrow="always" :interval="3000">
    <el-carousel-item v-for="(item, index) in systemIntroductionList" :key="index" :label="item.title" >
      <div class="common-layout">
        <el-container class="container_absolute">
          <el-aside style="width: 50%; height: 95%;">
            <el-image
                style="height:98%;"
                :src="item.img_src"
                :preview-src-list="introductionPictureList"
                :initial-index="index"
                fit="cover"
            />
          </el-aside>

          <el-main>
            <div class="explanation">
              <p class="pre-title">步骤{{index + 1}}</p>
              <h1>{{item.title}}</h1>
              <p>
                {{item.content.p_text}}
              </p>
              <div v-show="item.content.li_text.isDisplay">
                <ul>
                  <li>
                    {{item.content.li_text.li_text_1}}
                  </li>
                  <li>
                    {{item.content.li_text.li_text_2}}
                  </li>
                  <li>
                    {{item.content.li_text.li_text_3}}
                  </li>
                </ul>
              </div>

              <!--展示系统介绍用的tips-->
              <div v-show="item.content.tips_text.isDisplay">
                <p>{{item.content.tips_text.tips_title}}</p>
                <ul>
                  <li>{{item.content.tips_text.tips_li.tips_li_1}}</li>
                  <li>{{item.content.tips_text.tips_li.tips_li_2}}</li>
                  <li>{{item.content.tips_text.tips_li.tips_li_3}}</li>
                  <li></li>
                </ul>
              </div>

            </div>
          </el-main>
        </el-container>
      </div>

    </el-carousel-item>
  </el-carousel>

</template>

<script>
//引入组件
import {ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import {computed} from "vue";

export default {
    name:"SystemIntroduction",
    setup(){
      //得到store对象
      const store = useStore()

      const systemIntroductionList = store.state.systemAbout.systemQuickStart

      //定义一个预览数组
      const introductionPictureList = ref([])

      //循环得到系统介绍中的所有的图片路径
      systemIntroductionList.forEach((item)=>{
        introductionPictureList.value.push(item.img_src)//追加图片的路径到原数组的末尾
      })

        return {
          introductionPictureList,
          systemIntroductionList
        }
    }
}
</script>

<style scoped>

.container_absolute {
  position: absolute;
  top: 0px;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100%;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

</style>
