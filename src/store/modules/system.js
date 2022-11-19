//引入axios
import axios from 'axios'
import { nanoid } from 'nanoid'


//配置personOptions选项
const systemOptions = {
    namespaced: true,
    state: {
        //定义存放'关于我们页面组件'的相关数据
        systemAboutUs:{
            systemAboutUsIconUrl:"images/IAIR_icon.png",

        },
        //定义的快速开始页面需要的数据数组
        systemQuickStart:[
            {
                title:"项目介绍",
                img_src:"images/system_introduction_bg.jpg",
                content: {
                    p_text:"本系统是面向柴油发动机生产线的缺陷成像与检测系统的重要组成部分，主要包含：将成像系统拍摄传送过来的图像上传至服务器进行检测、对服务器发送回来了的缺陷检测图像进行人工的检查和在线标注、实现服务器云端在线训练等任务。",
                    li_text:{
                        isDisplay:false,
                        li_text_1:"",
                        li_text_2:"",
                        li_text_3:""
                    },
                    tips_text:{
                        isDisplay:false,
                        tips_title:"",
                        tips_li:{
                            tips_li_1:"",
                            tips_li_2:"",
                            tips_li_3:""
                        }
                    }
                }
            },
            {
                title:"图像分类",
                img_src:"images/system_classification_bg.jpg",
                content: {
                    p_text:"对每张图像，考虑如下几个问题：",
                    li_text:{
                        isDisplay:true,
                        li_text_1:"首先，确定这张图像来自于哪个成像系统？",
                        li_text_2:"然后，确定这张图像拍摄的角度？",
                        li_text_3:"最后，确定图像的质量，以来区分图像是否模糊或清晰？"
                    },
                    tips_text:{
                        isDisplay:false,
                        tips_title:"",
                        tips_li:{
                            tips_li_1:"",
                            tips_li_2:"",
                            tips_li_3:""
                        }
                    }
                }

            },
            {
                title: "绘制边界框",
                img_src:"images/system_bbox_bg.jpg",
                content: {
                    p_text: "在图像中对服务器模型端没有检测出来的缺陷绘制边界框，这个过程会增加整个系统的鲁棒性和召回率。下面是绘制边界框的一些技巧：",
                    li_text:{
                        isDisplay:true,
                        li_text_1:"尽可能靠近图像中的未检测的地方；",
                        li_text_2:"捕获完整的缺陷；",
                        li_text_3:"从绘制的边界框中尽可能的排除其他成像因素的干扰；"
                    },
                    tips_text:{
                        tips_title:"更多提示",
                        tips_li:{
                            isDisplay:true,
                            tips_li_1:"当不确定是一个还是两个缺陷时：只捕获一个；",
                            tips_li_2:"当一个缺陷附近有几个非常小的缺陷时：将它们全部捕获在一起；",
                            tips_li_3:"当不确定这是否是缺陷时：不要标记它"
                        }
                    }

                }
            },

            {
                title:"给边界框赋标签类别",
                img_src:"images/system_class_to_bbox_bg.jpg",
                content: {
                    p_text: "获得新框定的缺陷类别，包含几个经常观察到的类别。它们共同构成了我们系统应用场景中常见类别。",
                    li_text: {
                        isDisplay:true,
                        li_text_1: "Scratch：发动机表面图像中出现较为纤细的线段；",
                        li_text_2: "Spot：发动机表面出现的细小的点状缺陷；",
                        li_text_3: "Rust：发动机表面出现的浅黄色或者浅绿色的大片污渍状缺陷；",
                        li_text_4:"Other：其他不包含在上述三种类别的缺陷类型；"
                    },
                    tips_text: {
                        isDisplay:false,
                        tips_title: "",
                        tips_li: {
                            tips_li_1: "",
                            tips_li_2: "；",
                            tips_li_3: ""
                        }
                    }

                }
            }

        ],

    },

    //处理逻辑的对象
    actions: {

    },

    mutations: {

    },

    getters: {

    }

}

export default systemOptions


