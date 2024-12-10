<template>
  <setting-item-box name="尺寸">
    <n-input-number v-model:value="chartAttr.w" :min="50" :disabled="isGroup" size="small" placeholder="px"
      @change="changeW">
      <template #prefix>
        <n-text depth="3">宽度</n-text>
      </template>
    </n-input-number>
    <n-input-number v-model:value="chartAttr.h" :min="50" :disabled="isGroup" size="small" placeholder="px"
      @change="changeH">
      <template #prefix>
        <n-text depth="3">高度</n-text>
      </template>
    </n-input-number>
  </setting-item-box>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { PickCreateComponentType } from '@/packages/index.d'
import { SettingItemBox } from '@/components/Pages/ChartItemSetting'
import { PackagesCategoryEnum } from '@/packages/index.d'
import { debounce } from '@/utils/utils'
const props = defineProps({
  chartAttr: {
    type: Object as PropType<Omit<PickCreateComponentType<'attr'>, 'node' | 'conNode'>>,
    required: true
  },
  isGroup: {
    type: Boolean,
    required: false
  },
  targetKey: {
    type: String,
    required: false
  }
})

const changeW = debounce((v: number) => {
  // 更新meta2d画布尺寸
  if (props?.targetKey === PackagesCategoryEnum.META2D) {
    meta2d.resize(v, props.chartAttr.h)
    meta2d.fitView()
  }
},1000)
const changeH = debounce((v: number) => {
  // 更新meta2d画布尺寸
  if (props?.targetKey === PackagesCategoryEnum.META2D) {
    meta2d.resize(props.chartAttr.w,v)
    meta2d.fitView()
  }
},1000)
</script>
