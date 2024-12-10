<script setup>
import Form from '../Form.vue'
import { computed, onMounted, onUnmounted, reactive, ref, toRaw } from 'vue'
import { appearanceProps } from '@/config/defaultConfig'
import { mergeProps } from '@/config/utils'
import { deepClone, getFromAnchor, getToAnchor, calcPenRect } from '@meta2d/core'
import IconDrawer from '@/components/Meta2d/icon/IconDrawer.vue'

let showIconDrawer = ref(false)
/** pen图标改变 */
let penProp = ''
const iconChange = (val) => {
  updateFunc('icon')(val.value)
  updateFunc('iconClass')(val.icon)
  m[penProp] = val.icon
}

// 记录是否有选中多个图元
const multiPen = ref(false)
const defaultConfig = deepClone(appearanceProps) //深拷贝保存默认配置
let m = reactive(appearanceProps) // 响应式数据源
let activePen = reactive({ target: {} })
let otherProps = reactive({ props: [] })
// 更新属性方法
function updateFunc(prop) {
  return (value) => {
    if (multiPen.value) {
      for (let i of activePen.target) {
        meta2d.setValue(
          {
            id: i.id,
            [prop]: value
          },
          { render: false }
        )
      }
      meta2d.render()
    } else {
      meta2d.setValue({
        id: activePen.target.id,
        [prop]: value
      })
    }
  }
}

function active(args) {
  // 只修改一个
  if (args.length >= 1) {
    multiPen.value = args.length > 1
    if (multiPen.value) {
      // 批量修改
      activePen.target = reactive(args)
      // 以最后一个图元信息为主
      for (let i of activePen.target) {
        mergeProps(m, i)
      }
    } else {
      // 修改一个
      let fromAnchor = getFromAnchor(args[0])
      let toAnchor = getToAnchor(args[0])
      args[0].startX = fromAnchor?.x
      args[0].startY = fromAnchor?.y
      args[0].endX = toAnchor?.x
      args[0].endY = toAnchor?.y
      activePen.target = reactive(args[0])
      otherProps.props = []
      if (activePen.target.props) {
        let otherProp = {
          title: '其他',
          children: []
        }
        activePen.target.props.forEach((prop) => {
          otherProp.children.push({
            title: prop.title,
            type: prop.type,
            prop: prop.prop,
            bindProp: m,
            event: prop.event,
            func: updateFunc(prop.prop)
          })
        })
        otherProps.props.push(otherProp)
      }
      mergeProps(m, defaultConfig)
      mergeProps(m, activePen.target)
      const penRect = meta2d.getPenRect(toRaw(activePen.target))
      Object.assign(m, penRect);
      if(args[0].name === "combine"){
        map.forEach(item => {
          let showChild = item.children.find(e => e.prop === 'showChild');
          let showChildIndex = item.children.findIndex(e => e.prop === 'showChild');
          if(showChild && showChildIndex){
            item.children[showChildIndex].option.list
            = args[0].children.map((e,index) => {
              return {
                label: `状态${index+1}`,
                value: index+""
              }
            })
          }
        });
      }
    }
  }
}

onUnmounted(() => {
  meta2d.off("active", active)
})

onMounted(() => {
  meta2d.on('active', active)
  // 更新数据  合并多个事件
  meta2d.on('update', () => {
    meta2d.emit('editPen')
  })
  meta2d.on('resizePens', () => {
    meta2d.emit('editPen')
  })
  meta2d.on('rotatePens', () => {
    meta2d.emit('editPen')
  })
  meta2d.on('valueUpdate', () => {
    meta2d.emit('editPen')
  })
  meta2d.on('editPen', () => {
    if (multiPen.value) {
      // 若有多个图元，则设置以最后一个图元为主
      for (let i of activePen.target) {
        mergeProps(m, i)
      }
    } else {
      mergeProps(m, activePen.target)
    }
  })
})

const map = [
  {
    title: '位置与大小',
    multiShow: false,
    line: false,
    labelWidth: 100,
    children: [
      {
        title: 'x',
        type: 'number',
        prop: 'x',
        option: {
          placeholder: 'px'
        },
        bindProp: m,
        event: 'change',
        func(value) {
          meta2d.setValue({
            id: activePen.target.id,
            x: value
          })
          meta2d.canvas.calcActiveRect()
          mergeProps(m, activePen.target)
          meta2d.render()
        }
      },
      {
        title: 'y',
        type: 'number',
        prop: 'y',
        option: {
          placeholder: 'px'
        },
        bindProp: m,
        event: 'change',
        func(value) {
          meta2d.setValue({
            id: activePen.target.id,
            y: value
          })
          meta2d.canvas.calcActiveRect()
          mergeProps(m, activePen.target)
          meta2d.render()
        }
      },
      {
        title: '宽度',
        type: 'number',
        prop: 'width',
        bindProp: m,
        option: {
          min: 0
        },
        event: 'change',
        func(value) {
          if (activePen.target.ratio) {
            meta2d.setValue({
              id: activePen.target.id,
              width: value,
              height: (value / activePen.target.width) * activePen.target.height
            })
          } else {
            meta2d.setValue({
              id: activePen.target.id,
              width: value
            })
          }
          mergeProps(m, activePen.target)
        }
      },
      {
        title: '高度',
        type: 'number',
        prop: 'height',
        bindProp: m,
        event: 'change',
        func(value) {
          if (activePen.target.ratio) {
            meta2d.setValue({
              id: activePen.target.id,
              height: value,
              width: (value / activePen.target.height) * activePen.target.width
            })
          } else {
            meta2d.setValue({
              id: activePen.target.id,
              height: value
            })
          }
          mergeProps(m, activePen.target)
        }
      },
      {
        title: '锁定宽高比',
        type: 'switch',
        prop: 'ratio',
        bindProp: m,
        event: 'change',
        func(value) {
          activePen.target.ratio = value
          meta2d.render()
          mergeProps(m, activePen.target)
        }
      },
      {
        title: '圆角',
        type: 'number',
        prop: 'borderRadius',
        bindProp: m,
        event: 'change',
        option: {
          placeholder: '<1为比例',
          min: 0
        },
        func: updateFunc('borderRadius')
      },
      {
        title: '旋转',
        type: 'number',
        prop: 'rotate',
        bindProp: m,
        event: 'change',
        option: {
          placeholder: '角度'
        },
        func: updateFunc('rotate')
      },
      {
        title: '内边距上',
        type: 'number',
        prop: 'paddingTop',
        bindProp: m,
        event: 'change',
        option: {
          placeholder: 'px'
        },
        func: updateFunc('paddingTop')
      },
      {
        title: '内边距下',
        type: 'number',
        prop: 'paddingBottom',
        bindProp: m,
        event: 'change',
        option: {
          placeholder: 'px'
        },
        func: updateFunc('paddingBottom')
      },
      {
        title: '内边距左',
        type: 'number',
        prop: 'paddingLeft',
        bindProp: m,
        event: 'change',
        option: {
          placeholder: 'px'
        },
        func: updateFunc('paddingLeft')
      },
      {
        title: '内边距右',
        type: 'number',
        prop: 'paddingRight',
        bindProp: m,
        event: 'change',
        option: {
          placeholder: 'px'
        },
        func: updateFunc('paddingRight')
      },
      {
        title: '进度',
        type: 'number',
        prop: 'progress',
        bindProp: m,
        event: 'change',
        option: {
          tip: '百分比，0.1表示10%',
          placeholder: '',
          min: 0,
          step: 0.1,
          max: 1
        },
        func: updateFunc('progress')
      },
      {
        title: '进度颜色',
        type: 'color',
        prop: 'progressColor',
        bindProp: m,
        event: 'change',
        option: {
          defaultColor: "#1890ff"
        },
        func: updateFunc('progressColor')
      },
      {
        title: '垂直进度',
        type: 'switch',
        prop: 'verticalProgress',
        bindProp: m,
        event: 'change',
        func: updateFunc('verticalProgress')
      },
      {
        title: '反向进度',
        type: 'switch',
        prop: 'reverseProgress',
        bindProp: m,
        event: 'change',
        func: updateFunc('reverseProgress')
      },
      {
        title: '水平翻转',
        type: 'switch',
        prop: 'flipX',
        bindProp: m,
        event: 'change',
        func: updateFunc('flipX')
      },
      {
        title: '垂直翻转',
        type: 'switch',
        prop: 'flipY',
        bindProp: m,
        event: 'change',
        func: updateFunc('flipY')
      },
      {
        title: '状态',
        type: 'select',
        prop: 'showChild',
        bindProp: m,
        event: 'change',
        option: {
          list: [
            { label: "状态1", value: '0' },
            { label: "状态2", value: '1' },
            { label: "状态3", value: '2' },
            { label: "状态4", value: '3' }
          ],
          placeholder: "请选择状态",
          hidden: computed(() => {
            return !(Array.isArray(m.children) && m.children.length > 0)
          })
        },
        func: updateFunc('showChild')
      },
    ]
  },
  {
    title: "对齐",
    labelWidth: 100,
    multiShow: true,
    isOnlyMulti: true,
    children: [
    {
        title: "左对齐",
        type: "align",
        multiShow: true,
        icon: "left",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodes("left", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodes("left", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "右对齐",
        type: "align",
        multiShow: true,
        icon: "right",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodes("right", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodes("right", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "顶部对齐",
        type: "align",
        multiShow: true,
        icon: "top",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodes("top", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodes("top", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "底部对齐",
        type: "align",
        multiShow: true,
        icon: "bottom",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodes("bottom", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodes("bottom", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "垂直居中",
        type: "align",
        multiShow: true,
        icon: "center",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodes("center", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodes("center", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "水平居中",
        type: "align",
        multiShow: true,
        icon: "middle",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodes("middle", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodes("middle", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "水平等分",
        type: "align",
        multiShow: true,
        icon: "middleSpace",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          if(meta2d.store.active.length > 2){
            meta2d.spaceBetween(meta2d.store.active,666);
          }
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          if(meta2d.store.active.length > 2){
            meta2d.spaceBetween(meta2d.store.active,666);
          }
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          if(meta2d.store.active.length > 2){
            meta2d.undo();
          }
        }
      },{
        title: "垂直等分",
        type: "align",
        multiShow: true,
        icon: "centerSpace",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          if(meta2d.store.active.length > 2){
            meta2d.spaceBetweenColumn(meta2d.store.active,666);
          }

        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          if(meta2d.store.active.length > 2){
            meta2d.spaceBetweenColumn(meta2d.store.active,666);
          }
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          if(meta2d.store.active.length > 2){
            meta2d.undo();
          }
        }
      },
    ],
  },
  {
    title: "对齐(参照第一个选中节点)",
    labelWidth: 100,
    multiShow: true,
    isOnlyMulti: true,
    children: [
    {
        title: "左对齐",
        type: "align",
        multiShow: true,
        icon: "left",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodesByFirst("left", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodesByFirst("left", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "右对齐",
        type: "align",
        multiShow: true,
        icon: "right",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodesByFirst("right", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodesByFirst("right", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "顶部对齐",
        type: "align",
        multiShow: true,
        icon: "top",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodesByFirst("top", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodesByFirst("top", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "底部对齐",
        type: "align",
        multiShow: true,
        icon: "bottom",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodesByFirst("bottom", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodesByFirst("bottom", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "垂直居中",
        type: "align",
        multiShow: true,
        icon: "center",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodesByFirst("center", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodesByFirst("center", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "水平居中",
        type: "align",
        multiShow: true,
        icon: "middle",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodesByFirst("middle", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodesByFirst("middle", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "相同大小",
        type: "align",
        multiShow: true,
        icon: "same",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.beSameByFirst(meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.beSameByFirst(meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "格式刷",
        type: "align",
        multiShow: true,
        icon: "format",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.formatPainterByFirst(meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.formatPainterByFirst(meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      }
    ],
  },{
    title: "对齐(参照最后一个选中节点)",
    labelWidth: 100,
    multiShow: true,
    isOnlyMulti: true,
    children: [
    {
        title: "左对齐",
        type: "align",
        multiShow: true,
        icon: "left",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodesByLast("left", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodesByLast("left", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "右对齐",
        type: "align",
        multiShow: true,
        icon: "right",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodesByLast("right", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodesByLast("right", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "顶部对齐",
        type: "align",
        multiShow: true,
        icon: "top",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodesByLast("top", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodesByLast("top", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "底部对齐",
        type: "align",
        multiShow: true,
        icon: "bottom",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodesByLast("bottom", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodesByLast("bottom", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "垂直居中",
        type: "align",
        multiShow: true,
        icon: "center",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodesByLast("center", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodesByLast("center", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "水平居中",
        type: "align",
        multiShow: true,
        icon: "middle",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.alignNodesByLast("middle", meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.alignNodesByLast("middle", meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "相同大小",
        type: "align",
        multiShow: true,
        icon: "same",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.beSameByLast(meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.beSameByLast(meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      },{
        title: "格式刷",
        type: "align",
        multiShow: true,
        icon: "format",
        option:{
          size: "small"
        },
        event: "click",
        func: () => {
          meta2d.formatPainterByLast(meta2d.store.active);
        },
        mouseOverEvent: "mouseover",
        funcMouseOver: () => {
          meta2d.formatPainterByLast(meta2d.store.active);
        },
        mouseOutEvent: "mouseout",
        funcMouseOut: () => {
          meta2d.undo();
        }
      }
    ],
  },
  {
    title: '样式',
    labelWidth: 100,
    multiShow: true,
    children: [
      {
        title: '线条样式',
        type: 'dropdown',
        multiShow: true,
        prop: 'dash',
        option: {
          placeholder: '线条样式',
          list: [
            {
              label: '直线',
              template:
                '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;width: 80px;">\n' +
                '                  <g fill="none" stroke="black" stroke-width="1">\n' +
                '                    <path d="M0 9 l85 0"></path>\n' +
                '                  </g>\n' +
                '                </svg>',
              value: 0
            },
            {
              label: '虚线',
              template:
                '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;width: 80px;">\n' +
                '                  <g fill="none" stroke="black" stroke-width="1">\n' +
                '                    <path stroke-dasharray="5 5" d="M0 9 l85 0"></path>\n' +
                '                  </g>\n' +
                '                </svg>',
              value: 1
            },
            {
              label: '虚线',
              template:
                `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path stroke-dasharray="10 10" d="M0 9 l85 0"></path>
                  </g>
                </svg>`,
              value: 2
            },
            {
              label: '点横线',
              template:
                '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;width: 80px;">\n' +
                '                  <g fill="none" stroke="black" stroke-width="1">\n' +
                '                    <path stroke-dasharray="10 10 2 10" d="M0 9 l85 0"></path>\n' +
                '                  </g>\n' +
                '                </svg>',
              value: 3
            }
          ]
        },
        bindProp: m,
        event: 'command',
        func(value) {
          const dash = [
            [0, 0],
            [5, 5],
            [10, 10],
            [10, 10, 2, 10]
          ]
          if (multiPen.value) {
            for (let i of activePen.target) {
              meta2d.setValue({
                id: i.id,
                lineDash: dash[value],
                dash: value
              })
            }
            meta2d.render()
          } else {
            activePen.target.dash = value
            meta2d.setValue({
              id: activePen.target.id,
              lineDash: dash[value],
              dash: value
            })
          }
        }
      },
      {
        title: '连线类型',
        type: 'dropdown',
        multiShow: true,
        prop: 'lineName',
        option: {
          placeholder: '线条样式',
          hidden: computed(() => {
            return activePen.target.type != 1
          }),
          list: [
            {
              label: '脑图',
              template: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 a100,50 0 0,1 85,0"></path>
                  </g>
                </svg>`,
              value: 'curve'
            },
            {
              label: '线段',
              template: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 4 l40 0 l0 12 l40 0"></path>
                  </g>
                </svg>`,
              value: 'polyline'
            },
            {
              label: '直线',
              template:
                `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path d="M0 9 l85 0"></path>
                  </g>
                </svg>`,
              value: 'line'
            }
          ]
        },
        bindProp: m,
        event: 'command',
        func(value) {
          m.lineName = value
          meta2d.updateLineType(meta2d.store.active[0], value);
        }
      },
      {
        title: '连接样式',
        type: 'select',
        multiShow: true,
        option: {
          placeholder: '连接样式',
          list: [
            {
              label: '默认',
              value: 'miter'
            },
            {
              label: '圆形',
              value: 'round'
            },
            {
              label: '斜角',
              value: 'bevel'
            }
          ]
        },
        prop: 'lineJoin',
        bindProp: m,
        event: 'change',
        func: updateFunc('lineJoin')
      },
      {
        title: '末端样式',
        type: 'select',
        multiShow: true,
        option: {
          placeholder: '末端样式',
          list: [
            {
              label: '默认',
              value: 'butt'
            },
            {
              label: '圆形',
              value: 'round'
            },
            {
              label: '方形',
              value: 'square'
            }
          ]
        },
        prop: 'lineCap',
        bindProp: m,
        event: 'change',
        func: updateFunc('lineCap')
      },
      {
        title: "平滑度",
        multiShow: true,
        type: 'number',
        prop: 'lineSmooth',
        bindProp: m,
        event: 'change',
        option: {
          placeholder: "推荐1-3",

        },
        func: updateFunc('lineSmooth')
      },
      {
        title: "线渐变",
        type: 'select',
        multiShow: true,
        bindProp: m,
        prop: 'strokeType',
        event: 'change',
        option: {
          placeholder: "请选择",
          list: [
            { label: '无', value: 0 },
            { label: '线性渐变', value: 1 },
          ]
        },
        func: updateFunc('strokeType')
      },
      {
        title: '线性渐变颜色',
        type: 'gradientColor',
        multiShow: true,
        prop: 'lineGradientColors',
        bindProp: m,
        option: {
          hidden: computed(() => {
            return !m.strokeType
          }),
          gradientType: computed(() => {
            return m.strokeType == 1?'liner':'both'
          }),
          useType: 'gradient',
        },
        func: updateFunc('lineGradientColors')
      },
      {
        title: '颜色',
        type: 'color',
        multiShow: true,
        prop: 'color',
        bindProp: m,
        event: 'change',
        option: {
          hidden: computed(() => {
            return !!m.strokeType
          }),
        },
        func: updateFunc('color')
      },
      {
        title: '浮动颜色',
        type: 'color',
        multiShow: true,
        prop: 'hoverColor',
        bindProp: m,
        event: 'change',
        func: updateFunc('hoverColor')
      },
      {
        title: '选中颜色',
        type: 'color',
        multiShow: true,
        prop: 'activeColor',
        bindProp: m,
        event: 'change',
        func: updateFunc('activeColor')
      },
      {
        title: '线条宽度',
        type: 'number',
        multiShow: true,
        prop: 'lineWidth',
        bindProp: m,
        event: 'change',
        func: updateFunc('lineWidth')
      },
      {
        title: "背景渐变",
        type: 'select',
        multiShow: true,
        bindProp: m,
        prop: 'bkType',
        event: 'change',
        option: {
          placeholder: "请选择",
          list: [
            { label: '纯色', value: 0 },
            { label: '线性渐变', value: 1 },
            // { label: '径向渐变', value: 2 },
          ]
        },
        func: updateFunc('bkType')
      },
      {
        title: '背景渐变颜色',
        type: 'gradientColor',
        multiShow: true,
        prop: 'gradientColors',
        bindProp: m,
        option: {
          hidden: computed(() => {
            return !m.bkType
          }),
          useType: 'gradient',
          gradientType: computed(() => {
            if(m.bkType == 1) {
              return 'liner'
            } else if(m.bkType == 2) {
              return 'radial'
            }
            return 'both'
          })
        },
        func: updateFunc('gradientColors')
      },
      {
        title: '背景颜色',
        type: 'color',
        multiShow: true,
        prop: 'background',
        bindProp: m,
        event: 'change',
        option: {
          hidden: computed(() => {
            return !!m.bkType
          })
        },
        func: updateFunc('background')
      },
      // {
      //   title: '渐变半径',
      //   type: 'number',
      //   multiShow: true,
      //   prop: 'gradientRadius',
      //   bindProp: m,
      //   event: 'change',
      //   option: {
      //     hidden: computed(() => {
      //       return m.bkType != 2
      //     }),
      //     min: 0,
      //     step: 0.1
      //   },
      //   func: updateFunc('gradientRadius')
      // },
      {
        title: '浮动背景颜色',
        type: 'color',
        multiShow: true,
        prop: 'hoverBackground',
        bindProp: m,
        event: 'change',
        func: updateFunc('hoverBackground')
      },
      {
        title: '选中背景颜色',
        type: 'color',
        multiShow: true,
        prop: 'activeBackground',
        bindProp: m,
        event: 'change',
        func: updateFunc('activeBackground')
      },
      {
        title: '透明度',
        type: 'number',
        multiShow: true,
        prop: 'globalAlpha',
        bindProp: m,
        option: {
          min: 0,
          step: 0.1,
          max: 1
        },
        event: 'change',
        func: updateFunc('globalAlpha')
      },
      {
        title: '锚点颜色',
        type: 'color',
        prop: 'anchorColor',
        bindProp: m,
        event: 'change',
        func: updateFunc('anchorColor')
      },
      {
        title: '锚点半径',
        type: 'number',
        prop: 'anchorRadius',
        bindProp: m,
        option: {
          min: 0,
          step: 1,
          max: 10
        },
        event: 'change',
        func: updateFunc('anchorRadius')
      },
      {
        title: '阴影颜色',
        type: 'color',
        prop: 'shadowColor',
        bindProp: m,
        event: 'change',
        func: updateFunc('shadowColor')
      },
      {
        title: '阴影模糊',
        type: 'number',
        prop: 'shadowBlur',
        bindProp: m,
        option: {
          min: 0,
          step: 1,
          max: Infinity
        },
        event: 'change',
        func: updateFunc('shadowBlur')
      },
      {
        title: '阴影x偏移',
        type: 'number',
        prop: 'shadowOffsetX',
        bindProp: m,
        event: 'change',
        func: updateFunc('shadowOffsetX')
      },
      {
        title: '阴影y偏移',
        type: 'number',
        prop: 'shadowOffsetY',
        bindProp: m,
        event: 'change',
        func: updateFunc('shadowOffsetY')
      },
      {
        title: '文字阴影',
        type: 'switch',
        prop: 'textHasShadow',
        bindProp: m,
        event: 'change',
        func: updateFunc('textHasShadow')
      }
    ]
  },
  {
    title: "位置",
    labelWidth: 100,
    line: true,
    multiShow: false,
    children: [
      {
        title: "起点坐标 X ",
        type: 'number',
        prop: 'startX',
        bindProp: m,
        event: 'change',
        option: {
          placeholder: 'px',
          readonly: true
        },
        func(val) {
          activePen.target.calculative.worldAnchors[0].x = val;
          calcPenRect(activePen.target)
          updateFunc("startX")(val)
        }
      },
      {
        title: "起点坐标 Y ",
        type: 'number',
        prop: 'startY',
        bindProp: m,
        event: 'change',
        option: {
          placeholder: 'px',
          readonly: true
        },
        func(val) {
          activePen.target.calculative.worldAnchors[0].y = val;
          calcPenRect(activePen.target)
          updateFunc("startY")(val)
        }
      },
      {
        title: "终点坐标 X ",
        type: 'number',
        prop: 'endX',
        bindProp: m,
        event: 'change',
        option: {
          readonly: true
        },
        func(val) {
          let lastIndex = activePen.target.calculative.worldAnchors.length - 1
          activePen.target.calculative.worldAnchors[lastIndex].x = val;
          calcPenRect(activePen.target)
          updateFunc("endX")(val)
        }
      },
      {
        title: "终点坐标 X ",
        type: 'number',
        prop: 'endY',
        bindProp: m,
        event: 'change',
        option: {
          readonly: true
        },
        func(val) {
          let lastIndex = activePen.target.calculative.worldAnchors.length - 1
          activePen.target.calculative.worldAnchors[lastIndex].y = val;
          calcPenRect(activePen.target)
          updateFunc("startY")(val)
        }
      },
      {
        title: "起点箭头",
        type: 'dropdown',
        prop: 'fromArrow',
        bindProp: m,
        event: 'command',
        option: {
          list: [
            { icon: "l-line", value: "" },
            { icon: "l-from-triangle", value: "triangle" },
            { icon: "l-from-diamond", value: "diamond" },
            { icon: "l-from-circle", value: "circle" },
            { icon: "l-from-lineDown", value: "lineDown" },
            { icon: "l-from-lineUp", value: "lineUp" },
            { icon: "l-from-triangleSolid", value: "triangleSolid" },
            { icon: "l-from-diamondSolid", value: "diamondSolid" },
            { icon: "l-from-circleSolid", value: "circleSolid" },
            { icon: "l-from-line", value: "line" },
          ],
          placeholder: "请选择箭头"
        },
        func(value) {
          m.fromArrow = value
          updateFunc('fromArrow')(value)
        }
      },
      {
        title: "起点箭头大小",
        type: 'number',
        prop: 'fromArrowSize',
        bindProp: m,
        event: 'change',
        option: {
          min: 0
        },
        func: updateFunc('fromArrowSize')
      },
      {
        title: "起点箭头颜色",
        type: 'color',
        prop: 'fromArrowColor',
        bindProp: m,
        event: 'change',
        func: updateFunc('fromArrowColor')
      },
      {
        title: "终点箭头 ",
        type: 'dropdown',
        prop: 'toArrow',
        bindProp: m,
        event: 'command',
        option: {
          list: [
            { icon: "l-line", value: "" },
            { icon: "l-to-triangle", value: "triangle" },
            { icon: "l-to-diamond", value: "diamond" },
            { icon: "l-to-circle", value: "circle" },
            { icon: "l-to-lineDown", value: "lineDown" },
            { icon: "l-to-lineUp", value: "lineUp" },
            { icon: "l-to-triangleSolid", value: "triangleSolid" },
            { icon: "l-to-diamondSolid", value: "diamondSolid" },
            { icon: "l-to-circleSolid", value: "circleSolid" },
            { icon: "l-to-line", value: "line" },
          ],
          placeholder: "请选择箭头"
        },
        func(value) {
          m.toArrow = value
          updateFunc('toArrow')(value)
        }
      },
      {
        title: "终点箭头大小",
        type: 'number',
        prop: 'toArrowSize',
        bindProp: m,
        event: 'change',
        option: {
          min: 0
        },
        func: updateFunc('toArrowSize')
      },
      {
        title: "终点箭头颜色",
        type: 'color',
        prop: 'toArrowColor',
        bindProp: m,
        event: 'change',
        func: updateFunc('toArrowColor')
      },
      {
        title: "起点自动关联",
        type: 'switch',
        prop: 'autoFrom',
        bindProp: m,
        event: 'change',
        func: updateFunc('autoFrom')
      },
      {
        title: "终点自动关联",
        type: 'switch',
        prop: 'autoTo',
        bindProp: m,
        event: 'change',
        func: updateFunc('autoTo')
      },
    ]
  },
  {
    title: '文字',
    multiShow: true,
    labelWidth: 100,
    children: [
      {
        title: '字体名',
        type: 'select',
        multiShow: true,
        prop: 'fontFamily',
        option: {
          placeholder: '请选择字体',
          list: [
            {
              label: '宋体',
              value: '宋体'
            },
            {
              label: '黑体',
              value: '黑体'
            }
          ]
        },
        bindProp: m,
        event: 'change',
        func: updateFunc('fontFamily')
      },
      {
        title: '字体大小',
        type: 'number',
        multiShow: true,
        prop: 'fontSize',
        bindProp: m,
        event: 'change',
        func: updateFunc('fontSize')
      },
      {
        title: '字体颜色',
        type: 'color',
        multiShow: true,
        prop: 'textColor',
        bindProp: m,
        event: 'change',
        func: updateFunc('textColor')
      },
      {
        title: '浮动字体颜色',
        type: 'color',
        multiShow: true,
        prop: 'hoverTextColor',
        bindProp: m,
        event: 'change',
        func: updateFunc('hoverTextColor')
      },
      {
        title: '选中字体颜色',
        type: 'color',
        multiShow: true,
        prop: 'activeTextColor',
        bindProp: m,
        event: 'change',
        func: updateFunc('activeTextColor')
      },
      {
        title: '文字背景颜色',
        type: 'color',
        multiShow: true,
        prop: 'textBackground',
        bindProp: m,
        event: 'change',
        func: updateFunc('textBackground')
      },
      {
        title: "倾斜",
        type: 'select',
        prop: 'fontStyle',
        multiShow: true,
        bindProp: m,
        event: 'change',
        option: {
          placeholder: '请选择',
          list: [
            { label: '正常', value: 'normal' },
            { label: '倾斜', value: 'italic' },
          ]
        },
        func: updateFunc('fontStyle'),
      },
      {
        title: "加粗",
        type: 'select',
        prop: 'fontWeight',
        multiShow: true,
        bindProp: m,
        event: 'change',
        option: {
          placeholder: '请选择',
          list: [
            { label: '正常', value: 'normal' },
            { label: '加粗', value: 'bold' },
          ]
        },
        func: updateFunc('fontWeight'),
      },
      {
        title: '水平对齐',
        type: 'select',
        multiShow: true,
        prop: 'textAlign',
        option: {
          placeholder: '请选择对齐方式',
          list: [
            {
              label: '左对齐',
              value: 'left'
            },
            {
              label: '居中对齐',
              value: 'center'
            },
            {
              label: '右对齐',
              value: 'right'
            }
          ]
        },
        bindProp: m,
        event: 'change',
        func: updateFunc('textAlign')
      },
      {
        title: '垂直对齐',
        type: 'select',
        multiShow: true,
        prop: 'textBaseline',
        option: {
          placeholder: '请选择对齐方式',
          list: [
            {
              label: '顶部对齐',
              value: 'top'
            },
            {
              label: '居中对齐',
              value: 'center'
            },
            {
              label: '底部对齐',
              value: 'bottom'
            }
          ]
        },
        bindProp: m,
        event: 'change',
        func: updateFunc('textBaseline')
      },
      {
        title: '行高',
        type: 'number',
        multiShow: true,
        option: {
          step: 0.1,
          min: 0
        },
        prop: 'lineHeight',
        bindProp: m,
        event: 'change',
        func: updateFunc('lineHeight')
      },
      {
        title: '换行',
        type: 'select',
        multiShow: true,
        prop: 'whiteSpace',
        option: {
          placeholder: '请选择换行方式',
          list: [
            {
              label: '默认',
              value: 'break-word'
            },
            {
              label: '不换行',
              value: 'nowrap'
            },
            {
              label: '回车换行',
              value: 'pre-line'
            },
            {
              label: '永远换行',
              value: 'break-all'
            }
          ]
        },
        bindProp: m,
        event: 'change',
        func: updateFunc('whiteSpace')
      },
      {
        title: '文字宽度',
        type: 'number',
        multiShow: true,
        option: {
          min: 0
        },
        prop: 'textWidth',
        bindProp: m,
        event: 'change',
        func: updateFunc('textWidth')
      },
      {
        title: '文字高度',
        type: 'number',
        multiShow: true,
        option: {
          min: 0
        },
        prop: 'textHeight',
        bindProp: m,
        event: 'change',
        func: updateFunc('textHeight')
      },
      {
        title: '水平偏移',
        type: 'number',
        multiShow: true,
        prop: 'textLeft',
        bindProp: m,
        event: 'change',
        func: updateFunc('textLeft')
      },
      {
        title: '垂直偏移',
        type: 'number',
        multiShow: true,
        prop: 'textTop',
        bindProp: m,
        event: 'change',
        func: updateFunc('textTop')
      },
      {
        title: '超出省略',
        type: 'switch',
        prop: 'ellipsis',
        bindProp: m,
        event: 'change',
        func: updateFunc('ellipsis')
      },
      {
        title: '隐藏文字',
        type: 'switch',
        prop: 'hiddenText',
        bindProp: m,
        event: 'change',
        func: updateFunc('hiddenText')
      },
      {
        title: '保留小数',
        type: 'number',
        prop: 'keepDecimal',
        bindProp: m,
        event: 'change',
        option: {
          placeholder: '保留小数位',
          min: 0,
          step: 1
        },
        func: updateFunc('keepDecimal')
      },
      {
        title: '下划线',
        type: 'switch',
        prop: 'textDecoration',
        bindProp: m,
        event: 'change',
        func: updateFunc('textDecoration')
      },
      {
        title: '下划线颜色',
        type: 'color',
        prop: 'textDecorationColor',
        bindProp: m,
        event: 'change',
        func: updateFunc('textDecorationColor')
      },
      {
        title: '下划线样式',
        type: 'dropdown',
        option: {
          placeholder: '线条样式',
          list: [
            {
              label: '直线',
              template:
                '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;width: 80px;">\n' +
                '                  <g fill="none" stroke="black" stroke-width="1">\n' +
                '                    <path d="M0 9 l85 0"></path>\n' +
                '                  </g>\n' +
                '                </svg>',
              value: 0
            },
            {
              label: '虚线',
              template:
                '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;width: 80px;">\n' +
                '                  <g fill="none" stroke="black" stroke-width="1">\n' +
                '                    <path stroke-dasharray="5 5" d="M0 9 l85 0"></path>\n' +
                '                  </g>\n' +
                '                </svg>',
              value: 1
            },
            {
              label: '虚线',
              template:
                `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path stroke-dasharray="10 10" d="M0 9 l85 0"></path>
                  </g>
                </svg>`,
              value: 2
            },
            {
              label: '点横线',
              template:
                '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;width: 80px;">\n' +
                '                  <g fill="none" stroke="black" stroke-width="1">\n' +
                '                    <path stroke-dasharray="10 10 2 10" d="M0 9 l85 0"></path>\n' +
                '                  </g>\n' +
                '                </svg>',
              value: 3
            }
          ]
        },
        bindProp: m,
        event: 'command',
        prop: 'decorationDash',
        func(value) {
          const dash = [
            [0, 0],
            [5, 5],
            [10, 10],
            [10, 10, 2, 10]
          ]
          if (multiPen.value) {
            for (let i of activePen.target) {
              meta2d.setValue({
                id: i.id,
                textDecorationDash: dash[value],
                decorationDash: value
              })
            }
            meta2d.render()
          } else {
            activePen.target.decorationDash = value
            meta2d.setValue({
              id: activePen.target.id,
              textDecorationDash: dash[value],
              decorationDash: value
            })
          }
        }
      },
      {
        title: '删除线',
        type: 'switch',
        prop: 'textStrickout',
        bindProp: m,
        event: 'change',
        func: updateFunc('textStrickout')
      },
      {
        title: '删除线颜色',
        type: 'color',
        prop: 'textStrickoutColor',
        bindProp: m,
        event: 'change',
        func: updateFunc('textStrickoutColor')
      },
      {
        title: '删除线样式',
        type: 'dropdown',
        option: {
          placeholder: '线条样式',
          list: [
            {
              label: '直线',
              template:
                '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;width: 80px;">\n' +
                '                  <g fill="none" stroke="black" stroke-width="1">\n' +
                '                    <path d="M0 9 l85 0"></path>\n' +
                '                  </g>\n' +
                '                </svg>',
              value: 0
            },
            {
              label: '虚线',
              template:
                '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;width: 80px;">\n' +
                '                  <g fill="none" stroke="black" stroke-width="1">\n' +
                '                    <path stroke-dasharray="5 5" d="M0 9 l85 0"></path>\n' +
                '                  </g>\n' +
                '                </svg>',
              value: 1
            },
            {
              label: '虚线',
              template:
                `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path stroke-dasharray="10 10" d="M0 9 l85 0"></path>
                  </g>
                </svg>`,
              value: 2
            },
            {
              label: '点横线',
              template:
                '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="height: 20px;width: 80px;">\n' +
                '                  <g fill="none" stroke="black" stroke-width="1">\n' +
                '                    <path stroke-dasharray="10 10 2 10" d="M0 9 l85 0"></path>\n' +
                '                  </g>\n' +
                '                </svg>',
              value: 3
            }
          ]
        },
        bindProp: m,
        event: 'command',
        prop: 'strickoutDash',
        func(value) {
          const dash = [
            [0, 0],
            [5, 5],
            [10, 10],
            [10, 10, 2, 10]
          ]
          if (multiPen.value) {
            for (let i of activePen.target) {
              meta2d.setValue({
                id: i.id,
                textStrickoutDash: dash[value],
                strickoutDash: value
              })
            }
            meta2d.render()
          } else {
            activePen.target.strickoutDash = value
            meta2d.setValue({
              id: activePen.target.id,
              textStrickoutDash: dash[value],
              strickoutDash: value
            })
          }
        }
      },
      {
        title: '文字内容',
        type: 'input',
        option: {
          type: 'textarea'
        },
        prop: 'text',
        bindProp: m,
        event: 'input',
        func: updateFunc('text')
      }
    ]
  },
  {
    title: '图片 ',
    tip: '图片、字体图标同时存在时，图片优先',
    labelWidth: 100,
    children: [
      {
        title: '图片',
        type: 'image',
        prop: 'image',
        bindProp: m, // 绑定的属性
        event: 'change',
        option: {
          accept: 'image/*',
        },
        for: Math.random(), // 随机id
        func(file) {
          // let fileUrl = URL.createObjectURL(file) // 创建文件引用 转换为blob
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function () {
            const fileUrl = reader.result
            m.image = fileUrl
            updateFunc("image")(fileUrl)
          }
        }
      },
      {
        title: '图片地址',
        type: 'input',
        prop: 'image',
        bindProp: m,
        event: 'change',
        option: {
          type: 'text',
          placeholder: '请输入图片地址'
        },
        func: updateFunc("image")
      },
      {
        title: '旋转角度',
        type: 'number',
        bindProp: m,
        prop: 'iconRotate',
        event: 'change',
        option: {
          min: 0,
          placeholder: '请输入图标旋转角度'
        },
        func: updateFunc("iconRotate")
      },
      {
        title: '宽度',
        type: 'number',
        bindProp: m,
        prop: 'iconWidth',
        event: 'change',
        option: {
          min: 0,
          placeholder: '自适应'
        },
        func: updateFunc("iconWidth")
      },
      {
        title: '高度',
        type: 'number',
        bindProp: m,
        prop: 'iconHeight',
        event: 'change',
        option: {
          min: 0,
          placeholder: '自适应'
        },
        func: updateFunc("iconHeight")
      },
      {
        title: '保存比例',
        type: 'switch',
        bindProp: m,
        prop: 'imageRatio',
        event: 'change',
        func: updateFunc("imageRatio")
      },
      {
        title: '水平偏移',
        type: 'number',
        bindProp: m,
        prop: 'iconLeft',
        event: 'change',
        func: updateFunc("iconLeft")
      },
      {
        title: '垂直偏移',
        type: 'number',
        bindProp: m,
        prop: 'iconTop',
        event: 'change',
        func: updateFunc("iconTop")
      },
      {
        title: '层级',
        type: 'select',
        bindProp: m,
        prop: 'canvasLayer',
        event: 'change',
        option: {
          list: [
            { label: '上层', value: 4 },
            { label: '中层', value: 3 },
            { label: '下层', value: 2 },
            { label: '模板', value: 1 },
          ]
        },
        func: updateFunc("canvasLayer")
      },
      {
        title: '对齐方式',
        type: 'select',
        bindProp: m,
        prop: 'iconAlign',
        event: 'change',
        option: {
          placeholder: '请选择',
          list: [
            { label: '居中', value: 'center' },
            { label: '左', value: 'left' },
            { label: '右', value: 'right' },
            { label: '上', value: 'top' },
            { label: '下', value: 'bottom' },
            { label: '左上', value: 'left-top' },
            { label: '左下', value: 'left-bottom' },
            { label: '右上', value: 'right-top' },
            { label: '右下', value: 'right-bottom' },
          ]
        },
        func: updateFunc("iconAlign")
      },
      {
        title: '背景图片',
        type: 'image',
        prop: 'backgroundImage',
        bindProp: m, // 绑定的属性
        event: 'change',
        option: {
          accept: 'image/*',
        },
        for: Math.random(), // 随机id
        func(file) {
          // let fileUrl = URL.createObjectURL(file) // 创建文件引用 转换为blob
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function () {
            const fileUrl = reader.result
            m.backgroundImage = fileUrl
            updateFunc('backgroundImage')(fileUrl)
          }
        }
      },
      {
        title: '背景图片地址',
        type: 'input',
        prop: 'backgroundImage',
        bindProp: m,
        event: 'change',
        option: {
          type: 'text',
          placeholder: '请输入背景图片地址'
        },
        func: updateFunc('backgroundImage')
      },
      {
        title: '描绘图片',
        type: 'image',
        prop: 'strokeImage',
        bindProp: m, // 绑定的属性
        event: 'change',
        option: {
          accept: 'image/*',
        },
        for: Math.random(), // 随机id
        func(file) {
          // let fileUrl = URL.createObjectURL(file) // 创建文件引用 转换为blob
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function () {
            const fileUrl = reader.result
            m.strokeImage = fileUrl
            updateFunc('strokeImage')(fileUrl)
          }
        }
      },
      {
        title: '描绘图片地址',
        type: 'input',
        prop: 'strokeImage',
        bindProp: m,
        event: 'change',
        option: {
          type: 'text',
          placeholder: '请输入描绘图片地址'
        },
        func: updateFunc('strokeImage')
      },
    ]
  },
  {
    title: '字体图标 ',
    tip: '图片、字体图标同时存在时，图片优先',
    labelWidth: 100,
    children: [
      {
        title: '字体图标',
        type: 'icon',
        prop: 'iconClass',
        bindProp: m,
        event: 'click',
        deleteFunc() {
          m['iconClass'] = undefined
          updateFunc('icon')()
          updateFunc('iconClass')()
        },
        func() {
          updateFunc("iconFamily")("ticon")
          penProp = 'iconClass'
          showIconDrawer.value = true
        }
      },
      {
        title: '图标大小',
        type: 'number',
        bindProp: m,
        prop: 'iconSize',
        event: 'change',
        option: {
          min: 0,
          placeholder: '请输入图标大小'
        },
        func: updateFunc("iconSize")
      },
      {
        title: '图标旋转',
        type: 'number',
        bindProp: m,
        prop: 'iconRotate',
        event: 'change',
        option: {
          min: 0,
          placeholder: '请输入图标旋转角度'
        },
        func: updateFunc("iconRotate")
      },
      {
        title: '颜色',
        type: 'color',
        bindProp: m,
        prop: 'iconColor',
        event: 'change',
        func: updateFunc("iconColor")
      },
      {
        title: '对齐方式',
        type: 'select',
        bindProp: m,
        prop: 'iconAlign',
        event: 'change',
        option: {
          placeholder: '请选择',
          list: [
            { label: '居中', value: 'center' },
            { label: '左', value: 'left' },
            { label: '右', value: 'right' },
            { label: '上', value: 'top' },
            { label: '下', value: 'bottom' },
            { label: '左上', value: 'left-top' },
            { label: '左下', value: 'left-bottom' },
            { label: '右上', value: 'right-top' },
            { label: '右下', value: 'right-bottom' },
          ]
        },
        func: updateFunc("iconAlign")
      },
    ]
  },
  {
    title: '禁止',
    labelWidth: 100,
    multiShow: false,
    children: [
      {
        title: '禁止输入',
        type: 'switch',
        prop: 'disableInput',
        bindProp: m,
        event: 'change',
        func: updateFunc('disableInput')
      },
      {
        title: '禁止旋转',
        type: 'switch',
        prop: 'disableRotate',
        bindProp: m,
        event: 'change',
        func: updateFunc('disableRotate')
      },
      {
        title: '禁止缩放',
        type: 'switch',
        prop: 'disableSize',
        bindProp: m,
        event: 'change',
        func: updateFunc('disableSize')
      },
      {
        title: '禁止锚点',
        type: 'switch',
        prop: 'disableAnchor',
        bindProp: m,
        event: 'change',
        func: updateFunc('disableAnchor')
      }
    ]
  }
]

// 计算展示字段列表
// eslint-disable-next-line vue/return-in-computed-property
let showMap = computed(() => {
  if (multiPen.value) {
    return map.filter((i) => {
      i.multiShow ? (i.children = i.children.filter((item) => item.multiShow)) : ''
      return i.multiShow
    })
  } else if (!multiPen.value && otherProps) {
    let data = map.concat(otherProps.props)
    data = data.filter(i => !i.isOnlyMulti);
    // 节点类型为线
    if (activePen.target.type == 1) {
      return data.filter((i) => {
        return i.line === true || i.line === undefined
      })
    } else {
      return data.filter((i) => {
        return i.line === false || i.line === undefined
      })
    }
  }
})
</script>

<template>
  <div class="appearanceProps">
    <Form :form-list="showMap"></Form>
  </div>

  <IconDrawer v-model="showIconDrawer" @change="iconChange" />
</template>

<style scoped></style>