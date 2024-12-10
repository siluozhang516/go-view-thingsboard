<script setup>
const props = defineProps(['formList'])
import GColorPicker from '@/components/Meta2d/GColorPicker.vue'
function convertGradient(data) {
    if (data.type === 'linear-gradient') {
        const orientation = data.orientation.type === 'angular' ? `${data.orientation.value}deg` : `${data.orientation.value}`;

        // Sort color stops by their length value
        const colorStops = data.colorStops.sort((a, b) => parseFloat(a.length.value) - parseFloat(b.length.value));

        // Create the gradient color string
        const gradientColor = colorStops.map(stop => {
            const color = `rgba(${stop.value.join(', ')})`;
            return `${color} ${stop.length.value}${stop.length.type}`;
        }).join(', ');

        // Form the complete linear-gradient string
        return `linear-gradient(${orientation}, ${gradientColor})`;
    } else {
        // Sort color stops by their length value
        const colorStops = data.colorStops.sort((a, b) => parseFloat(a.length.value) - parseFloat(b.length.value));

        // Create the gradient color string
        const gradientColor = colorStops.map(stop => {
            const color = `rgba(${stop.value.join(', ')})`;
            return `${color} ${stop.length.value}${stop.length.type}`;
        }).join(', ');
        return `radial-gradient(circle, ${gradientColor})`
        // return data.gradientColor
    }

}

const gradientDataChange = (i, gradientData) => {
    const gradientColor = convertGradient(gradientData)
    i.bindProp[i.prop] = gradientColor
    i?.func(gradientColor)
}
</script>

<template>
    <el-collapse accordion>
        <el-collapse-item v-for="(item, index) in props.formList" :title="item.title" :key="index">
            <template #title>
                <div class="title-box">
                    <div class="title-left">
                        <span>{{ item.title }}</span>
                        <el-tooltip v-if="item.tip" :content="item.tip" effect="dark" placement="top">
                            <el-icon style="margin-left: 4px">
                                <warningFilled />
                            </el-icon>
                        </el-tooltip>
                    </div>
                    <el-popconfirm v-if="item.delete" @confirm.stop="item.func && item.func(index)" title="确定要删除吗?"
                        cancel-button-text="取消" confirm-button-text="确定">
                        <template #reference>
                            <el-icon @click.stop style="margin-right: 10px">
                                <Delete />
                            </el-icon>
                        </template>
                    </el-popconfirm>
                </div>
            </template>
            <el-form @submit="(e) => e.preventDefault()" :label-width="item.labelWidth || '150px'">
                <!-- eslint-disable-next-line vue/no-useless-template-attributes -->
                <template v-for="(i, childIndex) in item.children" :label="i.title" :key="childIndex">
                    <!--输入框-->
                    <el-form-item :label-width="i.option?.labelWidth"
                        v-if="i.type === 'input' && !i.option?.hidden?.value">
                        <template #label>
                            <span>{{ i.title }}</span>
                            <el-tooltip v-if="i.option?.tip" class="item" effect="dark" :content="i.option?.tip"
                                placement="top">
                                <el-icon style="margin-left: 4px;"><warningFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <el-input v-model="i.bindProp[i.prop]" :placeholder="i.option?.placeholder" @[i.event]="i.func"
                            :type="i.option?.type || 'text'" :clearable="i.option?.clearable || false"
                            :readonly="i.option?.readonly || false" :disabled="i.option?.disabled || false" />
                    </el-form-item>
                    <!--文件框-->
                    <el-form-item :label-width="i.option?.labelWidth"
                        v-if="i.type === 'file' && !i.option?.hidden?.value">
                        <template #label>
                            <span>{{ i.title }}</span>
                            <el-tooltip v-if="i.option?.tip" class="item" effect="dark" :content="i.option?.tip"
                                placement="top">
                                <el-icon style="margin-left: 4px;"><warningFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <el-button>
                            <label :for="i.for || i.title">
                                <input :id="i.for || i.title" style="display: none" type="file"
                                    :accept="i.option?.accept || '*/*'" @[i.event]="i.func" />
                                选择文件
                            </label>
                        </el-button>
                    </el-form-item>
                    <!-- 图片 -->
                    <el-form-item :label-width="i.option?.labelWidth"
                        v-if="i.type == 'image' && !i.option?.hidden?.value">
                        <template #label>
                            <span>{{ i.title }}</span>
                            <el-tooltip v-if="i.option?.tip" class="item" effect="dark" :content="i.option?.tip"
                                placement="top">
                                <el-icon style="margin-left: 4px;"><warningFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <el-upload class="avatar-uploader" action="" :accept="i.option?.accept || '*/*'"
                            :before-upload="i.func" :show-file-list="false">
                            <img v-if="i.bindProp[i.prop]" :src="i.bindProp[i.prop]" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>
                    <!-- 按钮 -->
                    <el-form-item :label-width="i.option?.labelWidth"
                        v-if="i.type === 'button' && !i.option?.hidden?.value">
                        <template #label>
                            <span>{{ i.title }}</span>
                            <el-tooltip v-if="i.option?.tip" class="item" effect="dark" :content="i.option?.tip"
                                placement="top">
                                <el-icon style="margin-left: 4px;"><warningFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <el-button :class="{ block: i.option?.block }" @[i.event]="i.func($event, childIndex, index)"
                            :type="i.option?.type || 'primary'" :size="i.option?.size">
                            {{ i.option?.text || '按钮' }}
                        </el-button>
                    </el-form-item>
                    <!--数字框-->
                    <el-form-item :label-width="i.option?.labelWidth"
                        v-if="i.type === 'number' && !i.option?.hidden?.value">
                        <template #label>
                            <span>{{ i.title }}</span>
                            <el-tooltip v-if="i.option?.tip" class="item" effect="dark" :content="i.option?.tip"
                                placement="top">
                                <el-icon style="margin-left: 4px;"><warningFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <el-input-number controls-position="right" :placeholder="i.option?.placeholder || '请输入'"
                            :step="i.option?.step || 1" v-model="i.bindProp[i.prop]" :min="i.option?.min ?? -Infinity"
                            :max="i.option?.max ?? Infinity" @[i.event]="i.func" :readonly="i.option?.readonly" />
                    </el-form-item>
                    <!--选择框-->
                    <el-form-item :label-width="i.option?.labelWidth"
                        v-if="i.type === 'select' && !i.option?.hidden?.value">
                        <template #label>
                            <span>{{ i.title }}</span>
                            <el-tooltip v-if="i.option?.tip" class="item" effect="dark" :content="i.option?.tip"
                                placement="top">
                                <el-icon style="margin-left: 4px;"><warningFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <el-select v-model="i.bindProp[i.prop]" :placeholder="i.option.placeholder" @[i.event]="i.func">
                            <el-option v-for="item in i.option.list" :key="item.value" :label="item.label"
                                :value="item.value" :disabled="item.disabled">
                                <div v-if="item.template" class="select_template" v-html="item.template"></div>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 下拉菜单 -->
                    <el-form-item :label-width="i.option?.labelWidth"
                        v-if="i.type === 'dropdown' && !i.option?.hidden?.value">
                        <template #label>
                            <span>{{ i.title }}</span>
                            <el-tooltip v-if="i.option?.tip" class="item" effect="dark" :content="i.option?.tip"
                                placement="top">
                                <el-icon style="margin-left: 4px;"><warningFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>

                        <el-dropdown @[i.event]="i.func" trigger="click">
                            <span class="el-dropdown-link">
                                <span class="m-dropdown-text" v-if="i.bindProp[i.prop] !== undefined">
                                    <template v-if="i.option.list.find(it => it.value == i.bindProp[i.prop])?.template">
                                        <span
                                            v-html="i.option.list.find(it => it.value === i.bindProp[i.prop])?.template"></span>
                                    </template>
                                    <template v-if="i.option.list.find(it => it.value === i.bindProp[i.prop])?.icon">
                                        <svg class="icon-svg" aria-hidden="true">
                                            <use
                                                :xlink:href="'#' + i.option.list.find(it => it.value == i.bindProp[i.prop])?.icon">
                                            </use>
                                        </svg>

                                    </template>
                                </span>
                                <span v-else class="m-dropdown-text" style="opacity: 0.7;padding: 4px 0">
                                    {{ i.option.placeholder }}&nbsp;
                                </span>
                                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <template v-if="i.option?.list">
                                        <el-dropdown-item v-for="p in i.option.list" :key="p.value" :command="p.value">
                                            <span v-if="p.template" v-html="p.template"></span>
                                            <span v-else-if="p.icon">
                                                <svg class="icon-svg" aria-hidden="true">
                                                    <use :xlink:href="'#' + p.icon" />
                                                </svg>
                                            </span>
                                            <span v-else>{{ p.label }}</span>
                                        </el-dropdown-item>
                                    </template>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </el-form-item>
                    <!--取色器-->
                    <el-form-item :label-width="i.option?.labelWidth"
                        v-if="i.type === 'color' && !i.option?.hidden?.value">
                        <template #label>
                            <span>{{ i.title }}</span>
                            <el-tooltip v-if="i.option?.tip" class="item" effect="dark" :content="i.option?.tip"
                                placement="top">
                                <el-icon style="margin-left: 4px;"><warningFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>

                        <!-- <el-color-picker v-model="i.bindProp[i.prop]" show-alpha v-if="i.type === 'color'"
                        @[i.event]="i.func" /> -->
                        <g-color-picker :use-type="i.option?.useType" :default-color="i.option?.defaultColor"
                            v-model="i.bindProp[i.prop]" @[i.event]="i.func" />
                    </el-form-item>
                    <!-- 渐变取色器 -->
                    <el-form-item :label-width="i.option?.labelWidth"
                        v-if="i.type === 'gradientColor' && !i.option?.hidden?.value">
                        <template #label>
                            <span>{{ i.title }}</span>
                            <el-tooltip v-if="i.option?.tip" class="item" effect="dark" :content="i.option?.tip"
                                placement="top">
                                <el-icon style="margin-left: 4px;"><warningFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>

                        <!-- <el-color-picker v-model="i.bindProp[i.prop]" show-alpha v-if="i.type === 'color'"
                        @[i.event]="i.func" /> -->
                        <!-- <g-color-picker :use-type="i.option?.useType" :default-color="i.option?.defaultColor"
                            v-model="i.bindProp[i.prop]" @[i.event]="i.func" /> -->

                        <!-- <el-popover placement="bottom" title="Title" :width="400" trigger="click" :show-arrow="false"
                            :teleported="false" @show="i.option.showGradient = true" @hide="i.option.showGradient = false">
                            {{ i.option.showGradient }}
                            <GradientColorPicker v-if="i.option.showGradient.value" :color="i.bindProp[i.prop]" is-gradient
                                @[i.event]="(color) => {i.func(color.style);  i.bindProp[i.prop]=color.style}" />
                            <template #reference>
                                <div style="width: 50px;height: 24px" :style="{ background: i.bindProp[i.prop] || i.option?.defaultColor || 'black' }"></div>
                            </template>
                        </el-popover> -->
                        <color-picker pickerType="chrome" :use-type="i.option?.useType"
                            :gradientType="i.option?.gradientType?.value" :gradientColor="i.bindProp[i.prop]"
                            @gradientDataChange="(gradientData) => gradientDataChange(i, gradientData)" />
                    </el-form-item>
                    <!--开关-->
                    <el-form-item :label-width="i.option?.labelWidth"
                        v-if="i.type === 'switch' && !i.option?.hidden?.value">
                        <template #label>
                            <span>{{ i.title }}</span>
                            <el-tooltip v-if="i.option?.tip" class="item" effect="dark" :content="i.option?.tip"
                                placement="top">
                                <el-icon style="margin-left: 4px;"><warningFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <el-switch v-model="i.bindProp[i.prop]" @[i.event]="i.func" />
                    </el-form-item>
                    <!--滑块-->
                    <el-form-item :label-width="i.option?.labelWidth"
                        v-if="i.type === 'slider' && !i.option?.hidden?.value">
                        <template #label>
                            <span>{{ i.title }}</span>
                            <el-tooltip v-if="i.option?.tip" class="item" effect="dark" :content="i.option?.tip"
                                placement="top">
                                <el-icon style="margin-left: 4px;"><warningFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <el-slider v-model="i.bindProp[i.prop]" @[i.event]="i.func" :min="i.option?.min"
                            :max="i.option?.max" />
                    </el-form-item>
                    <!-- 图标 -->
                    <el-form-item :label-width="i.option?.labelWidth"
                        v-if="i.type === 'icon' && !i.option?.hidden?.value">
                        <template #label>
                            <span>{{ i.title }}</span>
                            <el-tooltip v-if="i.option?.tip" class="item" effect="dark" :content="i.option?.tip"
                                placement="top">
                                <el-icon style="margin-left: 4px;"><warningFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <i @[i.event]="i.func" class="icon ticon pointer font-18" :class="i.bindProp[i.prop]"
                            v-if="i.bindProp[i.prop]"></i>

                        <el-icon @[i.event]="i.deleteFunc" class="pointer ml-8 font-18"
                            v-if="i.bindProp[i.prop]"><Delete /></el-icon>
                        <el-icon @[i.event]="i.func" class="pointer  font-18"
                            v-if="!i.bindProp[i.prop]"><Edit /></el-icon>

                    </el-form-item>
                    <!-- link -->
                    <el-form-item :label-width="i.option?.labelWidth"
                        v-if="i.type === 'link' && !i.option?.hidden?.value">
                        <template #label>
                            <span>{{ i.title }}</span>
                            <el-tooltip v-if="i.option?.tip" class="item" effect="dark" :content="i.option?.tip"
                                placement="top">
                                <el-icon style="margin-left: 4px;"><warningFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <el-button type="primary" link size="small" @[i.event]="i.func">{{ i.option?.text }}</el-button>

                    </el-form-item>
                    <!-- code -->
                    <el-form-item :label-width="i.option?.labelWidth"
                        v-if="i.type === 'code' && !i.option?.hidden?.value">
                        <template #label>
                            <span>{{ i.title }}</span>
                            <el-tooltip v-if="i.option?.tip" class="item" effect="dark" :content="i.option?.tip"
                                placement="top">
                                <el-icon style="margin-left: 4px;"><warningFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <el-button size="small" @[i.event]="i.func">···</el-button>

                    </el-form-item>
                    <!-- 扩展 -->
                    <el-form-item v-if="i.type == 'extend'" :label-width="i.option?.labelWidth">
                        <template #label>
                            <span>{{ i.title }}</span>
                            <el-tooltip v-if="i.option?.tip" class="item" effect="dark" :content="i.option?.tip"
                                placement="top">
                                <el-icon style="margin-left: 4px;"><warningFilled />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <template v-for="(e, index) in i.option?.extendList" :key="index">
                            <component :is="e.component" v-bind="e.props">{{ e.text }}</component>
                        </template>
                    </el-form-item>
                    <!-- 对齐方式 -->
                    <template v-if="i.type == 'align'">
                        <img class="image-style-icon" :src="`/src/assets/icons/${i.icon}.svg`"
                            @[i.event]="i.func($event, childIndex, index)"
                            @[i.mouseOverEvent]="i.funcMouseOver($event, childIndex, index)"
                            @[i.mouseOutEvent]="i.funcMouseOut($event, childIndex, index)">
                    </template>
                </template>
            </el-form>
        </el-collapse-item>
    </el-collapse>
</template>

<style scoped>
:deep(.el-collapse-item__header) {
    font-weight: 1000;
}

:deep(.el-collapse-item__content) {
    margin-right: 15px;
}

.image-style-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    cursor: pointer;
}

.avatar-uploader .avatar {
    width: 100px;
    height: 100px;
    display: block;
}

.avatar-uploader :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload):hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
}

:deep(.el-form-item__label) {
    align-items: center
}

.block {
    display: block;
    width: 100%;
}

.title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

:deep(.el-dropdown) {
    padding: 5px 12px;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);
    width: 100%;
}

.el-dropdown-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.m-dropdown-text {
    display: inline-block;
    width: calc(100% - 20px);
    overflow: hidden
}

.pointer {
    cursor: pointer;
}

.font-18 {
    font-size: 18px;
}

.ml-8 {
    margin-left: 8px;
}

:deep(.el-form-item) {
    margin-bottom: 10px;
}

.icon-svg {
    width: 100px;
    height: 20px;
}
</style>