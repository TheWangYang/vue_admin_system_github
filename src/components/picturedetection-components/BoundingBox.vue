<template>

    <div
        ref="boundingBoxRoot"
        :id="`bounding-box-${id}`"
        :class="{
            'bounding-box': true,
            'bounding-box-labelled': getLabelled,
            'bounding-box-disabled': getDisabled,
            'bounding-box-selected': selected
        }"
        :style="{
            left: `${getX}px`,
            top: `${getY}px`,
            width: `${getWidth}px`,
            height: `${getHeight}px`
        }"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @click="onMouseClick"
    >

        <div>
            <div
                :class="{
                    'close-cross-container': true,
                    'bounding-box-labelled': getLabelled
                }"
                v-show="!isBeingDrawn"
            >
              <el-tooltip content="删除该标记" placement="bottom" effect="light">
                <el-button
                    type="primary"
                    icon="Delete"
                    :circle="true"
                    @click="onClickCross"
                    :v-show="!selected"
                    size="small">
                </el-button>
              </el-tooltip>
            </div>

            <div
                class="bounding-box-content"
                :style="{
                    width: `${getWidth}px`,
                    height: `${getHeight}px`
                }">

              <div class="bounding-box-index" v-show="props.id !== 'draw'">
                  <p>{{ getIndex }}</p>
              </div>

              <div class="bounding-box-label" v-if="props.id !== 'draw'">
                {{ getAnnotationLabel }}
              </div>

                <el-dialog v-model="selected" title="请选择缺陷类型" close-icon="false" width="30%" :close-on-click-modal="true">
                  <div class="mb-2 flex items-center text-sm">
                    <el-radio-group v-model="annotationLabel" @change="onSelectLabel" class="ml-4">
                      <el-radio
                          v-for="item in store.state.pictureDetectionAbout.annotationLabels"
                          :key="item.id"
                          :label="item.name"
                          size="small">{{item.name}}</el-radio>
                    </el-radio-group>
                  </div>
                </el-dialog>
              </div>
            </div>
        </div>
</template>
<style src="../../../node_modules/vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
import {computed, ref} from 'vue'
import {useStore} from 'vuex'

export default {
  props: ["id","drawed"],

  setup(props){

    //定义获得当前组件对象的ref变量
    const boundingBoxRoot = ref()
    //使用store对象
    const store = useStore()
    const annotationLabel = ref(null)
    const hovered = ref(false)
    //设置是否被选中
    const selected = ref(false)

    //const isClassChooseDialog = computed(()=> selected.value && annotationLabel.value === "")

    //设置鼠标进入函数
    function onMouseEnter(event) {
      //如果鼠标进入box中，那么直接设置hovered为true
      if (boundingBoxRoot.value === event.target) {
        hovered.value = true;
    }
  }

  //设置的鼠标移出函数
    function onMouseLeave(event) {
      if (boundingBoxRoot.value === event.target) {
        hovered.value = false;
    }
  }

  //设置鼠标点击函数
    function onMouseClick() {
      if (hovered.value) {
        store.commit("pictureDetectionAbout/selectAnnotation", props.id);
        selected.value = true;
    } else {
        selected.value = false;
    }
  }

    //判断是否为正在绘制的box
    const isBeingDrawn = computed(()=> props.id === "draw")

    //删除一个box元素
    function onClickCross() {
      store.commit("pictureDetectionAbout/deleteBox", props.id);
    }

    //监听选择缺陷类别函数
    function onSelectLabel() {
      //动态提交到后台mutation中，传入参数为boxUid和注释标签变量值
      store.commit("pictureDetectionAbout/updateBoxAnnotationLabel", {
        boxUid: props.id,
        annotationLabel: annotationLabel.value
      });
    }

    //得到注释标签
    const getAnnotationLabel = computed(()=> getAnnotation()[0].annotationLabel.name)

    //得到最大高度，使用计算属性
    const getOptionMaxHeight = computed(()=>{
      if (getOpenDirection.value === "top") {
        return getY.value + getHeight.value;
      } else {
        return (
            store.state.pictureDetectionAbout.boxOffset.y
            + store.state.pictureDetectionAbout.actualImageHeight
            - (getY.value + getHeight.value)
        )
      }
    })

    //得到打开方向
    const getOpenDirection = computed(()=>{
      if (getY.value + getHeight.value >= store.state.pictureDetectionAbout.actualImageHeight / 2
          + store.state.pictureDetectionAbout.boxOffset.y) {
        return "top";
      } else {
        return "bottom";
      }
    })

    //得到devStyle
    const getDEVstyle = computed(()=> {
      return {
        "min-width": getWidth.value + "px"
      }
    })

    //得到box边界框
    function getBox() {
      const id = props.id
      //console.log("id : ",props.id)
      //绘制box
      if (id === "draw") {
        //console.log("drawed box : ", props.drawed)
        return props.drawed;
      }
      //非绘制，直接返回box
      selected.value = store.state.pictureDetectionAbout.selectedBoxUid === id;
      //console.log("getAnnotation : ", getAnnotation()[0])
      //console.log("selected : ", store.state.pictureDetectionAbout.selectedBoxUid === id)
      return getAnnotation()[0].box
    }

    //得到标注函数
    const getLabelled = computed(()=>{
      //console.log("getAnnotation.value : ",getAnnotation.value)
      //如果存在标签对象那么直接返回对象的标签名name
      return getAnnotation()[0] ? !!getAnnotation()[0].annotationLabel : false;
    })

    //得到用户uid对应的单个注释对象
    //const getAnnotation = computed(()=> store.state.pictureDetectionAbout.annotations.filter((item) => item.uid === props.id))

    function getAnnotation(){
      return store.state.pictureDetectionAbout.annotations.filter((item) => item.uid === props.id)
    }

    //得到index变量
    const getIndex = computed(()=> store.state.pictureDetectionAbout.annotations.findIndex(item => item.uid === props.id))

    //设置是否显示函数
    const getDisabled = computed(()=>{
      return !sizeOK();
    })

    //得到X值
    const getX = computed(()=>{
      return Math.round(
          store.state.pictureDetectionAbout.image.reverseRatio.width * getBox().x
          + store.state.pictureDetectionAbout.boxOffset.x);
    })

    //得到Y坐标的值
    const getY = computed(()=>{
      return Math.round(
          store.state.pictureDetectionAbout.image.reverseRatio.height * getBox().y
          + store.state.pictureDetectionAbout.boxOffset.y);
    })

    //得到宽度
    const getWidth = computed(()=>{
      return Math.round(
          store.state.pictureDetectionAbout.image.reverseRatio.width * getBox().width);
    })

    //得到高度
    const getHeight = computed(()=>{
      return Math.round(
          store.state.pictureDetectionAbout.image.reverseRatio.height * getBox().height);
    })

    //判断size大小是否ok的函数
    function sizeOK(){
      //console.log("getBox() : ",getBox())
      //得到限制的最小缺陷尺寸
      const limitSize = store.state.pictureDetectionAbout.minDetectionSize;
      return getBox().width >= limitSize && getBox().height >= limitSize;
    }

    //无论是变量还是函数对象，都需要返回才可以使用
    return {
      //返回变量
      selected,
      boundingBoxRoot,
      store,
      annotationLabel,
      hovered,
      getAnnotationLabel,
      //返回函数
      getOptionMaxHeight,
      getOpenDirection,
      getDEVstyle,
      getLabelled,
      getAnnotation,
      getIndex,
      getDisabled,
      getX,
      getY,
      getWidth,
      getHeight,
      sizeOK,
      props,

      getBox,
      onSelectLabel,
      onMouseEnter,
      onMouseLeave,
      onMouseClick,
      isBeingDrawn,
      onClickCross
    }
  }
}
</script>

<style scoped>
.custom-multi .multiselect__content-wrapper {
    width: fit-content;
}
.custom-multi .multiselect__option {
    width: 100%;
}
.bounding-box {
    position: absolute;
    cursor: pointer;
    display: inline-block;
}
.close-cross-container {
    position: absolute;
    right: 0;
    line-height: 1;
}
.bounding-box-cross {
    position: absolute;
}

.bounding-box-content {
    border: 2px solid rgb(51, 207, 120);
    display: flex;
    align-items: flex-end;
}

.bounding-box-labelled .bounding-box-content {
    border-style: dotted;
    border-color: #8dc3f1;
}
.bounding-box-labelled .bounding-box-index {
    background-color: #fff;
}
.bounding-box-label {
    background-color: rgba(255, 255, 255, 0.6);
    color: black;
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.bounding-box-index {
    border-radius: 50%;
    width: 10px;
    height: 10px;
    padding: 8px;
    background: #33cf78;
    color: black;
    top: -5px;
    left: -5px;
    font-size: 10px;
    font-weight: bold;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
}

.bounding-box-index p {
    margin: 0px;
}

.bounding-box-disabled .bounding-box-content {
    border-color: #ff6a6a;
}

.bounding-box-selected .bounding-box-content {
    border-style: dotted;
}

.box-multiselect {
    display: inline-block;
    justify-content: space-between;
    width: 200px;
}

.custom-multi >>> .multiselect__tag-icon:focus {
    background: #0073be;
}

.custom-multi >>> .multiselect__tag-icon:hover {
    background: #0073be;
}

.custom-multi >>> .custom-multi.multiselect__tag {
    position: relative;
    display: inline-block;
    padding: 4px 26px 4px 10px;
    border-radius: 5px;
    margin-right: 10px;
    color: #fff;
    line-height: 1;
    background: #0073be;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
}

.custom-multi >>> .custom-multi.multiselect__tag-icon:after {
    content: "×";
    color: #0073be;
    font-size: 14px;
}

.custom-multi >>> .multiselect__tag-icon:focus {
    background: #0073be;
}

.custom-multi >>> .multiselect__tag-icon:hover {
    background: #0073be;
}

.custom-multi >>> .multiselect__option--highlight {
    background: #0073be;
    outline: none;
    color: white;
}

.custom-multi >>> .multiselect__option--highlight:after {
    content: attr(data-select);
    background: #0073be;
    color: white;
}

.custom-multi
    >>> .multiselect__option--selected.multiselect__option--highlight {
    background: #0073be;
    color: #fff;
}

.custom-multi
    >>> .multiselect__option--selected.multiselect__option--highlight:after {
    background: #0073be;
    content: attr(data-deselect);
    color: #fff;
}
</style>
