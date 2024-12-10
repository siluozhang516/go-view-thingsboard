<script setup lang="ts">
import { onMounted, reactive, ref, onUnmounted, computed, toRaw } from 'vue'
import { type Pen, PenType } from '@meta2d/core'
import { animateProps } from '@/config/defaultConfig'
import Form from '@/components/Meta2d/Form.vue'
import AnimateDrawer from './AnimateDrawer.vue'
import { ElButton } from 'element-plus'
import CodeEdit from '@/components/Meta2d/CodeEdit.vue'

/** code编辑器 */
let visible = ref(false)
let language = ref('javascript')
let mouseCode = ref('')
let mouseProp = ""
let mouseTitle = ref<string>()
let tip = ref<any>()
const updateCode = (value: string) => {
  (<any>m)[mouseProp] = value || undefined
  meta2d.setValue({
    id: activePen.id,
    [mouseProp]: value || undefined,
    titleFn: undefined
  })
  meta2d.render()
}

/** 显示动画帧抽屉 */
let showNodeAnimate = ref(false)
let currentFrames = ref<number[]>([])
function drawerUpdate(value: any) {
  m.frames = toRaw(value || [])
  m.showDuration = (value || []).reduce((a: any, b: any) => (+a) + (+b.duration), 0)
  meta2d.setValue({
    id: activePen.id,
    frames: toRaw(value || [])
  })
}

/** 动画参数 */
let m = reactive({ ...animateProps })
/** 画笔的类型 */
let penType = ref<PenType | undefined>()
/** 节点的名称 */
let penName = ref<string>()

/** 当前激活的元素 */
let activePen: Pen = {}

function active(pens: Pen[]) {
  if (pens.length === 1) {
    activePen = pens[0]
    penName.value = activePen.name
    let keys: string[] = Object.keys(animateProps)
    keys.forEach((key: string) => {
      (m as any)[key] = (<any>activePen)[key] || (animateProps as any)[key]
    })
    // pen的类型
    penType.value = activePen.type || PenType.Node
  }
}

// 更新动画
function updateFunc(params: string) {
  return (val: any) => {
    if (params == 'play') {
      meta2d.startAnimate([activePen]);
      return false
    }
    if (params == 'pluse') {
      meta2d.pauseAnimate([activePen]);
      return false
    }
    if (params == 'stop') {
      meta2d.stopAnimate([activePen]);
      return false
    }
    meta2d.setValue({
      id: activePen.id,
      [params]: val
    })
    meta2d.render()
  }
}

enum LineAnimateType {
  Flow,
  Dot,
  Circle
}

const map = [
  {
    labelWidth: "110px",
    title: "动画",
    line: true,
    node: true,
    children: [],
    child: [
      {
        title: "动画效果",
        type: "select",
        bindProp: m,
        prop: "lineAnimateType",
        event: "change",
        line: true,
        option: {
          placeholder: "默认为水流",
          list: [
            { label: "水流", value: LineAnimateType.Flow },
            { label: "水珠流动", value: LineAnimateType.Dot },
            { label: "圆点", value: LineAnimateType.Circle },
          ]
        },
        func: updateFunc("lineAnimateType")
      },
      {
        title: "圆点大小",
        type: "number",
        bindProp: m,
        option: {
          min: 6,
          placeholder: "最小值6",
          hidden: computed(() => {
            return m.lineAnimateType != LineAnimateType.Circle
          }),
        },
        line: true,
        prop: "animateDotSize",
        event: "change",
        func: updateFunc("animateDotSize")
      },
      {
        title: '线条样式',
        type: 'dropdown',
        line: true,
        prop: 'animateLineDashNum',
        option: {
          hidden: computed(() => {
            return m.lineAnimateType != LineAnimateType.Dot
          }),
          placeholder: '线条样式',
          list: [
            {
              label: '虚线',
              template:
                '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;width: 80px;">\n' +
                '                  <g fill="none" stroke="black" stroke-width="1">\n' +
                '                    <path stroke-dasharray="5 5" d="M0 9 l85 0"></path>\n' +
                '                  </g>\n' +
                '                </svg>',
              value: 0
            },
            {
              label: '虚线',
              template:
                `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path stroke-dasharray="10 10" d="M0 9 l85 0"></path>
                  </g>
                </svg>`,
              value: 1
            },
            {
              label: '点横线',
              template:
                '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;width: 80px;">\n' +
                '                  <g fill="none" stroke="black" stroke-width="1">\n' +
                '                    <path stroke-dasharray="10 10 2 10" d="M0 9 l85 0"></path>\n' +
                '                  </g>\n' +
                '                </svg>',
              value: 2
            }
          ]
        },
        bindProp: m,
        event: 'command',
        func(value: number) {
          const dash = [
            [5, 5],
            [10, 10],
            [10, 10, 2, 10]
          ]
          meta2d.setValue({
            id: activePen.id,
            animateLineDash: dash[value],
            animateLineDashNum: value
          })
        }
      },
      {
        title: "动画线宽",
        type: "number",
        bindProp: m,
        line: true,
        option: {
          min: 0,
          hidden: computed(() => {
            return m.lineAnimateType == LineAnimateType.Circle
          }),
        },
        prop: "animateLineWidth",
        event: "change",
        func: updateFunc("animateLineWidth")
      },
      {
        title: "动画线颜色",
        type: "color",
        bindProp: m,
        prop: "animateColor",
        event: "change",
        line: true,
        func: updateFunc("animateColor")
      },
      {
        title: "动画发光",
        type: "switch",
        bindProp: m,
        prop: "animateShadow",
        event: "change",
        line: true,
        func: updateFunc("animateShadow")
      },
      {
        title: "动画发光颜色",
        type: "color",
        bindProp: m,
        prop: "animateShadowColor",
        event: "change",
        line: true,
        option: {
          hidden: computed(() => {
            return !m.animateShadow
          })
        },
        func: updateFunc("animateShadowColor")
      },
      {
        title: "动画发光模糊",
        type: "number",
        bindProp: m,
        prop: "animateShadowBlur",
        event: "change",
        line: true,
        option: {
          min: 0,
          hidden: computed(() => {
            return !m.animateShadow
          })
        },
        func: updateFunc("animateShadowBlur")
      },
      {
        title: "动画速度",
        type: "slider",
        bindProp: m,
        prop: "animateSpan",
        event: "change",
        line: true,
        option: {
          min: 1,
          max: 5
        },
        func: updateFunc("animateSpan")
      },
      {
        title: "反向流动",
        type: "switch",
        bindProp: m,
        prop: "animateReverse",
        event: "change",
        line: true,
        func: updateFunc("animateReverse")
      },
      {
        title: "时长",
        type: "input",
        bindProp: m,
        prop: "showDuration",
        event: "change",
        option: {
          readonly: true
        },
        node: true
      },
      {
        title: "动画效果",
        type: "select",
        bindProp: m,
        prop: "animateType",
        event: "change",
        option: {
          placeholder: "请选择动画效果",
          list: [
            { label: "左右跳动", value: "leftRight" },
            { label: "心跳", value: "heart" },
            { label: "成功", value: "success" },
            { label: "警告", value: "warning" },
            { label: "错误", value: "error" },
            { label: "炫耀", value: "show" },
            { label: "旋转", value: "rotate" },
            { label: "自定义", value: "custom" },
          ]
        },
        node: true,
        func(val: string) {
          let obj: any = {
            leftRight: [
              { x: -10, duration: 100 },
              { x: 10, duration: 80 },
              { x: -10, duration: 50 },
              { x: 10, duration: 30 },
              { x: 0, duration: 300 },
            ],
            heart: [
              { scale: 1.1, duration: 100 },
              { scale: 1, duration: 400 },
            ],
            success: [{ background: "#389e0d22", color: "#237804", duration: 500 }],
            error: [{ color: "#cf1322", background: "#cf132222", duration: 100 }],
            show: [
              { color: "#fa541c", rotate: -10, duration: 100 },
              { color: "#fa541c", rotate: 10, duration: 100 },
              { color: "#fa541c", rotate: 0, duration: 100 }
            ],
            warning: [
              { color: "#fa8c16", lineDash: [10, 10], duration: 300 },
              { color: "#fa8c16", lineDash: undefined, duration: 500 },
              { color: "#fa8c16", lineDash: [10, 10], duration: 300 }
            ],
            rotate: [{ rotate: 360, duration: 1000 }]
          }
          let frames: any[] = obj[val] || []
          let l = frames.length
          let showDuration = '0'
          if (l > 0) {
            showDuration = frames.reduce((pre, cur) => {
              return pre + (Number(cur.duration))
            }, 0)
            m.showDuration = showDuration;
            (m.frames as any[]) = frames;
            updateFunc('showDuration')(showDuration);
            updateFunc('animateType')(val);
            updateFunc('frames')(frames);
          }
          if (m.frames.length == 0) {
            m.showDuration = '0'
          }
        }
      },
      {
        title: "",
        node: true,
        type: 'link',
        bindProp: m,
        prop: 'frames',
        event: 'click',
        option: {
          text: '编辑',
          hidden: computed(() => {
            return m.animateType != 'custom'
          }),
        },
        func() {
          showNodeAnimate.value = true
          currentFrames.value = toRaw(m.frames || [])
        },
      },
      {
        title: "循环次数",
        type: "number",
        bindProp: m,
        prop: "animateCycle",
        event: "change",
        line: true,
        node: true,
        option: {
          placeholder: '默认不限次数',
          min: 0,
          step: 1
        },
        func: updateFunc("animateCycle")
      },
      {
        title: "下个动画",
        type: "input",
        bindProp: m,
        prop: "nextAnimate",
        event: "change",
        line: true,
        node: true,
        option: {
          placeholder: 'id/tag'
        },
        func: updateFunc("nextAnimate")
      },
      {
        title: "自动播放",
        type: "switch",
        bindProp: m,
        prop: "autoPlay",
        event: "change",
        line: true,
        node: true,
        func: updateFunc("autoPlay")
      },
      {
        title: "保持动画状态",
        type: "switch",
        bindProp: m,
        prop: "keepAnimateState",
        event: "change",
        line: true,
        node: true,
        func: updateFunc("keepAnimateState")
      },
      {
        title: "",
        type: "extend",
        line: true,
        node: true,
        option: {
          labelWidth: '0px',
          extendList: [
            {
              component: ElButton,
              text: "播放",
              props: {
                type: 'primary',
                onClick: updateFunc("play")
              },
            },
            {
              component: ElButton,
              text: "暂停",
              props: {
                type: 'primary',
                onClick: updateFunc("pluse")
              },
            },
            {
              component: ElButton,
              text: "停止",
              props: {
                type: 'danger',
                onClick: updateFunc("stop")
              },
            },
          ]
        },
      }
    ]
  },
  {
    title: "网页",
    iframe: true,
    children: [],
    child: [{
      title: "网页URL",
      type: "input",
      iframe: true,
      bindProp: m,
      prop: "iframe",
      event: "change",
      option: {
        placeholder: "请输入网页URL",
        labelWidth: "100px"
      },
      func: updateFunc("iframe")
    }]
  },
  {
    title: "视频",
    video: true,
    children: [],
    child: [
      {
        title: "音频URL",
        type: "input",
        video: true,
        bindProp: m,
        prop: "audio",
        event: "change",
        option: {
          hidden: computed(() => {
            return m.videoType != 'audio'
          }),
          placeholder: "请输入音频URL",
          labelWidth: "100px"
        },
        func: updateFunc("audio")
      },
      {
        title: "视频URL",
        type: "input",
        video: true,
        bindProp: m,
        prop: "video",
        event: "change",
        option: {
          hidden: computed(() => {
            return m.videoType != 'video'
          }),
          placeholder: "请输入视频URL",
          labelWidth: "100px"
        },
        func: updateFunc("video")
      },
      {
        title: "自动播放",
        type: "switch",
        video: true,
        bindProp: m,
        prop: "autoPlay",
        event: "change",
        option: {
          labelWidth: "100px"
        },
        func: updateFunc("autoPlay")
      },
      {
        title: "下个播放",
        type: "input",
        video: true,
        bindProp: m,
        prop: "nextAnimate",
        event: "change",
        option: {
          placeholder: 'id/tag',
          labelWidth: "100px"
        },
        func: updateFunc("nextAnimate")
      },
      {
        title: "循环播放",
        type: "switch",
        video: true,
        bindProp: m,
        prop: "playLoop",
        event: "change",
        option: {
          labelWidth: "100px"
        },
        func: updateFunc("playLoop")
      },
      {
        title: "",
        type: "extend",
        video: true,
        option: {
          labelWidth: '100px',
          extendList: [
            {
              component: ElButton,
              text: "播放",
              props: {
                type: 'primary',
                onClick: () => {
                  meta2d.startVideo([activePen]);
                }
              },
            },
            {
              component: ElButton,
              text: "暂停",
              props: {
                type: 'primary',
                onClick: () => {
                  meta2d.pauseVideo([activePen]);
                }
              },
            },
            {
              component: ElButton,
              text: "停止",
              props: {
                type: 'danger',
                onClick: () => {
                  meta2d.stopVideo([activePen]);
                }
              },
            },
          ]
        },
      }
    ]
  },
  {
    title: "鼠标提示",
    children: [],
    labelWidth: 100,
    node: true,
    line: true,
    child: [
      {
        title: "Markdown",
        line: true,
        node: true,
        bindProp: m,
        prop: 'title',
        type: 'code',
        event: "click",
        option: {
          tip: "优先级比Mark 函数低"
        },
        func() {
          language.value = "markdown"
          mouseProp = 'title'
          mouseCode.value = m['title']
          tip.value = undefined
          mouseTitle.value = "Markdown"
          visible.value = true
        }
      },
      {
        title: "Mark 函数",
        line: true,
        node: true,
        bindProp: m,
        prop: 'titleFnJs',
        type: 'code',
        event: "click",
        option: {
          tip: "优先级高"
        },
        func() {
          language.value = "javascript"
          mouseProp = 'titleFnJs'
          mouseCode.value = m['titleFnJs']
          tip.value = { subTitle: "return `${pen.name}:${pen.text}`;" }
          mouseTitle.value = "Javascript"
          visible.value = true
        }
      },
    ]
  }
]

const showMap = computed(() => {
  if (penType.value == PenType.Line) {
    return map.filter(item => {
      (<any>item.children) = item.child.filter((it: any) => {
        return it.line
      })
      return item.line
    })
  } else if (penType.value == PenType.Node) {
    let name = penName.value || ""
    return map.filter((item: any) => {
      (<any>item.children) = (item.child as any).filter((it: any) => it.node || it[name])
      return item.node || item[name]
    })
  }
})

onUnmounted(() => {
  // @ts-ignore
  meta2d.off("active", active)
})

onMounted(() => {
  // @ts-ignore
  meta2d.on('active', active)
})
</script>

<template>
  <!-- 配置 -->
  <Form :form-list="showMap" />
  <!-- 代码 -->
  <CodeEdit v-model:visible="visible" :language="language" v-model="mouseCode" @done="updateCode" :title="mouseTitle"
    :tip="tip" />
  <!-- 动画帧 -->
  <AnimateDrawer :frames="currentFrames" v-model:visible="showNodeAnimate" @update="drawerUpdate" />
</template>

<style scoped></style>