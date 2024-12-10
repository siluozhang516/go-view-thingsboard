<template>
    <el-dialog v-model="visible" title="编辑附加信息" width="45%">
        <el-input v-model="alarmDetails" :rows="8" :disabled="!editStatus" type="textarea"
            placeholder="请在此处提供评论和调整，以便在附加信息下的告警详情中显示" />
        <span class="tip">提示: 使用 ${keyName} 来替代告警规则条件中使用的属性或遥测键的值。
        </span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onClose">取消</el-button>
                <el-button type="primary" @click="onSave">保存</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, inject } from 'vue';


const visible = ref(false);
const alarmDetails = ref('');


const emit = defineEmits(['updateAlarmDetails'])
interface Detail {
    alarmDetails: string
}

const props = defineProps<Detail>()
const editStatus = inject("editStatus");

watch(() => props.alarmDetails, (v: any) => {
    if (v != null) alarmDetails.value = v
}, { deep: true, immediate: true })


defineExpose({
    visible
})

const onSave = () => {
    emit('updateAlarmDetails', alarmDetails.value)
    onClose()
}

const onClose = () => {
    visible.value = false
    alarmDetails.value = ''
}
</script>

<style scoped>
.tip {
    color: rgba(0, 0, 0, 0.65);
    margin-top: 10px;
    display: inline-block;
}
</style>