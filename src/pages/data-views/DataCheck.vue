<template>
  <!--定义面包屑样式-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
    <el-breadcrumb-item>数据操作</el-breadcrumb-item>
    <el-breadcrumb-item>数据检查</el-breadcrumb-item>
  </el-breadcrumb>
  <h1>数据检查</h1>

  <!--引入图片数据-->
  <div class="demo-image__error">
    <div class="block demo-image__lazy">
      <el-scrollbar>
        <el-image v-for="url in image_urls" :key="url" :src="url" lazy @click="getPictureDetails(url)">
          <template #error>
            <div class="image-slot">
              <el-icon>
                <icon-picture/>
              </el-icon>
            </div>
          </template>
        </el-image>
      </el-scrollbar>
    </div>
  </div>

</template>

<script>
import {Picture as IconPicture} from '@element-plus/icons-vue'
import {ref} from 'vue'

export default {
  name: "DataCheck",
  //引入组件
  components: {
    IconPicture
  },
  setup() {
    //定义图片url
    const image_urls = ref([
      'http://127.0.0.1:8001/static/images/test1.jpg',
      'http://127.0.0.1:8001/static/images/test2.jpg',
      'http://127.0.0.1:8001/static/images/test3.jpg'
    ])

    //定义对每个图片的点击事件
    function getPictureDetails(url) {
      const curr_img = new Image()
      curr_img.src = url
      console.log("width : ", curr_img.width, "; height : ", curr_img.height, "name : ", curr_img.name)
    }

    return {
      //返回变量
      image_urls,
      //返回函数
      getPictureDetails
    }
  }
}
</script>

<style scoped>
/**设置图片缓加载**/
.demo-image__lazy {
  height: 700px;
  min-width: 600px;
  min-height: 400px;
  overflow-y: auto;
}

.demo-image__lazy .el-image {
  display: block;
  min-height: 200px;
  margin-bottom: 10px;
}

.demo-image__lazy .el-image:last-child {
  margin-bottom: 0;
}


/**设置图片加载失败时的错误显示方式**/
.demo-image__error .block {
  padding: 30px 0;
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
  margin-bottom: 20px;
}

.demo-image__error .el-image {
  padding: 0 5px;
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
</style>