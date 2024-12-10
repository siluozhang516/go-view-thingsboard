<template>
    <el-dialog v-model="visible" title="添加键名筛选器" width="50%">
        <div class="dialog-content">
            <el-form :inline="true" :model="formState" :rules="rules" label-position="top" status-icon ref="formRef">
                <el-form-item label="键类型" :style="{ width: caleWidth }" prop="type">
                    <el-select v-model="formState.type" placeholder="键类型" :disabled="!editStatus">
                        <el-option v-for="option in keyTypeOptions" :key="option.value" :label="option.label"
                            :value="option.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="键名" :style="{ width: caleWidth }" prop="key">
                    <el-input v-model="formState.key" placeholder="键名" :disabled="!editStatus" />
                </el-form-item>
                <el-form-item label="值类型" :style="{ width: caleWidth }" prop="valueType">
                    <el-select v-model="formState.valueType" placeholder="值类型" @change="changeValueType"
                        :disabled="!editStatus">
                        <el-option v-for="option in valueTypeOptions" :key="option.value" :label="option.label"
                            :value="option.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="值" :style="{ width: caleWidth }" prop="value"
                    v-if="formState.type === EntityKeyType.CONSTANT">
                    <el-input v-model="formState.value" placeholder="值" :disabled="!editStatus" />
                </el-form-item>
            </el-form>
            <el-card :body-style="{ padding: '0 16px' }" shadow="never" v-if="formState.valueType">
                <el-collapse v-model="activeNames" style="border: unset">
                    <el-collapse-item :name="1" title="筛选器">
                        <ConfigValue :valueType="formState.valueType" ref="configValueRef" :condition="condition" />
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onClose">取消</el-button>
                <el-button type="primary" @click="onSave" :disabled="!editStatus">保存</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, unref, watch, inject, nextTick } from "vue";
import { keyTypeOptions, valueTypeOptions } from "./Config";
import { EntityKeyType, OperationSige } from "./type";
import ConfigValue from "./ConfigValue.vue";
import { ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from 'element-plus'

const rules = reactive<FormRules>({
    key: [
        {
            required: true,
            message: '请填写键名',
            trigger: 'blur',
        },
    ],
    type: [
        {
            required: true,
            message: '请选择键类型',
            trigger: 'change',
        },
    ],
    valueType: [
        {
            required: true,
            message: '请选择值类型',
            trigger: 'change',
        },
    ],
    value: [
        {
            required: true,
            message: '请填写值',
            trigger: 'blur',
        },
    ],
}
)

const visible = ref(false);
const activeNames = ref(1);
const configValueRef = ref();
const formRef = ref<FormInstance>()
const condition = inject("condition");
const editStatus = inject("editStatus");

const caleWidth = computed(() => {
    if (formState.type === EntityKeyType.CONSTANT) return "20%";
    else return "27%";
});

const emit = defineEmits(["updateCondition"]);

const props = defineProps<{ operateType: OperationSige }>()

const formState = reactive({
    key: "",
    type: EntityKeyType.ATTRIBUTE,
    valueType: "",
    value: "",
});


/**
 * 更改值的类型
 */
const changeValueType = () => {
    if (
        unref(configValueRef) &&
        unref(configValueRef).getPredicatesValues().length
    ) {
        ElMessageBox.confirm(
            "如果您确认新的值类型，所有输入的键过滤器将被删除。",
            "确定要更改键值类型吗？",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customStyle: { padding: "24px" },
            }
        ).then(() => {
            unref(configValueRef).resetPredicates();
        });
    } else if (props.operateType === OperationSige.ADD) {
        nextTick(() => {
            unref(configValueRef) && unref(configValueRef).resetPredicates();
        })
    }
};

const onClose = () => {
    visible.value = false
    if (props.operateType === OperationSige.ADD) {
        unref(configValueRef) && unref(configValueRef).resetPredicates();
        resetForm()
    }
}

/**
 * 表单重置
 */
const resetForm = () => {
    unref(formRef)?.resetFields()
    formState.key = ''
    formState.type = EntityKeyType.ATTRIBUTE
    formState.valueType = ''
    formState.value = ''
}

/**
 * 保存
 */
const onSave = () => {
    if (!unref(formRef)) return
    unref(formRef)!.validate((valid) => {
        if (valid) {
            const { type, key, valueType, value } = formState;
            // 更新
            const conditionList = unref(unref(configValueRef))
                .getPredicatesValues()
                .map((item: any) => ({
                    key: { type, key },
                    predicate: item,
                    value,
                    valueType,
                }));
            emit("updateCondition", ref(conditionList));
            onClose()
        }
    })

};


watch(() => props.operateType, (v) => {
    if (v === OperationSige.ADD) {
        resetForm()
        nextTick(() => {
            unref(configValueRef) && unref(configValueRef).resetPredicates();
        })
    }
}, { immediate: true })

watch(
    () => condition,
    (v: any) => {
        if (v.value.length) {
            formState.key = v.value[0].key.key;
            formState.type = v.value[0].key.type;
            formState.valueType = v.value[0].valueType;
            formState.value = v.value[0].value;
        }
    },
    { deep: true, immediate: true }
);
defineExpose({
    visible,
});
</script>

<style scoped>
.dialog-content {
    padding: 24px 10px;
}
</style>
