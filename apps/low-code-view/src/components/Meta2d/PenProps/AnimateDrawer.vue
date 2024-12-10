<template>
    <el-drawer v-model="drawerVisible" class="animate-drawer" append-to-body lock-scroll title="节点动画" :size="356">
        <el-button type="primary" @click="addFrame" class="full-w mb-10">新增动画帧</el-button>
        <el-scrollbar height="100%" style="height: calc(100vh - 130px)">
            <Form :form-list="showMap" />
        </el-scrollbar>
    </el-drawer>
    <IconDrawer v-model="showIconDrawer" @change="iconChange" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Form from '@/components/Meta2d/Form.vue'
import IconDrawer from '@/components/Meta2d/icon/IconDrawer.vue'
/** pen图标改变 */
let penProp = ''
let penindex = 0
let showIconDrawer = ref(false)
const iconChange = (val: any) => {
    props.frames[penindex].iconClass = val.icon
    props.frames[penindex].icon = val.value
    props.frames[penProp] = val.icon
    func()
}

const props = withDefaults(defineProps<{
    visible: boolean,
    frames: any,
}>(), {
    visible: false,
    frames: []
})

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void,
    (e: 'update', value: any): void,
}>()
const drawerVisible = computed({
    get() {
        return props.visible
    },
    set(val) {
        emit('update:visible', val)
    }
})
const func = () => {
    emit("update", props.frames)
}

const showMap = computed(() => {
    let l = props.frames.length
    return props.frames.map((frame: any, index: number) => {
        return {
            title: `动画帧 ${index + 1} / ${l}`,
            delete: true,
            labelWidth: 110,
            func(index: number) {
                props.frames.splice(index, 1)
                func()
            },
            children: [
                {
                    title: "时长(ms)",
                    prop: "duration",
                    bindProp: props.frames[index],
                    type: "number",
                    event: 'change',
                    option: {
                        min: 0
                    },
                    func
                },
                {
                    title: "偏移X",
                    prop: "x",
                    bindProp: props.frames[index],
                    type: "number",
                    event: 'change',
                    option: {
                        placeholder: 'px'
                    },
                    func
                },
                {
                    title: "偏移Y",
                    prop: "y",
                    bindProp: props.frames[index],
                    type: "number",
                    event: 'change',
                    option: {
                        placeholder: 'px'
                    },
                    func
                },
                {
                    title: "缩放",
                    prop: "scale",
                    bindProp: props.frames[index],
                    type: "number",
                    event: 'change',
                    option: {
                        min: 0
                    },
                    func
                },
                {
                    title: "圆角",
                    prop: "borderRadius",
                    bindProp: props.frames[index],
                    type: "number",
                    event: 'change',
                    option: {
                        min: 0,
                        step: 0.1,
                        max: 1,
                        placeholder: "<1 比例"
                    },
                    func
                },
                {
                    title: "旋转",
                    prop: "rotate",
                    bindProp: props.frames[index],
                    type: "number",
                    event: 'change',
                    option: {
                        step: 1
                    },
                    func
                },
                {
                    title: "进度",
                    prop: "progress",
                    bindProp: props.frames[index],
                    type: "number",
                    event: 'change',
                    option: {
                        step: 0.1,
                        min: 0,
                        max: 1,
                        placeholder: '%'
                    },
                    func
                },
                {
                    title: "进度颜色",
                    prop: "progressColor",
                    bindProp: props.frames[index],
                    type: "color",
                    event: 'change',
                    func
                },
                {
                    title: "水平翻转",
                    prop: "flipX",
                    bindProp: props.frames[index],
                    type: "switch",
                    event: 'change',
                    func
                },
                {
                    title: "垂直翻转",
                    prop: "flipY",
                    bindProp: props.frames[index],
                    type: "switch",
                    event: 'change',
                    func
                },
                {
                    title: '线条样式',
                    type: 'dropdown',
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
                    bindProp: props.frames[index],
                    event: 'command',
                    func(value: number) {
                        const dash = [
                            [0, 0],
                            [5, 5],
                            [10, 10],
                            [10, 10, 2, 10]
                        ]
                        let lineDash = dash[value]
                        props.frames[index].lineDash = lineDash
                        props.frames[index].dash = value
                        func()
                    }
                },
                {
                    title: "线条宽度",
                    type: "number",
                    bindProp: props.frames[index],
                    prop: "lineWidth",
                    event: "change",
                    option: {
                        min: 0,
                        step: 1,
                        placeholder: 'px'
                    },
                    func
                },
                {
                    title: "线条偏移",
                    type: "number",
                    bindProp: props.frames[index],
                    prop: "lineDashOffset",
                    event: "change",
                    option: {
                        placeholder: 'px'
                    },
                    func
                },
                {
                    title: "透明度",
                    type: "number",
                    bindProp: props.frames[index],
                    prop: "globalAlpha",
                    event: "change",
                    option: {
                        placeholder: '(0-1)',
                        min: 0,
                        max: 1,
                        step: 0.1
                    },
                    func
                },
                {
                    title: "显示",
                    type: "switch",
                    bindProp: props.frames[index],
                    prop: "visible",
                    event: "change",
                    func
                },
                {
                    title: "线条渐变",
                    type: "select",
                    bindProp: props.frames[index],
                    prop: "strokeType",
                    event: "change",
                    option: {
                        list: [
                            { label: '无', value: 0 },
                            { label: '线性渐变', value: 1 },
                        ]
                    },
                    func
                },
                {
                    title: "颜色",
                    type: "color",
                    bindProp: props.frames[index],
                    prop: "color",
                    event: "change",
                    option: {
                        hidden: computed(() => {
                            return props.frames[index].strokeType === 1
                        })
                    },
                    func
                },
                {
                    title: "线条渐变色",
                    type: "color",
                    bindProp: props.frames[index],
                    prop: "lineGradientColors",
                    event: "change",
                    option: {
                        hidden: computed(() => {
                            return props.frames[index].strokeType !== 1
                        }),
                        useType: 'gradient'
                    },
                    func
                },
                {
                    title: "背景渐变",
                    type: 'select',
                    bindProp: props.frames[index],
                    prop: 'bkType',
                    event: 'change',
                    option: {
                        placeholder: "请选择",
                        list: [
                            { label: '纯色', value: 0 },
                            { label: '线性渐变', value: 1 },
                            { label: '径向渐变', value: 2 },
                        ]
                    },
                    func
                },
                {
                    title: '背景渐变颜色',
                    type: 'color',
                    prop: 'gradientColors',
                    bindProp: props.frames[index],
                    event: 'change',
                    option: {
                        hidden: computed(() => {
                            return !props.frames[index].bkType
                        }),
                        useType: 'gradient'
                    },
                    func
                },
                {
                    title: '背景颜色',
                    type: 'color',
                    prop: 'background',
                    bindProp: props.frames[index],
                    event: 'change',
                    option: {
                        hidden: computed(() => {
                            return !!props.frames[index].bkType
                        })
                    },
                    func
                },
                {
                    title: '渐变半径',
                    type: 'number',
                    prop: 'gradientRadius',
                    bindProp: props.frames[index],
                    event: 'change',
                    option: {
                        hidden: computed(() => {
                            return props.frames[index].bkType != 2
                        }),
                        min: 0,
                        step: 0.1,
                        max: 1
                    },
                    func
                },
                {
                    title: '阴影模糊',
                    type: 'number',
                    prop: 'shadowBlur',
                    bindProp: props.frames[index],
                    event: 'change',
                    option: {
                        min: 0,
                        step: 1,
                    },
                    func
                },
                {
                    title: '阴影 X 偏移',
                    type: 'number',
                    prop: 'shadowOffsetX',
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '阴影 Y 偏移',
                    type: 'number',
                    prop: 'shadowOffsetY',
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '文字阴影',
                    type: 'switch',
                    prop: 'textHasShadow',
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '字体名',
                    type: 'select',
                    prop: 'fontFamily',
                    option: {
                        placeholder: '请选择字体',
                        list: [
                            { label: '宋体', value: '宋体' },
                            { label: '黑体', value: '黑体' }
                        ]
                    },
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '字体大小',
                    type: 'number',
                    prop: 'fontSize',
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '字体颜色',
                    type: 'color',
                    prop: 'textColor',
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '浮动字体颜色',
                    type: 'color',
                    prop: 'hoverTextColor',
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '选中字体颜色',
                    type: 'color',
                    prop: 'activeTextColor',
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '文字背景颜色',
                    type: 'color',
                    prop: 'textBackground',
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: "倾斜",
                    type: 'select',
                    prop: 'fontStyle',
                    bindProp: props.frames[index],
                    event: 'change',
                    option: {
                        placeholder: '请选择',
                        list: [
                            { label: '正常', value: 'normal' },
                            { label: '倾斜', value: 'italic' },
                        ]
                    },
                    func
                },
                {
                    title: "加粗",
                    type: 'select',
                    prop: 'fontWeight',
                    bindProp: props.frames[index],
                    event: 'change',
                    option: {
                        placeholder: '请选择',
                        list: [
                            { label: '正常', value: 'normal' },
                            { label: '加粗', value: 'bold' },
                        ]
                    },
                    func
                },
                {
                    title: '水平对齐',
                    type: 'select',
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
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '垂直对齐',
                    type: 'select',
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
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '行高',
                    type: 'number',
                    option: {
                        step: 0.1,
                        min: 0
                    },
                    prop: 'lineHeight',
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '换行',
                    type: 'select',
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
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '文字宽度',
                    type: 'number',
                    option: {
                        min: 0
                    },
                    prop: 'textWidth',
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '文字高度',
                    type: 'number',
                    option: {
                        min: 0
                    },
                    prop: 'textHeight',
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '水平偏移',
                    type: 'number',
                    prop: 'textLeft',
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '垂直偏移',
                    type: 'number',
                    prop: 'textTop',
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '超出省略',
                    type: 'switch',
                    prop: 'ellipsis',
                    bindProp: props.frames[index],
                    event: 'change',
                    func
                },
                {
                    title: '文字内容',
                    type: 'input',
                    option: {
                        type: 'textarea'
                    },
                    prop: 'text',
                    bindProp: props.frames[index],
                    event: 'input',
                    func
                },
                {
                    title: '字体图标',
                    type: 'icon',
                    prop: 'iconClass',
                    bindProp: props.frames[index],
                    event: 'click',
                    deleteFunc() {
                        props.frames[index]['iconClass'] = undefined
                        props.frames[index]['icon'] = undefined
                        func()
                    },
                    func() {
                        props.frames[index]['iconFamily'] = "ticon"
                        penProp = 'iconClass'
                        penindex = index
                        showIconDrawer.value = true
                        func()
                    }
                },
                {
                    title: '图标大小',
                    type: 'number',
                    bindProp: props.frames[index],
                    prop: 'iconSize',
                    event: 'change',
                    option: {
                        min: 0,
                        placeholder: '请输入图标大小'
                    },
                    func
                },
                {
                    title: '图标旋转',
                    type: 'number',
                    bindProp: props.frames[index],
                    prop: 'iconRotate',
                    event: 'change',
                    option: {
                        min: 0,
                        placeholder: '请输入图标旋转角度'
                    },
                    func
                },
                {
                    title: '图标颜色',
                    type: 'color',
                    bindProp: props.frames[index],
                    prop: 'iconColor',
                    event: 'change',
                    func
                },
                {
                    title: '对齐方式',
                    type: 'select',
                    bindProp: props.frames[index],
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
                    func
                },
                {
                    title: '水平偏移',
                    type: 'number',
                    bindProp: props.frames[index],
                    prop: 'iconLeft',
                    event: 'change',
                    func
                },
                {
                    title: '垂直偏移',
                    type: 'number',
                    bindProp: props.frames[index],
                    prop: 'iconTop',
                    event: 'change',
                    func
                },
                {
                    title: '图片',
                    type: 'image',
                    prop: 'image',
                    bindProp: props.frames[index], // 绑定的属性
                    event: 'change',
                    option: {
                        accept: 'image/*',
                    },
                    for: Math.random(), // 随机id
                    func(file: File) {
                        // let fileUrl = URL.createObjectURL(file) // 创建文件引用 转换为blob
                        const reader = new FileReader()
                        reader.readAsDataURL(file)
                        reader.onload = function () {
                            const fileUrl = reader.result
                            props.frames[index].image = fileUrl
                            func()
                        }
                    }
                },
                {
                    title: '图片地址',
                    type: 'input',
                    prop: 'image',
                    bindProp: props.frames[index],
                    event: 'change',
                    option: {
                        type: 'text',
                        placeholder: '请输入图片地址'
                    },
                    func
                },
                {
                    title: '宽度',
                    type: 'number',
                    bindProp: props.frames[index],
                    prop: 'iconWidth',
                    event: 'change',
                    option: {
                        min: 0,
                        placeholder: '自适应'
                    },
                    func
                },
                {
                    title: '高度',
                    type: 'number',
                    bindProp: props.frames[index],
                    prop: 'iconHeight',
                    event: 'change',
                    option: {
                        min: 0,
                        placeholder: '自适应'
                    },
                    func
                },
            ]
        }
    })
})

const addFrame = () => {
    props.frames.push({ duration: 200, visible: true })
    func()
}
</script>

<style>
.full-w {
    width: 100%;
}

.mb-20 {
    margin-bottom: 20px;
}

.animate-drawer .el-drawer__header {
    margin-bottom: 10px;
}
</style>