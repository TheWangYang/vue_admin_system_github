//引入vue-router插件
import {createRouter, createWebHashHistory} from 'vue-router'   // 使用插件可以不加这个

//引入layout主布局组件
import Layout from '../pages/Layout.vue'
import DataTable from '../pages/data-views/DataTable.vue'
import DataTree from '../pages/data-views/DataTree.vue'
import DataCheck from '../pages/data-views/DataCheck.vue'
import PictureDetection from '../pages/picture-views/PictureDetection.vue'
import UserCenter from '../pages/user-views/UserCenter.vue'
import SystemQuickStart from '../pages/system-views/SystemQuickStart.vue'
import SystemAboutUs from '../pages/system-views/SystemAboutUs.vue'
import SystemWelcome from '../pages/system-views/SystemWelcome.vue'
import UserManage from '../pages/user-views/UserManage.vue'

//引入用户登录组件
import UserLogin from '../pages/user-views/UserLogin.vue'

//配置路径：key:value的对应关系
const routes = [
    //设置layout主布局
    {
        path: '/',
        redirect: '/picture-detection',  //设置默认路由位置到图片检测页面
        name: "layout",
        component: Layout,
        meta: {
            title: "主页"
        },

        //设置嵌套路由
        children: [
            //配置系统欢迎页
            {
                path: "system-welcome",
                name: "SystemWelcome",
                component: SystemWelcome,
                meta: {
                    title: "缺陷检测系统欢迎您"
                }
            },
            //配置数据列表
            {
                path: "data-table",
                name: "DataTable",
                component: DataTable,
                meta: {
                    isAuth: true,
                    title: "数据列表"
                }
            },
            //配置数据树
            {
                path: "data-tree",
                name: "DataTree",
                component: DataTree,
                meta: {
                    isAuth: true,
                    title: "数据树"
                }
            },
            //配置数据检查
            {
                path: "data-check",
                name: "DataCheck",
                component: DataCheck,
                meta: {
                    isAuth: true,
                    title: "数据检查"
                }
            },
            //配置图片检测
            {
                path: "picture-detection",
                name: "PictureDetection",
                component: PictureDetection,
                meta: {
                    isAuth: true,
                    title: "图片检测"
                }
            },
            //配置用户中心
            {
                path: "user-center",
                name: "UserCenter",
                component: UserCenter,
                meta: {
                    isAuth: true,
                    title: "用户中心"
                }
            },
            {
                path: "user-manage",
                name: "UserManage",
                component: UserManage,
                meta: {
                    isAuth: true,
                    title: "用户管理"
                },
                //设置独享路由守卫，由一个组件独享
                // beforeEnter: (to, from, next) => {
                //     console.log("UserAdmin中的前置路由守位被调用...", to, from)
                //     //点击之前判断用户身份是否为admin，不是的话提示用户无权限
                //     //获得localStorage中的用户对象，读取其身份属性值
                //     const currUser = JSON.parse(localStorage.userInfo)
                //     if(currUser.identification !== "admin"){
                //         alert("您不是admin管理员，无权限访问！")
                //     }else{
                //         console.log("UserManage页面访问成功！")
                //         next()
                //     }
                // }
            },

            //使用系统快速开始
            {
                path: "system-quick-start",
                name: "SystemQuickStart",
                component: SystemQuickStart,
                meta: {
                    isAuth: false,
                    title: "快速开始"
                }
            },
            //配置系统关于
            {
                path: "system-about",
                name: "SystemAbout",
                component: SystemAboutUs,
                meta: {
                    isAuth: false,
                    title: "系统关于"
                }
            }

        ]
    },

    //设置的用户登录跳转路由
    {
        path: "/user-login",
        name: "UserLogin",
        component: UserLogin,
        meta: {
            //设置isUserExist属性来判断用户是否已经登录
            isUserExist: true
        }
    },

    //设置的用户退出登录跳转路由
    {
        path: "/user-loginout-login",
        name: "User-Loginout-Login",
        component: UserLogin,
        meta: {
            //设置deleteUser属性使用户退出登录
            isDeleteUser: true,
        }
    },
]


//创建路由器对象
const router = createRouter({
    //使用history请求模式
    history: createWebHashHistory(),  // 编写后台就这么写
    routes
})


//设置全局前置路由守卫
router.beforeEach((to, from, next) => {

    if (to.meta.isUserExist) {//如果需要验证，那么查看localStorage中是否已经包含用户登录信息
        if (typeof localStorage.userInfo == "undefined") {//判断userInfo是否为undefined
            //如果是，直接放行
            next()
        } else {
            //如果不是，先提示用户已经登录，然后放行
            alert("您当前已经登录...")
        }
    } else if (to.meta.isDeleteUser) {//设置退出登录之前，清楚用户信息
        if (typeof localStorage.userInfo == "undefined") {//判断userInfo是否为undefined
            //如果是，直接放行
            next()
        } else {
            //清除用户信息，然后提示用户退出登录成功
            localStorage.userInfo = undefined
            //如果不是，先提示用户已经登录，然后放行
            alert("退出登录成功...")
            next()
        }
    } else {
        next()
    }

})


// 设置的全局后置路由守卫设置
router.afterEach((to, from) => {
    // console.log('后置路由守卫...', to, from)
    document.title = to.meta.title || '端云一体的缺陷检测系统'//切换组件之后，对组件展示的title进行修改
})

export default router
