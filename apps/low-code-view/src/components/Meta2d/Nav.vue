<template>
  <div class="nav-box">
    <!-- 左侧 -->
    <div class="nav-left">
      <div class="nav-item" v-for="(item, index) in menu.left" :key="index">
        <template v-if="item.children && item.children.length > 0">
          <el-dropdown @command="handleCommand($event, item)">
            <div class="el-dropdown-link">
              <div class="text-center">
                <svg v-if="item.icon" class="icon-svg" aria-hidden="true">
                  <use :xlink:href="'#' + item.icon" />
                </svg>
                <span>{{ item.name }}</span>

                <el-icon class="font-12">
                  <ArrowDown />
                </el-icon>
              </div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(c, i) in item.children" :key="i" :command="c.action">{{ c.name
                  }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <div v-else class="pointer" :class="{ active: item.active }" @click="dispatchFunc(item.action, item)">
          <div class="el-dropdown-link">
            <div class="text-center">
              <svg v-if="item.icon" class="icon-svg" aria-hidden="true">
                <use :xlink:href="'#' + item.icon" />
              </svg>
              <span class="l-14">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="nav-right">
      <div class="nav-item" v-for="(item, index) in menu.right" :key="index">
        <template v-if="item.children && item.children.length > 0">
          <el-dropdown @command="handleCommand($event, item)">
            <div class="el-dropdown-link">
              <div class="text-center">
                <svg v-if="item.icon" class="icon-svg" aria-hidden="true">
                  <use :xlink:href="'#' + item.icon" />
                </svg>
                <span>{{ item.name }}</span>
                <el-icon class="font-12">
                  <ArrowDown />
                </el-icon>
              </div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(c, i) in item.children" :key="i" :command="c.action + ',' + c.value">
                  <div class="flex-center">
                    <svg v-if="c.icon" class="icon-svg" aria-hidden="true">
                      <use :xlink:href="'#' + c.icon" />
                    </svg>
                    {{ c.name }}
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <div v-else class="pointer" :class="{ active: item.active }" @click="dispatchFunc(item.action, item)">
          <div class="el-dropdown-link">
            <div class="text-center">
              <svg v-if="item.icon" class="icon-svg" aria-hidden="true">
                <use :xlink:href="'#' + item.icon" />
              </svg>
              <span class="l-14">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <el-popover :width="300"
          popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
          <template #reference>
            <div class="scale-result-box">
              <span class="mb-7">{{ scaleValue }}%</span>
              <span>缩放</span>
            </div>
          </template>
          <template #default>
            <el-slider :min="min" :max="max" size="small" v-model="scaleValue" show-input @change="scaleView" />
          </template>
        </el-popover>
      </div>
      <div class="nav-item">
        <div class="el-dropdown-link pointer" @click="handlePreview">
          <div class="text-center">
            <svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#l-attention" />
            </svg>
            <span class="l-14">预览</span>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <div class="el-dropdown-link pointer" @click="handleEditStatus">
          <div class="text-center" :style="{ color: mapEditStatus.color }">
            <svg v-if="mapEditStatus.icon" class="icon-svg" :fill="mapEditStatus.color" aria-hidden="true">
              <use :xlink:href="'#' + mapEditStatus.icon" />
            </svg>
            <span class="l-14">{{ mapEditStatus.name }}</span>
          </div>
        </div>
      </div>


      <div class="nav-item">
        <el-popover placement="bottom" :width="400" :visible="visible">
          <template #reference>
            <div class="el-dropdown-link pointer" @click="visible = true">
              <div class="text-center">
                <svg class="icon-svg" aria-hidden="true">
                  <use xlink:href="#l-save" />
                </svg>
                <span class="l-14">保存</span>
              </div>
            </div>
          </template>

          <el-form ref="formRef" :model="formState" label-width="auto">
            <el-form-item label="标识" prop="dataset" :rules="[
              { required: true, message: '请输入标识且唯一', trigger: 'blur' }
            ]">
              <el-input v-model.number="formState.dataset" type="text" autocomplete="off" />
            </el-form-item>
            <el-form-item label="图片地址" prop="image" :rules="[
              { required: true, message: '请输入图片地址', trigger: 'blur' }
            ]">
              <el-input v-model.number="formState.image" type="text" autocomplete="off" />
            </el-form-item>
            <el-form-item>
              <div style="width:100%;text-align: right">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="handleSave">保存</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-popover>
      </div>

    </div>
  </div>

</template>

<script lang="ts" setup>
import { ref, onMounted, unref } from 'vue'
import { menu, dispatchFunc } from '../../config/defaultNav'
import { LockState } from '@meta2d/core'
import { useRouter } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'
import { useMeata2dStore, Meta2dConfig } from '@/store/modules/meta2d/meta2dStore'
import { reactive } from 'vue'
import type { FormInstance } from 'element-plus'

const meta2dStore = useMeata2dStore()

const router = useRouter()
const formRef = ref<FormInstance>()
const formState = reactive({
  dataset: '',
  image: ''
})
const visible = ref(false)

const mapEditConfig = {
  [LockState.None]: {
    name: '编辑',
    icon: 'l-unlock',
    color: "#000",
    locked: LockState.None
  },
  [LockState.DisableEdit]: {
    name: '预览',
    icon: 'l-lock',
    color: '#faad14',
    locked: LockState.DisableEdit
  },
  [LockState.Disable]: {
    name: '锁定',
    icon: 'l-wufayidong',
    color: '#f50000',
    locked: LockState.Disable
  },
  [LockState.DisableMoveScale]: {
    name: '禁止平移缩放',
    icon: 'l-wufayidong',
    color: '#f50000',
    locked: LockState.DisableMoveScale
  },
  [LockState.DisableMove]: {
    name: '禁止平移',
    icon: 'l-wufayidong',
    color: '#f50000',
    locked: LockState.DisableMove
  },
  [LockState.DisableScale]: {
    name: '禁止缩放',
    icon: 'l-wufayidong',
    color: '#f50000',
    locked: LockState.DisableScale
  },
}

interface LockConfig {
  name: string;
  icon: string;
  color: string;
  locked: LockState;
}

let mapEditStatus = ref<LockConfig>(mapEditConfig[LockState.None])

/** 下拉菜单点击事件 */
function handleCommand(command: string, data: any) {
  let [action, value] = command.split(',')
  let item = data.children.find((it: any) => (value ? it.value === value : it.action === action))
  item.icon && (data.icon = item.icon)
  dispatchFunc(action, item)
}

// 缩放
const scaleValue = ref(0)
const min = ref(1)
const max = ref(100)
const scaleView = (val: number) => {
  meta2d.scale(val / 100)
  // 将图元移动到图纸中央
  meta2d.centerView()
}

/** 获取图纸锁定状态 */
function openFn() {
  let data = meta2d.data()
  let locked: LockState | number = data.locked || 0
  mapEditStatus.value = (mapEditConfig as any)[locked]
}

/** 改变图纸状态 */
function handleEditStatus() {
  let locked = mapEditStatus.value.locked
  if (locked === LockState.None) {
    meta2d.lock(LockState.DisableEdit)
    mapEditStatus.value = mapEditConfig[LockState.DisableEdit]
  } else if (locked === LockState.DisableEdit) {
    meta2d.lock(LockState.Disable)
    mapEditStatus.value = mapEditConfig[LockState.Disable]
  } else if (locked === LockState.Disable) {
    meta2d.lock(LockState.DisableMoveScale)
    mapEditStatus.value = mapEditConfig[LockState.DisableMoveScale]
  } else if (locked === LockState.DisableMoveScale) {
    meta2d.lock(LockState.DisableMove)
    mapEditStatus.value = mapEditConfig[LockState.DisableMove]
  } else if (locked === LockState.DisableMove) {
    meta2d.lock(LockState.DisableScale)
    mapEditStatus.value = mapEditConfig[LockState.DisableScale]
  } else {
    meta2d.lock(LockState.None)
    mapEditStatus.value = mapEditConfig[LockState.None]
  }
}
/** 预览 */
function handlePreview() {
  const json = meta2d.data()
  localStorage.setItem("meta2dJSON", JSON.stringify(json))
  window.open('#' + PageEnum.META2DPREVIEW, '_blank')
}



const handleSave = () => {
  unref(formRef)!.validate((valid) => {
    if (valid) {
      const json = meta2d.data()
      const config: Meta2dConfig = {
        dataset: formState.dataset,
        image: formState.image,
        json
      }
      meta2dStore.addMeata2d(config)
      console.log(meta2dStore.getMeta2dsList,1)
      visible.value = false;
    }
  })


}
onMounted(() => {
  setTimeout(() => {
    min.value = (meta2d.store.options as any).minScale * 100
    max.value = (meta2d.store.options as any).maxScale * 100
    scaleValue.value = +(meta2d.data().scale * 100).toFixed()
    // @ts-ignore
    meta2d.on('scale', (data: number) => {
      scaleValue.value = +(data * 100).toFixed()
    })
    openFn()
    // @ts-ignore
    meta2d.on("opened", openFn)
  }, 100);
})
</script>

<style scoped>
.nav-box {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-item {
  margin-right: 30px;
}

.nav-right,
.nav-left {
  display: flex;
  align-items: center;
}

.nav-right {
  justify-content: flex-end;
}

.pointer {
  cursor: pointer;
}

.active {
  color: var(--el-color-primary);
}

.active svg {
  fill: var(--el-color-primary);
}

.scale-result-box {
  text-align: center;
  line-height: 1;
}

.icon-svg {
  width: 18px;
  height: 18px;
}

.text-center {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.text-center>svg {
  margin-right: 6px;
}

.font-12 {
  font-size: 12px;
}

.el-dropdown-link {
  display: flex;
  align-items: baseline;
  justify-content: center;
  outline: none;
}

.flex-center {
  display: flex;
  justify-content: flex-start;
  align-items: center
}

.l-14 {
  line-height: 14px;
  margin-top: -4px
}

.mb-7 {
  margin-bottom: 7px;
}

.user-box {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.sf-style {
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  margin-left: 10px;
}
</style>