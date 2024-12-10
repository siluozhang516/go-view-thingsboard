<script setup>
import { isRef, onMounted, reactive, ref, toRaw } from 'vue'
import { eventType, propsType } from '@/config/defaultConfig'
import { EventAction } from '@meta2d/core'
import CodeEdit from '@/components/Meta2d/CodeEdit.vue'

import { ElMessage } from 'element-plus';
// 当前的pen
let activePen = reactive({})
/** 事件列表 */
let eventList = ref([])

/** 添加事件 */
const addEvent = () => {
  eventList.value.push({
    name: eventType[0].event,
    action: eventBehavior[0].behavior,
    where: { type: 'null' }
  })
  meta2d.setValue({
    id: activePen.id,
    events: toRaw(eventList.value),
  })
  meta2d.render()
}


/** 事件行为 */
const eventBehavior = [
  {
    name: "打开链接",
    behavior: EventAction.Link,
    depend: [
      {
        name: "链接地址",
        type: "input",
        bindProp: "value",
        event: 'change',
        option: {
          placeholder: "URL"
        },
        func: updateFunc("value")
      },
      {
        name: "打开方式",
        type: "select",
        bindProp: "params",
        event: 'change',
        option: {
          list: [
            {
              name: "新窗口打开",
              value: "_blank"
            }, {
              name: "覆盖当前页面",
              value: "_self"
            }
          ]
        },
        func: updateFunc("params")
      }
    ]
  },
  {
    name: "更改属性",
    behavior: EventAction.SetProps,
    depend: [
      {
        name: "目标",
        type: "input",
        bindProp: "params",
        option: {
          tip: '目标id/tag',
          placeholder: "默认自身"
        },
        event: 'change',
        func: updateFunc("params")
      },
      {
        name: "",
        type: "table",
        bindProp: "setProps",
        option: {
          labelWidth: '0px'
        },
        event: 'change',
        func: updateFunc("setProps")
      }
    ]
  },
  {
    name: "执行动画",
    behavior: EventAction.StartAnimate,
    depend: [
      {
        name: "动画目标",
        type: "input",
        event: 'change',
        bindProp: "value",
        option: {
          tip: '目标id/tag',
          placeholder: "默认自身"
        },
        func: updateFunc("value")
      },
    ]
  },
  {
    name: "暂停动画",
    behavior: EventAction.PauseAnimate,
    depend: [
      {
        name: "动画目标",
        type: "input",
        event: 'change',
        bindProp: "value",
        option: {
          tip: '目标id/tag',
          placeholder: "默认自身"
        },
        func: updateFunc("value")
      },
    ]
  },
  {
    name: "停止动画",
    behavior: EventAction.StopAnimate,
    depend: [
      {
        name: "动画目标",
        type: "input",
        event: 'change',
        bindProp: "value",
        option: {
          tip: '目标id/tag',
          placeholder: "默认自身"
        },
        func: updateFunc("value")
      },
    ]
  },
  {
    name: "播放视频",
    behavior: EventAction.StartVideo,
    depend: [
      {
        name: "视频目标",
        type: "input",
        event: 'change',
        bindProp: "value",
        option: {
          placeholder: "默认自身",
          tip: '目标id/tag'
        },
        func: updateFunc("value")
      },
    ]
  },
  {
    name: "暂停视频",
    behavior: EventAction.PauseVideo,
    depend: [
      {
        name: "视频目标",
        type: "input",
        event: 'change',
        bindProp: "value",
        option: {
          placeholder: "默认自身",
          tip: '目标id/tag'
        },
        func: updateFunc("value")
      },
    ]
  },
  {
    name: "停止视频",
    behavior: EventAction.StopVideo,
    depend: [
      {
        name: "视频目标",
        type: "input",
        event: 'change',
        bindProp: "value",
        option: {
          placeholder: "默认自身",
          tip: '目标id/tag'
        },
        func: updateFunc("value")
      },
    ]
  },
  {
    name: "执行JavaScript",
    behavior: EventAction.JS,
    depend: [
      {
        name: "JavaScript",
        type: "code",
        event: 'click',
        bindProp: "value",
        func: updateFunc("value")
      },
      {
        name: "函数参数",
        type: "input",
        event: 'change',
        bindProp: "params",
        func: updateFunc("params")
      },
    ]
  },
  {
    name: "执行全局函数",
    behavior: EventAction.GlobalFn,
    depend: [
      {
        name: "函数名称",
        type: "input",
        event: 'change',
        bindProp: "value",
        option: {
          tip: `在代码中设置全局函数，例如：
                    globalThis.eventFn= (pen,params) =>{
                        console.log('当前图元：',pen,'参数：',params);
                    };
                    输入框中输入：eventFn
                    `
        },
        func: updateFunc("value")
      },
      {
        name: "函数参数",
        type: "input",
        event: 'change',
        bindProp: "params",
        func: updateFunc("params")
      },
    ]
  },
  {
    name: "发送消息",
    behavior: EventAction.Emit,
    depend: [
      {
        name: "消息名称",
        type: "complete",
        event: 'change',
        bindProp: "value",
        option: {
          list: [
            // { link: '对话框', value: 'l-dialog' },
            // { link: 'iframe展示', value: 'iframe-dialog' },
            // { link: '导航', value: 'navigator' },
          ],
          tip: `在代码中使用meta2d.on('eventName', (params) => {})监听消息名称`
        },
        func: updateFunc("value")
      },
      {
        name: "消息参数",
        type: "input",
        event: 'change',
        bindProp: "params",
        func: updateFunc("params")
      },
    ]
  },
  {
    name: "发送图元数据",
    behavior: EventAction.SendPropData,
    depend: [
      {
        name: "目标",
        type: "input",
        event: 'change',
        bindProp: "params",
        option: {
          placeholder: "默认自身"
        },
        func: updateFunc("params")
      },
      {
        name: "Topics*",
        type: "input",
        event: 'change',
        bindProp: "extend",
        option: {
          tip: '仅针对mqtt通信',
          placeholder: "多个topic以英文逗号“,”分隔"
        },
        func: updateFunc("extend")
      },
      {
        name: "",
        type: "table",
        bindProp: "setProps",
        option: {
          labelWidth: '0px'
        },
        event: 'change',
        func: updateFunc("setProps")
      }
    ]
  },
  {
    name: "发送绑定变量",
    behavior: EventAction.SendVarData,
    depend: [
      {
        name: "目标",
        type: "input",
        event: 'change',
        bindProp: "params",
        option: {
          placeholder: "默认自身"
        },
        func: updateFunc("params")
      },
      {
        name: "Topics*",
        type: "input",
        event: 'change',
        bindProp: "extend",
        option: {
          tip: '仅针对mqtt通信',
          placeholder: "多个topic以英文逗号“,”分隔"
        },
        func: updateFunc("extend")
      },
      {
        name: "",
        type: "table",
        bindProp: "setProps",
        option: {
          labelWidth: '0px'
        },
        event: 'change',
        func: updateFunc("setProps")
      }
    ]
  },
]

/** 事件条件 */
const eventParams = {
  comparison: [
    {
      name: "属性名",
      type: "complete",
      bindProp: "key",
      option: {
        placeholder: "属性名",
        list: [
          { value: 'text', link: '文字' }
        ]
      },
      event: 'change',
      func: updateFunc("where")
    },
    {
      name: "条件",
      type: "select",
      bindProp: "comparison",
      option: {
        placeholder: "属性名",
        list: [
          { value: ">", name: "大于" },
          { value: ">=", name: "大于等于" },
          { value: "<", name: "小于" },
          { value: "<=", name: '小于等于' },
          { value: "==", name: '等于' },
          { value: "!=", name: '不等于' },
          { value: "[)", name: '介于' },
          { value: "![)", name: '不介于' },
          { value: "[]", name: '属于' },
          { value: "![]", name: '不属于' },
        ]
      },
      event: 'change',
      func: updateFunc("where")
    },
    {
      name: "属性值",
      type: "input",
      bindProp: "value",
      option: {
        placeholder: "属性值"
      },
      event: 'change',
      func: updateFunc("where")
    },
  ],
  custom: [
    {
      name: "高优先级判断",
      type: "code",
      bindProp: "fnJs",
      event: 'click',
      func: updateFunc("where")
    },
  ]
}



onMounted(() => {
  meta2d.on('active', (pen) => {
    if (pen.length === 1) {
      activePen = reactive(pen[0])
      let events = pen[0].events || []
      if (isRef(events)) events = toRaw(events._value) || [];
      events = events.map(item => {
        let filter = eventBehavior.filter(it => it.behavior === item.action)
        item.depList = filter.length ? filter[0].depend : []
        return item
      })
      eventList.value = events
    } else {
      activePen = undefined
    }
  })
})
/** 删除事件 */
function removeEvent(index) {
  eventList.value.splice(index, 1)
  meta2d.setValue({
    id: activePen.id,
    events: toRaw(eventList.value)
  })
  meta2d.render()
}

/** 事件改变 */
function handleEventChange(val, prop, index) {
  eventList.value[index][prop] = val

  // 如果改变的是事件行为
  if (prop === 'action') {
    let filter = eventBehavior.filter(it => it.behavior === val)
    eventList.value[index].depList = filter.length ? filter[0].depend : []
    // 情况value、params
    eventList.value[index].value = undefined
    eventList.value[index].params = undefined
    eventList.value[index].setProps = undefined
    // 初始化value,setProps属性值 更改属性、发送图元数据、发送绑定变量
    if (val == 1 || val == 11 || val == 12) {
      eventList.value[index].value = { "": "" }
      eventList.value[index].setProps = [{ key: "", value: "" }]
    }
  }
  meta2d.setValue({
    id: activePen.id,
    events: toRaw(eventList.value)
  })
  meta2d.render()
}

/** 添加属性 */
function addPropsEvent(index) {
  eventList.value[index].setProps.push({ key: "", value: "" })
  meta2d.setValue({
    id: activePen.id,
    events: toRaw(eventList.value)
  })
  meta2d.render()
}
/** 删除属性 */
function removePropsEvent(index, index2) {
  if (eventList.value[index].setProps.length == 1) {
    ElMessage.error("至少保留一个属性")
    return false
  }
  eventList.value[index].setProps.splice(index2, 1)
  meta2d.setValue({
    id: activePen.id,
    events: toRaw(eventList.value)
  })
  meta2d.render()
}
/** 获取属性列表 */
function getSuggestions(queryStr, cb) {
  return cb(propsType)
}
/** 显示事件编辑js */
let jsCb = ""
const visible = ref(false)
const jsCode = ref("")
let eventIndex = 0
let eventProp = 'value'
let valueTip = {
  title: "可获取pen、params和context参数",
  subTitle: "console.log('arguments',arguments); console.log('当前点击的图元', pen); console.log('参数',params); console.log('上下文',context);"
}
let whereTip = {
  title: "可获取'pen'和 'context'参数，返回一个boolean值",
  subTitle: "console.log('arguments',arguments); return true"
}
let eventTip = valueTip
function showCodeDialog(cb, value, index, prop = 'value') {
  if (prop == 'where') {
    eventTip = whereTip
  } else {
    eventTip = valueTip
  }
  eventProp = prop
  jsCb = cb
  eventIndex = index
  jsCode.value = value
  visible.value = true
}
const eventDone = (val) => {
  if (eventProp === 'where') {
    eventList.value[eventIndex][eventProp].fnJs = val
  } else {
    eventList.value[eventIndex][eventProp] = val
  }
  jsCb(eventList.value, activePen.id)
}

/** 事件行为改变 */
const handleEventAction = (index) => {
  eventList.value[index].where.fnJs = undefined
  eventList.value[index].where.key = undefined
  eventList.value[index].where.value = undefined
  eventList.value[index].where.comparison = undefined
  meta2d.setValue({
    id: activePen.id,
    events: toRaw(eventList.value)
  })
  meta2d.render()
}
const listBoolean  = ["true", "false"];
function updateFunc(param) {
  return () => {
    if (param === 'setProps') {
      eventList.value.forEach(item => {
        let setProps = item.setProps
        item.value = {}
        setProps && setProps.forEach(it => {
          item.value[it.key] = isNaN(Number(it.value)) ? it.value === 'true' ? true : it.value === 'false' ? false : it.value : Number(it.value)
        })
      })
    }
    const valueList = toRaw(eventList.value);
    valueList.forEach((item) => {
      const valueObj = item.value;
      for(let i in valueObj){
        if(listBoolean.includes(valueObj[i])){
          valueObj[i] = valueObj[i] === 'true' ? true : false;
        }
      };
      if(item.where.type === 'null'){
        item.where.type = null
      }
      // if(listBoolean.includes(item.where.value)){
      //   item.where.value = item.where.value === 'true' ? true : false;
      // }
    });
    meta2d.setValue({
      id: activePen.id,
      events: toRaw(eventList.value)
    })
    meta2d.render()
  }
}

</script>

<template>
  <!-- js编辑事件 -->
  <CodeEdit v-model:visible="visible" title="JavaScript" :tip="eventTip" v-model="jsCode" @done="eventDone" />
  <div class="event">
    <el-button @click="addEvent" type="primary" style="width: 100%">添加事件</el-button>
    <el-collapse accordion>
      <el-collapse-item v-for="(event, index) in eventList" :key=index>
        <template #title>
          <div class="title-box">
            <div class="title-left">
              <span> {{ `事件 ${index + 1} / ${eventList.length}` }} </span>
            </div>
            <el-popconfirm @confirm.stop="removeEvent(index)" title="确定要删除吗?" cancel-button-text="取消"
              confirm-button-text="确定">
              <template #reference>
                <el-icon @click.stop style="margin-right: 10px">
                  <Delete />
                </el-icon>
              </template>
            </el-popconfirm>
          </div>
        </template>

        <el-form @submit="(e) => e.preventDefault()" label-width="100px">
          <el-form-item label="事件类型">
            <el-select @change="handleEventChange($event, 'name', index)" v-model="event.name" placeholder="选择事件类型">
              <el-option v-for="e in eventType" :key="e.event" :label="e.name" :value="e.event"></el-option>
            </el-select>
          </el-form-item>

          <!--事件行为-->
          <el-form-item label="事件行为">
            <el-select @change="handleEventChange($event, 'action', index)" v-model="event.action" placeholder="选择行为类型">
              <el-option v-for="i in eventBehavior" :key="i.behavior" :label="i.name" :value="i.behavior"></el-option>
            </el-select>
          </el-form-item>

          <!-- 事件类型依赖表单-->
          <el-form-item :label-width="dep.option?.labelWidth" :label="dep.name" v-for="(dep,index) in event.depList" :key="index">
            <template #label>
              <span>{{ dep.name }}</span>
              <el-tooltip :content="dep.option?.tip" v-if="dep.option?.tip" placement="top">
                <el-icon style="margin-left: 5px;margin-top: 8px;">
                  <warningFilled />
                </el-icon>
              </el-tooltip>
            </template>
            <el-input v-model="event[dep.bindProp]" :placeholder="dep.option?.placeholder || '请输入'"
              v-if="dep.type === 'input'" @[dep.event]="dep.func" :type="dep.option?.type || 'text'" />
            <!--选择框-->
            <el-select v-model="event[dep.bindProp]" :placeholder="dep.option.placeholder"
              v-else-if="dep.type === 'select'" @[dep.event]="dep.func">
              <el-option v-for="item in dep.option.list" :key="item.value" :label="item.name" :value="item.value"
                :disabled="item.disabled"></el-option>
            </el-select>
            <!-- table -->
            <el-table v-else-if="dep.type === 'table'" :data="event[dep.bindProp]" style="width: 100%">
              <el-table-column align="center" label="key" prop="key">
                <template #default="scope">
                  <el-autocomplete v-model="scope.row.key" @change="dep.func" :fetch-suggestions="getSuggestions"
                    @select="dep.func">
                    <template #default="{ item }">
                      <span class="link">{{ item.link }}</span>
                    </template>
                  </el-autocomplete>
                </template>
              </el-table-column>
              <el-table-column align="center" label="value" prop="value">
                <template #default="scope">
                  <el-input @change="dep.func" v-model="scope.row.value" />
                </template>
              </el-table-column>
              <el-table-column width="50" align="center">
                <template #header>
                  <el-icon class="pointer" @click="addPropsEvent(index)">
                    <CirclePlus />
                  </el-icon>
                </template>
                <template #default="scope">
                  <el-popconfirm @confirm.stop="removePropsEvent(index, scope.$index)" title="确定要删除吗?"
                    cancel-button-text="取消" confirm-button-text="确定">
                    <template #reference>
                      <el-icon class="pointer">
                        <Delete />
                      </el-icon>
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <!-- code -->
            <el-button type="default" size="small" @[dep.event]="showCodeDialog(dep.func, event[dep.bindProp], index)"
              v-else-if="dep.type === 'code'">···</el-button>
            <!-- 自动完成 -->
            <el-autocomplete class="full-w" v-else-if="dep.type == 'complete'" v-model="event[dep.bindProp]"
              @[dep.event]="dep.func" @select="dep.func" :fetch-suggestions="(queryString, cb) => cb(dep.option?.list)">
              <template #default="{ item }">
                <span class="link">{{ item.link }}</span>
              </template>
            </el-autocomplete>
          </el-form-item>

          <!-- 事件条件 -->
          <el-form-item label="事件条件">
            <el-select v-model="event.where.type" placeholder="无" @change="handleEventAction(index)">
              <el-option label="无" :value="'null'"></el-option>
              <el-option label="关系运算" value="comparison"></el-option>
              <el-option label="自定义代码判断" value="custom"></el-option>
            </el-select>
          </el-form-item>

          <!-- 事件行为-->
          <el-form-item :label-width="dep.option?.labelWidth" :label="dep.name"
            v-for="(dep,index) in eventParams[event.where.type] || []" :key="index">
            <template #label>
              <span>{{ dep.name }}</span>
              <el-tooltip :content="dep.option?.tip" v-if="dep.option?.tip" placement="top">
                <el-icon style="margin-left: 5px;margin-top: 8px;">
                  <warningFilled />
                </el-icon>
              </el-tooltip>
            </template>
            <el-input v-model="event.where[dep.bindProp]" :placeholder="dep.option?.placeholder || '请输入'"
              v-if="dep.type === 'input'" @[dep.event]="dep.func" :type="dep.option?.type || 'text'" />
            <!--选择框-->
            <el-select v-model="event.where[dep.bindProp]" :placeholder="dep.option.placeholder"
              v-else-if="dep.type === 'select'" @[dep.event]="dep.func">
              <el-option v-for="item in dep.option.list" :key="item.value" :label="item.name" :value="item.value"
                :disabled="item.disabled"></el-option>
            </el-select>
            <!-- code -->
            <el-button type="default" size="small"
              @[dep.event]="showCodeDialog(dep.func, event.where[dep.bindProp], index, 'where')"
              v-else-if="dep.type === 'code'">···</el-button>
            <!-- 自动完成 -->
            <el-autocomplete class="full-w" v-else-if="dep.type == 'complete'" v-model="event.where[dep.bindProp]"
              @[dep.event]="dep.func" @select="dep.func" :fetch-suggestions="(queryString, cb) => cb(dep.option?.list)">
              <template #default="{ item }">
                <span class="link">{{ item.link }}</span>
              </template>
            </el-autocomplete>
          </el-form-item>

        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
.event_button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.event {
  margin: 10px;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.pointer {
  cursor: pointer;
}

:deep(.full-w) {
  width: 100%;
}

:deep(.el-form-item) {
  margin-bottom: 10px;
}
</style>