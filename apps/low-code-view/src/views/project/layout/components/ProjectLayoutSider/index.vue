<template>
  <n-layout-sider
    class="go-project-sider"
    bordered
    collapse-mode="width"
    show-trigger="bar"
    :collapsed="collapsed"
    :native-scrollbar="false"
    :collapsed-width="getAsideCollapsedWidth"
    :width="asideWidth"
    @collapse="collapsed = true"
    @after-leave="calcMeta2dSize"
    @after-enter="calcMeta2dSize"
    @expand="collapsed = false"
  >
    <div class="go-project-sider-flex">
      <aside>
        <n-space vertical class="go-project-sider-top">
          <project-layout-create :collapsed="collapsed"></project-layout-create>
        </n-space>
        <n-menu
          :value="menuValue"
          :options="menuOptions"
          :collapsed-width="getAsideCollapsedWidth"
          :collapsed-icon-size="22"
          :default-expanded-keys="defaultExpandedKeys"
       ></n-menu>
      </aside>
    </div>
  </n-layout-sider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, toRefs } from 'vue'
import { ProjectLayoutCreate } from '../ProjectLayoutCreate/index'
import { asideWidth } from '@/settings/designSetting'
import { useRoute } from 'vue-router'
import { useSettingStore } from '@/store/modules/settingStore/settingStore'
import { menuOptionsInit, expandedKeys } from './menu'

const collapsed = ref<boolean>(false)
const { getAsideCollapsedWidth } = toRefs(useSettingStore())

const route = useRoute()
const menuValue = computed(() => route.name)

const menuOptions = menuOptionsInit()

const defaultExpandedKeys = expandedKeys()

const watchWidth = () => {
  const Width = document.body.clientWidth
  if (Width <= 950) {
    collapsed.value = true
  } else collapsed.value = false
}

onMounted(() => {
  window.addEventListener('resize', watchWidth)
})

onUnmounted(()=> {
  window.removeEventListener('resize', watchWidth)
})

const calcMeta2dSize = ()=>{
  const meta2dDiv =  document.getElementById('meta2d')
  meta2d.resize(meta2dDiv?.offsetWidth,meta2dDiv?.offsetHeight)
}
</script>

<style lang="scss" scoped>
$siderHeight: 100vh;

@include go(project) {
  &-sider {
    @include fetch-bg-color('aside-background-color');
    &-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      margin-top: 30px;
      margin-bottom: 20px;
    }
    &-flex {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: $siderHeight;
    }
  }
  &-layout-sider {
    height: $siderHeight;
  }
  .content-top {
    top: $--header-height;
    margin-top: 1px;
  }
}
</style>
