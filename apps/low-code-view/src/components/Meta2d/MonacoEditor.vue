<template>
    <div ref="monacoEditorRef" :style="monacoEditorStyle"></div>
</template>
<script setup lang="ts">
import { useMonacoEditor } from '@/hooks/useMonacoEditor'
import { onMounted, computed, watch } from 'vue'

const props = withDefaults(defineProps<{
    width?: string | number,
    height?: string | number,
    language?: string,
    editorOption?: Object,
    modelValue: string
}>(), {
    width: '100%',
    height: '100%',
    language: 'javascript',
    editorOption: () => ({}),
    modelValue: ''
})

const emits = defineEmits<{
    (e: 'blue'): void,
    (e: 'update:modelValue', val: string): void
}>()

const monacoEditorStyle = computed(() => {
    return {
        width: typeof props.width === 'string' ? props.width : props.width + 'px',
        height: typeof props.height === 'string' ? props.height : props.height + 'px'
    }
})

const { monacoEditorRef, createEditor, updateVal, updateOptions, getEditor } = useMonacoEditor(props.language)

onMounted(() => {
    const monacoEditor = createEditor(props.editorOption)
    updateMonacoVal(props.modelValue)
    monacoEditor?.onDidChangeModelContent(() => {
        emits('update:modelValue', monacoEditor!.getValue())
    })
    monacoEditor?.onDidBlurEditorText(() => {
        emits('blue')
    })
})

watch(() => props.modelValue, () => {
    updateMonacoVal(props.modelValue)
})

function updateMonacoVal(val: string) {
    if (val !== getEditor()?.getValue()) {
        updateVal(val)
    }
}

defineExpose({ updateOptions })
</script>