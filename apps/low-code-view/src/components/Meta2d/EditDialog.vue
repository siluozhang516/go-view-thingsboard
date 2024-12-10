<template>
    <el-dialog v-model="dialogVisible" :title="title" width="800">
        <MonacoEditor :height="500" ref="MonacoEditRef" v-model="editJson" language="json" />
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleConfirm">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import MonacoEditor from '@/components/Meta2d/MonacoEditor.vue'
import { computed, ref } from 'vue';


const MonacoEditRef = ref<InstanceType<typeof MonacoEditor>>()

let props = withDefaults(defineProps<{
    visible: boolean,
    title?: string,
    modelValue: string
}>(), {
    visible: false,
    modelValue: '',
    title: ''
})

const emit = defineEmits(['update:visible', 'update:modelValue', 'done'])

const dialogVisible = computed({
    get() {
        return props.visible
    },
    set(val) {
        emit("update:visible", val)
    }
})

const editJson = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit("update:modelValue", val)
    }
})

function handleConfirm() {
    dialogVisible.value = false
    emit('done', editJson.value)
}
</script>