<template>
    <SelectIconAsync @change="onChange" />
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
const SelectIconAsync = defineAsyncComponent(() => import('@/components/Meta2d/icon/SelectIcon.vue'));
const emit = defineEmits(['change']);
const onChange = (icon) => {
    emit('change', icon);
};

</script>