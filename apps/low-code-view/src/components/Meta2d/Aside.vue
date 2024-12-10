<template>
    <el-aside class="aside-box" width="300px">
        <el-tabs v-model="activeName" class="aside-tabs">
            <el-tab-pane label="图标库" name="icon">
                <Icons />
            </el-tab-pane>
            <el-tab-pane label="模板库" name="module">
                <div v-if="activeName === 'module'">
                    <Module />
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Icons from './Icons.vue'
import Module from './Module.vue'
const activeName = ref("icon");
</script>

<style scoped>
.aside-box {
    height: 100%;
    box-shadow: 4px 0 8px rgba(0, 0, 0, 0.1);
    padding: 12px 12px;
}

</style>