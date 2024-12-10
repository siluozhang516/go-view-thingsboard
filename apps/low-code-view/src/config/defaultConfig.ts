// import { getToken } from "@/utils"

/** 图纸配置 */
export const mapProps = {
  fileName: '',
  color: '#eeeeee',
  penBackground: '',
  background: '',
  bkImage: '',
  rule: false,
  ruleColor: '',
  grid: true,
  gridColor: '',
  gridSize: 20,
  gridRotate: 0,
  autoAlignGrid: false
}

/** mqtt、websocket 配置 */
export const communicateProp = {
  websocketUrl: '',
  websocketConnected: false,
  mqttUrl: 'ws://broker.emqx.io:8083/mqtt',
  mqttConnected: false,
  customClientId: false,
  clientId: '',
  username: '',
  password: '',
  mqttTopics: 'le5le'
}

/** http 配置 */
export const httpProp = [
  {
    method: 'GET',
    http: '',
    httpHeaders: '{}',
    httpTimeInterval: 1000
  }
]

/** 全局配置 */
export const globalConfigProps = {
  color: '',
  activeColor: '',
  hoverColor: '',
  hoverBackground: '',
  anchorColor: '',
  anchorBackground: '',
  dockColor: '',
  dragColor: '',
  animateColor: '',
  textColor: '',
  fontFamily: '',
  fontSize: 14,
  lineHeight: 0,
  textAlign: '',
  textBaseline: '',
  rotateCursor: '',
  hoverCursor: '',
  disableInput: false,
  disableRotate: false,
  disableAnchor: false,
  disableEmptyLine: false,
  disableRepeatLine: false,
  disableScale: false,
  disableDockLine: false,
  disableTranslate: false,
  minScale: 0.1,
  maxScale: 10,
  autoAnchor: true,
  interval: 10,
  animateInterval: 10,
  textRotate: true,
  textFlip: false
}

/** 外观 配置 */
export const appearanceProps = {
  x: 0,
  y: 0,
  text: '',
  color: '',
  width: 0,
  height: 0,
  lineWidth: 0,
  hoverColor: '',
  activeColor: '',
  background: '',
  hoverBackground: '',
  activeBackground: '',
  shadowColor: '',
  shadowBlur: 0,
  textHasShadow: false,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  anchorColor: '',
  anchorRadius: 0,
  borderRadius: 0,
  globalAlpha: 0,
  ratio: false,
  rotate: 0,
  paddingTop: 0,
  paddingBottom: 0,
  paddingRight: 0,
  paddingLeft: 0,
  progress: 0,
  progressColor: '#1890ff',
  verticalProgress: false,
  flipX: false,
  flipY: false,
  dash: 0,
  fontFamily: '',
  fontSize: 14,
  textColor: '',
  hoverTextColor: '',
  activeTextColor: '',
  textBackground: '',
  textAlign: '',
  textBaseline: '',
  lineHeight: 0,
  whiteSpace: '',
  textWidth: 0,
  textHeight: 1,
  ellipsis: '',
  hiddenText: false,
  disableAnchor: false,
  disableInput: false,
  disableRotate: false,
  disableSize: false,
  lineSmooth: 0,
  strokeType: 0,
  bkType: 0,
  image: '',
  decorationDash: 0,
  strickoutDash: 0,
  children: [],
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  type: 0,
  lineGradientColors: ''
}

/** 事件类型 */
export const eventType = [
  {
    name: '鼠标移入',
    event: 'enter'
  },
  {
    name: '鼠标移出',
    event: 'leave'
  },
  {
    name: '鼠标右键',
    event: 'contextmenu'
  },
  {
    name: '获取焦点',
    event: 'active'
  },
  {
    name: '失去焦点',
    event: 'inactive'
  },
  {
    name: '鼠标按下',
    event: 'mousedown'
  },
  {
    name: '鼠标弹起',
    event: 'mouseup'
  },
  {
    name: '单击',
    event: 'click'
  },
  {
    name: '双击',
    event: 'dbclick'
  }
  // {
  //     name: "值变化",
  //     event: "valueUpdate"
  // }
]

/** 属性下拉 */
export const propsType = [
  { link: '背景颜色', value: 'background' },
  { link: '颜色', value: 'color' },
  { link: '文字', value: 'text' },
  { link: '宽度', value: 'width' },
  { link: '高度', value: 'height' },
  { link: '显示', value: 'visible' },
  { link: '进度值', value: 'progress' },
  { link: '值', value: 'value' }
]

/** 布局 */
export const LayoutConfig = {
  width: undefined,
  space: 30
}

/** 动画 */
export const animateProps = {
  animateColor: 'red',
  animateCycle: null,
  animateLineWidth: 1,
  animateReverse: false,
  animateShadow: false,
  animateShadowBlur: 6,
  animateShadowColor: '',
  animateSpan: 1,
  autoPlay: false,
  keepAnimateState: false,
  lineAnimateType: 0,
  nextAnimate: '',
  animateLineDash: [5, 5],
  animateLineDashNum: 0,
  animateDotSize: 6,
  showDuration: '',
  animateType: '',
  frames: [],
  title: '',
  titleFnJs: '',
  iframe: '',
  video: '',
  audio: '',
  playLoop: false,
  videoType: ''
}
