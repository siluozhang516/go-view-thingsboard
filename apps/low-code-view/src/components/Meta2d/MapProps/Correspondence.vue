<template>
    <Form :form-list="map" />
    <Form :form-list="h" />
    <el-collapse accordion>
        <el-collapse-item title="消息处理JavaScript">
            <el-form label-width='100px'>
                <el-form-item label="消息处理">
                    <el-button @click="onOpenEditContainerSocketCbJs">...</el-button>
                </el-form-item>
            </el-form>
        </el-collapse-item>
    </el-collapse>

    <!-- 代码 -->
    <CodeEdit v-model:visible="codeVisible" language="javascript" v-model="code" @done=" updateCode " title="JavaScript"
        :tip="{ subTitle: `打开图纸后，执行的初始脚本。 <br />可获取pen和context参数 <br />例如，console.log('pen', 'context');return true;`}" />
    <EditDialog title="请求头配置" v-model=" httpHeaderVal " v-model:visible=" visible " @done=" done " />
</template>

<script setup>
import Form from '@/components/Meta2d/Form.vue'
import { communicateProp, httpProp } from '@/config/defaultConfig'
import EditDialog from '@/components/Meta2d/EditDialog.vue'
import { computed, reactive, ref, nextTick } from 'vue';
import { ElMessage } from 'element-plus'
import CodeEdit from '@/components/Meta2d/CodeEdit.vue'

const httpHeaderVal = ref('')
const httpHeaderIndex = ref(0)

const visible = ref(false)

const m = reactive(communicateProp)

const http = reactive(httpProp)

/** 添加httpHeader回调 */
const done = (val) => {
    http[httpHeaderIndex.value].httpHeaders = val
    try {
        if (!meta2d.store.data.https) {
            meta2d.store.data.https = []
        }
        !meta2d.store.data.https[httpHeaderIndex.value] && (meta2d.store.data.https[httpHeaderIndex.value] = {})
        meta2d.store.data.https[httpHeaderIndex.value].httpHeaders = JSON.parse(val); // 请求头设置
        if (meta2d.store.data.https[httpHeaderIndex.value].http) {
            meta2d.connectHttp();
        }
    } catch (error) {
        ElMessage.error('请求头格式错误')
    }

}

const map = computed(() => {
    return [
        {
            title: "websocket",
            labelWidth: 100,
            children: [
                {
                    title: "URL地址",
                    type: "input",
                    prop: "websocketUrl",
                    bindProp: m,
                    event: "change",
                    option: {
                        placeholder: "请输入",
                        tip: '必须以ws(s)开头，否则不保存',
                    },
                    func(val) {
                        let reg = /^ws:\/\/|wss:\/\//
                        if (val && !reg.test(val)) {
                            ElMessage({
                                type: "error",
                                message: "请输入正确的地址",
                            })
                            return false
                        }
                        meta2d.store.data.websocket = val;
                        if (!val) {
                            meta2d.closeWebsocket()
                            return false
                        }
                        meta2d.connectWebsocket();
                    }
                },
            ]
        },
        {
            title: "MQTT",
            labelWidth: 120,
            children: [
                {
                    title: "URL地址",
                    type: "input",
                    prop: "mqttUrl",
                    bindProp: m,
                    event: "change",
                    option: {
                        placeholder: "请输入",
                        tip: '必须以ws(s)开头，否则不保存',
                    },
                    func(val) {
                        if (!val) {
                            meta2d.store.data.mqtt = val;
                            meta2d.closeMqtt();
                        }
                    }
                },
                {
                    title: "Client ID",
                    type: "input",
                    prop: "clientId",
                    bindProp: m,
                    event: "change",
                },
                {
                    title: "关闭自动生成",
                    type: "switch",
                    prop: "customClientId",
                    bindProp: m,
                    event: "change",
                    option: {
                        placeholder: "请输入",
                        tip: '是否关闭client ID自动生成',
                    }
                },
                {
                    title: "用户名",
                    type: "input",
                    prop: "username",
                    bindProp: m,
                    event: "change",
                    option: {
                        placeholder: "请输入用户名"
                    }
                },
                {
                    title: "密码",
                    type: "input",
                    prop: "password",
                    bindProp: m,
                    event: "change",
                    option: {
                        placeholder: "请输入密码",
                        type: "password"
                    }
                },
                {
                    title: "Topics",
                    type: "input",
                    prop: "mqttTopics",
                    bindProp: m,
                    event: "change",
                    option: {
                        placeholder: "多个topic用英文','分割",
                        tip: "多个topic用英文','分割",
                    }
                },
                {
                    title: "",
                    type: "button",
                    prop: "",
                    bindProp: m,
                    event: "click",
                    option: {
                        labelWidth: '0px',
                        text: "连接MQTT",
                        block: true
                    },
                    func() {
                        let reg = /^ws|wss:\/\//
                        if (!m.mqttUrl || !reg.test(m.mqttUrl)) {
                            ElMessage({
                                type: "error",
                                message: "请输入正确的地址",
                            })
                            return false
                        }
                        if (m.customClientId && !m.clientId) {
                            ElMessage({
                                type: "error",
                                message: "请输入clientId",
                            })
                            return false
                        }
                        // meta2d.closeMqtt();
                        meta2d.store.data.mqtt = m.mqttUrl;
                        meta2d.store.data.mqttTopics = m.mqttTopics;
                        meta2d.store.data.mqttOptions = {
                            clientId: m.clientId,
                            username: m.username,
                            password: m.password,
                            customClientId: m.customClientId
                        };
                        meta2d.connectMqtt();
                    }
                }
            ]
        },
    ]
})


const h = computed(() => {
    return http.map((it, i) => {
        let obj = {
            title: `http${i + 1}`,
            delete: true,
            labelWidth: 100,
            func(index) {
                if (http.length < 2) {
                    ElMessage.warning('至少保留一个http');
                    return false
                }
                http.splice(index, 1)
                meta2d.store.data.https.splice(index, 1)
                meta2d.closeHttp()
                meta2d.connectHttp()
            },
            children: [
                {
                    title: "请求方式",
                    type: 'select',
                    prop: 'method',
                    bindProp: http[i],
                    event: "change",
                    option: {
                        list: [
                            { label: 'GET', value: 'GET' },
                            { label: 'POST', value: 'POST' },
                        ],
                        placeholder: "请选择请求方式"
                    },
                    func(val) {
                        if (!meta2d.store.data.https) {
                            meta2d.store.data.https = []
                        }
                        !meta2d.store.data.https[i] && (meta2d.store.data.https[i] = {})
                        meta2d.store.data.https[i].method = val;
                        if (meta2d.store.data.https[i].http) {
                            meta2d.connectHttp();
                        }
                    }

                },
                {
                    title: "URL地址",
                    type: 'input',
                    prop: 'http ',
                    bindProp: http[i],
                    event: "change",
                    option: {
                        placeholder: "请选择URL地址"
                    },
                    func(val) {
                        if (!meta2d.store.data.https) {
                            meta2d.store.data.https = []
                        }
                        !meta2d.store.data.https[i] && (meta2d.store.data.https[i] = {})
                        meta2d.store.data.https[i].http = val;
                        meta2d.closeHttp()
                        meta2d.connectHttp();
                    }

                },
                {
                    title: "时间间隔",
                    type: 'number',
                    prop: 'httpTimeInterval',
                    bindProp: http[i],
                    event: "change",
                    option: {
                        placeholder: "请输入时间间隔",
                        min: 100
                    },
                    func(val) {
                        if (!meta2d.store.data.https) {
                            meta2d.store.data.https = []
                        }
                        !meta2d.store.data.https[i] && (meta2d.store.data.https[i] = {})
                        meta2d.store.data.https[i].httpTimeInterval = val
                        meta2d.closeHttp()
                        if (meta2d.store.data.https[i].http) {
                            meta2d.connectHttp();
                        }
                    }
                },
                {
                    title: "请求头",
                    type: 'button',
                    prop: 'httpHeaders',
                    bindProp: http[i],
                    event: "click",
                    option: {
                        text: "...",
                        type: 'default',
                        size: 'small'
                    },
                    func(e, childindex, index) {
                        visible.value = true
                        httpHeaderVal.value = http[index].httpHeaders
                        httpHeaderIndex.value = index
                    }
                },
            ]
        }
        let length = http.length;
        if (length === (i + 1)) {
            obj.children.push({
                title: "",
                type: 'button',
                event: "click",
                option: {
                    labelWidth: '0px',
                    text: "添加http通信",
                    block: true
                },
                func(e, childindex, index) {
                    http.push({
                        method: 'GET',
                        http: '',
                        httpHeaders: "{}",
                        httpTimeInterval: 1000
                    })
                }
            })
        }
        return obj
    })
})

const codeVisible = ref(false)
const code = ref('')

const onOpenEditContainerSocketCbJs = () => {
    codeVisible.value = true;
    nextTick(() => {
        let _ = meta2d.store.data['socketCbJs'];
        code.value = _
    });
}

const updateCode = () => {
    meta2d.store.data['socketCbJs'] = code.value;
    meta2d.listenSocket();
}

</script>