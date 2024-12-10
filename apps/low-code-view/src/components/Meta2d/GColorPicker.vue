<template>
    <color-picker ref="colorPickers" blurClose disableHistory :pickerType="pickerType" v-bind="$attrs"
        :use-type="useType" v-model:[bindProp]="color" @pureColorChange="pureColorChange"
        @gradientColorChange="pureColorChange">
        <template #extra>
            <div class="text-right">
                <el-button size="small" @click="handleClear">clear</el-button>
            </div>
        </template>
    </color-picker>
</template>

<script setup lang="ts">
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import { computed, ref } from "vue";

const colorPickers = ref<InstanceType<typeof ColorPicker>>();

const props = withDefaults(defineProps<{
    modelValue: string,
    useType?: "pure" | "gradient" | "both",
    pickerType?: "chrome" | "fk",
    defaultColor?: string
}>(), {
    modelValue: '',
    useType: "pure",
    pickerType: 'chrome',
    defaultColor: 'rgba(255,255,255,0)'
})

enum BinDataType {
    pure = 'pureColor',
    gradient = 'gradientColor'
}

const emit = defineEmits(['update:modelValue', "change"])

const color = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})

const bindProp = computed(() => {
    if (props.useType === 'pure') return BinDataType.pure
    if (props.useType === 'gradient') return BinDataType.gradient
    return BinDataType.gradient
})



function pureColorChange(val: any) {
    emit('change', val)
}

function handleClear() {
    emit("update:modelValue", props.defaultColor)
}

</script>

<style>
.text-right {
    text-align: right;
}

.vc-gradient-wrap__types {
    visibility: hidden !important;
    opacity: 0 !important;
}
</style>