
//设置用户管理页面相关的对用户操作的配置
import axios from "axios";

const userManageOptions = {
    namespaced:true,
    state: {
        //设置的删除用户信息的所需配置数据
        // index表示在当前前端store中存储的对应的用户index
        deleteUserNeedOptions:{
            index: 0,
            row: {}
        },

        // 将从服务器得到的用户数据放入vuex的store仓库中
        userList: []
    },

    actions: {
        //------------------------------------------设置得到用户数据list的函数--------------------------------------------
        //设置得到远程服务器用户数据
        async getUserListAction(context) {
            return new Promise((resolve, reject) => {
                //使用axios访问用户数据接口
                axios({
                    //走代理服务器访问数据
                    url: 'http://localhost:8080/proxy_1/user_list',
                    method: 'post',
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (response) {
                    //得到服务器返回用户列表
                    if (JSON.stringify(response.data) === '[]') {
                        reject("远程获得用户列表失败！")
                    } else {
                        //向store中添加用户列表数据
                        context.commit("getUserListMutation", response.data)
                        resolve("远程获得用户列表成功！")
                    }
                }).catch(function (error) {
                    //请求服务器失败
                    reject(error)
                });
            })
        },

        //------------------------------------------设置增加用户数据action函数--------------------------------------------
        //设置的增加用户函数
        addUserAction(context, addUser) {
            //获得前端用户输入的user对象各个属性值
            const newUser = {
                user_name: addUser.user_name,
                login_name: addUser.login_name,
                login_password: addUser.login_password,
                phone_number: addUser.phone_number,
                info: addUser.info,
                identification: addUser.identification
            }

            //使用异步交互
            return new Promise((resolve, reject) => {
                axios({
                    //走代理服务器访问数据
                    url: 'http://localhost:8080/proxy_1/add_user',
                    method: 'post',
                    data: JSON.stringify(newUser),
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (response) {
                    // 得到服务器返回结果
                    if (response.data.flag === "failed") {
                        reject("远程新增用户失败！")
                    } else if (response.data.flag === "error") {
                        console.log("远程新增用户错误，请稍后重试...")
                        reject("远程新增用户错误，请稍后重试...")
                    } else if(response.data.flag === "success"){
                        resolve("success");
                        console.log("远程新增用户成功！")
                    }
                }).catch(function (error) {
                    //请求服务器失败
                    reject(error)
                });
            })

        },

        //------------------------------------------设置删除用户数据action函数--------------------------------------------
        //设置的删除图片数据按钮实现了
        deleteUserAction(context, value) {
            console.log("deleteUserAction被调用了...", value)
            const deleteUserNeed = {
                user_id: value['user_id']
            }

            // 请求服务器并从数据库中删除用户数据，异步交互
            return new Promise((resolve, reject) => {
                axios({
                    //走代理服务器访问数据
                    url: 'http://localhost:8080/proxy_1/delete_user',
                    method: 'post',
                    data: JSON.stringify(deleteUserNeed),
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (response) {
                    // 得到服务器返回结果
                    if (response.data.flag === "failed") {
                        reject("远程删除用户失败！")
                    } else if (response.data.flag === "error") {
                        console.log("远程删除用户错误，请稍后重试...")
                        reject("远程删除用户错误，请稍后重试...")
                    } else if(response.data.flag === "success"){
                        resolve("success");
                        console.log("远程删除用户成功！")
                    }
                }).catch(function (error) {
                    //请求服务器失败
                    console.log("远程删除用户请求服务器失败...")
                    reject(error)
                });
            })
        },

        //------------------------------------------设置修改用户数据action函数--------------------------------------------
        editUserAction(context, value) {
            console.log("editUserAction被调用了...", value)

            //todo-设置查看是否有敏感字眼存在的判定逻辑


            //检查完成之后构造请求数据对象
            const editUserNeed = {
                identification:value.identification,
                user_id: value.row.user_id
            }

            // 请求远程服务器修改用户信息
            // 请求服务器并从数据库中修改用户数据，异步交互
            return new Promise((resolve, reject) => {
                axios({
                    //走代理服务器访问数据
                    url: 'http://localhost:8080/proxy_1/edit_user',
                    method: 'post',
                    data: JSON.stringify(editUserNeed),
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (response) {
                    // 得到服务器返回结果
                    if (response.data.flag === "failed") {
                        reject("远程删除用户失败！")
                    } else if (response.data.flag === "error") {
                        console.log("远程修改用户错误，请稍后重试...")
                        reject("远程修改用户错误，请稍后重试...")
                    } else if(response.data.flag === "success"){
                        resolve("success");
                        console.log("远程修改用户成功！")
                    }
                }).catch(function (error) {
                    //请求服务器失败
                    console.log("远程修改用户请求服务器失败...")
                    reject(error)
                });
            })
        }
    },

    mutations: {
        //向mutation中添加用户列表
        getUserListMutation(state, value){
            state.userList = value
        },

    },

    //设置的getters对象，包含了一些组件中用到的特殊方法
    getters: {
        //todo
    }

}

export default userManageOptions
