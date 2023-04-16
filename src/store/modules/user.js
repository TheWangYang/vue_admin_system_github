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
        //设置的用户登录请求action
        userIsExistAction(context, userInfo) {
            const {loginName, loginPassword} = userInfo
            return new Promise((resolve, reject) => {
                axios({
                    //走代理服务器访问数据
                    url: 'http://localhost:8080/proxy_1/user_is_exist',
                    method: 'post',
                    data: JSON.stringify({loginName: loginName, loginPassword: loginPassword}),
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (response) {
                    //得到服务器返回结果
                    console.log("login user res : ", response)
                    if (JSON.stringify(response.data) === '{}') {
                        reject("user not exists!")
                    } else {
                        //设置令牌，这里使用向state设置数据的方法表示令牌
                        //commit('SET_TOKEN', data.token)
                        //向localStorage中添加当前登录用户信息
                        context.commit("userIsExistMutation", {loginName, loginPassword})
                        resolve("user exists and login success!")
                    }
                }).catch(function (error) {
                    //请求服务器失败
                    reject(error)
                });

            })
        },

        //定义的修改用户信息的函数
        //参数为用户当前提交的修改属性
        updateLoginNameAction(context, loginName) {
            // console.log("updateLogiNameAction被调用了...", loginName)
            //设置返回promise
            return new Promise((resolve, reject) => {
                //模拟请求服务器响应时间为3s
                setTimeout(function () {
                    // console.log("loginName is null : ", loginName !== "")
                    if (loginName !== "") {//判断是不是空的，是空的直接返回失败，不是空的返回成功
                        //返回成功之前，调用commit请求mutations中的实际修改用户信息函数
                        context.commit("updateLoginNameMutation", loginName)
                        //返回成功
                        resolve("success")
                    } else {
                        reject("error")
                    }
                }, 3000)

            })
        },

        //定义修改用户信息的函数
        updateUserInfoAction(context, info) {
            console.log("updateUserInfoAction被调用了...", info)

            //设置返回promise
            return new Promise((resolve, reject) => {
                //模拟请求服务器响应时间为3s
                setTimeout(function () {
                    // console.log("loginName is null : ", loginName !== "")
                    if (info !== "") {//判断是不是空的，是空的直接返回失败，不是空的返回成功
                        //返回成功之前，调用commit请求mutations中的实际修改用户信息函数
                        context.commit("updateUserInfoMutation", info)
                        //返回成功
                        resolve("success")
                    } else {
                        reject("error")
                    }
                }, 3000)

            })
        },

    },
    mutations: {
        //将用户数据放入到state对象
        userIsExistMutation(state, currUserNameAndPwd) {
            //给state中的userInfo属性设置值
            state.userInfo = currUserNameAndPwd
            //设置到本地存储中去
            localStorage.userInfo = JSON.stringify(currUserNameAndPwd)
            //console.log("userIsExistMutation被调用了...")
        },

        //设置的修改用户登陆名的mutation
        updateLoginNameMutation(state, loginName) {
            console.log("updateLoginNameMutation被调用了...")
            //更新localStorage中的userInfo
            const userInfo = JSON.parse(localStorage.userInfo)
            userInfo.login_name = loginName
            //更新state中的userInfo
            state.userInfo = userInfo
            localStorage.userInfo = JSON.stringify(userInfo)
        },

        //更新用户info数据
        updateUserInfoMutation(state, info) {
            console.log("updateUserInfoMutation被调用了...")
            //更新localStorage中的userInfo
            const userInfo = JSON.parse(localStorage.userInfo)
            userInfo.info = info
            //更新state中的userInfo
            state.userInfo = userInfo
            localStorage.userInfo = JSON.stringify(userInfo)
        }
    },
    getters: {}
}

export default userOptions
