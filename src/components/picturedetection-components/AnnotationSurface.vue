<template>
  <div
      @mousemove="onMouseMove"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      id="annotation-surface-image"
      ref="annotationSurfaceRoot"
      :style="{
            'background-image': store.state.pictureDetectionAbout.image.loaded
                ? `url('${store.state.pictureDetectionAbout.image.url}')`
                : 'none',
            cursor: !store.state.pictureDetectionAbout.selectedBoxUid ? 'crosshair' : 'not-allowed'
        }">
    <!--设置未完成图片加载的提示组件-->
    <div id="loader-animation" v-if="!store.state.pictureDetectionAbout.image.loaded">
      <GridLoader color="white"/>
    </div>

    <!--增加标注框-->
    <BoundingBox
        v-for="annotatedDetection in store.state.pictureDetectionAbout.annotations"
        :id="annotatedDetection.uid"
        :key="annotatedDetection.uid"
    />

    <CrosshairGuide :cursor-information="cursorInformation"/>

    <!--设置新绘制的BoundingBox-->
    <BoundingBox ref="draw" id="draw" :drawed="drawedBox" v-if="drawing"/>

  </div>
</template>

<script>
//引入组件
import BoundingBox from "@/components/picturedetection-components/BoundingBox"
import CrosshairGuide from "@/components/picturedetection-components/CrossHairGuide"
import GridLoader from "vue-spinner/src/PulseLoader.vue"

//使用store
import {useStore} from 'vuex'
import {ref, onMounted} from 'vue';

export default {
  name: "AnnotationSurface",
  components: {
    CrosshairGuide,
    GridLoader,
    BoundingBox
  },
  setup() {
    //得到数据仓库store
    const store = useStore()
    //定义获得当前组件的根ref元素
    const annotationSurfaceRoot = ref()

    //定义是否正在绘制
    const drawing = ref(false)
    //设置的绘制开始的起点坐标
    const drawedMouseDownLocation = ref({x: NaN, y: NaN})
    //设置已经绘制好的新增box变量
    const drawedBox = ref({x: NaN, y: NaN, width: NaN, height: NaN})

    //定义相关变量
    /** 当前相对于表面的相对位置 */
    const relativeCursor = ref({x: 0, y: 0})
    //有关要传递给 CrosshairGuide 的光标的信息
    const cursorInformation = ref({
      cursor: {x: 0, y: 0},
      elem: annotationSurfaceRoot.value,
      offset: {left: 0, top: 0}
    })

    //设置组件挂载时的处理操作
    onMounted(() => {
      //向window对象中增加监听器
      window.addEventListener("detectionResize", () => {
        const annotatorSurface = document.getElementById("annotation-surface-image");
        const annotatorWidth = annotatorSurface.offsetWidth;
        const annotatorHeight = annotatorSurface.offsetHeight;
        console.log("annotatorWidth: ", annotatorWidth)
        console.log("annotatorHeight : ", annotatorHeight)
        const {actualImageWidth, actualImageHeight} = estimateActualImageSize(annotatorWidth, annotatorHeight);
        //提交到后边的更新图片分辨率函数
        store.commit("pictureDetectionAbout/updateRatio", {
          actualImageWidth,
          actualImageHeight
        });

        //定义box边界偏移量
        const boxOffset = {
          x: annotatorWidth / 2 - actualImageWidth / 2,
          y: annotatorHeight / 2 - actualImageHeight / 2
        };
        console.log("boxOffset : ", boxOffset)
        //提交到更新边界偏移量函数中
        store.commit("pictureDetectionAbout/updateBoxOffset", boxOffset);
      });
    })

    //确定实际的图片大小
    function estimateActualImageSize(annotatorWidth, annotatorHeight) {
      //得到分辨率长宽比率
      const annotatorLandscapeRatio = annotatorWidth / annotatorHeight;
      //console.log("store.state.pictureDetectionAbout.image.landscapeRatio : ",store.state.pictureDetectionAbout.image.landscapeRatio)
      //如果长宽比率大于store对象中存储的
      if (annotatorLandscapeRatio > store.state.pictureDetectionAbout.image.landscapeRatio) {
        // 那么需要限制的是图片的高度大小，需要按照比率进行缩放
        return {
          actualImageHeight: annotatorHeight,
          actualImageWidth: annotatorHeight * store.state.pictureDetectionAbout.image.landscapeRatio
        };
      } else {
        // 限制显示的是图片的宽
        return {
          actualImageHeight: annotatorWidth / store.state.pictureDetectionAbout.image.landscapeRatio,
          actualImageWidth: annotatorWidth
        };
      }
    }

    //设置鼠标按下逻辑函数
    function onMouseDown(event) {
      //console.log("onMouseDown...")
      if (
          store.state.pictureDetectionAbout.globalDisabled
          //表示鼠标还在标注面板中
          && annotationSurfaceRoot.value === event.target
          //表示还未开始绘制，状态为false
          && !drawing.value
          //选中的标注为空，那么表示正在绘制中的鼠标点击事件
          && isNaN(store.state.pictureDetectionAbout.selectedAnnotationIndex)
          //表示是否包含缺陷点，只有包含缺陷点才可以绘制，默认值为true
          && store.state.pictureDetectionAbout.contextSelections.isHasDetection
      ) {
        //组织默认的鼠标点击冒泡事件
        event.preventDefault();
        //给待定绘制的box属性赋值
        drawedBox.value.width = 0;
        drawedBox.value.height = 0;
        //给绘制起点赋值，绘制起点为鼠标在图片中的相对位置
        drawedMouseDownLocation.value.x = store.state.pictureDetectionAbout.relativeCursor.x;
        drawedMouseDownLocation.value.y = store.state.pictureDetectionAbout.relativeCursor.y;
        //给绘制的box位置赋值
        drawedBox.value.x = store.state.pictureDetectionAbout.relativeCursor.x;
        drawedBox.value.y = store.state.pictureDetectionAbout.relativeCursor.y;
        //设置绘制变量为true
        drawing.value = true;
      }
    }


    //设置鼠标抬起逻辑函数
    function onMouseUp() {
      //判断是否正在绘制
      if (drawing.value) {
        //表示当前box绘制完毕
        drawing.value = false;
        //得到新绘制的box框
        const box = {
          //box的坐标
          x: drawedBox.value.x,
          y: drawedBox.value.y,
          //box的大小
          width: Math.round(drawedBox.value.width),
          height: Math.round(drawedBox.value.height)
        }
        //得到最小限制大小
        const limitSize = store.state.pictureDetectionAbout.minDetectionSize;
        if (box.width > limitSize && box.height > limitSize) {
          //提交到后边的mutation增加box
          store.commit("pictureDetectionAbout/addBox", box)
        } else {
          console.log("标定框太小了即将重置...");
        }
        //调用重置标定框函数
        resetDrawedBox();
      } else {
        //调用重置selectedBox的mutation
        store.commit("pictureDetectionAbout/resetSelectedBox");
      }
    }

    //重置已经绘制过的box
    function resetDrawedBox() {
      drawedBox.value.width = NaN;
      drawedBox.value.height = NaN;
      drawedBox.value.x = NaN;
      drawedBox.value.y = NaN;
    }

    //设置的鼠标移动逻辑处理函数
    function onMouseMove(event) {
      //得到ref元素的value值
      const elem = annotationSurfaceRoot.value;

      //得到实际的偏移量
      const offset = {
        //这里最后添加了layout总布局页面header高度和aside宽度值的偏移量
        left: elem.offsetLeft + store.state.pictureDetectionAbout.boxOffset.x + store.state.pictureDetectionAbout.layoutElAsideWidth,
        top: elem.offsetTop + store.state.pictureDetectionAbout.boxOffset.y + store.state.pictureDetectionAbout.layoutElHeaderHeight
      };

      const cursor = {
        x: event.clientX,
        y: event.clientY
      };

      //得到在PictureDetection组件的右上角zoomPanel中的局部显示图片
      const relativeCursor = {
        x: (cursor.x - offset.left) * store.state.pictureDetectionAbout.image.ratio.width,
        y: (cursor.y - offset.top) * store.state.pictureDetectionAbout.image.ratio.height
      };

      cursorInformation.value.cursor = cursor;
      cursorInformation.value.offset = offset;
      cursorInformation.value.elem = elem;
      store.commit("pictureDetectionAbout/updateRelativeCursor", relativeCursor);

      //判断是否正在绘制
      if (drawing.value) {
        drawedBox.value.width = Math.abs(store.state.pictureDetectionAbout.relativeCursor.x - drawedMouseDownLocation.value.x);
        drawedBox.value.height = Math.abs(store.state.pictureDetectionAbout.relativeCursor.y - drawedMouseDownLocation.value.y);
        drawedBox.value.x = store.state.pictureDetectionAbout.relativeCursor.x - drawedMouseDownLocation.value.x < 0
            ? store.state.pictureDetectionAbout.relativeCursor.x : drawedMouseDownLocation.value.x;
        drawedBox.value.y = store.state.pictureDetectionAbout.relativeCursor.y - drawedMouseDownLocation.value.y < 0
            ? store.state.pictureDetectionAbout.relativeCursor.y : drawedMouseDownLocation.value.y;
      }

    }

    /** 设置离开组件时，停止使用标注表面*/
    function onMouseLeave(event) {
      console.log("onMouseLeave...")
      // 判断是否鼠标已经移出标注面板，如果移出，设置正在标注变量为false
      if (annotationSurfaceRoot.value === event.target) {
        drawing.value = false;
      }
    }

    //返回变量和函数对象
    return {
      //返回变量对象
      store,
      relativeCursor,
      annotationSurfaceRoot,
      cursorInformation,
      drawedBox,
      drawing,

      //返回函数
      estimateActualImageSize,
      onMouseMove,
      onMouseDown,
      onMouseUp,
      onMouseLeave
    }
  }
}
</script>

<style scoped>
#annotation-surface-image {
  position: relative;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain !important;
  /* border: solid 0.1px red; */
}

#loader-animation {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
