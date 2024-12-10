<template>
    <Teleport to="body">
        <transition>
            <ul class="right-menu" v-show="visible" :style="menusPostion">
                <li v-for="(item) in menus" :key="item.title">
                    <div class="right-menu-item" :class="{ disabled: item.disabled }" v-if="item.type != 'divider'"
                        @click="itemClick(item)">
                        <div class="right-menu-item-title">{{ item.title }}</div>
                        <div class="right-menu-item-content">
                            {{ item.ctrl }}
                        </div>
                    </div>
                    <el-divider style="margin: 0" v-else />
                </li>
            </ul>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    modelValue: boolean,
    menus: Array<Record<string, any>>,
    position: Array<number>
}>(), {
    modelValue: false,
    position: () => [0, 0],
    menus: () => []
})


const emit = defineEmits(['update:modelValue', 'selectMenu'])

let visible = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})

const menusPostion = computed(() => {
    const [x, y] = props.position
    let { height } = document.body.getBoundingClientRect()
    let menusHeight = 460
    let t = y + menusHeight
    let top = y
    let obj: any
    if (t >= height) {
        top = height - y
        obj = {
            left: x + 'px',
            bottom: top + 'px'
        }
    } else {
        obj = {
            left: x + 'px',
            top: top + 'px'
        }
    }

    return obj
})


/** 菜单项点击 */
function itemClick(item: Record<string, any>) {
    if (item.disabled) return false
    emit('selectMenu', item)
    item.func && item.func()
    visible.value = false
}


</script>

<style scoped>
.right-menu {
    position: fixed;
    z-index: 19900920;
    min-width: 200px;
    min-height: 250px;
    max-height: 470px;
    overflow: auto;
    background: #fff;
    box-shadow: 0 2px 8px #05050526;
    border-radius: 2px;
    list-style: none;
    padding: 0;
    margin: 0;
}

.right-menu-item {
    padding: 10px 20px;
    line-height: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

.right-menu-item:hover {
    background: #f5f5f5;
}

.right-menu-item.disabled {
    color: #918f8f;
}

.right-menu-item.disabled:hover {
    background: #fff;
    cursor: not-allowed;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
