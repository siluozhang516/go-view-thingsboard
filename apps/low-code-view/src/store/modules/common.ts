import { defineStore } from 'pinia'
import { ref } from 'vue'

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark'
}

/** 编辑器颜色 */
export const useCommonStore = defineStore('useCommonStore', () => {
  const mode = ref<string>(ThemeMode.DARK)
  function changeMode() {
    mode.value = mode.value === ThemeMode.DARK ? ThemeMode.DARK : ThemeMode.LIGHT
  }
  return {
    mode,
    changeMode
  }
})
