<template>
    <component :is="containerName ? containerName : OuterContainer.Dialog" v-model="visible" :destroy-on-close="true"
        :title="title ? title : type == OperateType.ADD ? '新增' : '编辑'" :size="size" :width="width" @close="onClose">
        <!-- 插槽 -->
        <slot name="header"></slot>
        <el-form ref="dynamicForm" :model="form" label-width="120px" label-position="top" :rules="formRules"
            v-show="!hideForm">
            <el-row :gutter="16">
                <template v-for="item in cloneFormConfig" :key="item.prop">
                    <el-col :span="item.col ? item.col : (col ? 12 : 24)" v-if="ifShow(item, form)">
                        <el-form-item :label="item.label" :prop="item.prop">
                            <component :is="item.type" v-model="form[item.prop]" :placeholder="item.placeholder || ''"
                                v-bind="getItemProps(item)" :style="item?.style || {}"
                                v-if="item.type !== 'el-select' && !item.slot" :options="item.options"
                                v-on="eventScheduler(item)">
                            </component>

                            <!-- 插槽、插槽名为prop -->
                            <slot v-if="item.slot" :name="item.prop" :form="form" :column="item"></slot>

                            <!-- 虚拟滚动 -->
                            <el-select-v2 v-if="item.type === 'el-select' && !item.slot && item.virtual"
                                v-model="form[item.prop]" :placeholder="item.placeholder || ''"
                                v-bind="getItemProps(item)" :style="item?.style || { width: '100%' }"
                                :options="item.options || []" v-on="eventScheduler(item)" />

                            <!-- select单独处理option -->
                            <el-select v-if="item.type === 'el-select' && !item.slot && !item.virtual"
                                v-model="form[item.prop]" :placeholder="item.placeholder || ''"
                                v-bind="getItemProps(item)" v-on="eventScheduler(item)"
                                :style="item?.style || { width: '100%' }">
                                <el-option v-for="(option, oIndex) in item.options" :key="oIndex" :label="option.label"
                                    :value="option.value" :disabled="option.disabled" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </template>
            </el-row>
        </el-form>

        <!-- 插槽 -->
        <slot name="content"></slot>

        <template #footer>
            <slot name="footer">
                <el-space>
                    <el-button @click="onClose">取消</el-button>
                    <el-button type="primary" @click="onSubmit" :loading="loading">确定</el-button>
                </el-space>
            </slot>
        </template>
    </component>
</template>

<script setup lang="ts">
import { nextTick, ref, unref, watch } from "vue";
import { OperateType, OuterContainer } from "../interface";
import { resMessage, isArray, deepClone, isObject } from "../utils";


interface Option {
    label: string;
    value: string | number,
    disabled?: boolean
}

interface ConfigFun {
    getFormConfigByProp: (prop: string) => FormItem | undefined;
    updateFormConfig: (config: FormItem) => void;
    fetchSignAsyncOption: (config: FormItem, value?: any) => void
}
interface Events {
    [key: string]: (e: Event | string, form: any, { getFormConfigByProp, updateFormConfig, fetchSignAsyncOption }: ConfigFun) => void | string[]
}

export interface FormItem {
    type: string;
    label: string;
    prop: string;
    placeholder?: string;
    validate?: boolean;
    rules?: any[];
    props?: Record<string, any> | ((form: any, type: OperateType | undefined, { getFormConfigByProp, updateFormConfig, fetchSignAsyncOption }: ConfigFun) => Record<string, any>);
    style?: object;
    slot?: boolean;
    virtual?: boolean;
    col?: number | string;
    events?: Events,
    display?: boolean;
    vIf?: (form: any, item: FormItem, type: OperateType | undefined, formConfig: FormItem[]) => boolean;
    vShow?: (
        form: any,
        item: FormItem,
        type: OperateType | undefined,
        formConfig: FormItem[],
    ) => boolean;
    asyncOptions?: {
        requestApi: (data: any, formState: any, form: any) => Promise<any>;
        params?: object | string;
        transformResponse?: (data: any, type: OperateType | undefined, item: FormItem, form: any) => any[];
    };
    options?: Option[];
}

//传了 requestApi就会发射一个success事件,否则发射一个onSubmit事件，编辑时需要传入formState
interface Props {
    formConfig: FormItem[];
    type?: OperateType;
    width?: string;
    labelCol?: any;
    formState?: any;
    size?: 'large' | 'default' | 'small',
    col?: number | string;
    title?: string;
    containerName?: OuterContainer,
    hideForm?: boolean;
    requestApi?: {
        add?: (data: any) => Promise<any>;
        edit?: (data: any) => Promise<any>;
        disposeCallback?: (data: any, type: OperateType) => any;//新增请求前处理数据的回调
    };
}

const visible = ref(false);
const loading = ref(false);
const dynamicForm = ref();
const formRules = ref({});
const form: any = ref({});
const prop = defineProps<Props>();
const emit = defineEmits(["onSubmit", "success", "onCloseForm"]);
const optionEnum = ['el-tree-select', 'el-select', 'el-cascader']
const cloneFormConfig = ref<FormItem[]>(deepClone(prop.formConfig) as FormItem[])

/**
  * 获取表单值
  */
const getFormData = () => {
    return form.value;
};

/**
 * 修改 form 的键值
 */
const updateFormData = (value: any, key: string) => {
    form.value[key] = value
}


/**
 * 获取单个表单配置的props
 * @param item
 */
const getItemProps = (item: FormItem) => {
    return isFunction(item.props) ? item.props(form, prop.type, { getFormConfigByProp, updateFormConfig, fetchSignAsyncOption }) : item.props;
};

/**
 * 根据prop获取formConfig
 * @param prop
 */
const getFormConfigByProp = (prop: string) => {
    return cloneFormConfig.value.find(k => k.prop === prop)
}

/**
 * 更新config
 * @param config
 */
const updateFormConfig = (config: FormItem | FormItem[]) => {
    let resetRule = false
    function update(item: FormItem) {
        let matchConfig = cloneFormConfig.value.find(k => k.prop === item.prop)
        if (matchConfig) {
            matchConfig = item
            if (item.validate) {
                formRules.value[item.prop] = item.rules
                resetRule = true
            }
        }
    }
    if (isObject(config)) {
        update(config as FormItem)
    }
    if (Array.isArray(config)) {
        config.forEach(item => {
            update(item)
        })
    }
    if (resetRule) {
        setTimeout(() => {
            const fields = dynamicForm.value.fields
            fields.forEach(field => {
                if (!field.fieldValue) field.clearValidate()
            })
        })
    }
}
/**
* 处理事件
* @param item
* @param form
*/
const eventScheduler = (item: FormItem) => {
    const obj: any = {};
    if (item.events && isObject(item.events)) {
        for (let i in item.events) {
            const event = item.events[i];
            if (event) {
                obj[i] = (e: Event | string) => {
                    const propArray = event(e, form, { getFormConfigByProp, updateFormConfig, fetchSignAsyncOption });
                    if (Array.isArray(propArray)) {
                        propArray.forEach(prop => {
                            const match = cloneFormConfig.value.find(k => k.prop === prop)
                            if (match) fetchSignAsyncOption(match)
                        })
                    }
                };
            }
        }
    }
    return obj;
};

/**
* 显隐控制
* @param item
* @param form
*/
const ifShow = (item: FormItem, form: any) => {
    if (item['vIf']) {
        const v = item['vIf'](form, item, prop.type, cloneFormConfig.value);
        if (v && form[item.prop] == null) {
            if (
                optionEnum.includes(item.type) &&
                item.props &&
                getItemProps(item)?.mode === 'multiple'
            ) {
                form[item.prop] = [];
            } else {
                form[item.prop] = '';
            }
        }
        if (!v && form[item.prop] != null) {
            delete form[item.prop];
        }
        if (v && !item.display) {
            fetchSignAsyncOption(item);
            item.display = true
        }
        if (!v) item.display = false
        return v;
    }
    if (item['vShow']) {
        return item['vShow'](form, item, prop.type, cloneFormConfig.value);
    }
    return true;
};

const fetchSignAsyncOption = async (item: FormItem, value?: any) => {
    if (item?.asyncOptions && optionEnum.includes(item.type)) {
        try {
            const params = value ? value : (item.asyncOptions.params || {});
            const response = await item.asyncOptions.requestApi(params, prop.formState, form);
            const transformedData = item.asyncOptions.transformResponse
                ? item.asyncOptions.transformResponse(response, prop.type, item, form)
                : response;
            item.options = transformedData;
        } catch (error) {
            console.error('Error fetching options of CustomForm:', error);
        }
    }
};
/**
 * 异步请求select的options
 */
const fetchAsyncOptions = async (formState: any, formConfig: FormItem[]) => {
    if (!formConfig) return;
    for (const item of formConfig) {
        if (item?.asyncOptions && optionEnum.includes(item.type)) {
            try {
                const params = item.asyncOptions.params || {};
                const response = await item.asyncOptions.requestApi(params, formState, form);
                const transformedData = item.asyncOptions.transformResponse
                    ? item.asyncOptions.transformResponse(response, prop.type, item, form)
                    : response;
                item.options = transformedData;
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        }
    }
};

// 初始化表单校验规则
const initRules = () => {
    if (!prop.formConfig) return;
    prop.formConfig.forEach((item) => {
        if (item.validate) {
            formRules.value[item.prop] = item.rules;
        }
    });
};

/**
 * 关闭
 */
const onClose = () => {
    unref(dynamicForm)!.resetFields();
    loading.value = false;
    visible.value = false;
    form.value = {}
    emit('onCloseForm');
};

/**
 * 提交
 */
const onSubmit = () => {
    unref(dynamicForm)!.validate((valid) => {
        if (valid) {
            if (prop.requestApi) {
                loading.value = true
                try {
                    if (prop.type === OperateType.ADD) {
                        const formData = prop.requestApi?.disposeCallback
                            ? prop.requestApi?.disposeCallback(convertFormarter(unref(form)), prop.type)
                            : convertFormarter(unref(form));
                        prop.requestApi.add && prop.requestApi.add(formData).then((res: any) => {
                            loading.value = false
                            if (resMessage(res)) {
                                onClose();
                                emit("success", { ...formData, response: res });
                            }
                        }).catch((err) => {
                            console.error(err);
                            loading.value = false
                        });
                        return;
                    }
                    const editFormData = { ...prop.formState, ...unref(form) }
                    const formData = prop.requestApi?.disposeCallback
                        ? prop.requestApi?.disposeCallback(convertFormarter(editFormData), prop.type as OperateType)
                        : convertFormarter(unref(editFormData));
                    prop.requestApi
                        .edit && prop.requestApi
                            .edit(formData)
                            .then((res) => {
                                loading.value = false
                                if (resMessage(res)) {
                                    onClose();
                                    emit('success', { ...formData, response: res });
                                } else {
                                    loading.value = false;
                                }
                            }).catch((err) => {
                                console.error(err);
                                resMessage(err);
                                loading.value = false
                            });;
                    return;
                } catch (_error) {
                    console.error(_error);
                    loading.value = false;
                }
            }
            emit("onSubmit", unref(form));
        }
    });
};

/**
 * 数据处理
 */
const convertFormarter = (from_: any) => {
    if (!isObject(from_)) return
    const cloneForm: any = deepClone(from_);
    for (let i in cloneForm) {
        if (isArray(cloneForm[i])) {
            cloneForm[i] = cloneForm[i].join(",");
        }
    }
    return cloneForm;
};

watch(visible, (v) => {
    if (v) {
        initRules();
        fetchAsyncOptions(prop.formState, cloneFormConfig.value);
        if (prop.type === OperateType.EDIT && prop.formState) {
            prop.formConfig.forEach((item: any) => {
                if (item?.props && item.props?.multiple) {
                    form.value[item.prop] = prop.formState![item.prop] ? prop.formState![item.prop].split(',') : prop.formState![item.prop];
                    return
                }
                form.value[item.prop] = prop.formState![item.prop];
            })
            return
        }
        nextTick(() => {
            unref(dynamicForm)!.resetFields();
            form.value = {}
            prop.formConfig.map(item => {
                const props = getItemProps(item);
                if (item.props && props.defaultValue) {
                    if (isFunction(props.defaultValue)) {
                        form.value[item.prop] = props.defaultValue(item);
                        return;
                    }
                    form.value[item.prop] = props.defaultValue;
                }
            })
        })

    }
});

/**
 *
 * @param value
 */
const isFunction = (value: unknown): value is (...args: any) => any =>
    typeof value === 'function';

defineExpose({
    visible,
    loading,
    dynamicForm,
    getFormData,
    updateFormData
});
</script>

<style scoped></style>
