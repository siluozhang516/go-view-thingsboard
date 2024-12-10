<template>
    <div style="margin-top:6px">
    <el-tabs v-model="activeName1" class="demo-tabs" active-name="first">
        <el-tab-pane label="图纸" name="map" class="tab">
            <MapProps></MapProps>
        </el-tab-pane>
        <el-tab-pane label="通信" name="correspondence" class="tab">
            <Correspondence></Correspondence>
        </el-tab-pane>
    </el-tabs>
</div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import MapProps from './MapProps/Map.vue'
import Correspondence from './MapProps/Correspondence.vue'

let activeName1 = ref('map')
let activePen = ref(false)
let multiPen = ref(false)

const active = (args) => {
    if (args.length >= 1) activePen.value = true
    if (args.length > 1) {
        multiPen.value = true
    } else {
        multiPen.value = false
    }
}
onMounted(() => {
    // 监听鼠标点击事件，返回
    meta2d.on('active', active)
    meta2d.on('inactive', inactive)
})


onUnmounted(() => {
    meta2d.off("active", active)
    meta2d.off("inactive", inactive)
})



function inactive() {
    activePen.value = false
    multiPen.value = false
}

</script>

<style scoped>
:deep(.el-collapse-item__header) {
    background-color: #F2F3F5;
}
:deep(.el-form) {
    background-color: #F2F3F5;
}
:deep(.el-collapse-item__wrap) {
    background-color: #F2F3F5;
}

.setting {
    position: relative;
    display: flex;
    width: 350px;
    padding: 16px 0 0 16px;
    overflow: auto;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}


:deep(.el-tabs__header) {
    margin: 0;
}

:deep(.el-tabs__content::-webkit-scrollbar) {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}

:deep(.el-tabs__content::-webkit-scrollbar-thumb) {
    /*滚动条里面小方块*/
    border-radius: 10px;
    height: 20px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #4e4e4e;
}

:deep(.el-tabs__content::-webkit-scrollbar-track) {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ffffff;
}


.tz_props {
    display: flex;
    width: 100%;
}

.ty_props {
    display: flex;
    width: 100%;
}

:deep(.el-tabs__header) {
    height: 40px;
}

:deep(.el-tabs__content) {
    flex: 1;
    overflow: auto;
}

:deep(.el-tabs) {
    width: 100%;
}
</style>