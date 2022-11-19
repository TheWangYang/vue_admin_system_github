<template>
  <!--设置组件布局样式-->
  <div class="common-layout">
    <el-container class="container_absolute">
      <!--引入Header组件-->
      <el-header ref="layoutElHeaderRoot">
        <el-menu :default-active="this.$route.path" class="el-menu-demo" mode="horizontal" router
                 background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect"
                 :ellipsis="false">
          <el-menu-item index="/">端云一体的缺陷检测系统</el-menu-item>

          <el-sub-menu index="1">
            <template #title>数据操作</template>
            <el-menu-item index="/data-table">数据列表</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="2">
            <template #title>检测操作</template>
            <el-menu-item index="/picture-detection">图片检测</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="3">
            <template #title>用户操作</template>
            <el-menu-item index="/user-center">用户中心</el-menu-item>
            <el-menu-item index="/user-manage">用户管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="4">
            <template #title>系统相关</template>
            <el-menu-item index="/system-quick-start">快速开始</el-menu-item>
            <el-menu-item index="/system-about">关于我们</el-menu-item>
          </el-sub-menu>
          <div class="flex-grow"/>
          <!--设置登录-->
          <el-menu-item index="/user-login">用户登录</el-menu-item>

        </el-menu>
      </el-header>

      <!--管理界面container-->
      <el-container>
        <!--引入侧边栏-->
        <el-aside ref="layoutElAsideRoot">
          <el-row class="tac">
            <el-col>
              <el-menu active-text-color="#ffd04b" background-color="#545c64"
                       class="el-menu-vertical-demo" :default-active="this.$route.path" router
                       text-color="#fff" @open="handleOpen" @close="handleClose">

                <!--数据操作-->
                <el-sub-menu index="1">
                  <template #title>
                    <el-icon>
                      <location/>
                    </el-icon>
                    <span>数据操作</span>
                  </template>
                  <el-menu-item-group title="数据操作">
                    <el-menu-item index="/data-table">数据列表</el-menu-item>
                    <!--                            <el-menu-item index="/data-check">数据检查</el-menu-item>-->
                  </el-menu-item-group>

                  <el-sub-menu index="1-1">
                    <template #title>数据操作待扩展1</template>
                    <el-menu-item index="/">数据操作待扩展1-1</el-menu-item>
                  </el-sub-menu>
                </el-sub-menu>

                <!--检测操作-->
                <el-sub-menu index="2">
                  <template #title>
                    <el-icon>
                      <location/>
                    </el-icon>
                    <span>检测操作</span>
                  </template>

                  <el-menu-item-group title="检测操作">
                    <el-menu-item index="/picture-detection">图片检测</el-menu-item>
                  </el-menu-item-group>

                  <el-sub-menu index="2-1">
                    <template #title>检测操作待扩展1</template>
                    <el-menu-item index="/">检测操作待扩展1-1</el-menu-item>
                  </el-sub-menu>
                </el-sub-menu>

                <!--用户操作-->
                <el-sub-menu index="3">
                  <template #title>
                    <el-icon>
                      <location/>
                    </el-icon>
                    <span>用户操作</span>
                  </template>

                  <el-menu-item-group title="用户操作">
                    <el-menu-item index="/user-center">用户中心</el-menu-item>
                    <el-menu-item index="/user-manage">用户管理</el-menu-item>
                  </el-menu-item-group>

                  <el-sub-menu index="3-1">
                    <template #title>用户操作待扩展2</template>
                    <el-menu-item index="#">用户操作待扩展2-1</el-menu-item>
                  </el-sub-menu>
                </el-sub-menu>

                <!--系统相关-->
                <el-sub-menu index="4">
                  <template #title>
                    <el-icon>
                      <location/>
                    </el-icon>
                    <span>系统相关</span>
                  </template>

                  <el-menu-item-group title="系统相关">
                    <el-menu-item index="/system-quick-start">快速开始</el-menu-item>
                    <el-menu-item index="/system-about">关于我们</el-menu-item>
                  </el-menu-item-group>

                  <el-sub-menu index="4-1">
                    <template #title>资源下载</template>
                    <el-menu-item index="#">数据集下载</el-menu-item>
                  </el-sub-menu>
                </el-sub-menu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>

        <el-scrollbar height="100%" style="width: 100%">
          <el-main>
            <!--放置router-view-->
            <router-view></router-view>
          </el-main>
        </el-scrollbar>

      </el-container>

    </el-container>
  </div>
</template>

<script>
//使用store对象
import {useStore} from "vuex";
import {onMounted, ref, onUnmounted} from "vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Layout",

  //配置setup对象函数
  setup() {
    //定义获得主布局页面的header组件ref对象
    const layoutElHeaderRoot = ref()
    //获得主布局页面的aside组件ref对象
    const layoutElAsideRoot = ref()
    //得到store对象
    const store = useStore()

    //设置的挂载完成之后需要向store仓库中保存数据
    onMounted(() => {
      //console.log("layout挂载成功...")
      // console.log("header width : ", layoutElHeaderRoot)
      // console.log("aside height : ", layoutElAsideRoot)

      //向着pictureDetection的store.js中提交相关信息
      // store.commit("pictureDetectionAbout/setElHeaderRoot",)
      // store.commit("pictureDetectionAbout/setElAsideRoot", layoutElAsideRoot)
    })

    //设置在关闭页面之前，将用户登录信息删除掉
    onUnmounted(() => {
      //console.log("运行了...")
      //清除本地存储即可
      localStorage.clear()
    })

    function handleSelect(key, keyPath) {
      //console.log(key, keyPath);
    }

    function handleOpen(key, keyPath) {
      //console.log(key, keyPath);
    }

    function handleClose(key, keyPath) {
      //console.log(key, keyPath);
    }

    return {
      //返回变量对象
      layoutElHeaderRoot,
      layoutElAsideRoot,

      //返回函数对象
      handleSelect,
      handleClose,
      handleOpen,
    }
  }
}
</script>

<style scoped>

/*设置用户登录在导航栏靠右*/
.flex-grow {
  flex-grow: 1;
}


/*设置提示框的样式*/
.el-alert {
  margin: 20px 0 0;
}

.el-alert:first-child {
  margin: 0;
}

/*参考网上部分资料之后，修改的样式*/
.container_absolute {
  position: absolute;
  top: 0px;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100%;
}

/*固定头部和侧边栏，仅让el-main滑动*/
.el-main {
  width: 100%;
  /*background-color: #8dc7d5;*/
  color: #333;
  text-align: center;
}

.el-menu-vertical-demo {
  width: 200px;
}

.el-aside {
  width: auto;
  background-color: #545c64;
}

.el-aside .el-menu {
  border-right: none;
}

.el-header {
  padding: 0px;
  z-index: 1000;
}

.el-header .el-menu {
  border-bottom: none;
}
</style>


