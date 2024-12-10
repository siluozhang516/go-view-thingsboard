<template>
    <el-dialog v-model="visible" width="500" :show-close="false">

        <div class="header">
            <div class="tabs">
                <div :class="['title', checked ? 'checkoutBgc' : '']" @click="changeTabs(TimewindowType.realtime)">实时
                </div>
                <div :class="['title', checked ? '' : 'checkoutBgc']" @click="changeTabs(TimewindowType.history)">历史
                </div>
            </div>
            <el-icon size="20" class="icon">
                <Tools />
            </el-icon>
        </div>

        <div class="group">
            <div class="group-title">时间窗口</div>
            <div class="range-time">
                <el-radio-group v-model="form.type">
                    <el-radio-button label="最后" :value="HistoryWindowType.LAST_INTERVAL" />
                    <el-radio-button label="Range" :value="HistoryWindowType.FIXED" v-if="!checked" />
                    <el-radio-button label="Relative" :value="HistoryWindowType.INTERVAL" />
                </el-radio-group>

                <el-popover placement="top" :width="400" trigger="click">
                    <template #reference>
                        <el-button>{{ form.timezone }}</el-button>
                    </template>
                    <div class="group" style="margin-bottom:0">
                        <div class="content">
                            <div>时区</div>
                            <el-select v-model="form.timezone" style="width: 240px">
                                <el-option v-for="item in timezoneOption" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </div>
                    </div>
                </el-popover>
            </div>

            <div style="margin-bottom: 10px" v-if="form.type === HistoryWindowType.LAST_INTERVAL">
                <el-select v-model="form.timewindowMs" placeholder="请选择">
                    <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>

            <div style="margin-bottom: 10px" v-if="checked && form.type === HistoryWindowType.INTERVAL">
                <el-select v-model="form.quickInterval" placeholder="请选择">
                    <el-option v-for="item in lastOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>

            <div style="margin-bottom: 10px" v-if="!checked && form.type === HistoryWindowType.INTERVAL">
                <el-select v-model="form.quickInterval" placeholder="请选择">
                    <el-option v-for="item in historyOption" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </div>

            <div style="margin-bottom: 10px" v-if="!checked && form.type === HistoryWindowType.FIXED">
                <el-date-picker v-model="form.timewindowMs2" type="datetimerange" start-placeholder="开始时间"
                    end-placeholder="结束时间" style="width:100%" value-format="x" />
            </div>


            <el-row :gutter="20" v-if="form.type === HistoryWindowType.LAST_INTERVAL && form.timewindowMs === 'Custom'"
                style="margin-bottom: 10px">
                <el-col :span="6">
                    <div class="time">天</div>
                    <el-input v-model="form.customTimeWindow.day" :min="0" type="number" placeholder="天" />
                </el-col>
                <el-col :span="6">
                    <div class="time">小时</div>
                    <el-input v-model="form.customTimeWindow.hour" :min="0" type="number" placeholder="小时" />
                </el-col>
                <el-col :span="6">
                    <div class="time">分钟</div>
                    <el-input v-model="form.customTimeWindow.min" :min="0" type="number" placeholder="分钟" />
                </el-col>
                <el-col :span="6">
                    <div class="time">秒</div>
                    <el-input v-model="form.customTimeWindow.second" :min="0" type="number" placeholder="秒" />
                </el-col>
            </el-row>
        </div>

        <div class="group">
            <div class="content">
                <div>聚合</div>
                <el-select v-model="form.aggregation.type" style="width: 240px">
                    <el-option v-for="item in aggOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>
        </div>

        <div class="group" v-if="form.aggregation.type === thingsboard.AggregationType.NONE">
            <div class="content">
                <div style="width: 80px;">限制数</div>
                <el-slider v-model="form.aggregation.limit" show-input :min="1" :max="50000"
                    :show-input-controls="false" />
            </div>
        </div>

        <div class="group" v-else>
            <div class="content">
                <div>分组间隔</div>
                <el-select v-model="form.interval" style="width: 240px" placeholder="请选择">
                    <el-option v-for="item in intervalGroup" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </div>
        </div>

        <el-row :gutter="20" v-if="form.interval === 'Custom'">
            <el-col :span="6">
                <div class="time">天</div>
                <el-input v-model="form.intervalTime.day" :min="0" type="number" placeholder="天" />
            </el-col>
            <el-col :span="6">
                <div class="time">小时</div>
                <el-input v-model="form.intervalTime.hour" :min="0" type="number" placeholder="小时" />
            </el-col>
            <el-col :span="6">
                <div class="time">分钟</div>
                <el-input v-model="form.intervalTime.min" :min="0" type="number" placeholder="分钟" />
            </el-col>
            <el-col :span="6">
                <div class="time">秒</div>
                <el-input v-model="form.intervalTime.second" :min="0" type="number" placeholder="秒" />
            </el-col>
        </el-row>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="onSave">
                    保 存
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, unref, watch } from 'vue';
import { Tools } from '@element-plus/icons-vue'
import { calcMillisecond, formatTime } from '../utils'
import thingsboard from '@thingsboard/core'



enum TimewindowType {
    realtime,
    history
}
const { AggregationType, QuickTimeInterval, HistoryWindowType, RealtimeWindowType } = thingsboard

const props = withDefaults(defineProps<{ type?: TimewindowType }>(), {
    type: TimewindowType.realtime
})

const timeOptions = [
    { label: '1秒', value: calcMillisecond(1), unit: 'second' },
    { label: '5秒', value: calcMillisecond(5), unit: 'second' },
    { label: '10秒', value: calcMillisecond(10), unit: 'second' },
    { label: '15秒', value: calcMillisecond(15), unit: 'second' },
    { label: '30秒', value: calcMillisecond(30), unit: 'second' },
    { label: '1分', value: calcMillisecond(1, 'minute'), unit: 'minute' },
    { label: '2分', value: calcMillisecond(2, 'minute'), unit: 'minute' },
    { label: '5分', value: calcMillisecond(5, 'minute'), unit: 'minute' },
    { label: '10分', value: calcMillisecond(10, 'minute'), unit: 'minute' },
    { label: '15分', value: calcMillisecond(15, 'minute'), unit: 'minute' },
    { label: '30分', value: calcMillisecond(30, 'minute'), unit: 'minute' },
    { label: '1小时', value: calcMillisecond(1, 'hour'), unit: 'hour' },
    { label: '2小时', value: calcMillisecond(2, 'hour'), unit: 'hour' },
    { label: '5小时', value: calcMillisecond(5, 'hour'), unit: 'hour' },
    { label: '10小时', value: calcMillisecond(10, 'hour'), unit: 'hour' },
    { label: '12小时', value: calcMillisecond(12, 'hour'), unit: 'hour' },
    { label: '1天', value: calcMillisecond(1, 'day'), unit: 'day' },
    { label: '7天', value: calcMillisecond(7, 'day'), unit: 'day' },
    { label: '30天', value: calcMillisecond(30, 'day'), unit: 'day' },
    { label: 'Custom', value: 'Custom' },
]



const intervalOption = [
    { label: '1秒', value: calcMillisecond(1) },
    { label: '5秒', value: calcMillisecond(5, 'second') },
    { label: '10秒', value: calcMillisecond(10, 'second') },
    { label: '15秒', value: calcMillisecond(15, 'second') },
    { label: '30秒', value: calcMillisecond(30, 'second') },
    { label: '1分', value: calcMillisecond(1, 'minute') },
    { label: '2分', value: calcMillisecond(2, 'minute') },
    { label: '5分', value: calcMillisecond(5, 'minute') },
    { label: '10分', value: calcMillisecond(10, 'minute') },
    { label: '30分', value: calcMillisecond(12, 'minute') },
    { label: '1小时', value: calcMillisecond(1, 'hour') },
    { label: '2小时', value: calcMillisecond(2, 'hour') },
    { label: '5小时', value: calcMillisecond(5, 'hour') },
    { label: '10小时', value: calcMillisecond(10, 'hour') },
    { label: '12小时', value: calcMillisecond(12, 'hour') },
    { label: '1天', value: calcMillisecond(1, 'day') },
    { label: '7天', value: calcMillisecond(7, 'day') },
    { label: '30天', value: calcMillisecond(30, 'day') },
    { label: 'Custom', value: 'Custom' },
]

const aggOptions = [
    { label: '最小值', value: AggregationType.MIN },
    { label: '最大值', value: AggregationType.MAX },
    { label: '平均值', value: AggregationType.AVG },
    { label: '求和', value: AggregationType.SUM },
    { label: '计数', value: AggregationType.COUNT },
    { label: '无', value: AggregationType.NONE },
]
const timezoneOption = [
    { label: '浏览器时间 (UTC+08:00)', value: 'Asia/Shanghai' },
    { label: 'Africa/Abidjan (UTC+00:00)', value: 'Africa/Abidjan' },
    { label: 'Africa/Accra (UTC+00:00)', value: 'Africa/Accra' },
    { label: 'Africa/Addis Ababa (UTC+03:00)', value: 'Africa/Addis_Ababa' },
    { label: 'Africa/Algiers (UTC+01:00)', value: 'Africa/Algiers' },
    { label: 'Africa/Asmara (UTC+03:00)', value: 'Africa/Asmara' },
]



const lastOptions = [
    { label: '当前小时', value: QuickTimeInterval.CURRENT_HOUR },
    { label: '当前天', value: QuickTimeInterval.CURRENT_DAY },
    { label: '当天到目前为止', value: QuickTimeInterval.CURRENT_DAY_SO_FAR },
    { label: '本周(周日至周六)', value: QuickTimeInterval.CURRENT_WEEK },
    { label: '本周(周一至周日)', value: QuickTimeInterval.CURRENT_WEEK_ISO },
    { label: '本周到目前为止（周日至周六）', value: QuickTimeInterval.CURRENT_WEEK_SO_FAR },
    { label: '本周到目前为止（周一至周日）', value: QuickTimeInterval.CURRENT_WEEK_ISO_SO_FAR },
    { label: '本月', value: QuickTimeInterval.CURRENT_MONTH },
    { label: '本月到目前为止', value: QuickTimeInterval.CURRENT_MONTH_SO_FAR },
    { label: '当前季度', value: QuickTimeInterval.CURRENT_QUARTER },
    { label: '当前季度到目前为止', value: QuickTimeInterval.CURRENT_QUARTER_SO_FAR },
    { label: '当前半年', value: QuickTimeInterval.CURRENT_HALF_YEAR },
    { label: '当前半年到目前为止', value: QuickTimeInterval.CURRENT_HALF_YEAR_SO_FAR },
    { label: '本年', value: QuickTimeInterval.CURRENT_YEAR },
    { label: '本年到目前为止', value: QuickTimeInterval.CURRENT_YEAR_SO_FAR },
]

const historyOption = [
    { label: '昨天', value: QuickTimeInterval.YESTERDAY },
    { label: '前天', value: QuickTimeInterval.DAY_BEFORE_YESTERDAY },
    { label: '前一周的这一天', value: QuickTimeInterval.THIS_DAY_LAST_WEEK },
    { label: '前一周（周日至周六）', value: QuickTimeInterval.PREVIOUS_WEEK },
    { label: '前一周（周一至周日）', value: QuickTimeInterval.PREVIOUS_WEEK_ISO },
    { label: '前一个月', value: QuickTimeInterval.PREVIOUS_MONTH },
    { label: '上季度', value: QuickTimeInterval.PREVIOUS_QUARTER },
    { label: '前半年', value: QuickTimeInterval.PREVIOUS_HALF_YEAR },
    { label: '前一年', value: QuickTimeInterval.PREVIOUS_YEAR },
    ...lastOptions
]


const visible = ref(false)
const checked = ref(true)

watch(() => props.type, (v) => {
    if (v) {
        checked.value = false
        return
    }
    checked.value = true
})

const form = reactive({
    interval: '1000',
    intervalTime: {
        day: 0,
        hour: 0,
        min: 0,
        second: 0,
    },
    aggregation: {
        type: AggregationType.NONE,
        limit: 1000
    },
    type: 1,
    timezone: 'Asia/Shanghai',
    timewindowMs: '',
    customTimeWindow: {
        day: 0,
        hour: 0,
        min: 0,
        second: 0,
    },
    timewindowMs2: [],
    hideAggInterval: false,
    hideAggregation: false,
    hideTimezone: false,
    selectedTab: 0,
    startTimeMs: 0,
    quickInterval: QuickTimeInterval.CURRENT_HOUR,
    fixedTimewindow: {
        startTimeMs: 0,
        endTimeMs: 0,
    }

})

const emit = defineEmits(['submit', 'submitDes'])


const changeTabs = (value: TimewindowType) => {
    checked.value = !checked.value;
    if (unref(checked) && form.type === HistoryWindowType.FIXED) {
        form.type = HistoryWindowType.LAST_INTERVAL
        return
    }
    form.type === HistoryWindowType.LAST_INTERVAL
}






const intervalGroup = computed(() => {
    if (form.type === HistoryWindowType.INTERVAL) {
        return intervalOption
    }
    let times = 0
    if (form.type === HistoryWindowType.LAST_INTERVAL && form.timewindowMs === 'Custom') {
        const day = calcMillisecond(Number(form.customTimeWindow.day), 'day') || 0;
        const hour = calcMillisecond(Number(form.customTimeWindow.hour), 'hour') || 0;
        const minute = calcMillisecond(Number(form.customTimeWindow.min), 'minute') || 0;
        const second = calcMillisecond(Number(form.customTimeWindow.second), 'second') || 0;
        times = day + hour + minute + second
    }
    if (form.type === HistoryWindowType.FIXED) {
        times = Number(form.timewindowMs2[1]) - Number(form.timewindowMs2[0])
    }
    return intervalOption.filter(item => (item.value && Number(item.value) <= times) || item.value === 'Custom' || item.value === 1000)
})

const open = () => {
    visible.value = true
}
const close = () => {
    visible.value = false
}

const onSave = () => {
    const { aggregation, type, timezone, quickInterval, timewindowMs2 } = form
    const timeWindowConfig: thingsboard.Timewindow = {
        selectedTab: unref(checked) ? thingsboard.TimewindowType.REALTIME : thingsboard.TimewindowType.HISTORY,
        aggregation: { limit: aggregation.limit, type: aggregation.type },
    }
    let timewindowMs = 0, interval = 0, timeDescription = '';
    if (form.timewindowMs === 'Custom') {
        const day = calcMillisecond(Number(form.customTimeWindow.day), 'day') || 0;
        const hour = calcMillisecond(Number(form.customTimeWindow.hour), 'hour') || 0;
        const minute = calcMillisecond(Number(form.customTimeWindow.min), 'minute') || 0;
        const second = calcMillisecond(Number(form.customTimeWindow.second), 'second') || 0;
        timewindowMs = day + hour + minute + second
    } else {
        timewindowMs = Number(form.timewindowMs)
    }

    if (form.interval === 'Custom') {
        const day = calcMillisecond(Number(form.intervalTime.day), 'day') || 0;
        const hour = calcMillisecond(Number(form.intervalTime.hour), 'hour') || 0;
        const minute = calcMillisecond(Number(form.intervalTime.min), 'minute') || 0;
        const second = calcMillisecond(Number(form.intervalTime.second), 'second') || 0;
        interval = day + hour + minute + second
    } else {
        interval = Number(form.interval)
    }

    if (unref(checked)) {
        timeDescription = '实时 - '
        timeWindowConfig.realtime = {
            interval,
        }
        if (timeWindowConfig.realtime) {
            if (type === HistoryWindowType.LAST_INTERVAL) {
                timeWindowConfig.realtime.timewindowMs = timewindowMs
                timeWindowConfig.realtime.realtimeType = RealtimeWindowType.LAST_INTERVAL
                timeWindowConfig.timezone = timezone
                if (form.timewindowMs === 'Custom') {
                    const { day, hour, min, second } = form.customTimeWindow
                    timeDescription += `最后 ${day ? day + '天' : ''} ${hour ? hour + '小时' : ''} ${min ? min + '分' : ''} ${second ? second + '秒' : ''}`
                } else {
                    const matchMs = timeOptions.find(k => k.value === timewindowMs)
                    if (matchMs) {
                        timeDescription += `最后 ${matchMs.label}`
                    }
                }
            } else if (type === HistoryWindowType.INTERVAL) {
                timeWindowConfig.realtime.quickInterval = quickInterval
                timeWindowConfig.realtime.realtimeType = RealtimeWindowType.INTERVAL
                timeWindowConfig.timezone = timezone
                const matchMs = lastOptions.find(k => k.value === quickInterval)
                if (matchMs) {
                    timeDescription += matchMs.label
                }
            }
        }


    } else {
        timeDescription = '历史 - '
        timeWindowConfig.history = {
            interval
        }
        if (timeWindowConfig.history) {
            if (type === HistoryWindowType.LAST_INTERVAL) {
                timeWindowConfig.history.timewindowMs = timewindowMs;
                timeWindowConfig.history.historyType = HistoryWindowType.LAST_INTERVAL;
                timeWindowConfig.timezone = timezone;
                if (form.timewindowMs === 'Custom') {
                    const { day, hour, min, second } = form.customTimeWindow
                    timeDescription += `最后 ${day ? day + '天' : ''} ${hour ? hour + '小时' : ''} ${min ? min + '分' : ''} ${second ? second + '秒' : ''}`
                } else {
                    const matchMs = timeOptions.find(k => k.value === timewindowMs)
                    if (matchMs) {
                        timeDescription += `最后 ${matchMs.label}`
                    }
                }
            } else if (type === HistoryWindowType.INTERVAL) {
                timeWindowConfig!.history.quickInterval = quickInterval;
                timeWindowConfig.history.historyType = HistoryWindowType.INTERVAL;
                timeWindowConfig.timezone = timezone;
                const matchMs = historyOption.find(k => k.value === quickInterval)
                if (matchMs) {
                    timeDescription += matchMs.label
                }

            } else {
                timeWindowConfig.history.fixedTimewindow = {
                    startTimeMs: timewindowMs2[0],
                    endTimeMs: timewindowMs2[1],
                }
                timeDescription += `从 ${formatTime(timewindowMs2[0])} 到 ${formatTime(timewindowMs2[1])}`
            }
        }

    }

    emit('submit', timeWindowConfig)
    emit('submitDes', timeDescription)
    visible.value = false
}

defineExpose({
    open,
    close
})
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0 16px;
}

.tabs {
    flex-grow: 1;
    display: flex;
    background-color: #F0F0F0;
    border-radius: 30px;
    margin-right: 16px;
}

.tabs:hover {
    cursor: pointer;
}

.title {
    width: 50%;
    padding: 4px 0;
    text-align: center;
    border-radius: 30px;
}

.checkoutBgc {
    background-color: #409eff;
    color: #fff;
}

.icon:hover {
    cursor: pointer;
}

.group {
    border: 1px solid #E0E0E0;
    border-radius: 10px;
    padding: 10px 20px;
    margin-bottom: 16px;
}

.content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.range-time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.group-title {
    margin: 10px 0 16px;
    font-size: 16px;
}

.time {
    margin: 0 0 4px 3px;
}
</style>