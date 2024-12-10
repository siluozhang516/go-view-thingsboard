<template>
  <div>
    <div class="form-operation">
      <el-form ref="formRef" :model="form">
        <el-row style="width: 100%" :gutter="16">
          <el-col :span="2"> </el-col>
          <el-col :span="6">
            <div>操作</div>
          </el-col>
          <el-col :span="4" v-if="valueType === EntityKeyValueType.STRING">
            <div>忽略大小写</div>
          </el-col>
          <el-col :span="10">
            <div>值</div>
          </el-col>
        </el-row>
        <el-divider style="margin: 12px 0" />
        <template v-for="(item, i) in predicates" :key="i">
          <el-form-item v-if="item.type !== 'COMPLEX'">
            <el-row style="width: 100%" :gutter="10">
              <el-col :span="2"> </el-col>
              <el-col :span="6">
                <el-form-item prop="date1">
                  <el-select
                    v-model="item.operation"
                    placeholder="条件"
                    :disabled="!editStatus"
                  >
                    <el-option
                      v-for="option in operationOption"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="2" v-if="valueType === EntityKeyValueType.STRING">
                <el-form-item>
                  <div
                    style="width: 80px; overflow: hidden; text-align: center"
                  >
                    <el-checkbox
                      v-model="item.ignoreCase"
                      size="large"
                      :disabled="!editStatus"
                    />
                  </div>
                </el-form-item>
              </el-col> -->
              <el-col :span="11">
                <el-form-item>
                  <div v-if="!item.dynamic" style="width: 100%">
                    <el-checkbox
                      v-model="item.value.defaultValue"
                      size="large"
                      :label="item.value.defaultValue ? '真' : '假'"
                      v-if="valueType === EntityKeyValueType.BOOLEAN"
                      :disabled="!editStatus"
                    />
                    <el-date-picker
                      v-model="item.value.defaultValue"
                      type="datetime"
                      placeholder="请选择时间"
                      format="YYYY/MM/DD hh:mm:ss"
                      value-format="x"
                      v-else-if="valueType === EntityKeyValueType.DATE_TIME"
                      :disabled="!editStatus"
                    />
                    <el-input
                      v-model="item.value.defaultValue"
                      placeholder="默认值"
                      :disabled="!editStatus"
                      v-else
                      :type="
                        valueType === EntityKeyValueType.NUMERIC
                          ? 'number'
                          : 'text'
                      "
                    />
                  </div>

                  <!-- dynamicValue -->
                  <el-space
                    size="large"
                    v-else
                    style="align-items: flex-start; width: 100%"
                  >
                    <el-select
                      v-model="item.value.dynamicValue.sourceType"
                      placeholder="动态源类型"
                      @change="changeSourceType(item, $event)"
                      :disabled="!editStatus"
                    >
                      <el-option
                        v-for="option in dynamicValueOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                    <el-input
                      v-model="item.value.dynamicValue.sourceAttribute"
                      placeholder="源属性"
                      :disabled="!editStatus"
                    />
                    <el-checkbox
                      v-model="item.value.dynamicValue.inherit"
                      v-if="
                        item.value.dynamicValue.sourceType &&
                        item.value.dynamicValue.sourceType !==
                          DynamicValueSourceType.CURRENT_TENANT
                      "
                      label="从所有者继承"
                      :disabled="!editStatus"
                      size="large"
                    />
                  </el-space>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-space style="margin-left: 10px" size="large">
                  <div class="dynamic-cion" @click="onChangeValueType(item)">
                    <img src="./dynamic.svg" style="padding: 5px" />
                  </div>
                  <div class="close-cion" @click="onDel(i)" v-show="editStatus">
                    <Close style="padding: 5px" />
                  </div>
                </el-space>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-else>
            <el-row :gutter="10" style="width: 100%">
              <el-col :span="2"> </el-col>
              <el-col :span="18">
                <div class="complex-item">
                  <div style="margin-right: 10px">复合选择器</div>
                  <el-button
                    type="primary"
                    link
                    :circle="true"
                    @click="onEditComplex(item, i)"
                  >
                    <template #icon>
                      <EditPen class="icon" />
                    </template>
                  </el-button>
                </div>
              </el-col>
              <el-col :span="4">
                <div
                  class="close-cion"
                  @click="onDel(i)"
                  v-show="editStatus"
                  style="margin-left: 20px"
                >
                  <Close style="padding: 5px" />
                </div>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" @click="onAdd" v-if="editStatus">
        添加
      </el-button>
      <el-button type="primary" v-if="editStatus" @click="addComplex">
        添加复合
      </el-button>
    </div>

    <ComplexCom
      ref="complexRef"
      :valueType="valueType"
      :complexData="currentComplexData"
      @updateComplexData="updateComplexData"
      @onClose="onCloseComplexCom"
      v-if="complexComVisible"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, nextTick, reactive, ref, unref, watch } from "vue";
import { Close, EditPen } from "@element-plus/icons-vue";
import {
  EntityKeyValueType,
  DynamicValueSourceType,
  ComplexOperation,
} from "./type";
import {
  stringOptions,
  numberOptions,
  booleanOptions,
  dynamicValueOptions,
} from "./Config";
import { deepClone } from "./utils";
import ComplexCom from "./Complex.vue";

const form = reactive({
  name: "",
  operation: "",
  date2: "",
  checked1: "",
});
interface Props {
  valueType?: EntityKeyValueType | string;
  condition?: any;
}
const props = withDefaults(defineProps<Props>(), {
  valueType: EntityKeyValueType.STRING,
  condition: [],
});

const editStatus = inject("editStatus");
const complexRef = ref();
const currentComplexData = ref({});
// 用来标注当前操作的predicates的对象位置，如果为null，
// 则为新增，否则直接替换当前操作的复合条件
const currentIndex = ref<null | number>(null);
// 用来控制递归组件的渲染，解决无限嵌套的性能问题
const complexComVisible = ref(false);

const emit = defineEmits(["onChange"]);

const operationOption = computed(() => {
  if (props.valueType === EntityKeyValueType.BOOLEAN) {
    return booleanOptions.value;
  }
  if (
    props.valueType === EntityKeyValueType.DATE_TIME ||
    props.valueType === EntityKeyValueType.NUMERIC
  ) {
    return numberOptions.value;
  }
  if (props.valueType === EntityKeyValueType.STRING) {
    return stringOptions.value;
  }
});

const predicates = ref<any[]>([]);

watch(
  () => props.condition,
  (v: any) => {
    if (unref(v).length) {
      predicates.value = deepClone(
        unref(v).map((k: { predicate: any }) => k.predicate || k)
      );
    }
  },
  { deep: true, immediate: true }
);

const onAdd = () => {
  predicates.value.push({
    type: props.valueType,
    operation: "",
    dynamic: false,
    value: {
      defaultValue: "",
      userValue: null,
      dynamicValue: {
        sourceType: "",
        sourceAttribute: "",
        inherit: false,
      },
    },
    // ignoreCase: false,
  });
  emit("onChange", predicates.value);
};

const onDel = (index: number) => {
  predicates.value.splice(index, 1);
  emit("onChange", predicates.value);
};

const onChangeValueType = (item: any) => {
  item.dynamic = !item.dynamic;
  if (!item.value.dynamicValue) {
    item.value.dynamicValue = {
      sourceType: "",
      sourceAttribute: "",
      inherit: false,
    };
  }
};
const changeSourceType = (
  item: any,
  valule: DynamicValueSourceType | string
) => {
  if (!valule) {
    item.value.dynamicValue.sourceAttribute = "";
    item.value.dynamicValue.inherit = false;
  }
};

const resetPredicates = () => {
  predicates.value = [];
};

/**
 * 处理后的值
 */
const getPredicatesValues = () => {
  return unref(predicates).map((item: any) => {
    let isNull = true;
    if (item.type !== "COMPLEX") {
      for (let i in item.value.dynamicValue) {
        if (item.value.dynamicValue[i]) {
          isNull = false;
        }
      }
      if (isNull) {
        item.value.dynamicValue = null;
      }
    }
    delete item.dynamic
    return item;
  });
};

const addComplex = () => {
  complexComVisible.value = true;
  currentIndex.value = null;
  nextTick(() => {
    currentComplexData.value = {
      operation: ComplexOperation.AND,
      type: "COMPLEX",
      predicates: [],
    };
    unref(complexRef).visible = true;
  });
};

const onEditComplex = (item: any, index: number) => {
  complexComVisible.value = true;
  nextTick(() => {
    currentIndex.value = index;
    currentComplexData.value = item;
    unref(complexRef).visible = true;
  });
};

// 无限嵌套、更新值方法
const updateComplexData = (complexData: any) => {
  if (!unref(currentIndex)) {
    predicates.value.push(complexData);
  } else {
    predicates.value[unref(currentIndex) as number] = complexData;
  }
  onCloseComplexCom();
};

const onCloseComplexCom = () => {
  complexComVisible.value = false;
};
defineExpose({
  resetPredicates,
  getPredicatesValues,
});
</script>

<style scoped>
.form-operation {
  max-height: 400px;
  overflow-y: auto;
}

.dynamic-cion {
  width: 30px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

.dynamic-cion :hover {
  background-color: #eceff1;
  border-radius: 50%;
}

.close-cion {
  width: 30px;
  height: 30px;
  line-height: 30px;
  color: #305680;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

.close-cion :hover {
  background-color: #eceff1;
  border-radius: 50%;
}

.footer {
  padding-top: 10px;
}

:deep(.el-space__item) {
  width: 80%;
}

.complex-item {
  display: flex;
  align-items: center;
}

:deep(.el-icon) {
  width: 2em;
  height: 2em;
}

.icon {
  width: 18px;
  height: 18px;
}
</style>
