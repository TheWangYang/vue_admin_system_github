<template>
    <div id="zoom-panel-container" ref="zoomPanelRoot">
        <div
            class="zoom-panel"
            :style="{
                'background-image': store.state.pictureDetectionAbout.image.loaded
                    ? `url('${store.state.pictureDetectionAbout.image.url}')`
                    : 'none',
                'background-position': `${viewportX}px ${viewportY}px`,
                'background-repeat': 'no-repeat'
            }"
            v-if="store.state.pictureDetectionAbout.image.loaded && !store.state.pictureDetectionAbout.selectedBoxUid">
            <div class="axis x-axis" v-if="store.state.pictureDetectionAbout.image.loaded"></div>
            <div class="axis y-axis" v-if="store.state.pictureDetectionAbout.image.loaded"></div>
            <div id="zoom-panel-coordinates" v-if="store.state.pictureDetectionAbout.image.loaded">
                {{ store.state.pictureDetectionAbout.relativeCursor.x }},
                {{ store.state.pictureDetectionAbout.relativeCursor.y }}
            </div>
        </div>

        <!-- TODO: it would be nice to only display  the trash box when selected (with correct width/height) -->
        <div
            class="zoom-panel"
            :style="{
                'background-image': store.state.pictureDetectionAbout.image.loaded
                    ? 'url(' + store.state.pictureDetectionAbout.image.url + ')'
                    : 'none',
                'background-position': `-${getBox.x - 2}px -${getBox.y - 5}px`,
                'background-repeat': 'no-repeat'
            }"
            v-if="store.state.pictureDetectionAbout.image.loaded && store.state.pictureDetectionAbout.selectedBoxUid"
        ></div>
        <div id="zoom-panal-state" v-if="!store.state.pictureDetectionAbout.image.loaded">
            从服务器加载图片
        </div>
    </div>
</template>

<script>
//引入useStore
import {useStore} from 'vuex'

import {computed, onMounted, ref} from 'vue'

export default {

  setup(){
    const store = useStore()
    const size = ref({ width: 0, height: 0 })
    //定义当前页面组件ref的变量
    const zoomPanelRoot = ref()

    //使用计算属性编写X Y定位函数
    const viewportX = computed(() => {
      // console.log("getViewportX : ", size.value.width / 2 - store.state.pictureDetectionAbout.relativeCursor.x);
      return size.value.width / 2 - store.state.pictureDetectionAbout.relativeCursor.x;
    })

    // function viewportX(){
    //   return size.value.width / 2 - store.state.pictureDetectionAbout.relativeCursor.x;
    // }

    const viewportY = computed(() => {
      //console.log("getViewportY : ", size.value.height / 2 - store.state.pictureDetectionAbout.relativeCursor.y);
      return size.value.height / 2 - store.state.pictureDetectionAbout.relativeCursor.y;
    })

    // function viewportY (){
    //   return size.value.height / 2 - store.state.pictureDetectionAbout.relativeCursor.y;
    // }

    //得到box的函数
    const getAnnotation = computed(()=>
        store.state.pictureDetectionAbout.annotations.filter((item) => item.uid === store.state.pictureDetectionAbout.selectedBoxUid)
    )

    const getBox = computed(()=> getAnnotation.value[0].box)

    //设置hook onMounted()周期函数
    onMounted(()=>{
      size.value.width = zoomPanelRoot.value.clientWidth;
      size.value.height = zoomPanelRoot.value.clientHeight;
      //console.log("size width : ",size.value.width,"size height : ", size.value.height)
    })

    //返回对象和函数
    return {
      //返回变量对象
      store,
      size,
      zoomPanelRoot,
      viewportX,
      viewportY,
      getBox
    }
  }
}
</script>

<style scoped>
#zoom-panel-container {
  width: 400px;
  height: 300px;
}

.zoom-panel {
    width: 100%;
    height: 100%;
}

#zoom-panel-coordinates {
    padding-left: 5%;
    background-color: rgba(100, 100, 100, 0.5);
    color: rgba(234, 234, 32, 0.7);
}

#zoom-panal-state {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.axis {
    z-index: 9;
    position: relative;
    background: rgba(234, 234, 32, 0.5);
}

.hover-axis {
    background: red !important;
}

.x-axis {
    top: 50%;
    left: 5%;
    width: 90%;
    height: 1px;
}

.y-axis {
    top: 5%;
    left: 50%;
    width: 1px;
    height: 90%;
}
</style>
