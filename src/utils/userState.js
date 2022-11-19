import { mapState, createNamespacedHelpers } from 'vuex'
import { useStateMapper } from './useMapper'
import {checkType} from './index'


export function useState(moduleName, mapper) {
    let mapperFn = mapState;

    // 如果使用模块化，则使用vuex提供的createNamespacedHelpers方法找到对应模块的mapState方法
    if (checkType(moduleName) === "[object String]" && moduleName.length > 0) {
        mapperFn = createNamespacedHelpers(moduleName).mapState
    }

    return useStateMapper(mapper, mapperFn)
}