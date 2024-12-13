<template>
  <div class="go-chart-data-pond">
    <n-card class="n-card-shallow" v-if="!loginStatus">
      <div class="label-content">
        <div class="label-line"></div>
        <div>账号登录</div>
      </div>
      <setting-item-box name="账号" :alone="true">
        <n-input size="small" placeholder='暂无' v-model:value="account.username">

        </n-input>
      </setting-item-box>

      <setting-item-box name="密码" :alone="true">
        <n-input size="small" placeholder="暂无" v-model:value="account.password">
        </n-input>
      </setting-item-box>
      <n-button type="primary" @click="onLogin" block>登录</n-button>
    </n-card>

    <n-card class="n-card-shallow" v-else>
      <n-tag type="success" style="width:100%;cursor: pointer;" @click="loginStatus = null">
        已登录
        <template #icon>
          <n-icon :component="CheckmarkCircle" />
        </template>
      </n-tag>
    </n-card>

    <n-card class="n-card-shallow">
      <div class="label-content">
        <div class="label-line"></div>
        <div>数据源</div>
      </div>
      <setting-item-box name="筛选器类型" :alone="true">
        <n-select v-model:value="entity.type" placeholder="筛选器类型" :disabled="true" :options="entityFilterOptions" />
      </setting-item-box>

      <setting-item-box name="类型" :alone="true">
        <n-select v-model:value="entity.entityType" size="small" placeholder="类型" :disabled="true"
          :options="entityOptions" />

      </setting-item-box>

      <div class="edit-text" @click="aliasRef.open()">
        <div class="go-absolute-center">
          <n-button type="primary" secondary>编辑数据源</n-button>
        </div>
      </div>

    </n-card>

    <n-card class="n-card-shallow">
      <div class="label-content">
        <div class="label-line"></div>
        <div>筛选器</div>
      </div>

      <setting-item-box name="筛选器预览" :alone="true" />
      <div class="preview" v-html="getPreviewValue(keyFilterSource) || renderDefaultHtml()"></div>
      <div class="edit-text" @click="keyFilterRef.open()">
        <div class="go-absolute-center">
          <n-button type="primary" secondary>编辑筛选器</n-button>
        </div>
      </div>
    </n-card>

    <n-card class="n-card-shallow">
      <div class="label-content">
        <div class="label-line"></div>
        <div>时间窗口</div>
      </div>
      <setting-item-box name="时间" :alone="true">
        <n-input size="small" autosize type="textarea" placeholder='订阅时间' :disabled="true"
          v-model:value="timeConfig.type" />
      </setting-item-box>

      <div class="edit-text" @click="timeWindowRef.open()">
        <div class="go-absolute-center">
          <n-button type="primary" secondary>编辑时间窗口</n-button>
        </div>
      </div>
    </n-card>
  </div>

  <div class="sub-button">
    <n-checkbox v-model:checked="targetData.request.subscribe.realtime">
      <n-tooltip trigger="hover">
        <template #trigger>
          实时订阅
        </template>
        当实体订阅存在时序数据时，控制是否实时订阅，<br/>取消可能会拿不到时序数据，仅在预览生效
      </n-tooltip>
    </n-checkbox>
  </div>

  <div class="sub-button">
    <n-button type="primary" block @click="handleSubscribe" :disabled="!dataSources">
      <template #icon>
        <n-icon>
          <flash-icon />
        </n-icon>
      </template>
      开始订阅
    </n-button>
    <n-button dashed block @click="handleUnsubscribe" class="unsub-button" v-if="subscription$">
      取消订阅
    </n-button>
  </div>


  <!-- 底部数据展示 -->
  <chart-data-matching-and-show :ajax="true"></chart-data-matching-and-show>

  <FormkitAlias ref="aliasRef" @save="onAliasValue" />
  <KeyFilter ref="keyFilterRef" :condition="condition" @updateRuleCondition="onKeyFilterValue" />
  <Timewindow ref="timeWindowRef" @submit="onTimeWindowValue" @submitDes="onTimewindowDes" />

</template>

<script setup lang="ts">
import { computed, reactive, ref, unref } from 'vue';
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { SettingItemBox } from '@/components/Pages/ChartItemSetting'
import { useTargetData } from '../../../hooks/useTargetData.hook'
import { FormkitAlias, KeyFilter, AlarmConditionType, Timewindow, getPreviewValue, entityFilterOptions, AliasEntityTypeOption, EntityTypeOption, EntityDataKeys } from '@thingsboard/widget'
import thingsboard, { EntitySubscriptionService, FormValue, PublicParams } from '@thingsboard/core'
import { useMessage } from 'naive-ui'
import { CheckmarkCircle } from '@vicons/ionicons5'
import { ChartDataMatchingAndShow } from '../ChartDataMatchingAndShow'
import { newFunctionHandle } from '@/utils'
import { icon } from '@/plugins'


const { FlashIcon } = icon.ionicons5

type AliasParams = { dataKeys: EntityDataKeys, formState: FormValue, pageLink: thingsboard.EntityDataPageLink }

const message = useMessage()
const { targetData } = useTargetData()
const designStore = useDesignStore()

// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme
})



const condition = {
  condition: [],
  spec: {
    type: AlarmConditionType.SIMPLE,
    predicate: {
      defaultValue: '',
      dynamicValue: null
    }
  }
}

const subscription$: any = ref(null)
const aliasRef = ref()
const keyFilterRef = ref()
const timeWindowRef = ref()
const keyFilterSource = ref([])
const dataSources = ref<FormValue | null>(null)
const entityDataKeys = ref<EntityDataKeys | null>(null)
const pageSize = ref<thingsboard.EntityDataPageLink | null>(null)
const timeWindowValue = ref<thingsboard.Timewindow | null>(null)
const loginStatus = ref(localStorage.getItem('TB-jwt_token'))

const account = reactive({
  username: 'tenant@thingsboard.org',
  password: 'tenant'
})

const entity = reactive({
  type: '',
  entityType: '',
})

const timeConfig = reactive({
  type: '',
})


const entityOptions = computed(() => {
  const defaultType = ["singleEntity", "stateEntity"]
  if (defaultType.includes(entity.type)) {
    return [...EntityTypeOption, ...AliasEntityTypeOption]
  }
  return (EntityTypeOption);
})

const renderDefaultHtml = () => {
  return '<span style="color:rgba(0,0,0,0.65);font-size:12px">未指定筛选器</span>'
}

const onLogin = () => {
  thingsboard.AuthService.login(account).subscribe(res => {
    if (res.token) {
      message.success('Thingsboard 登录成功')
      loginStatus.value = localStorage.getItem('TB-jwt_token')
      return
    }
    message.error('Thingsboard 登录失败')
  }, () => {
    message.error('Thingsboard 登录失败')
  })
}


const handleSubscribe = () => {
  if (unref(subscription$)) unref(subscription$).unsubscribe()
  if(!unref(dataSources)) return
  let params: PublicParams = {
    ...unref(entityDataKeys),
    pageLink: unref(pageSize) as thingsboard.EntityDataPageLink,
    keyFilters: unref(keyFilterSource),
    isPage: unref(timeWindowValue) ? false : true,
    widgetType: unref(timeWindowValue) ? thingsboard.widgetType.timeseries : thingsboard.widgetType.latest
  }
  if (unref(timeWindowValue)) {
    params.timeWindowConfig = unref(timeWindowValue) as thingsboard.Timewindow
  }

  subscription$.value = EntitySubscriptionService.subscribeEntityInfoPublic(
    unref(dataSources) as FormValue,
    params
  ).subscribe((res: any) => {
    const { data } = res
    targetData.value.option.dataset = newFunctionHandle(data, res, targetData.value.filter)
  })
}

const handleUnsubscribe = () => {
  if (unref(subscription$)) {
    unref(subscription$).unsubscribe()
    subscription$.value = null;
  }
}


const onKeyFilterValue = ({ condition }: any) => {
  keyFilterSource.value = condition
  targetData.value.request.subscribe.keyFilter = condition
}

const onAliasValue = ({ dataKeys, formState, pageLink }: AliasParams) => {
  dataSources.value = formState
  entity.type = formState.type
  entity.entityType = formState.entityType
  entityDataKeys.value = dataKeys
  pageSize.value = pageLink
  unref(aliasRef).close()
  targetData.value.request.subscribe.formValue = formState
  targetData.value.request.subscribe.datakeys = dataKeys
  targetData.value.request.subscribe.pageLink = pageLink

}

const onTimeWindowValue = (timeWindow: any) => {
  timeWindowValue.value = timeWindow
  targetData.value.request.subscribe.timeWindowConfig = timeWindow
}
const onTimewindowDes = (des: string) => {
  timeConfig.type = des
}

</script>

<style scoped lang="scss">
@include go('chart-data-pond') {
  position: relative;
  display: flex;
  flex-direction: column;

  .n-card-shallow {
    margin-bottom: 10px;

    &.n-card {
      @extend .go-background-filter;

      @include deep() {
        .n-card__content {
          padding: 10px;
        }
      }
    }

    .edit-text {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 325px;
      height: 100%;
      cursor: pointer;
      opacity: 0;
      transition: all 0.3s;
      @extend .go-background-filter;
      backdrop-filter: blur(2px) !important;
    }

    &:hover {
      border-color: v-bind('themeColor');

      .edit-text {
        opacity: 1;
      }
    }
  }
}

.label-content {
  display: flex;
  align-items: center;

  .label-line {
    width: 4px;
    height: 14px;
    background-color: #51d6a9;
    margin-right: 6px;
  }
}

.preview {
  min-height: 35px;
  padding: 4px 16px;
  border-radius: 5px;
  line-height: 32px;
  border: 1px solid #ccc;
  color: rgba(0, 0, 0, 0.65);
}

:deep(.value-key) {
  padding: 6px;
  line-height: 10px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  color: #305680;
  text-align: center;
  font-weight: 700;
  display: inline-block;
  font-size: 14px;
}

:deep(.tb-filter-value) {
  color: #ff5722;
}

:deep(.tb-dynamic-source) {
  color: #0c959c;
}

.sub-button {
  margin: 10px 0 20px;

  .unsub-button {
    margin-top: 20px;
  }
}
</style>