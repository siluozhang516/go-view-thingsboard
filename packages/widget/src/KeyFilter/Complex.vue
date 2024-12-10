<template>
    <el-dialog v-model="visible" title="复合筛选器" width="50%">
        <el-form ref="formRef" :model="form" label-position="top">
            <el-form-item label="操作">
                <el-select v-model="form.operation" placeholder="请选择" :disabled="!editStatus">
                    <el-option v-for="option in complexOptions" :key="option.value" :label="option.label"
                        :value="option.value" />
                </el-select>
            </el-form-item>
        </el-form>
        <el-card :body-style="{ padding: '0 16px' }" shadow="never">
            <el-collapse v-model="activeNames" style="border: unset">
                <el-collapse-item :name="1" title="筛选器">
                    <ConfigValue :valueType="valueType" ref="configValueRef" :condition="currentConditions"
                        @onChange="onChangeCondition" />
                </el-collapse-item>
            </el-collapse>
        </el-card>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onClose">取消</el-button>
                <el-button type="primary" @click="onSave" :disabled="!editStatus || disabledSave">保存</el-button>
            </span>
        </template>
    </el-dialog>

</template>

<script setup lang="ts">
import { inject, reactive, ref, unref, watch } from 'vue';
import { ComplexOperation, EntityKeyValueType } from './type'
import { complexOptions } from './Config'
import ConfigValue from "./ConfigValue.vue";
import {deepClone} from './utils'

const form = reactive({ operation: ComplexOperation.AND, type: 'COMPLEX' })
const activeNames = ref(1);
const visible = ref(false)
const formRef = ref()
const configValueRef = ref()
const editStatus = inject("editStatus");
const disabledSave = ref(false)
const currentConditions = ref([])

interface Props {
    valueType?: EntityKeyValueType | string;
    complexData: any
}
const props = withDefaults(defineProps<Props>(), {
    valueType: EntityKeyValueType.STRING,
    complexData: {
        operation: ComplexOperation.AND,
        predicates: []
    }
});



const emit = defineEmits(['updateComplexData', 'onClose'])

watch(() => props.complexData, (v) => {
    form.operation = v.operation;
    form.type = v.type;
    currentConditions.value = deepClone(v.predicates) || []
}, { deep: true, immediate: true })

const onSave = () => {
    emit('updateComplexData', { ...form, predicates: unref(configValueRef).getPredicatesValues() })
    onClose()
}

const onChangeCondition = (v:any[]) => {
    if (v.length) {
        disabledSave.value = false
        return
    }
    disabledSave.value = true

}

const onClose = () => {
    visible.value = false
    emit('onClose', visible)
}

defineExpose({
    visible
})

</script>

<style scoped></style>