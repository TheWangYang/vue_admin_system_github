import { mapActions, createNamespacedHelpers } from 'vuex';
import {useActionMapper} from './useMapper'
import {checkType} from './index'

export function useActions(moduleName, mapper) {
    let mapperFn = mapActions;

    // 如果使用模块化，则使用vuex提供的createNamespacedHelpers方法找到对应模块的mapActions方法
    if (checkType(moduleName) === "[object String]" && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapActions
    }
    return useActionMapper(mapper, mapperFn)
}

