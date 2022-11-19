<template>
  <!--定义面包屑样式-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
    <el-breadcrumb-item>数据操作</el-breadcrumb-item>
    <el-breadcrumb-item>数据树</el-breadcrumb-item>
  </el-breadcrumb>
  <h1>数据树展示页面</h1>
</template>

<script>
export default {
  name: "DataTree",
  setup() {
    return {}
  }
}
</script>

<style>

</style>