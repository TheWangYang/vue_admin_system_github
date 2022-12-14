//使用axios
import axios from 'axios'
//使用router对象
import {useRouter} from "vue-router";
import {ref} from "vue";

//得到用户的身份
const savedAuth = localStorage.getItem("auth");

//得到router对象
const router = useRouter()

//定义标注图片需要的标签
const developmentAnnotationLabels = [{id: 1, name: "scratch"}, {id: 2, name: "spot"}, {id: 3, name: "rust"}, {
    id: 4, name: "other"
}]

const pictureDetectionOptions = {
    namespaced: true, state: {
        detectionPictureSavePath: "",//待检测图片保存在服务器端的路径变量
        detectionPictureUri: "",//设置待检测图片的uri
        globalDisabled: false,//默认设置为可见
        axiosRequestConfig: {},
        auth: savedAuth ? JSON.parse(savedAuth) : {},
        useAxios: true,//默认值设置为可使用，使用模拟服务器获得
        //设置是否包含垃圾
        contextSelections: {
            environment: null, viewPoint: null, quality: null, isHasDetection: null//默认包含缺陷点
        },
        actualImageWidth: 0,
        actualImageHeight: 0,
        image: {
            url: "",
            creator: "",
            id: "",
            loader: undefined,
            loaded: false,
            size: {width: 1, height: 1},
            ratio: {width: 1, height: 1},
            reverseRatio: {width: 1, height: 1},
            landscapeRatio: 1
        },
        boxOffset: {x: NaN, y: NaN},
        relativeCursor: {x: 0, y: 0},
        annotations: [],
        annotationLabels: [],
        minDetectionSize: 0, //限制最小缺陷尺寸，先设置为0
        selectedAnnotationIndex: NaN,//表示选中的标注Index
        selectedBoxUid: undefined,//设置选中box uid属性变量
        selectedAnnotationLabel: undefined,//设置选中的注释标记为undefined

        //设置store数据仓库保存layout布局页面中header和aside的偏移量
        layoutElAsideWidth: 200,
        layoutElHeaderHeight: 58,//先设置为定值，后期根据需要再设置为动态获取
    },

    //pictureDetection中设置的getter方法
    getters: {},

    //处理逻辑的actions对象
    actions: {
        //从服务器获得标注图片对象对应的缺陷类别
        loadAnnotationLabels(context) {
            if (!context.state.useAxios) {//使用本地模式
                console.log("[INFO] loadAnnotationLabels...");
                context.state.annotationLabels = developmentAnnotationLabels;
            } else {//使用网络请求模式
                return new Promise((resolve, reject) => {
                    setTimeout(function () {
                        //这里先默认得到本地写好的图片缺陷类别数组
                        context.state.annotationLabels = developmentAnnotationLabels
                    }, 2000)
                })
            }
        },

        //设置重置图片检测页面的一些状态，当重新进入该组件页面时调用
        resetPictureDetectionStatus(context) {
            //提交到mutation函数中，重置图片属性和标注数组
            context.commit("resetPictureDetectionStatusMutation")
        },

        //设置提交图片复检框的action接口
        async submitToManualRecheckAction() {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    //发送图片复检框给服务器
                    //context.state.annotations
                    //得到检测结果，更新检测页面显示组件
                    resolve("后台服务器已经接收到了您提供的复检框，感谢您的贡献！")
                    //reject("请求提交复检框到服务器错误，请稍后重试！")
                }, 3000)
            })
        },

        //设置检测图片的action接口
        async detectionPicture(context, curr_picture_properties) {
            console.log("curr_picture_properties: ", curr_picture_properties)
            //得到当前登录的用户信息
            const currUserInfo = JSON.parse(localStorage.userInfo)
            //设置定时器表示请求服务器获得检测结果的过程
            return new Promise((resolve, reject) => {
                //访问服务器接口获得图片的检测信息
                //使用axios访问图片数据接口
                axios({
                    //走代理服务器访问数据
                    url: 'http://localhost:8080/proxy_1/detection_picture', method: 'post', data: JSON.stringify({
                        //传入检索及修改图片需要的信息
                        //将图片的保存路径传送到服务器端
                        detectionPictureSavePath: context.state.detectionPictureSavePath,
                        shooting_environment: curr_picture_properties.shooting_environment,
                        shooting_direction: curr_picture_properties.shooting_direction,
                        shooting_quality: curr_picture_properties.shooting_quality, //传入用户信息
                        loginName: currUserInfo.loginName,
                        loginPassword: currUserInfo.loginPassword
                    }), headers: {'Content-Type': 'application/json;charset=UTF-8'}
                }).then(function (response) {
                    //得到服务器返回结果
                    console.log("detection picture : ", response.data)
                    if (JSON.stringify(response.data.annotations_list) === '[]') {
                        reject("远程检测图片失败！")
                    } else {
                        //获得服务器检测得到的图片注释数组
                        const annotations_list = response.data.annotations_list
                        //获得服务器端保存检测结果图片相对路径
                        const detection_relative_result_path = response.data.detection_relative_result_path
                        //包装上述两个对象为一个新的value对象，传递给mutations方法中
                        const value = {
                            annotations_list, detection_relative_result_path
                        }
                        //得到检测结果，更新检测页面显示组件
                        context.commit("detectionPictureMutation", value)
                        resolve("远程检测图片成功！")
                    }
                }).catch(function (error) {
                    //请求服务器失败
                    reject(error)
                });
            })
        },

        //异步得到图片检测页面的初始化状态
        async fetchState(context, imageLoader) {
            //正在加载远程浏览器图片（用于部署应用模式）
            //得到用户名和密码
            const currUserInfo = JSON.parse(localStorage.userInfo)
            return new Promise((resolve, reject) => {
                if (context.state.detectionPictureUri === "") {//表示图片检测Uri为空，直接从服务器加载一张新的图片
                    //使用axios访问图片数据接口
                    axios({
                        //走代理服务器访问数据
                        url: 'http://localhost:8080/proxy_1/add_picture', method: 'post', data: JSON.stringify({
                            loginName: currUserInfo.loginName, loginPassword: currUserInfo.loginPassword
                        }), headers: {'Content-Type': 'application/json;charset=UTF-8'}
                    }).then(function (response) {
                        //得到服务器返回结果
                        if (response.data.new_image_uri === "") {
                            reject("远程新增图片失败！")
                        } else if (response.data.new_image_uri === "error") {
                            reject("远程新增图片错误，请稍后重试...")
                        } else {
                            //更新检测图片的相对路径
                            context.state.detectionPictureSavePath = response.data.save_path
                            //首先更新图片显示的uri
                            context.state.detectionPictureUri = response.data.new_image_uri
                            //将图片检测uri设置给图片的url
                            context.state.image.url = context.state.detectionPictureUri
                            //访问服务器成功，在此注册imageLoader
                            imageLoader.value.onload = () => {
                                //这里测试图片加载完毕的情景
                                context.state.image.loaded = true;//设置图片加载完毕
                                context.state.image.size.width = imageLoader.value.naturalWidth;
                                context.state.image.size.height = imageLoader.value.naturalHeight;
                                context.state.image.landscapeRatio = imageLoader.value.naturalWidth / imageLoader.value.naturalHeight;
                                //保证分辨率在首次加载时被更新
                                window.dispatchEvent(new Event("detectionResize"));
                            }
                            //给图片设置imageLoader
                            context.state.image.loader = imageLoader;
                            //加载服务器端的图片缺陷类别数组
                            context.dispatch("loadAnnotationLabels")
                            //设置控制显示全局变量为false
                            context.state.globalDisplayFlag = true

                            if (context.state.image.url) {
                                context.state.image.loader.src = context.state.image.url;
                            }

                            resolve("success");
                            console.log("远程新增图片成功！")
                        }
                    }).catch(function (error) {
                        //请求服务器失败
                        reject(error)
                    });
                } else {
                    //将图片检测uri设置给图片的url
                    context.state.image.url = context.state.detectionPictureUri
                    //注册imageLoader
                    imageLoader.value.onload = () => {
                        //这里测试图片加载完毕的情景
                        context.state.image.loaded = true;//设置图片加载完毕
                        context.state.image.size.width = imageLoader.value.naturalWidth;
                        context.state.image.size.height = imageLoader.value.naturalHeight;
                        context.state.image.landscapeRatio = imageLoader.value.naturalWidth / imageLoader.value.naturalHeight;
                        //保证分辨率在首次加载时被更新
                        window.dispatchEvent(new Event("detectionResize"));
                    }
                    //给图片设置imageLoader
                    context.state.image.loader = imageLoader;
                    //加载服务器端的图片缺陷类别数组
                    context.dispatch("loadAnnotationLabels")
                    //设置控制显示全局变量为false
                    context.state.globalDisplayFlag = true

                    if (context.state.image.url) {
                        context.state.image.loader.src = context.state.image.url;
                    }
                    resolve("success");
                }
            })
        }
    },

    //最终提交结果的mutations对象
    mutations: {
        //更新注释数组中缺陷类别的函数
        updateBoxAnnotationLabel(state, {boxUid, annotationLabel}) {
            const annotationObj = state.annotationLabels.find(item => item.name === annotationLabel)
            state.annotations = state.annotations.map(annotation => {
                return annotation.uid === boxUid ? {...annotation, annotationLabel: annotationObj} : annotation;
            });
        },

        //删除annotation中的一个对象元素
        deleteBox(state, boxUid) {
            state.annotations = state.annotations.filter(item => item.uid !== boxUid);
        },

        //选中annotation函数
        selectAnnotation(state, boxUid) {
            //得到注释
            const annotation = state.annotations.find(annotation => annotation.uid === boxUid);
            //如果annotation存在，那么设置选中box uid变量和选中数组变量
            if (annotation) {
                state.selectedBoxUid = boxUid;
                state.selectedAnnotationLabel = annotation.annotationLabel;
            }
        },

        //设置重置选中box的属性mutation
        resetSelectedBox(state) {
            //设置选中box uid为undefined
            state.selectedBoxUid = undefined;
            state.selectedAnnotationLabel = undefined;
        },

        //增加box对象的mutation
        addBox(state, box) {
            // We use Date.now() as a unique id
            const uid = Date.now();//设置每个box的关联uid
            const annotationLabel = {
                id: 0, name: "待定",
            }
            //console.log("before addBox : ",state.annotations)
            //向annotations数组中增加新的注释对象
            state.annotations.push({uid, box, annotationLabel});
            //console.log("after addBox : ",state.annotations)
            //然后设置选中的boxUid为当前uid，便于后续添加注释标签
            state.selectedBoxUid = uid;
            //console.log("selectedBoxUid : ", uid)
        },

        //当组件重新渲染时重置部分变量状态的最终调用
        resetPictureDetectionStatusMutation(state) {
            //重置全局显示变量为false
            state.globalDisabled = false;
            //重置image对象的loaded属性为false
            state.image.loaded = false;//设置图片加载未完毕
            //重置图片属性
            state.image.url = "";
            state.image = {
                url: "",
                creator: "",
                id: "",
                loader: undefined,
                loaded: false,
                size: {width: 1, height: 1},
                ratio: {width: 1, height: 1},
                reverseRatio: {width: 1, height: 1},
                landscapeRatio: 1
            }
            state.annotations = []
            state.actualImageWidth = 0
            state.actualImageHeigh = 0
            state.contextSelections = {
                environment: null, viewPoint: null, quality: null, isHasDetection: null//默认不设置是否包含缺陷点
            }
            //state.boxOffset = {x:NaN, y:NaN}
            state.relativeCursor = {x: 0, y: 0}
        },

        //更新detection页面显示的组件
        detectionPictureMutation(state, value) {
            //设置全局控制页面组件显示变量flag
            state.globalDisabled = true
            //设置得到的注释数组对象
            state.annotations = value.annotations_list
            //设置当前图片显示的uri为结果图片
            //向pictureDetectionAbout的store中设置初始化图片url
            const server_prefix = "http://localhost:8001"
            state.detectionPictureUri = server_prefix + value.detection_relative_result_path
            //将图片检测Uri设置给图片的url
            state.image.url = state.detectionPictureUri
            if (state.image.url) {
                state.image.loader.src = state.image.url;
            }
            //将该图片路径直接赋值给store中的路径变量
            state.detectionPictureSavePath = value.detection_relative_result_path
        },

        //设置上下文选择对象变量
        setContextSelections(state, contextSelections) {
            //赋值给上下文选择对象
            state.contextSelections = contextSelections;
        },

        //重置上下文选择函数
        resetContextSelections(state) {
            state.contextSelections = undefined;
        },

        //更新分辨率的函数
        updateRatio(state, {actualImageWidth, actualImageHeight}) {
            state.actualImageWidth = actualImageWidth;
            state.actualImageHeight = actualImageHeight;
            state.image.ratio.width = state.image.size.width / actualImageWidth;
            state.image.ratio.height = state.image.size.height / actualImageHeight;
            // console.log("updateRatio : ", state.image.ratio.height)
            state.image.reverseRatio.width = 1 / state.image.ratio.width;
            state.image.reverseRatio.height = 1 / state.image.ratio.height;
        },

        //更新相对坐标函数
        updateRelativeCursor(state, offset) {
            if (offset.x > 0 && offset.y > 0 && offset.x <= state.image.size.width && offset.y <= state.image.size.height) {
                // console.log("offset.x : ",offset.x, "offset.y : ", offset.y)
                state.relativeCursor.x = Math.round(offset.x);
                state.relativeCursor.y = Math.round(offset.y);
            }
        },

        //更新box偏移量
        updateBoxOffset(state, offset) {
            state.boxOffset.x = offset.x;
            state.boxOffset.y = offset.y;
        }
    },
}


//向外暴露该options对象
export default pictureDetectionOptions




