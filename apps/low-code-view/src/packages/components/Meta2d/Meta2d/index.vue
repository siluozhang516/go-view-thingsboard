<template>
    <div class="main-height">
        <Meta2d preview :chartConfig="chartConfig"/>
    </div>
</template>

<script setup lang="ts">
import Meta2d from '@/components/Meta2d/Meta2d.vue'
import { PropType } from 'vue';
import Config from './config'

defineProps({
  chartConfig: {
    type: Object as PropType<Config>,
    required: true
  }
})


</script>

<style lang="scss" scoped>

.main-height {
    height: calc(100vh - 112px);
}
</style>