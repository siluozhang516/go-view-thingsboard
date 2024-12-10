<template>
    <el-header class="header-box" height="50px">
        <Nav />
    </el-header>
</template>

<script setup lang="ts">
import Nav from './Nav.vue'
</script>

<style scoped>
.header-box {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
}
</style>