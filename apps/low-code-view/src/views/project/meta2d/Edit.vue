<template>
    <el-container class="full-height" direction="vertical">
        <Header />
        <el-container class="main-height">
            <Aside />
            <Meta2d />
            <Setting />
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import Header from '@/components/Meta2d/Header.vue'
import Aside from '@/components/Meta2d/Aside.vue'
import Meta2d from '@/components/Meta2d/Meta2d.vue'
import Setting from '@/components/Meta2d/Setting.vue'


</script>


<style lang="scss" scoped>
.full-height {
    height: 100%;
}

.main-height {
     height: calc(100vh - 112px);
}
</style>
