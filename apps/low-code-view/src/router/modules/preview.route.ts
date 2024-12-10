import { RouteRecordRaw } from 'vue-router'
import { PreviewEnum } from '@/enums/pageEnum'
import { PageEnum } from '@/enums/pageEnum'

const metaRoutes: RouteRecordRaw = {
  path: PageEnum.META2DPREVIEW,
  name: PageEnum.BASE_HOME_PREVIEW,
  component: () => import('@/views/project/meta2d/Preview.vue'),
  meta: {
    title: '组态图预览',
    isRoot: true
  }
}

// 引入路径
const importPath = {
  'PreviewEnum.CHART_PREVIEW_NAME': () => import('@/views/preview/wrapper.vue')
}

const chartRoutes: RouteRecordRaw = {
  path: PreviewEnum.CHART_PREVIEW,
  name: PreviewEnum.CHART_PREVIEW_NAME,
  component: importPath['PreviewEnum.CHART_PREVIEW_NAME'],
  meta: {
    title: '预览',
    isRoot: true
  }
}

export default {
  chartRoutes,
  metaRoutes
}
