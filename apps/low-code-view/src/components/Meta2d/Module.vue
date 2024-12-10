<template>
    <div class="module-box">
        <div class="module-box-plan" v-for="(item, index) in pathList" :key="index" @dblclick="handleJson(item, index)">
            <div  class="module-box-item"></div>
            <p class="module-box-p">{{ item?.name }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { fileJsonPath, fetchJson } from "@/utils/meta2d";
import { nextTick, onMounted, ref } from "vue";
const pathList = ref<any>([]);
onMounted(() => {
    nextTick(() => {
        pathList.value = fileJsonPath();
        const prefix = '/module/';
        setTimeout(() => {
            const moduleBoxItem: any = document.getElementsByClassName("module-box-item");
            pathList.value.forEach(async (item: any, index: number) => {
                const res:any = await fetchJson(item?.path);
                item.json = res;
                item.imagePath = item?.path;
                item.document = moduleBoxItem;
                let path = `src/assets/images/chart/meta/${item.path.replace(new RegExp(`^${prefix}`), '')}`
                path = path.replace('json','png')
                moduleBoxItem[index].style.backgroundImage = `url(${path})`;
                moduleBoxItem[index].style.backgroundSize = `100% 100%`;
            })
        }, 100);
    });
})

const handleJson = (item: any, index: number) => {
    for(let i =0;i<item.document.length;i++){
        item.document[i].style.border = "none";
    }
    item.document[index].style.border = "4px solid #128bed";
    localStorage.setItem("meta2dJSON", JSON.stringify(item.json))
    meta2d.open(JSON.parse(JSON.stringify(item.json)), false);
    meta2d.emit('opened');
    meta2d.emit("changePens");
    meta2d.setGrid({
        grid: false
    });
    meta2d.render(true);
}
</script>

<style scoped>
.module-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

.module-box-plan {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    cursor: pointer;
}

.module-box-item {
    width: 100%;
    height: 180px;
}

.module-box-p {
    text-align: center;
    padding: 6px 0;
}
.style-active{
    border: 4px solid #128bed;
}
</style>