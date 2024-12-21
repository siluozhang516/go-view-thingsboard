<template>
    <Form :type="OperateType.ADD" :formConfig="formConfig" :col="12" title="数据源配置" ref="aliasFormRef"
        @onSubmit="onSubmit" :hideForm="active === 1 ? false : true" @onCloseForm="close">
        <template #header>
            <el-steps :active="active" finish-status="finish" simple style="margin-bottom:20px">
                <el-step title="数据源" :icon="Edit" />
                <el-step title="属性" :icon="Edit" />
            </el-steps>
        </template>

        <template #content>
            <el-card shadow="never" class="table-content" v-if="active === 2">
                <template #header>
                    <div class="card-header">
                        <span>数据键</span>
                    </div>
                </template>
                <pure-table row-key="id" :header-cell-style="{
                    background: 'var(--el-fill-color-light)',
                    color: 'var(--el-text-color-primary)'
                }" :data="dataList" :columns="columns">
                    <template #empty>
                        <img src="../assets/empty.svg" alt="" style="vertical-align:middle;">
                    </template>
                    <template #append>
                        <el-button plain class="add-button" @click="onAdd" :icon="Plus">
                            添加数据
                        </el-button>
                    </template>
                    <template #operation="{ row }">
                        <el-button link type="primary" @click="onDel(row)" :icon="Delete" />
                    </template>
                </pure-table>
            </el-card>

            <div class="pagination" v-if="active === 2">
                <div>默认页面大小</div>
                <el-input-number v-model="pageLink.pageSize" :min="1" controls-position="right"/>
            </div>
        </template>

        <template #footer>
            <el-space>
                <el-button @click="aliasFormRef.visible = false">取消</el-button>
                <el-button type="primary" v-if="active === 2" @click="active = 1">上一步</el-button>
                <el-button type="primary" @click="onSubmit" :loading="loading">{{ active === 1 ? '下一步' : '确定'
                    }}</el-button>
            </el-space>
        </template>
    </Form>
</template>

<script setup lang="ts">
import { OperateType } from '../interface'
import Form from '../components/form.vue'
import { h, reactive, ref, unref } from 'vue';
import { deepClone } from '../utils'
import { useColumns, TimeseriesEnum } from "./columns";
import "@pureadmin/table/dist/style.css";
import { PureTable } from "@pureadmin/table";
import { Delete, Plus, Edit } from '@element-plus/icons-vue'
import thingsboard, { EntitySubscriptionService,FormValue } from "@thingsboard/core";
import { ElOption } from "element-plus";
import attrSvg from '../assets/attribute.svg?url'
import tsSvg from '../assets/timeseries.svg?url'
import { EntityDataKeys,formConfig } from './config'

const { DataKeyType } = thingsboard;



const aliasFormRef = ref()
const active = ref(1)
const keyOptions = ref<any[] | null>(null)
const attrOptions = ref<any>(null)
const loading = ref(false)
const { columns, dataList, onAdd, onDel } = useColumns(keyOptions, attrOptions);
const pageLink = reactive({
    page: 0,
    pageSize: 10
})



const emit = defineEmits(['save'])

/**
 * 查询对应数据源的属性（遥测、服务端属性、实体等）
 */
const getKeysByEntity = () => {
    keyOptions.value = null;
    return new Promise((resolve, reject) => {
        EntitySubscriptionService.findEntityKeysByQuery(
            aliasFormRef.value.getFormData()
        ).subscribe((res) => {
            keyOptions.value = []
            attrOptions.value = {}
            for (let i in res) {
                if (i === 'attribute' || i === 'timeseries') {
                    res[i].forEach(item => {
                        attrOptions.value[item] = i === 'attribute'
                            ? DataKeyType.attribute
                            : DataKeyType.timeseries,
                            keyOptions.value?.push(
                                h(ElOption, {
                                    key: item,
                                    label: item,
                                    value: item,
                                }, () => [
                                    h('img', {
                                        src: i === 'attribute' ? attrSvg : tsSvg,
                                        width: '18px',
                                        height: '18px'
                                    }),
                                    h('span', {
                                        style: {
                                            verticalAlign: 'super',
                                            marginLeft: '16px'
                                        },
                                        innerHTML: item
                                    })
                                ])
                            )
                    })
                }
            }
            resolve(true)
        }, () => {
            reject(false)
        });
    })
}

const onSubmit = () => {
    if (unref(active) === 1) {
        unref(aliasFormRef).dynamicForm.validate(async (valid) => {
            if (valid) {
                loading.value = true
                await getKeysByEntity()
                loading.value = false
                active.value = 2
            }
        })
        return
    }

    emit('save', {
        formState: deepClone(unref(aliasFormRef).getFormData()),
        dataKeys: toDataKey(),
        pageLink
    } as { dataKeys: EntityDataKeys, formState: FormValue, pageLink: thingsboard.EntityDataPageLink })
}


const toDataKey = (): EntityDataKeys => {
    const dataKeys: EntityDataKeys = {
        dataKeys: [],
        latestDataKeys: []
    }
    unref(dataList).forEach(item => {
        if (item.name.length) {
            if (item.type === TimeseriesEnum.LATEST) {
                dataKeys.latestDataKeys.push({
                    type: item.keyType,
                    name: item.name[0]
                })
            } else {
                dataKeys.dataKeys.push({
                    type: item.keyType,
                    name: item.name[0]
                })
            }
        }
    })

    return dataKeys
}

const open = () => {
    unref(aliasFormRef).visible = true
}
const close = () => {
    unref(aliasFormRef).visible = false
    active.value = 1
    dataList.value = []
}

defineExpose({
    open,
    close
})
</script>

<style scoped>
:deep(.el-table__inner-wrapper::before) {
    height: 0;
}

.table-content {
    margin-top: 20px;
}

.add-button {
    width: 100%;
    margin: 10px 0;
}

.pagination{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border:1px solid #e4e7ed;
    border-radius: 4px;
    padding:10px 20px;
    margin-top: 20px;
}
</style>