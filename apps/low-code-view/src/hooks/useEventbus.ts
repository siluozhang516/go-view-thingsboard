import { onUnmounted } from 'vue'
import mitt from 'mitt'

const emitter = mitt()

const customEmit = (eventName: string) => {
    emitter.emit(eventName)
}

const customOn = (eventName: string, callback: () => void) => {
    emitter.on(eventName, () => callback())
}

export const useEventbus = () => {
    // 销毁的事件
    onUnmounted(() => {
        // 清空所有的事件，避免多组件互相清理
        emitter.all.clear()
    })

    return {
        customEmit,
        customOn
    }
}
