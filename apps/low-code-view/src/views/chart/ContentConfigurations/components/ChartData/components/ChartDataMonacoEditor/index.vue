<template>
  <template v-if="targetData.filter">
    <n-card>
      <p><span class="func-keyword">function</span>&nbsp;&nbsp;filter(data, res)&nbsp;&nbsp;{</p>
      <!-- 函数体 -->
      <div class="go-ml-4">
        <n-code :code="targetData.filter" language="typescript"></n-code>
      </div>
      <p>}</p>
      <template #footer>
        <n-space justify="end">
          <n-button type="primary" tertiary size="small" @click="addFilter">
            <template #icon>
              <n-icon>
                <filter-edit-icon />
              </n-icon>
            </template>
            编辑
          </n-button>
          <n-button tertiary size="small" @click="delFilter"> 删除 </n-button>
        </n-space>
      </template>
    </n-card>
  </template>
  <template v-else>
    <n-button class="go-ml-3" @click="addFilter">
      <template #icon>
        <n-icon>
          <filter-icon />
        </n-icon>
      </template>
      新增过滤器
    </n-button>
  </template>

  <!-- 弹窗 -->
  <n-modal class="go-chart-data-monaco-editor" v-model:show="showModal" :mask-closable="false" :closeOnEsc="false">
    <n-card :bordered="false" role="dialog" size="small" aria-modal="true" style="width: 1000px; height: 600px">
      <template #header>
        <n-space>
          <n-text>过滤器函数编辑器</n-text>
        </n-space>
      </template>
      <template #header-extra> </template>
      <n-space size="small" vertical>
        <n-space justify="space-between">
          <div>
            <n-space vertical>
              <n-tag type="info">
                <span class="func-keyword">function</span>&nbsp;&nbsp;filter(data, res)&nbsp;&nbsp;{
              </n-tag>
              <monaco-editor v-model:modelValue="filter" width="460px" height="380px" language="javascript" />
              <n-tag type="info">}</n-tag>
            </n-space>
          </div>
          <n-divider vertical style="height: 480px" />
          <n-scrollbar style="max-height: 480px">
            <n-space :size="15" vertical>
              <div class="editor-data-show">
                <n-space>
                  <n-text depth="3">默认过滤数据(data)：</n-text>
                  <!-- n-node 会渲染大量的node,大量json会造成页面卡顿 -->
                  <div class="code-conent">{{ toString(sourceData?.data) || '暂无' }}</div>
                  <!-- <n-code :code="toString(sourceData?.data) || '暂无'" language="json" :word-wrap="true"></n-code> -->
                </n-space>
              </div>
              <div class="editor-data-show">
                <n-space>
                  <n-text depth="3">接口返回数据(res)：</n-text>
                  <div class="code-conent">{{ toString(sourceData) || '暂无' }}</div>
                  <!-- <n-code :code="toString(sourceData) || '暂无'" language="json" :word-wrap="true"></n-code> -->
                </n-space>
              </div>
              <div class="editor-data-show">
                <n-space>
                  <n-text depth="3">过滤器结果：</n-text>
                  <div class="code-conent">{{ toString(filterRes) || '暂无' }}</div>
                  <!-- <n-code :code="filterRes || '暂无'" language="json" :word-wrap="true"></n-code> -->
                </n-space>
              </div>
            </n-space>
          </n-scrollbar>
        </n-space>
      </n-space>
      <template #action>
        <n-space justify="space-between">
          <div class="go-flex-items-center">
            <n-tag :bordered="false" type="primary">
              <template #icon>
                <n-icon :component="DocumentTextIcon" />
              </template>
              规则
            </n-tag>
            <n-text class="go-ml-2" depth="2">过滤器默认处理接口返回值的「data」字段</n-text>
          </div>

          <n-space>
            <n-button size="medium" @click="closeFilter">取消</n-button>
            <n-button size="medium" type="primary" @click="saveFilter">保存</n-button>
          </n-space>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, computed, watch, toRef, toRefs, toRaw, reactive, unref } from 'vue'
import { useTargetData } from '../../../hooks/useTargetData.hook'
import { MonacoEditor } from '@/components/Pages/MonacoEditor'
import { icon } from '@/plugins'
import { goDialog, toString } from '@/utils'
import { customizeHttp } from '@/api/http'
import cloneDeep from 'lodash/cloneDeep'
import { RequestDataTypeEnum } from '@/enums/httpEnum'
import tinigsboard, { PublicParams, EntitySubscriptionService, FormValue } from '@thingsboard/core'

const { DocumentTextIcon } = icon.ionicons5
const { FilterIcon, FilterEditIcon } = icon.carbon
const { targetData, chartEditStore } = useTargetData()
const { requestDataType } = toRefs(targetData.value.request)
const { requestOriginUrl } = toRefs(chartEditStore.getRequestGlobalConfig)

// 受控弹窗
const showModal = ref(false)
// filter 函数模板
const filter = ref(targetData.value.filter || `return data`)
// 过滤错误标识
const errorFlag = ref(false)
// 目标静态/接口数据
const sourceData = ref<any>('')

const filterResSource = ref(null)

let sub$: any = null

// 动态获取数据
const fetchTargetData = async () => {
  try {
    if (targetData.value.request.requestDataType === RequestDataTypeEnum.Thingsboard) {
      if (sub$) sub$.unsubscribe()
      if(!unref(targetData).request.subscribe.formValue) return
      let params: PublicParams = {
        ...targetData.value.request.subscribe.datakeys,
        pageLink: targetData.value.request.subscribe.pageLink,
        keyFilters: unref(targetData).request.subscribe.keyFilter as tinigsboard.KeyFilter[],
        isPage: unref(targetData).request.subscribe.timeWindowConfig ? false : true,
        widgetType: unref(targetData).request.subscribe.timeWindowConfig ? tinigsboard.widgetType.timeseries : tinigsboard.widgetType.latest
      }
      if (unref(targetData).request.subscribe.timeWindowConfig) {
        params.timeWindowConfig = unref(targetData).request.subscribe.timeWindowConfig as tinigsboard.Timewindow
      }
      sub$ = EntitySubscriptionService.subscribeEntityInfoPublic(
        unref(targetData).request.subscribe.formValue as FormValue,
        params
      ).subscribe((res) => {
        sourceData.value = res
      }, () => {
        window['$message'].warning('没有拿到返回值，请检查接口！')
      })
      return
    }
    const res = await customizeHttp(toRaw(targetData.value.request), toRaw(chartEditStore.getRequestGlobalConfig))
    if (res) {
      sourceData.value = res
      return
    }
    window['$message'].warning('没有拿到返回值，请检查接口！')
  } catch (error) {
    console.error(error);
    window['$message'].warning('数据异常，请检查参数！')
  }
}

// 过滤结果
const filterRes = computed(() => {
  try {
    const fn = new Function('data', 'res', filter.value)
    const response = cloneDeep(sourceData.value)
    const res = fn(response?.data, response)
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    errorFlag.value = false
    filterResSource.value = res
    return toString(res)
  } catch (error) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    errorFlag.value = true
    return `过滤函数错误，日志：${error}`
  }
})

// 新增过滤器
const addFilter = () => {
  showModal.value = true
}

// 删除过滤器
const delFilter = () => {
  goDialog({
    message: '是否删除过滤器',
    onPositiveCallback: () => {
      targetData.value.filter = undefined
    }
  })
}

// 关闭过滤器
const closeFilter = () => {
  showModal.value = false
  if (sub$) sub$.unsubscribe()
}

// 新增过滤器
const saveFilter = () => {
  if (errorFlag.value) {
    window['$message'].error('过滤函数错误，无法进行保存')
    return
  }
  if (sub$) sub$.unsubscribe()
  targetData.value.filter = filter.value
  targetData.value.option.dataset = filterResSource.value
  closeFilter()
}

watch(
  () => showModal.value,
  (newData: boolean) => {
    if (newData) {
      fetchTargetData()
      filter.value = targetData.value.filter || `return data`
    }
  }
)
</script>

<style lang="scss" scoped>
.func-keyword {
  color: #b478cf;
}

@include go('chart-data-monaco-editor') {

  &.n-card.n-modal,
  .n-card {
    @extend .go-background-filter;
  }

  .editor-data-show {
    @include fetch-bg-color('filter-color');
    width: 420px;
    padding: 20px;
    border-radius: 5px;
  }
}

.code-conent{
  max-height: 420px;
  overflow-y: auto
}
</style>
