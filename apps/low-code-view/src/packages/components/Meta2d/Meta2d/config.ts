import { PublicConfigClass } from '@/packages/public'
import { Meta2dConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
import { GlobalThemeJsonType } from '@/settings/chartThemes'

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Meta2dConfig.key
  public option = {}
  public chartConfig = cloneDeep(Meta2dConfig)
}
