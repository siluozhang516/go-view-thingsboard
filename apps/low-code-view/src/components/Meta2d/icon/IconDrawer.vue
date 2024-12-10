<template>
    <el-drawer v-model="visible" append-to-body lock-scroll title="图标选择" :size="356">
        <AsyncSelectIcon @change="change" />
    </el-drawer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import AsyncSelectIcon from './AsyncSelectIcon.vue';

const props = withDefaults(defineProps<{
    modelValue: boolean,
}>(), {
    modelValue: false,
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'change', value: string): void;
}>()

const visible = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit('update:modelValue', val);
    }
})

const change = (value: string) => {
    emit('change', value);
    visible.value = false
}


</script>