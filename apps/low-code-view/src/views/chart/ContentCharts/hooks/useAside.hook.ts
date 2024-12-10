import { ref, watch, computed } from 'vue'
import { icon } from '@/plugins'
import { renderLang, renderIcon } from '@/utils'
import { themeColor, setItem, getCharts } from './useLayout.hook'
import { PackagesCategoryEnum, PackagesCategoryName, ConfigType } from '@/packages/index.d'
import { usePackagesStore } from '@/store/modules/packagesStore/packagesStore'
import { ChartLayoutStoreEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d'
import { useMetaConfigToOptions } from './useMeta.hook'
// 图标
const { AirPlaneOutlineIcon, ImageIcon, BarChartIcon } = icon.ionicons5
const { TableSplitIcon, RoadmapIcon, SpellCheckIcon, GraphicalDataFlowIcon } = icon.carbon

// 图表
export type MenuOptionsType = {
  key: string
  icon: ReturnType<typeof renderIcon>
  label: ReturnType<typeof renderLang>
  list: ConfigType[]
}

const packagesListObj = {
  [PackagesCategoryEnum.CHARTS]: {
    icon: renderIcon(RoadmapIcon),
    label: PackagesCategoryName.CHARTS
  },
  [PackagesCategoryEnum.INFORMATIONS]: {
    icon: renderIcon(SpellCheckIcon),
    label: PackagesCategoryName.INFORMATIONS
  },
  [PackagesCategoryEnum.TABLES]: {
    icon: renderIcon(TableSplitIcon),
    label: PackagesCategoryName.TABLES
  },
  [PackagesCategoryEnum.DECORATES]: {
    icon: renderIcon(GraphicalDataFlowIcon),
    label: PackagesCategoryName.DECORATES
  },
  [PackagesCategoryEnum.PHOTOS]: {
    icon: renderIcon(ImageIcon),
    label: PackagesCategoryName.PHOTOS
  },
  [PackagesCategoryEnum.ICONS]: {
    icon: renderIcon(AirPlaneOutlineIcon),
    label: PackagesCategoryName.ICONS
  },
  [PackagesCategoryEnum.META2D]: {
    icon: renderIcon(AirPlaneOutlineIcon),
    label: PackagesCategoryName.META2D
  }
}

export const useAsideHook = () => {
  const packagesStore = usePackagesStore()
  const menuOptions: MenuOptionsType[] = []

  const getMenuOptions = ()=>{
    menuOptions.length = 0
    // 处理列表
    const packagesList = packagesStore.getPackagesList
    for (const val in packagesList) {
      menuOptions.push({
        key: val,
        // @ts-ignore
        icon: packagesListObj[val].icon,
        // @ts-ignore
        label: packagesListObj[val].label,
        // @ts-ignore
        list: packagesList[val]
      })
    }
    // meta2d的列表
    const meta2dPackages = useMetaConfigToOptions()
    for (const val in meta2dPackages) {
      menuOptions.push({
        key: val,
        // @ts-ignore
        icon: packagesListObj[val].icon,
        // @ts-ignore
        label: packagesListObj[val].label,
        // @ts-ignore
        list: meta2dPackages[val]
      })
    }
  }

  getMenuOptions()


  // 记录选中值
  let beforeSelect: string = menuOptions[0]['key']
  const selectValue = ref<string>(menuOptions[0]['key'])

  // 选中的对象值
  const selectOptions = ref(menuOptions[0])

  // 点击 item
  const clickItemHandle = (key: string, item: any) => {
    selectOptions.value = item
    // 处理折叠
    if (beforeSelect === key) {
      setItem(ChartLayoutStoreEnum.CHARTS, !getCharts.value, false)
    } else {
      setItem(ChartLayoutStoreEnum.CHARTS, true, false)
    }
    beforeSelect = key
  }

  return {
    getCharts,
    BarChartIcon,
    themeColor,
    selectOptions,
    selectValue,
    clickItemHandle,
    menuOptions
  }
}
