import { createApp } from 'vue'
import App from './App.vue'

//使用store仓库
import store from './store/index.js'

//使用element-plus组件
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//引入element-plus的icon组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//引入配置好的vue-router
import router from './router/index.js'

//获得app对象
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

//app组件使用element-plus组件
app.use(ElementPlus)

//app对象使用Router组件
app.use(router)

//app对象使用store仓库
app.use(store)

//挂载app对象到前端html页面中
app.mount('#app')
