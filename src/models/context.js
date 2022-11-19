//定义决定图像质量标注好坏的变量
const QualityValue = "good" | "medium" | "bad";
//定义环境变量
const EnvironmentValue = "urban"
    | "nature"
    | "river"
    | "beach"
    | "underwater";

//定义拍摄视角变量
const ViewPoint = "side" | "above";

// const RadioOptions = { value: T; text: string }[];


//定义拍摄方向的选项
const viewPointOptions  =[
    { value: "aside", text: "侧面" },
    { value: "above", text: "上面" }
]


//定义环境选项变量
const environmentOptions = [
    { value: "environ1", text: "环境1" },
    { value: "environ2", text: "环境2" },
    { value: "environ3", text: "环境3" },
    { value: "environ4", text: "环境4" },
    { value: "environ5", text: "环境5" }
]


//定义
const qualityOptions = [
    { value: "good", text: "好" },
    { value: "medium", text: "中" },
    { value: "bad", text: "坏" }
]


//导出多个模块
export {QualityValue, EnvironmentValue, ViewPoint, viewPointOptions, environmentOptions, qualityOptions}
