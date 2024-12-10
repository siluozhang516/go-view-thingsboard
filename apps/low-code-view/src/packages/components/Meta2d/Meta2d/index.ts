import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'

export enum ChatCategoryEnumName {
  META = '组态图'
}


export enum ChatCategoryEnum {
  META = 'Meta2d'
}
export const Meta2dConfig: ConfigType = {
  key: PackagesCategoryEnum.META2D,
  chartKey: 'VMeta2d',
  conKey: 'VCMeta2d',
  title: '组态图',
  dataset:'lyxt',
  category: ChatCategoryEnum.META,
  categoryName: ChatCategoryEnumName.META,
  package: PackagesCategoryEnum.META2D,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'lyxt.png'
}
