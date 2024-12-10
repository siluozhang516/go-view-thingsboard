import { reactive, h } from 'vue'
import { renderIcon } from '@/utils'
import { RouterLink } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'
import { MenuOption, MenuGroupOption } from 'naive-ui'
import { icon } from '@/plugins'

const { GridIcon, TvOutlineIcon } = icon.ionicons5
const { StoreIcon, ObjectStorageIcon, DevicesIcon,ZAxisIcon } = icon.carbon
export const renderMenuLabel = (option: MenuOption | MenuGroupOption) => {
  return option.label
}

export const expandedKeys = () => ['all-project']

export const menuOptionsInit = () => {
  const t = window['$t']

  return reactive([
    {
      label: () => h('span', null, { default: () => t('project.project') }),
      key: 'all-project',
      icon: renderIcon(DevicesIcon),
      children: [
        {
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  name: PageEnum.BASE_HOME_ITEMS_NAME
                }
              },
              { default: () => t('project.all_project') }
            ),
          key: PageEnum.BASE_HOME_ITEMS_NAME,
          icon: renderIcon(TvOutlineIcon)
        },
        {
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  name: PageEnum.BASE_HOME_TEMPLATE_NAME
                }
              },
              { default: () => t('project.my_templete') }
            ),
          key: PageEnum.BASE_HOME_TEMPLATE_NAME,
          icon: renderIcon(ObjectStorageIcon)
        },
      ]
    },
    {
      label: () => h('span', null, { default: () => t('project.graphicEditor') }),
      key: 'editor',
      icon: renderIcon(DevicesIcon),
      children: [
        {
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  name: PageEnum.BASE_HOME_EDIT
                }
              },
              { default: () =>t('project.meta2d') }
            ),
          key: PageEnum.BASE_HOME_EDIT,
          icon: renderIcon(ZAxisIcon)
        }
      ]
    },
    {
      label: () => h('span', null, { default: () => t('project.thingsboard') }),
      key: 'thingsboard',
      icon: renderIcon(DevicesIcon),
      children: [
        {
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  name: PageEnum.BASE_HOME_THINGSBOARD
                }
              },
              { default: () =>t('project.widgetEditor') }
            ),
          key: PageEnum.BASE_HOME_THINGSBOARD,
          icon: renderIcon(ZAxisIcon)
        }
      ]
    }
  ])
}
