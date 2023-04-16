//引入axios
import axios from 'axios'


//配置personOptions选项
const picutureOptions = {
    namespaced: true,//启动命名空间寻找对应模块的方式，设置为
    state: {
        //设置的选中删除图片的数据对象需要配置
        //将来上述的两个对象进行封装
        deletePictureNeedOptions: {
            index: 0,
            row: {}
        },
        // 将从服务器得到的图片数据放入vuex的store仓库中
        pictureList: []
    },

    actions: {
        //设置得到远程服务器图片数据
        async getPictureDataAction(context) {
            console.log("getPictureDataAction被调用了...")
            //从localStorage中得到用户数据信息
            const currUserInfo = JSON.parse(localStorage.userInfo)
            console.log("currUserInfo : ", currUserInfo)
            return new Promise((resolve, reject) => {
                //使用axios访问图片数据接口
                axios({
                    //走代理服务器访问数据
                    url: 'http://localhost:8080/proxy_1/picture_table',
                    method: 'post',
                    data: JSON.stringify({
                        loginName: currUserInfo.loginName,
                        loginPassword: currUserInfo.loginPassword
                    }),
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (response) {
                    //得到服务器返回结果
                    console.log("picture table : ", response.data)
                    if (JSON.stringify(response.data) === '[]') {
                        reject("远程获得图片列表失败！")
                    } else {
                        //向store中添加图片列表数据
                        context.commit("getPictureDataMutation", response.data)
                        resolve("远程获得图片列表成功！")
                    }
                }).catch(function (error) {
                    //请求服务器失败
                    reject(error)
                });
            })
        },

        //设置的增加图片的函数
        async addPictureAction() {
            console.log("addPictureAction被调用了...")
            //得到当前登录用户对象
            const currUserInfo = JSON.parse(localStorage.userInfo)
            //请求服务器获得新增图片数据
            return new Promise((resolve, reject) => {
                axios({
                    //走代理服务器访问数据
                    url: 'http://localhost:8080/proxy_1/add_picture',
                    method: 'post',
                    data: JSON.stringify({
                        loginName: currUserInfo.loginName,
                        loginPassword: currUserInfo.loginPassword
                    }),
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (response) {
                    //得到服务器返回结果
                    // console.log("add picture : ", response.data)
                    if (response.data.new_image_uri === "") {
                        reject("远程新增图片失败！")
                    } else if (response.data.new_image_uri === "error") {
                        console.log("远程新增图片错误，请稍后重试...")
                        reject("远程新增图片错误，请稍后重试...")
                    } else {
                        resolve("success");
                        console.log("远程新增图片成功！")
                    }
                }).catch(function (error) {
                    //请求服务器失败
                    reject(error)
                });
            })
        },

        //设置的删除图片数据按钮实现了
        async deletePictureAction(context, option) {
            //console.log("deletePictureAction被调用了...", option)
            //得到当前用户信息
            const currUserInfo = JSON.parse(localStorage.userInfo)
            //根据index得到将删除的图片id
            const delete_picture = option.row
            const pictureId = delete_picture.picture_id
            const save_path = delete_picture.save_path
            const result_path = delete_picture.result_path

            //to-do：放置一些处理逻辑
            return new Promise((resolve, reject) => {
                //设置服务器请求删除图片数据
                //使用axios访问图片数据接口
                axios({
                    //走代理服务器访问数据
                    url: 'http://localhost:8080/proxy_1/picture_delete',
                    method: 'post',
                    data: JSON.stringify({
                        loginName: currUserInfo.loginName,
                        loginPassword: currUserInfo.loginPassword,
                        pictureId: pictureId,
                        save_path: save_path,
                        result_path: result_path
                    }),
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (response) {
                    //得到服务器返回结果
                    console.log("delete picture : ", response.data.result)
                    if (response.data.result === "failed") {
                        reject("远程删除图片失败...")
                    } else if (response.data.result === "Remove UnSynchronized Error") {
                        reject("服务器删除图片同步错误...")
                    } else if (response.data.result === "Original File Not Exists"){
                        reject("待删除图片在远程服务器中不存在...")
                    }else if (response.data.result === "Remove File Inner Error"){
                        reject("服务器删除图片内部错误...")
                    }else if(response.data.result === "error"){
                        reject("服务器错误...")
                    }else if(response.data.result === "success"){
                        resolve("远程服务器删除图片成功...")
                    }
                }).catch(function (error) {
                    //请求服务器失败
                    reject(error)
                });
            })
        },
        //设置修改图片数据action函数
        async editPictureAction(context, value) {
            console.log("editPictureAction被调用了...", value)
            //获得用户对象
            const currUserInfo = JSON.parse(localStorage.userInfo)
            //todo-设置查看是否有敏感字眼存在的判定逻辑

            return new Promise((resolve, reject)=>{
                //发送请求修改数据库中图片描述
                axios({
                    //走代理服务器访问数据
                    url: 'http://localhost:8080/proxy_1/picture_edit',
                    method: 'post',
                    data: JSON.stringify({
                        loginName: currUserInfo.loginName,
                        loginPassword: currUserInfo.loginPassword,
                        picture_id: value.picture_id,
                        picture_name: value.picture_name,
                        description: value.description
                    }),
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (response) {
                    //得到服务器返回结果
                    console.log("edit picture : ", response.data)
                    if (response.data.result === "failed") {
                        reject("远程修改图片失败！")
                    } else if (response.data.result === "error") {
                        console.log("远程修改图片错误，请稍后重试...")
                        reject("远程修改图片错误，请稍后重试...")
                    } else {
                        resolve("success");
                        console.log("远程修改图片成功！")
                    }
                }).catch(function (error) {
                    //请求服务器失败
                    reject(error)
                });
            })
        }
    },

    //实际操作对象，直接操作数据
    mutations: {
        //将新增加的图片数据放入到store.pictureList数组中
        getPictureDataMutation(state, value) {
            console.log("mutation中的getPictureDataMutation被调用了...")
            state.pictureList = value
        }
    },

    //设置的getters对象，包含了一些组件中用到的特殊方法
    getters: {
        //todo

    }
}

export default picutureOptions
