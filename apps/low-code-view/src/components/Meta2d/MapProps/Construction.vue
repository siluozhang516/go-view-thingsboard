<template>
    <div class="construction-box" v-if="showContr">
        <div class="construction-item" v-for="item in list" :key="item.id">
            <div class="construction-name" @click="handleClick(item)" :class="{ active: active.includes(item.id) }">
                <el-icon class="mr-4">
                    <DataLine />
                </el-icon>
                <span>{{ item.name }}</span>
            </div>
            <div class="construction-icon">
                <el-tooltip :content="lockedTip[item.locked || 0]" placement="top" effect="dark">
                    <svg aria-hidden="true" class="svg-icon" @click="handleLocked(item)">
                        <use :xlink:href="'#' + lockedIcon[item.locked || 0]"></use>
                    </svg>
                </el-tooltip>
                <!-- 显示 -->
                <el-icon class="construction-icon"
                    @click="setValue(item, 'visible', item.visible == undefined ? false : !item.visible)">
                    <view v-if="item.visible === undefined || item.visible === true" />
                    <Hide v-else />
                </el-icon>
            </div>
        </div>

    </div>
    <el-empty v-else description="暂无结构"></el-empty>

</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onUnmounted, nextTick } from 'vue'
import type { Meta2d, Pen } from '@meta2d/core'
import { LockState } from '@meta2d/core'


const active = ref<any[]>([])

let list = ref<Pen[]>([])

const lockedTip:any = reactive({
    [LockState.None]: '可编辑',
    [LockState.DisableEdit]: '禁止编辑',
    [LockState.DisableMove]: '禁止编辑和移动',
    [LockState.Disable]: '禁止所有事件'
})

const lockedIcon:any = reactive({
    [LockState.None]: 'l-unlock',
    [LockState.DisableEdit]: 'l-lock',
    [LockState.DisableMove]: 'l-wufayidong',
    [LockState.Disable]: 'l-jinyong'
})




function changePens() {
    active.value = []
    list.value = []
    nextTick(() => {
        active.value = meta2d.store.active?.map((it: Pen) => it.id) || []
        let pens = meta2d.store.data.pens || []
        let children = pens.map(it => it.children || []).flat()
        children = [...new Set(children)]
        list.value = pens.filter(it => !children.includes(it.id || ''))
    })
}


onMounted(() => {
    changePens()
    meta2d.on("changePens", changePens)
    meta2d.on("active", changePens)
    meta2d.on("inactive", changePens)
})

onUnmounted(() => {
    meta2d.off("changePens", changePens)
    meta2d.off("active", changePens)
    meta2d.off("inactive", changePens)
})

const showContr = computed(() => {
    return list.value.length > 0
})

function setValue(item: any, key: string = 'key', value: any) {
    let pen = {
        id: item.id,
        [key]: value
    }
    item[key] = value
    meta2d.setValue(pen)
    meta2d.render()
}

function handleLocked(item: any) {
    const locked = item.locked
    switch (locked) {
        case LockState.None:
            setValue(item, 'locked', LockState.DisableEdit)
            break
        case LockState.DisableEdit:
            setValue(item, 'locked', LockState.DisableMove)
            break;
        case LockState.DisableMove:
            setValue(item, 'locked', LockState.Disable)
            break;
        case LockState.Disable:
            setValue(item, 'locked', LockState.None)
            break;
        case undefined:
            setValue(item, 'locked', LockState.DisableEdit)
            break
    }

}

function handleClick(item: any) {
    meta2d.inactive();
    meta2d.active([item]);
    meta2d.render()
}

</script>

<style scoped>
.construction-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    padding: 0 10px
}

.construction-icon {
    cursor: pointer;
}

.active {
    color: var(--el-color-primary)
}

.svg-icon {
    width: 14px;
    height: 14px;
    margin-right: 10px;
}

.construction-name {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.mr-4 {
    margin-right: 4px;
}
</style>