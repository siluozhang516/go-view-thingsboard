<template>
  <div class="search-input">
    <el-input type="text" @input="searchChange" @clear="handleClear" v-model="search" placeholder="搜索图标"
      :prefix-icon="Search" clearable></el-input>
  </div>
  <el-scrollbar height="100%" class="icons-scrollbar">
    <el-empty v-if="isEmpty" description="暂无图元"></el-empty>
    <div class="icons-container" v-else>
      <el-collapse v-model="activeNames" accordion>
        <template v-for="item in searchList" :key="item.name">
          <el-collapse-item v-if="item.show" :title="item.name + item.count" :name="item.name">
            <!-- <template #title>
              <el-popover
                placement="top-start"
                trigger="hover"
                :width="240"
                :content="item.name + item.count">
                <template #reference>
                  <span>{{ item.name }}</span>
                </template>
              </el-popover>
            </template> -->
            <!-- @vue-ignore -->
            <div class="icon-wrap" v-if="activeNames.includes(item?.name)">
              <div class="icon-item" :title="child.name" v-for="child in item.list" :key="child.icon" :draggable="true"
                @dragstart.stop="dragStart($event, child)">
                <!-- 自定义图 -->
                <el-image class="svg-icon" fit="contain" v-if="child.image" :src="child.image" />
                <!-- svg内置 -->
                <svg v-else class="l-icon svg-icon" aria-hidden="true">
                  <use :xlink:href="'#' + child.icon" />
                </svg>
              </div>
            </div>
          </el-collapse-item>
        </template>
      </el-collapse>
    </div>
  </el-scrollbar>
  <div class="text-center">
    <el-button @click="showChartDialog" :icon="Menu">
      管理图元
    </el-button>
  </div>
  <!-- 图元管理弹框 -->
  <el-dialog title="管理图元" v-model="chartDialogVisible" width="600px">
    <el-row :gutter="20">
      <el-col class="chart-wrap" :span="24" v-for="(item, index) in searchList" :key="index">
        <div>{{ item.name }}</div>
        <el-switch v-model="item.show"></el-switch>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" setup>
import {debounce} from '@/utils/utils'

import { Search, Menu } from '@element-plus/icons-vue'
import { computed, ref, onMounted } from 'vue'
import { defaultIcons } from '../../config/defaultIcon'
// import ContomIcons from '@/config/constomSvg.json'
import { pngToPens, svgToPens, fileSvgPath } from '@/utils/meta2d'

let customIconList: Array<any> = []
// 加载自定义图表
// ContomIcons.forEach(item => {
//   let obj = {
//     name: item.name,
//     show: true,
//     list: [] as Array<any> // as ]
//   }
//   item.list.map(async (path) => {
//     // let ext = path.split('.').pop()
//     // if (ext === 'svg') {
//     //   obj.list.push(await svgToPens(path))
//     // } else {
//     obj.list.push(pngToPens(path))
//     // }
//   })
//   customIconList.push(obj)
// })
onMounted(() => {
  const customSVGData = fileSvgPath();
  customSVGData.forEach((item:any) => {
    let obj = {
    name: item.name,
    show: true,
    list: [] as Array<any> // as ]
  }
  item.list.map(async (path:any) => {
    // let ext = path.split('.').pop()
    // if (ext === 'svg') {
    //   obj.list.push(await svgToPens(path))
    // } else {
    obj.list.push(pngToPens(path))
    // }
  })
  customIconList.push(obj)
  })
  searchList.value = [...defaultIcons, ...customIconList]

  searchList.value.forEach((item:any) => {
    item.count = item.list.length ? `(${ item.list.length })` : ''
  })
})

const activeNames = ref([])
const search = ref('')
let searchList = ref<any>([...defaultIcons, ...customIconList])
const chartDialogVisible = ref(false)



/** 拖拽 */
function dragStart(e: DragEvent, item: any) {
  if (!item) return false
  e.dataTransfer?.setData('Meta2d', JSON.stringify(item.data));
}

/** 搜索图标 */
const searchChange = debounce((value: string) => {
  searchList.value = []
  let list = [...defaultIcons, ...customIconList]
  if (!value) {
    searchList.value = list
    return false
  }
  list.forEach((item) => {
    if (!item.show) return false
    let filter = item.list.filter((i: any) => <string>i.name.includes(value))
    if (filter.length) {
      searchList.value.push({
        ...item,
        list: filter
      })
    }
  })
})

/** 清空搜索 */
function handleClear() {
  searchList.value = [...defaultIcons, ...customIconList]
}
/** 图元管理 */
function showChartDialog() {
  chartDialogVisible.value = true
}

/** 是否为空 */
const isEmpty = computed(() => {
  return searchList.value.filter((it:any) => it.show).length === 0
})
</script>

<style scoped>

.icons-container {
  padding-left: 10px;
  padding-right: 10px;
}

.icon-wrap {
  display: grid;
  text-align: center;
  grid-template-columns: repeat(5, 20%);
}

.icon-item {
  padding: 5px;
}

.svg-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.icons-scrollbar {
  height: calc(100% - 100px);
}

.text-center {
  margin-top: 10px;
  text-align: center;
}

.search-input {
  padding: 10px;
}

.chart-wrap {
  display: flex;
  justify-content: space-between;
}

.elips {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.icons-container > .el-collapse{
  font-size: 14px !important;
}
</style>