<template>
    <div>
        <div id="horizontal-line-1" v-bind:style="getStylehorline1"></div>
        <div id="horizontal-line-2" v-bind:style="getStylehorline2"></div>
        <div id="vertical-line-1" v-bind:style="getStylevertline1"></div>
        <div id="vertical-line-2" v-bind:style="getStylevertline2"></div>
    </div>
</template>

<script>
import {ref} from 'vue'
import {useStore} from 'vuex'

//定义有助于准确定位十字准线的四条线 */
export default {
  //接收传来的值
  props:['cursor-information'],

  setup(props){
    //获得store对象
    const store = useStore()

    const lineConfig  = ref({ lineWidth: 1, cursorOffset: 20 })
    //接收前端传来的对象值
    const cursorInformation = ref(props["cursor-information"])

    //定义四条线1
    function getStylehorline1() {
      if (cursorInformation.value.elem != null) {
        const cursor = cursorInformation.value.cursor;
        const elem = cursorInformation.value.elem;
        const offset = cursorInformation.value.offset;

        const top =
            Math.min(
                Math.max(
                    offset.top - elem.offsetTop,
                    cursor.y - elem.offsetTop),
                store.state.pictureDetectionAbout.actualImageHeight + store.state.pictureDetectionAbout.boxOffset.y) + "px";
        const left = store.state.pictureDetectionAbout.boxOffset.x + "px";
        const width =
            Math.min(
                store.state.pictureDetectionAbout.actualImageWidth,
                Math.max(
                    0,
                    cursor.x -
                    offset.left - lineConfig.value.cursorOffset
                )
            ) + "px";
        const height = lineConfig.value.lineWidth + "px";
        return {
          position: "absolute",
          top: top,
          left: left,
          height: height,
          width: width,
          backgroundColor: "rgba( 245,30,20,0.7)"
        };
      }

      return {

      }
    }

    //得到四条线的线段2
    function getStylehorline2() {
      if (cursorInformation.value.elem != null) {
        const cursor = cursorInformation.value.cursor;
        const elem = cursorInformation.value.elem;
        const offset = cursorInformation.value.offset;

        const top =
            Math.min(
                Math.max(
                    cursor.y - elem.offsetTop,
                    offset.top - elem.offsetTop
                ),
                store.state.pictureDetectionAbout.actualImageHeight + store.state.pictureDetectionAbout.boxOffset.y
            ) + "px";
        const left =
            Math.max(
                offset.left - elem.offsetLeft,
                cursor.x -
                elem.offsetLeft + lineConfig.value.cursorOffset
            ) + "px";
        const width =
            Math.max(
                0,
                Math.min(
                    store.state.pictureDetectionAbout.actualImageWidth,
                    store.state.pictureDetectionAbout.actualImageWidth -
                    (cursor.x -
                        offset.left +
                        lineConfig.value.cursorOffset)
                )
            ) + "px";
        const height = lineConfig.value.lineWidth + "px";
        return {
          position: "absolute",
          top: top,
          left: left,
          height: height,
          width: width,
          backgroundColor: "rgba( 245,30,20,0.7)"
        };
      }

      return {

      }
    }

    //得到四条线中的第3条线
    function getStylevertline1() {
      if (cursorInformation.value.elem != null) {
        const cursor = cursorInformation.value.cursor;
        const elem = cursorInformation.value.elem;
        const offset = cursorInformation.value.offset;

        const top = store.state.pictureDetectionAbout.boxOffset.y + "px";
        const left =
            Math.max(
                offset.left - elem.offsetLeft,
                Math.min(
                    cursor.x - elem.offsetLeft,
                    store.state.pictureDetectionAbout.actualImageWidth +
                    offset.left - elem.offsetLeft
                )
            ) + "px";
        const width = lineConfig.value.lineWidth + "px";
        const height =
            Math.min(
                store.state.pictureDetectionAbout.actualImageHeight,
                Math.max(
                    0,
                    cursor.y -
                    offset.top - lineConfig.value.cursorOffset
                )
            ) + "px";
        return {
          position: "absolute",
          top: top,
          left: left,
          height: height,
          width: width,
          backgroundColor: "rgba( 245,30,20,0.7)"
        };
      }
      return {};
    }

    //得到四条线中的第4条线
    function getStylevertline2() {
      if (cursorInformation.value.elem != null) {
        const cursor = cursorInformation.value.cursor;
        const elem = cursorInformation.value.elem;
        const offset = cursorInformation.value.offset;

        const top =
            cursor.y -
            elem.offsetTop + lineConfig.value.cursorOffset + "px";
        const left =
            Math.max(
                offset.left - elem.offsetLeft,
                Math.min(
                    cursor.x - elem.offsetLeft,
                    store.state.pictureDetectionAbout.actualImageWidth +
                    offset.left - elem.offsetLeft
                )
            ) + "px";
        const width = lineConfig.value.lineWidth + "px";
        const height =
            Math.max(
                0,
                store.state.pictureDetectionAbout.actualImageHeight -
                (cursor.y -
                    offset.top + lineConfig.value.cursorOffset)
            ) + "px";
        return {
          position: "absolute",
          top: top,
          left: left,
          height: height,
          width: width,
          backgroundColor: "rgba( 245,30,20,0.7)"
        };
      }

      return {

      }
    }

    //返回对象和函数
    return {
      //返回对象
      store,
      lineConfig,
      cursorInformation,

      //返回函数
      getStylehorline1,
      getStylehorline2,
      getStylevertline1,
      getStylevertline2

    }
  }

}
</script>

<style scoped>

</style>
