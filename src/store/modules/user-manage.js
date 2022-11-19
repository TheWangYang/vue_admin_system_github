
//设置用户管理页面相关的对用户操作的配置
const userManageOptions = {
    namespaced:true,
    state: {
        //设置的删除用户信息的所需配置数据
        deleteUserNeedOptions:{
            index: 0,
            row: {}
        },

        //设置的user数组对象，如果当前登录者身份为管理员的话，需要该变量
        userList: [//设置的保存person的列表
            {
                "user_id": "1",
                "user_name": "wyy",
                "login_name": "wyy",
                "login_password": "wyy666888",
                "phone_number": "13803907433",
                "info": "A admin manager!",
                "identification": "testIdentification",
                "lastLoginTime": "19/3/2022 21:49:13",
                "register_time": "12/12/2021 19:47:45"
            },
            {
                "user_id": "2",
                "user_name": "wyy",
                "login_name": "wyy",
                "login_password": "wyy666888",
                "phone_number": "13803907433",
                "info": "A admin manager!",
                "identification": "testIdentification",
                "lastLoginTime": "19/3/2022 21:49:13",
                "register_time": "12/12/2021 19:47:45"
            },
            {
                "user_id": "3",
                "user_name": "wyy",
                "login_name": "wyy",
                "login_password": "wyy666888",
                "phone_number": "13803907433",
                "info": "A admin manager!",
                "identification": "testIdentification",
                "lastLoginTime": "19/3/2022 21:49:13",
                "register_time": "12/12/2021 19:47:45"
            },
            {
                "user_id": "4",
                "user_name": "wyy",
                "login_name": "wyy",
                "login_password": "wyy666888",
                "phone_number": "13803907433",
                "info": "A admin manager!",
                "identification": "testIdentification",
                "lastLoginTime": "19/3/2022 21:49:13",
                "register_time": "12/12/2021 19:47:45"
            },
            {
                "user_id": "5",
                "user_name": "wyy",
                "login_name": "wyy",
                "login_password": "wyy666888",
                "phone_number": "13803907433",
                "info": "A admin manager!",
                "identification": "testIdentification",
                "lastLoginTime": "19/3/2022 21:49:13",
                "register_time": "12/12/2021 19:47:45"
            }
        ]
    },

    actions: {
        //设置的删除图片数据按钮实现了
        deleteUserAction(context, value) {
            console.log("deleteUserAction被调用了...", value)
            //to-do：放置一些处理逻辑
            //调用mutations中的删除图片函数执行删除动作
            context.commit("deleteUserMutation", value)
        },

        //设置的增加图片的函数
        addUserAction(context, addUser) {
            //获得前端用户输入的user对象各个属性值
            const {
                user_name,
                login_name,
                login_password,
                phone_number,
                info,
                identification,
            } = addUser
            //console.log("addUserAction被调用了...",user_name)
            //返回到前端用户数据
            return new Promise((resolve, reject) => {
                //根据用户传来的用户信息创建新增用户对象
                const newUser = {
                    // "user_id": "100",

                    "user_name": addUser.user_name,
                    "login_name": addUser.login_name,
                    "login_password": addUser.login_password,
                    "phone_number": addUser.phone_number,
                    "info": addUser.info,
                    "identification": addUser.identification,

                    // "lastLoginTime": new Date(),
                    // "register_time": new Date()
                }

                //模拟请求服务器得到返回的图片数据，然后添加到数据列表中
                //请求服务器时，将用户的信息（除用户Id，最后登录时间，用户注册时间）
                setTimeout(function () {
                    //提交到mutations中的增加图片函数中
                    context.commit("addUserMutation", newUser)
                    resolve("success")
                    console.log("user-manage.js中请求服务器获得用户信息成功...")
                }, 3000)
            })
        },

        //设置修改图片数据action函数
        editUserAction(context, value) {
            console.log("editUserAction被调用了...", value)

            //todo-设置查看是否有敏感字眼存在的判定逻辑

            //定向到mutation中的处理编辑逻辑函数
            context.commit("editUserMutation", value)
        }
    },

    mutations: {
        //删除图片函数中间执行
        deleteUserMutation(state, value) {
            console.log("mutation中的deleteUserMutation被调用了...")
            //执行：删除store中state存储的对应数组数据
            state.userList.splice(value.index, 1)
        },

        //向数组中增加新的图片数据执行
        addUserMutation(state, addUser) {
            console.log("addUserMutation被调用了...")
            state.userList.unshift(addUser)
        },

        //处理图片数据修改的函数逻辑
        editUserMutation(state, value) {
            //获得当前数据的索引值
            const index = value.index
            console.log("editUserMutation被调用了...", value)
            //真正地处理修改的逻辑
            //得到数组中对应index下标的对象
            const userFromIndex = state.userList[index]
            //更新数组中的对象某些属性
            userFromIndex.identification = value.identification
            //重新将对象更新到对应的位置
            state.userList[index] = userFromIndex
        }
    },

    //设置的getters对象，包含了一些组件中用到的特殊方法
    getters: {
        //todo
    }

}

export default userManageOptions
