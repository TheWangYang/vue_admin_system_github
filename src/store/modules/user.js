//引入api接口
import axios from "axios";

//配置personOptions选项
const userOptions = {
    namespaced: true,
    state: {
        //设置的userInfo对象，如果当前登录者身份不是管理员，那么
        userInfo: {}
    },

    //处理逻辑的对象
    actions: {
        //-------------------------------------------设置的用户登录请求action------------------------------------------
        userIsExistAction(context, userInfo) {
            const {login_name, login_password} = userInfo

            // 与服务器进行异步交互请求
            return new Promise((resolve, reject) => {
                axios({
                    //走代理服务器访问数据
                    url: 'http://localhost:8080/proxy_1/user_is_exist',
                    method: 'post',
                    data: JSON.stringify({login_name: login_name, login_password: login_password}),
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (response) {
                    //得到服务器返回结果
                    console.log("login user res : ", response)
                    if (JSON.stringify(response.data) === '{}') {
                        reject("user not exists!")
                    } else {
                        //向localStorage中添加当前登录用户信息
                        console.log("response.data: ", response.data)
                        context.commit("userIsExistMutation", response.data)
                        resolve("user exists and login success!")
                    }
                }).catch(function (error) {
                    //请求服务器失败
                    reject(error)
                });
            })
        },

        //-------------------------------------------定义的修改用户信息的函数------------------------------------------
        updateLoginNameAction(context, currUser) {
            console.log("updateLoginNameAction被调用了 currUser: ", currUser)
            // 设置请求远程服务器修改用户名
            // 与服务器进行异步交互请求
            return new Promise((resolve, reject) => {
                axios({
                    //走代理服务器访问数据
                    url: 'http://localhost:8080/proxy_1/update_user_login_name',
                    method: 'post',
                    data: JSON.stringify({
                        user_id: currUser['user_id'],
                        login_name: currUser['login_name']
                    }),
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (response) {
                    //得到服务器返回结果
                    console.log("updateLoginNameAction inner res : ", response.data.flag)
                    if (response.data.flag === 'failed') {
                        reject("失败")
                    } else if (response.data.flag === 'success'){
                        //向localStorage中更新用户信息
                        context.commit("updateLoginNameMutation", currUser)
                        resolve("成功")
                    }else{
                        reject("错误")
                    }
                }).catch(function (error) {
                    //请求服务器失败
                    reject(error)
                });
            })
        },

        updateUserPasswordAction(context, currUser) {
            console.log("updateUserPasswordAction被调用了 currUser: ", currUser)
            // 设置请求远程服务器修改用户密码
            // 与服务器进行异步交互请求
            return new Promise((resolve, reject) => {
                axios({
                    //走代理服务器访问数据
                    url: 'http://localhost:8080/proxy_1/update_user_login_password',
                    method: 'post',
                    data: JSON.stringify({
                        user_id: currUser['user_id'],
                        login_password: currUser['login_password']
                    }),
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (response) {
                    //得到服务器返回结果
                    console.log("updateUserPasswordAction inner res : ", response.data.flag)
                    if (response.data.flag === 'failed') {
                        reject("失败")
                    } else if (response.data.flag === 'success'){
                        //向localStorage中更新用户信息
                        context.commit("updateUserPasswordMutation", currUser)
                        resolve("成功")
                    }else{
                        reject("错误")
                    }
                }).catch(function (error) {
                    //请求服务器失败
                    reject(error)
                });
            })
        },

        updateUserPhoneNumberAction(context, currUser) {
            console.log("updateUserPhoneNumberAction被调用了 currUser: ", currUser)
            // 设置请求远程服务器修改用户手机号
            // 与服务器进行异步交互请求
            return new Promise((resolve, reject) => {
                axios({
                    //走代理服务器访问数据
                    url: 'http://localhost:8080/proxy_1/update_user_phone_number',
                    method: 'post',
                    data: JSON.stringify({
                        user_id: currUser['user_id'],
                        phone_number: currUser['phone_number']
                    }),
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (response) {
                    //得到服务器返回结果
                    console.log("updateUserPhoneNumberAction inner res : ", response.data.flag)
                    if (response.data.flag === 'failed') {
                        reject("失败")
                    } else if (response.data.flag === 'success'){
                        //向localStorage中更新用户信息
                        context.commit("updateUserPhoneNumberMutation", currUser)
                        resolve("成功")
                    }else{
                        reject("错误")
                    }
                }).catch(function (error) {
                    //请求服务器失败
                    reject(error)
                });
            })
        },


        updateUserInfoAction(context, currUser) {
            console.log("updateUserInfoAction被调用了 currUser: ", currUser)
            // 设置请求远程服务器修改用户info
            // 与服务器进行异步交互请求
            return new Promise((resolve, reject) => {
                axios({
                    //走代理服务器访问数据
                    url: 'http://localhost:8080/proxy_1/update_user_info',
                    method: 'post',
                    data: JSON.stringify({
                        user_id: currUser['user_id'],
                        info: currUser['info']
                    }),
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (response) {
                    //得到服务器返回结果
                    console.log("updateUserInfoAction inner res : ", response.data.flag)
                    if (response.data.flag === 'failed') {
                        reject("失败")
                    } else if (response.data.flag === 'success'){
                        //向localStorage中更新用户信息
                        context.commit("updateUserInfoMutation", currUser)
                        resolve("成功")
                    }else{
                        reject("错误")
                    }
                }).catch(function (error) {
                    //请求服务器失败
                    reject(error)
                });
            })
        }


    },
    mutations: {
        //将用户数据放入到state对象
        userIsExistMutation(state, currUser) {
            //给state中的userInfo属性设置值
            state.userInfo = currUser
            //设置到本地存储中去
            localStorage.userInfo = JSON.stringify(currUser)
            //console.log("userIsExistMutation被调用了...")
        },

        //设置的修改用户登陆名的mutation
        updateLoginNameMutation(state, currUser) {
            console.log("updateLoginNameMutation被调用了...")
            // 更新state中的userInfo
            state.userInfo = currUser
            // 更新localStorage中的userInfo
            localStorage.userInfo = JSON.stringify(currUser)
        },

        //更新用户password数据
        updateUserPasswordMutation(state, currUser) {
            console.log("updateUserPasswordMutation被调用了...")
            //更新state中的userInfo
            state.userInfo = currUser
            //更新localStorage中的userInfo
            localStorage.userInfo = JSON.stringify(currUser)
        },

        // 更新用户phone_number数据
        updateUserPhoneNumberMutation(state, currUser) {
            console.log("updateUserPhoneNumberMutation被调用了...")
            //更新state中的userInfo
            state.userInfo = currUser
            //更新localStorage中的userInfo
            localStorage.userInfo = JSON.stringify(currUser)
        },

        // 更新用户info
        updateUserInfoMutation(state, currUser) {
            console.log("updateUserInfoMutation被调用了...")
            //更新state中的userInfo
            state.userInfo = currUser
            //更新localStorage中的userInfo
            localStorage.userInfo = JSON.stringify(currUser)
        },

    },
    getters: {}
}

export default userOptions
