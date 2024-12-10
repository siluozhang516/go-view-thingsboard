<template>
    <div class="icons">
        <i @click="handleClick(item)" :key="item.icon" v-for="item in iconList" :class="item.icon"
            class="icon ticon"></i>
    </div>
</template>

<script setup>
const emit = defineEmits(['change'])

const iconList = [
    { icon: 'ticon-cube', value: '\ue6fc' },
    { icon: 'ticon-up-down', value: '\ue623' },
    { icon: 'ticon-website', value: '\ue70f' },
    { icon: 'ticon-clock', value: '\ue75c' },
    { icon: 'ticon-camera', value: '\ue78a' },
    { icon: 'ticon-flow', value: '\ue85a' },
    { icon: 'ticon-dashboard1', value: '\ue873' },
    { icon: 'ticon-github', value: '\ue8fd' },
    { icon: 'ticon-upload', value: '\ue79f' },
    { icon: 'ticon-download', value: '\ue79c' },
    { icon: 'ticon-analytics', value: '\ue6a5' },
    { icon: 'ticon-stop', value: '\ue619' },
    { icon: 'ticon-stop1', value: '\ue622' },
    { icon: 'ticon-kefu', value: '\ue658' },
    { icon: 'ticon-exit1', value: '\ue6ab' },
    { icon: 'ticon-enter', value: '\ue63d' },
    { icon: 'ticon-exit', value: '\ue641' },
    { icon: 'ticon-share', value: '\ue620' },
    { icon: 'ticon-wechat', value: '\ue646' },
    { icon: 'ticon-pay6', value: '\ue68f' },
    { icon: 'ticon-pay3', value: '\ue691' },
    { icon: 'ticon-weibo', value: '\ue63e' },
    { icon: 'ticon-message', value: '\ue729' },
    { icon: 'ticon-app', value: '\ue618' },
    { icon: 'ticon-shoppingcart', value: '\ue62e' },
    { icon: 'ticon-people', value: '\ue651' },
    { icon: 'ticon-people2geren', value: '\ue673' },
    { icon: 'ticon-people4geren', value: '\ue68a' },
    { icon: 'ticon-jiankong', value: '\ue61e' },
    { icon: 'ticon-cpu', value: '\ue61f' },
    { icon: 'ticon-iot', value: '\ue627' },
    { icon: 'ticon-iot1', value: '\ue611' },
    { icon: 'ticon-iot2', value: '\ue617' },
    { icon: 'ticon-warning', value: '\ue6a9' },
    { icon: 'ticon-error', value: '\ue6b1' },
    { icon: 'ticon-success', value: '\ue6b3' },
    { icon: 'ticon-document', value: '\ue707' },
    { icon: 'ticon-folder', value: '\ue70e' },
    { icon: 'ticon-list', value: '\ue610' },
    { icon: 'ticon-kaiguan', value: '\ue67f' },
    { icon: 'ticon-search', value: '\ue60f' },
    { icon: 'ticon-remote-control', value: '\ue607' },
    { icon: 'ticon-browser', value: '\ue60b' },
    { icon: 'ticon-185055paintingpalletstreamline', value: '\ue61b' },
    { icon: 'ticon-house', value: '\ue61c' },
    { icon: 'ticon-map', value: '\ue61d' },
    { icon: 'ticon-sound', value: '\ue631' },
    { icon: 'ticon-link', value: '\ue63a' },
    { icon: 'ticon-umbrella', value: '\ue64b' },
    { icon: 'ticon-dashboard', value: '\ue653' },
    { icon: 'ticon-settings', value: '\ue654' },
    { icon: 'ticon-sync', value: '\ue657' },
    { icon: 'ticon-data-stream', value: '\uebd3' },
    { icon: 'ticon-streaming', value: '\ue8f9' },
    { icon: 'ticon-record', value: '\ue60d' },
    { icon: 'ticon-streamSQL', value: '\ue6d3' },
    { icon: 'ticon-locked', value: '\ue791' },
    { icon: 'ticon-unlocked', value: '\ue87b' },
    { icon: 'ticon-api', value: '\ue616' },
    { icon: 'ticon-email', value: '\ue67c' },
    { icon: 'ticon-apiassembly', value: '\ue67d' },
    { icon: 'ticon-api1', value: '\ue603' },
    { icon: 'ticon-api2', value: '\ue75d' },
    { icon: 'ticon-nodejs', value: '\ue989' },
    { icon: 'ticon-java', value: '\ue746' },
    { icon: 'ticon-safe', value: '\ue727' },
    { icon: 'ticon-html', value: '\ue606' },
    { icon: 'ticon-python', value: '\ue60e' },
    { icon: 'ticon-docker', value: '\ue689' },
    { icon: 'ticon-golang', value: '\ue615' },
    { icon: 'ticon-ks', value: '\ue685' },
    { icon: 'ticon-cloud-code', value: '\ue690' },
    { icon: 'ticon-rocketmq', value: '\ue6aa' },
    { icon: 'ticon-kafka', value: '\ue604' },
    { icon: 'ticon-fuwuqi', value: '\ue614' },
    { icon: 'ticon-rabbitmq', value: '\ue61a' },
    { icon: 'ticon-cassandra', value: '\ue621' },
    { icon: 'ticon-MongoDB', value: '\ue6f0' },
    { icon: 'ticon-hbase', value: '\ue67b' },
    { icon: 'ticon-redis', value: '\ue682' },
    { icon: 'ticon-sql', value: '\ue718' },
    { icon: 'ticon-mysql', value: '\ue652' },
    { icon: 'ticon-pgsql', value: '\ue706' },
    { icon: 'ticon-parallel', value: '\ue748' },
    { icon: 'ticon-db', value: '\ue645' },
    { icon: 'ticon-data1', value: '\ue761' },
    { icon: 'ticon-data2', value: '\ue60c' },
    { icon: 'ticon-data3', value: '\ue609' },
    { icon: 'ticon-data', value: '\ue649' },
    { icon: 'ticon-bub', value: '\uec73' },
    { icon: 'ticon-zuoji', value: '\ue68e' },
    { icon: 'ticon-firewall', value: '\ue630' },
    { icon: 'ticon-cloud-firewall', value: '\ue62b' },
    { icon: 'ticon-cloud-server', value: '\ue665' },
    { icon: 'ticon-earch', value: '\ue608' },
    { icon: 'ticon-printer', value: '\ue67e' },
    { icon: 'ticon-satelite', value: '\ued48' },
    { icon: 'ticon-satelite2', value: '\ued47' },
    { icon: 'ticon-router', value: '\ue612' },
    { icon: 'ticon-router2', value: '\ue613' },
    { icon: 'ticon-antenna', value: '\ue602' },
    { icon: 'ticon-antenna2', value: '\ue679' },
    { icon: 'ticon-antenna3', value: '\ue694' },
    { icon: 'ticon-building', value: '\ue601' },
    { icon: 'ticon-office', value: '\ue605' },
    { icon: 'ticon-ipad', value: '\ue664' },
    { icon: 'ticon-wifi', value: '\ue637' },
    { icon: 'ticon-network1', value: '\ue64d' },
    { icon: 'ticon-network', value: '\ue63b' },
    { icon: 'ticon-home', value: '\ue6ac' },
    { icon: 'ticon-cloud', value: '\ue60a' },
    { icon: 'ticon-mobile', value: '\ue63c' },
    { icon: 'ticon-pc', value: '\ue600' },
]
function handleClick(item) {
    emit("change", item)
}

</script>

<style>
.icons {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 16px;
}

.icons .icon {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
}

.icons i:hover {
    color: #1890ff;
    cursor: pointer;
}
</style>