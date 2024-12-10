<template>
    <el-dialog v-model="dialogVisible" destroy-on-close append-to-body :title="title" width="800">
        <MonacoEditor :height="500" ref="MonacoEditRef" v-model="editJson" :language="language" />
        <div v-if="tip.title"> {{ tip.title }}</div>
        <strong v-if="tip.subTitle">
            例如：
            <code>
                {{ tip.subTitle }}
           </code>
        </strong>
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
    modelValue: string,
    title?: string,
    language?: string,
    tip?: any
}>(), {
    visible: false,
    modelValue: '',
    title: '',
    tip: () => ({})
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