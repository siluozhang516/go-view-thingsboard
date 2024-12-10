<template>
  <el-main class="meta2d-box">
    <div :id="idSelector" class="meta2d-selector"></div>
  </el-main>
  <!-- 右键菜单 -->
  <RightMenu v-model="contextMenuVisible" :menus="contextMenus" :position="contextMenusByCtx" />
</template>

<script setup lang="ts">
import { PenType, type Options, type Pen, LockState } from '@meta2d/core'
import { Meta2d, register, registerAnchors, registerCanvasDraw } from '@meta2d/core'
import { flowPens, flowAnchors } from '@meta2d/flow-diagram'
import { activityDiagram, activityDiagramByCtx } from '@meta2d/activity-diagram'
import { classPens } from '@meta2d/class-diagram'
import { sequencePens, sequencePensbyCtx } from '@meta2d/sequence-diagram'
import {
  register as registerEcharts,
  registerHighcharts,
  // registerLightningChart
} from '@meta2d/chart-diagram'
import { formPens, formPath2DPens } from '@meta2d/form-diagram'
import { chartsPens } from '@meta2d/le5le-charts'
import { ftaPens, ftaPensbyCtx, ftaAnchors } from '@meta2d/fta-diagram'
import { onMounted, onUnmounted, ref, nextTick, computed, watch } from 'vue'
import RightMenu from './RightMenu.vue'
import { mindBoxPlugin } from "@meta2d/plugin-mind-core"
import { ElMessageBox } from 'element-plus'
import "element-plus/theme-chalk/el-message-box.css";
import { useMeata2dStore } from '@/store/modules/meta2d/meta2dStore'

const meta2dStore = useMeata2dStore()

let target = 'mindNode2' // 此处以安装在mindNode2 图元上为例

const props = withDefaults(defineProps<{
  preview?: boolean,
  chartConfig?: any
}>(), { preview: false, chartConfig: undefined })



let contextMenus = ref<Record<string, any>[]>([])
let contextMenusByCtx = ref<number[]>()

const count = ref(1)

const idSelector = computed(() => 'meta2d' + props?.chartConfig?.id || '')

interface ContextMenuConfig {
  title?: string
  type?: string
  disabled?: boolean
  func?: () => void
  ctrl?: string
}


const contextMenusConfig: ContextMenuConfig[] = [
  {
    title: '置顶',
    func() {
      let active = meta2d.store.active || []
      meta2d.top(active)
    }
  },
  {
    title: '置底',
    func() {
      let active = meta2d.store.active || []
      meta2d.bottom(active)
    }
  },
  {
    title: '上一个图层',
    func() {
      let active = meta2d.store.active || []
      meta2d.up(active)
    }
  },
  {
    title: '下一个图层',
    func() {
      let active = meta2d.store.active || []
      meta2d.down(active)
    }
  },
  { type: 'divider' },
  {
    title: '组合',
    func() {
      let pens = meta2d.store.active || []
      meta2d.combine(pens)
    }
  },
  {
    title: '取消组合',
    func() {
      meta2d.uncombine()
    }
  },
  {
    title: '组合状态',
    func() {
      let pens = meta2d.store.active || [];
      meta2d.combine(pens, 0);
    }
  },
  {
    title: '取消组合状态',
    func() {
      meta2d.uncombine()
    }
  },
  {
    title: '锁定',
    func() {
      let active = meta2d.store.active || []
      active.forEach((item) => {
        item.locked = 2
        meta2d.setValue(item)
      })
      meta2d.emit("changePens")
    }
  },
  {
    title: '解锁',
    func() {
      let active = meta2d.store.active || []
      active.forEach((item) => {
        item.locked = 0
        meta2d.setValue(item)
      })
      meta2d.emit("changePens")
    }
  },
  { type: 'divider' },
  {
    title: '删除',
    func() {
      let active = meta2d.store.active
      meta2d.delete(active, true)
    }
  },
  { type: 'divider' },
  {
    title: '变成节点',
    func() {
      let active = meta2d.store.active || []
      let pen = active[0]
      pen.type = PenType.Node
      meta2d.setValue(pen)
    }
  },
  {
    title: '变成连线',
    func() {
      let active = meta2d.store.active || []
      let pen = active[0]
      pen.type = PenType.Line
      meta2d.setValue(pen)
    }
  },

  { type: 'divider' },
  {
    title: '撤销',
    ctrl: 'Ctrl + Z',
    func() {
      meta2d.undo()
      meta2d.emit("changePens")
    }
  },
  {
    title: '重做',
    ctrl: 'Shift + Z',
    func() {
      meta2d.redo()
      meta2d.emit("changePens")
    }
  },
  { type: 'divider' },
  {
    title: '剪切',
    ctrl: 'Ctrl + X',
    func() {
      let active = meta2d.store.active
      meta2d.cut(active)
    }
  },
  {
    title: '复制',
    ctrl: 'Ctrl + C',
    func() {
      let active = meta2d.store.active
      meta2d.copy(active)
    }
  },
  {
    title: '粘贴',
    ctrl: 'Ctrl + V',
    func() {
      meta2d.paste()
    }
  }
]

declare const meta2d: Meta2d

const meta2dOptions: Options = {
  rule: true,
  grid: false,
  // width: 1920,//设施宽高会影响图形
  // height: 1080
}

/** 预览配置 */
if (props.preview) {
  meta2dOptions.rule = false
  meta2dOptions.grid = false
}
onMounted(() => {
  new Meta2d(idSelector.value, meta2dOptions)
  count.value += 1
  // 按需注册图形库
  // 以下为自带基础图形库
  register(flowPens())
  registerAnchors(flowAnchors())
  register(activityDiagram())
  registerCanvasDraw(activityDiagramByCtx())
  register(classPens())
  register(sequencePens())
  registerCanvasDraw(sequencePensbyCtx())
  registerCanvasDraw(formPens())
  register(formPath2DPens())
  registerCanvasDraw(chartsPens())
  register(ftaPens())
  registerCanvasDraw(ftaPensbyCtx())
  registerAnchors(ftaAnchors())
  // echarts
  registerEcharts()
  // hightChart
  registerHighcharts()
  // 直接调用LightningChart的注册函数
  // registerLightningChart()
  // 安装脑图插件
  meta2d.installPenPlugins({ name: target }, [{
    plugin: mindBoxPlugin
  }])

  const matchConfig = meta2dStore.getMeta2dsList.find(item => item.dataset === props?.chartConfig?.chartConfig.dataset)


  /**
   *
   * 预览模式打开预览文件
   * meta2d.open会修改json的值，调用destroy()会导致json下次渲染失败，
   * 所以保留每次打开的json都是原始数据
   */
  const json: any = matchConfig ? matchConfig.json : ''

  // const meta2dStore
  if (props.preview) {
    if (json) {
      json.rule = false
      json.locked = LockState.DisableEdit
      meta2d.open(json as any)
      meta2d.fitView()
    }
  } else {
    if (json) {
      ElMessageBox.confirm('有缓存数据，是否打开？',
        '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        meta2d.open(json as any)
        meta2d.fitView()
      }).catch(() => {
        localStorage.removeItem("meta2dJSON")
      })
    }
  }


  // 监听消息事件
  meta2d.on('contextmenu', contextmenu);
  meta2d.on('click', click);
  (meta2d.store.options as any).fileName = '未命名';
})
onUnmounted(() => {
  count.value -= 1
  if (meta2d) {
    meta2d.off('contextmenu', contextmenu)
    meta2d.off('click', click)
    meta2d.destroy()
  }
})
/** 右键菜单 */
const contextMenuVisible = ref(false)
function contextmenu(res: any) {
  /** 预览模式禁止使用右键菜单 */
  if (props.preview) return false
  contextMenusByCtx.value = [res.e.pageX + 10, res.e.pageY]
  contextMenuVisible.value = true
  setMenusListAndStatus()
}
function click() {
  contextMenuVisible.value = false
}

// 设置菜单项及可点击状态
async function setMenusListAndStatus() {
  await nextTick()
  let active = meta2d.store.active || []
  let pens = meta2d.store.data.pens || []
  // 是否有gif
  let hasGif = false

  if (active.length > 0) {
    let filterActive: string[] = []
    active.forEach(it => {
      filterActive.push(it.id || '', ...(it.children || []))
    })
    filterActive = [...new Set(filterActive)]
    let filterPens = pens.filter(it => {
      return filterActive.includes(it.id || '')
    })

    let gifPen = filterPens.find((item: Pen) => {
      let image = item.image || ""
      let ext = image.split('.').pop()
      return ext === 'gif'
    })
    if (gifPen) hasGif = true;
  }


  // 选中pen集合
  let activeNum = active.length
  contextMenus.value = []
  let histories = meta2d.store.histories || [] // 历史记录列表
  let historiesL = histories.length
  let historyIndex = meta2d.store.historyIndex || 0  // 操作列表步数
  let lastIndex = historiesL - 1
  // 画纸右键菜单
  if (activeNum == 0) {
    let exclude = ['组合', '组合状态', '取消组合', '取消组合状态', '解锁', '变成节点', '变成连线']
    let disabled = ['置顶', '置底', '上一个图层', '下一个图层', '删除', '锁定', '剪切', '复制']
    if (historiesL == 0) {
      disabled.push('撤销', '重做')
    }
    if (historyIndex == -1) {
      disabled.push('撤销')
    }
    if (historiesL > 0 && historyIndex == lastIndex) {
      disabled.push('重做')
    }
    let filterContext = contextMenusConfig.filter((item) => !exclude.includes(item.title || ''))
    filterContext.forEach((item) => {
      item.disabled = false
      if (disabled.includes(item.title || '')) {
        item.disabled = true
      }
    })
    contextMenus.value = filterContext
  }
  // 选中一个图元
  if (activeNum == 1) {
    let exclude = ['组合', '组合状态']
    let disabled: string[] = []

    if (hasGif) {
      disabled.push('置顶', '置底', '上一个图层', '下一个图层')
    }

    let locked = !!active[0].locked
    if (!locked) {
      exclude.push('解锁')
    } else {
      exclude.push('锁定')
    }
    if (historyIndex == -1) {
      disabled.push('撤销')
    }
    if (historiesL > 0 && historyIndex == lastIndex) {
      disabled.push('重做')
    }

    let currentActive = active[0]
    // 判断pen的类型
    let type = currentActive.type
    if (type == PenType.Line) {
      exclude.push('变成连线')
    } else if (type == PenType.Node) {
      exclude.push('变成节点')
    } else {
      exclude.push('变成节点', '变成连线')
    }


    // 是否组合判断
    let children = currentActive.children || []
    let childrenL = children.length
    let showChild = currentActive.showChild

    if (childrenL && showChild === undefined) {
      exclude.push('取消组合状态')
    } else if (childrenL && showChild !== undefined) {
      exclude.push('取消组合')
    } else {
      exclude.push('取消组合', '取消组合状态')
    }

    let filterContext = contextMenusConfig.filter((item) => !exclude.includes(item.title || ''))
    filterContext.forEach((item) => {
      item.disabled = false
      if (disabled.includes(item.title || '')) {
        item.disabled = true
      }
    })
    contextMenus.value = filterContext
  }
  // 选中多个图元
  if (activeNum > 1) {
    let exclude: string[] = ['取消组合', '取消组合状态', '解锁', '变成节点', '变成连线']
    let disabled: string[] = []

    if (hasGif) {
      disabled.push('置顶', '置底', '上一个图层', '下一个图层')
    }

    if (historyIndex == -1) {
      disabled.push('撤销')
    }
    if (historiesL > 0 && historyIndex == lastIndex) {
      disabled.push('重做')
    }
    let filterContext = contextMenusConfig.filter((item) => !exclude.includes(item.title || ''))
    filterContext.forEach((item) => {
      item.disabled = false
      if (disabled.includes(item.title || '')) {
        item.disabled = true
      }
    })
    contextMenus.value = filterContext
  }
}
</script>

<style scoped>
.meta2d-box {

  height: 100%;
  padding: 0;
}

.meta2d-selector {
  height: 100%;
  width: 100%;

}
</style>