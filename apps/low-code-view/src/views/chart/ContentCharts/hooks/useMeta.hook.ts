import { ChatCategoryEnumName, ChatCategoryEnum, Meta2dConfig } from '@/packages/components/Meta2d/Meta2d'
import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { useMeata2dStore } from '@/store/modules/meta2d/meta2dStore'
import { deepClone } from '@meta2d/core'

/**
 * 根据保存的meta json来生成组态图组件列表，使用同一配置组件渲染不同json的组态组
 * 根据dataset的值来加载对应的组态图json，也可以直接把json保存在config上面
 * @returns
 */
export const useMetaConfigToOptions = () => {
  const meta2dList: ConfigType[] = []
  const meta2dStore = useMeata2dStore()
  meta2dStore.getMeta2dsList.forEach(item => {
    const config = deepClone(Meta2dConfig)
    config.dataset = item.dataset
    config.image = item.image
    config.title = item.title
    meta2dList.push(config)
  })
  return {
    [PackagesCategoryEnum.META2D]: meta2dList
  }
}
