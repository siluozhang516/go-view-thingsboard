<template>
    <el-dialog v-model="visible" title="编辑告警日程表" width="50%">
        <div class="dialog-content">
            <el-form ref="formRef" :model="form" label-position="top" :rules="rules">
                <el-form-item label="类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择类型" :disabled="!editStatus">
                        <el-option :label="option.label" :value="option.value" v-for="option in scheduleTypeOptions"
                            :key="option.value" />
                    </el-select>
                </el-form-item>
                <!--  SPECIFIC_TIME-->
                <el-form-item label="时区" prop="timezone" v-if="form.type === AlarmScheduleType.SPECIFIC_TIME">
                    <el-select v-model="form.timezone" placeholder="请选择时区" :disabled="!editStatus">
                        <el-option label="Asia/Shanghai (UTC+08:00)" value="Asia/Shanghai (UTC+08:00)" />
                    </el-select>
                </el-form-item>

                <!-- !ANY_TIME -->
                <el-form-item v-if="form.type !== AlarmScheduleType.ANY_TIME">
                    <el-card :body-style="{ padding: '0 16px' }" shadow="never" style="margin-top: 10px; width: 100%">
                        <el-collapse style="border: unset; width: 100%">
                            <el-collapse-item title="动态值" :name="1">
                                <el-row :gutter="16">
                                    <el-col :span="12">
                                        <el-select v-model="form.dynamicValue.sourceType" placeholder="动态源类型"
                                            :disabled="!editStatus">
                                            <el-option :label="option.label" :value="option.value"
                                                v-for="option in dynamicValueOptions" :key="option.value" />
                                        </el-select>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-input v-model="form.dynamicValue.sourceAttribute" placeholder="源属性"
                                            :disabled="!editStatus" />
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                        </el-collapse>
                    </el-card>
                </el-form-item>

                <!--  SPECIFIC_TIME-->
                <el-form-item label="天" prop="daysOfWeek" v-if="form.type === AlarmScheduleType.SPECIFIC_TIME">
                    <el-checkbox-group v-model="form.daysOfWeek" :disabled="!editStatus">
                        <el-checkbox :value="item.value" v-for="item in specificTimeOption">{{ item.label
                            }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="时间" required v-if="form.type === AlarmScheduleType.SPECIFIC_TIME">
                    <el-col :span="11">
                        <el-form-item prop="startsOn">
                            <el-time-picker v-model="form.startsOn" type="date" value-format="x" placeholder="开始时间"
                                :disabled-seconds="disabledSeconds" style="width: 100%" format="HH:mm"
                                :disabled="!editStatus" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" style="text-align: center">
                        <span>-</span>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="endsOn">
                            <el-time-picker v-model="form.endsOn" placeholder="结束时间" value-format="x"
                                :disabled-seconds="disabledSeconds" style="width: 100%" format="HH:mm"
                                :disabled="!editStatus" />
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <!--  CUSTOM-->
                <el-form-item label="天" required v-if="form.type === AlarmScheduleType.CUSTOM">
                    <el-row :gutter="16" v-for="item in form.items" :key="item.dayOfWeek">
                        <el-col :span="4" style="margin-bottom: 20px">
                            <el-form-item prop="enabled">
                                <el-checkbox v-model="item.enabled" :disabled="!editStatus" @change="changeCheckbox">
                                    {{ mapDataPicker[item.dayOfWeek] }}
                                </el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item prop="startsOn">
                                <el-time-picker v-model="item.startsOn" value-format="x" placeholder="开始时间"
                                    :disabled-seconds="disabledSeconds" :default-value="[0]" format="HH:mm"
                                    :disabled="!editStatus" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item prop="endsOn">
                                <el-time-picker v-model="item.endsOn" value-format="x" placeholder="结束时间" format="HH:mm"
                                    :disabled="!editStatus" :disabled-seconds="disabledSeconds" :default-value="[0]" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="onSave" :disabled="!editStatus">保存</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch, inject, unref } from "vue";
import {
    scheduleTypeOptions,
    dynamicValueOptions,
    specificTimeOption,
} from "./Config";
import type { FormInstance, FormRules } from "element-plus";
import { AlarmScheduleType,AlarmSchedule } from "./type";
import { mappingTimeLabel } from "./utils";
import dayjs from "dayjs";



const validateEnabled = (_rule: any, _v: any, callback: any) => {
    const enabledItem = form.items.find((k: { enabled: any; }) => k.enabled)
    if (enabledItem) {
        callback()
        return
    }
    callback(new Error('请选择星期'))
}

const rules = reactive<FormRules>({
    type: [
        {
            required: true,
            message: "请选择类型",
            trigger: "change",
        },
    ],
    timezone: [
        {
            required: true,
            message: "请选择时区",
            trigger: "change",
        },
    ],
    daysOfWeek: [
        {
            required: true,
            message: "请选择天",
            trigger: "change",
        },
    ],
    startsOn: [
        {
            required: true,
            message: "请选择开始时间",
            trigger: "change",
        },
    ],
    endsOn: [
        {
            required: true,
            message: "请选择结束时间",
            trigger: "change",
        },
    ],
    enabled: [
        {
            validator: validateEnabled,
            trigger: "change",
        },
    ],
});

const visible = ref(false);
const formRef = ref<FormInstance>();
const props = defineProps<{ schedule: AlarmSchedule | null }>();

const editStatus = inject("editStatus");

const form: any = reactive({
    type: AlarmScheduleType.ANY_TIME,
    timezone: "",
    daysOfWeek: [],
    startsOn: 0,
    endsOn: 0,
    dynamicValue: {
        sourceAttribute: "",
        sourceType: "",
    },
    items: [
        {
            enabled: true,
            dayOfWeek: 1,
            startsOn: 0,
            endsOn: 0,
        },
        {
            enabled: false,
            dayOfWeek: 2,
            startsOn: 0,
            endsOn: 0,
        },
        {
            enabled: false,
            dayOfWeek: 3,
            startsOn: 0,
            endsOn: 0,
        },
        {
            enabled: false,
            dayOfWeek: 4,
            startsOn: 0,
            endsOn: 0,
        },
        {
            enabled: false,
            dayOfWeek: 5,
            startsOn: 0,
            endsOn: 0,
        },
        {
            enabled: false,
            dayOfWeek: 6,
            startsOn: 0,
            endsOn: 0,
        },
        {
            enabled: false,
            dayOfWeek: 7,
            startsOn: 0,
            endsOn: 0,
        },
    ],
});

const mapDataPicker = mappingTimeLabel();

const emit = defineEmits(["updateSchedule"]);

const onSave = () => {
    if (!unref(formRef)) return
    unref(formRef)!.validate((valid) => {
        if (valid) {
            const val = getMatchFormValue();
            incrementTimestamps(val);
            emit("updateSchedule", val);
            visible.value = false;
        }
    })

};


const changeCheckbox = (v: boolean) => {
    if (v) {
        unref(formRef)?.clearValidate('enabled')
    }
}

const disabledSeconds = () => {
    const result: number[] = []
    for (let i = 1; i <= 59; i++) {
        result.push(i)
    }
    return result
}

const getMatchFormValue = () => {
    if (form.type === AlarmScheduleType.ANY_TIME) {
        return getMatchKey(["type", "dynamicValue"]);
    }
    if (form.type === AlarmScheduleType.SPECIFIC_TIME) {
        return getMatchKey([
            "type",
            "daysOfWeek",
            "dynamicValue",
            "startsOn",
            "endsOn",
            "timezone",
        ]);
    }
    return getMatchKey(["type", "items", "dynamicValue", "timezone"]);
};

const getMatchKey = (keys: string[]) => {
    return keys.reduce((acc, key) => {
        if (form.hasOwnProperty(key)) {
            if (key === "dynamicValue" && !form[key].sourceType) {
                acc[key] = null;
            } else {
                acc[key] = JSON.parse(JSON.stringify(form[key]));
            }
        }
        return acc;
    }, {} as any);
};

/**
 * 对所有时间进行处理，转成时分的时间戳或者年月日时分的时间戳
 * @param obj
 * @param add
 */
const incrementTimestamps = (obj: any, add?: boolean) => {
    function traverse(item: any) {
        if (typeof item === "object" && item !== null) {
            Object.keys(item).forEach((key) => {
                const value = item[key];
                if (typeof value === "object" && value !== null) {
                    traverse(value);
                } else if (
                    (key === "startsOn" || key === "endsOn") &&
                    typeof value === "number"
                ) {
                    if (item[key]) {
                        if (add) {
                            item[key] += dayjs().startOf("day").valueOf();
                        } else {
                            item[key] -= dayjs().startOf("day").valueOf();
                        }
                    }
                }
            });
        }
    }

    if (Array.isArray(obj)) {
        obj.forEach(traverse);
    } else {
        traverse(obj);
    }
};

watch(
    () => props.schedule,
    (schedule: any) => {
        if (!schedule) return;
        for (let i in schedule) {
            if (i === "dynamicValue" && schedule[i] == null) {
                form[i] = {
                    sourceAttribute: "",
                    sourceType: "",
                };
            } else {
                form[i] = JSON.parse(JSON.stringify(schedule[i]));
            }
        }
        incrementTimestamps(form, true);
    },
    { deep: true, immediate: true }
);

defineExpose({
    visible,
});
</script>

<style scoped>
.time-picker {
    display: flex;
    align-items: center;

    span {
        margin-right: 10px;
    }
}

.dialog-content {
    padding: 24px 8px;
}

:deep(.el-collapse-item__header) {
    border-bottom: unset;
}
</style>
