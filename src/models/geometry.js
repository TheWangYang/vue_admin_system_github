
//定义需要使用到的变量
const x = 0
const y = 0
const width = 0
const height = 0

const Point = {
    x,
    y
}

const Size = {
    width,
    height
}

const Box = Size & Point

//导出对应的对象
export {Point, Size, Box}
