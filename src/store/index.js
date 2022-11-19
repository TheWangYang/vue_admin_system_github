import { createStore } from 'vuex'
//引入不同的组建的配置项目
import picutureOptions from './modules/picture.js'
import userOptions from './modules/user.js'
import systemOptions from './modules/system.js';
import userManageOptions from "./modules/user-manage.js";
import pictureDetectionOptions from "./modules/picture-detection.js";

//Vue3中创建store对象
const store = createStore({
        //模块化编程使用modules属性
        modules: {
            //增加模块配置
            pictureAbout: picutureOptions,
            userAbout: userOptions,
            systemAbout: systemOptions,
            userManageAbout: userManageOptions,
            pictureDetectionAbout: pictureDetectionOptions,
        }
}
)

//向外暴露store对象
export default store




