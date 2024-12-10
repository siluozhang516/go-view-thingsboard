<template>
    <el-dialog append-to-body @open="open" draggable title="绑定变量" width="460px" v-model="visible">
        <el-form ref="ruleForm" :rules="rules" :model="addData" label-width="80px">
            <el-form-item label="数据名称" prop="name">
                <el-input v-model="addData.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="数据ID" prop="key">
                <el-input v-model="addData.key" placeholder="请输入" />
            </el-form-item>
        </el-form>
        
        <!-- <div class="prl-10 mb-15 bind-data-box">
            <span>当前绑定：</span>
            <span>{{ defaultCheckedKeys.join() || '无' }}</span>
        </div>
        <div class="prl-10">
            <el-input class="mb-15" v-model="query" placeholder="输入关键字进行搜索" :suffix-icon="Search"
                @input="onQueryChanged" clearable @clear="onQueryChanged('')" />
            <el-tree-v2 :class="{ sigleCheck: !showCheckbox }" ref="treeRef" @check-change="onCheckChange" showCheckbox
                :data="treeData" :props="treeProps" :filter-method="filterMethod" @node-click="onNodeClick"
                empty-text="暂无数据" :height="400" />
        </div> -->

        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { getData, type DataTree } from '@/api/data'
import { onMounted, ref, computed, watchEffect, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { deepClone } from '@meta2d/core';

let treeData: DataTree[] = []
const treeRef = ref()

const treeProps = {
    value: 'id',
    label: 'name',
    children: 'children',
}
const query = ref('')
const checkNodes = ref<any[]>([])

const props = withDefaults(defineProps<{
    modelValue: boolean,
    showCheckbox: boolean,
    select: Array<{ dataId: string, name: string }>
}>(), {
    modelValue: false,
    showCheckbox: false,
    select: () => []
})


const emit = defineEmits(['update:modelValue', 'update'])

let visible = computed({
    get: () => props.modelValue,
    set: (val) => {
        emit('update:modelValue', val)
    }
})

const defaultCheckedKeys = computed(() => {
    return props.select.map(item => item.dataId)
})

const ruleForm = ref()
const addData = reactive({
    name: '',
    key: ''
})
const checkDataId = (rule: any, value: string, cb: any) => {
    // 校验 value 是否为数字和字母
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
        cb(new Error('只能输入数字和字母'))
    } else {
        cb()
    }
}
const rules = reactive({
    name: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    key: [
        { required: true, message: '请输入', trigger: 'blur' },
        { validator: checkDataId, trigger: 'blur' }
    ]
})

onMounted(() => {
    // getData().then((data: any) => {
    //     treeData = data
    // })
})

watchEffect(() => {
    checkNodes.value = props.select.map(item => {
        return {
            id: item.dataId,
            name: item.name
        }
    })
})

const open = () => {
    query.value = ""
    // onQueryChanged('')
    // treeRef.value!.setCheckedKeys(checkNodes.value.map(it => it.id))
}

/** tree过滤 */
const filterMethod = (query: string, node: any) => {
    return node.name!.includes(query)
}
/** 搜索 */
const onQueryChanged = (query: string) => {
    treeRef.value!.filter(query)
}
/** 勾选改变 */
const onCheckChange = (data: any, checked: boolean) => {
    let selectNodes = treeRef.value!.getCheckedNodes()
    checkNodes.value = selectNodes.filter((it: any) => !it.children)
}
/** 确定 */
const handleSubmit = () => {
    // emit('update', deepClone(checkNodes.value.map(item => ({ dataId: item.id, name: item.name }))))

    ruleForm.value.validate((valid: boolean) => {
        if (valid) {
            emit('update', [{ dataId: addData.key, name: addData.name }])

            ruleForm.value.resetFields()
            visible.value = false
        }
    })
}
/** 点击节点 */
const onNodeClick = (data: any) => {
    if (!props.showCheckbox) {
        treeRef.value.setCheckedKeys([])
        if (data.children) return false
        treeRef.value.setChecked(data.id, true)
        checkNodes.value = [data]
    }
}
</script>

<style scoped>
.prl-10 {
    padding: 0 10px;
}

.mb-15 {
    margin-bottom: 15px;
}

.bind-data-box {
    display: flex;
    align-items: baseline;
}

.bind-data-box>span:nth-child(1) {
    flex-shrink: 0;
    flex-basis: 70px;
}

.sigleCheck :deep(.is-checked + .el-tree-node__label) {
    background: rgb(59, 134, 233);
    color: #fff;
    padding: 0 5px;
}

.sigleCheck :deep(.el-checkbox) {
    display: none;
}
</style>