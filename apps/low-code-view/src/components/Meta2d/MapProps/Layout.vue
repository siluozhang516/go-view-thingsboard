<template>
    <Form :form-list="formList" />
</template>

<script setup lang="ts">
import Form from '@/components/Meta2d/Form.vue'
import { computed, onMounted, reactive } from 'vue'
import { LayoutConfig } from '@/config/defaultConfig'

const layout = reactive(LayoutConfig)


const formList = computed(() => {
    return [{
        title: '布局',
        labelWidth: 90,
        children: [
            {
                title: '最大宽度',
                type: 'input',
                prop: 'width',
                bindProp: layout, // 绑定的属性
                event: 'change',
                option: {
                    tip: '超过换行',
                    placeholder: '请输入最大宽度',

                }
            },
            {
                title: '间距',
                type: 'input',
                prop: 'space',
                bindProp: layout, // 绑定的属性
                event: 'change',
                option: {
                    placeholder: '请输入间距',

                }
            },
            {
                title: '',
                type: 'button',
                event: 'click',
                option: {
                    text: '开始排版',
                    labelWidth: '0px',
                    block: true
                },
                func() {
                    let activePens = meta2d.store.data.pens || []
                    if (!activePens.length) {
                        meta2d.layout(undefined, layout.width, layout.space);
                    } else {
                        meta2d.layout(activePens, layout.width, layout.space);
                    }

                }
            },
        ]
    }]
})
</script>