<script setup>
import Form from '../Form.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { mapProps } from '@/config/defaultConfig'
let m = reactive(mapProps)
function loadOptionsFromMeta2d(options, target) {
  for (let i in target) {
    target[i] = options[i] || target[i]
  }
}
onMounted(() => {
  meta2d.on('opened', () => {
    const options = meta2d.data()
    loadOptionsFromMeta2d(meta2d.getOptions(), m)
    loadOptionsFromMeta2d(options, m)
  })
  // 初始化
  const options = meta2d.getOptions()
  loadOptionsFromMeta2d(options, m)
  meta2d.fileName = m.fileName
})
const map = computed(() => {
  return [
    {
      title: '文件', //显示名
      labelWidth: 80,
      children: [
        {
          title: '文件名',
          type: 'input',
          option: {
            type: 'text',
            placeholder: '请输入文件名'
          },
          prop: 'fileName',
          bindProp: m, // 绑定的属性
          event: 'change',
          func: function arg1(value) {
            meta2d.store.options.fileName = value
          }
        }
      ]
    },
    {
      title: '画布', //显示名
      labelWidth: 100,
      children: [
        {
          title: '默认颜色',
          type: 'color',
          prop: 'color',
          event: 'change',
          bindProp: m, // 绑定的属性
          func(value) {
            meta2d.setOptions({
              color: value
            })
            meta2d.render()
          }
        },
        {
          title: '画笔填充颜色',
          type: 'color',
          prop: 'penBackground',
          bindProp: m, // 绑定的属性
          event: 'change',
          func(value) {
            meta2d.store.data.penBackground = value
            meta2d.render()
          }
        },
        {
          title: '背景颜色',
          type: 'color',
          prop: 'background',
          bindProp: m, // 绑定的属性
          event: 'change',
          func(value) {
            meta2d.setBackgroundColor(value)
            meta2d.render()
          }
        },
        {
          title: '背景图片',
          type: 'image',
          prop: 'bkImage',
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
              m.bkImage = fileUrl
              meta2d.setBackgroundImage(fileUrl)
              meta2d.render()
            }
          }
        },
        {
          title: '背景图片地址',
          type: 'input',
          prop: 'bkImage',
          bindProp: m,
          event: 'change',
          option: {
            type: 'text',
            placeholder: '请输入背景图片地址'
          },
          func(value) {
            meta2d.setBackgroundImage(value)
            meta2d.render()
          }
        },
        {
          title: '标尺',
          type: 'switch',
          prop: 'rule',
          bindProp: m, // 绑定的属性
          event: 'change',
          func(value) {
            meta2d.setRule({
              rule: value
            })
            meta2d.render()
          }
        },
        {
          title: '标尺颜色',
          type: 'color',
          prop: 'ruleColor',
          bindProp: m, // 绑定的属性
          event: 'change',
          func(value) {
            meta2d.setRule({
              ruleColor: value
            })
            meta2d.render()
          }
        },
        {
          title: '网格',
          type: 'switch',
          prop: 'grid',
          bindProp: m, // 绑定的属性
          event: 'change',
          func(value) {
            meta2d.setGrid({
              grid: value
            })
            meta2d.render()
          }
        },
        {
          title: '网格自动对齐',
          type: 'switch',
          prop: 'autoAlignGrid',
          bindProp: m, // 绑定的属性
          event: 'change',
          func(value) {
            meta2d.store.options.autoAlignGrid = value
            meta2d.render()
          }
        },
        // 连线相交时
        {
          title: '连线相交弯曲',
          type: 'switch',
          prop: 'curveStatus',
          bindProp: m, // 绑定的属性
          event: 'change',
          func(value) {
            meta2d.store.options.curveStatus = value;
            console.log(meta2d.store, 'meta2d.store');
          }
        },
        {
          title: '网格颜色',
          type: 'color',
          prop: 'gridColor',
          bindProp: m, // 绑定的属性
          event: 'change',
          func(value) {
            meta2d.setGrid({
              gridColor: value
            })
            meta2d.render()
          }
        },
        {
          title: '网格大小',
          type: 'number',
          prop: 'gridSize',
          bindProp: m, // 绑定的属性
          event: 'change',
          option: {
            min: 1,
            max: 100
          },
          func(value) {
            meta2d.setGrid({
              gridSize: +value
            })
            meta2d.render()
          }
        },
        {
          title: '网格角度',
          type: 'number',
          prop: 'gridRotate',
          bindProp: m, // 绑定的属性
          event: 'change',
          option: {
            min: -Infinity,
            max: Infinity
          },
          func(value) {
            meta2d.setGrid({
              gridRotate: +value
            })
            meta2d.render()
          }
        }
      ]
    }
  ]
})
</script>

<template>
  <div class="mapProps">
    <Form :form-list="map"></Form>
  </div>
</template>

<style scoped></style>