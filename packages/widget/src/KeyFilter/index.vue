<template>
  <el-dialog v-model="visible" title="添加筛选器" width="50%">
    <div class="dialog-content">
      <el-card :body-style="{ padding: '0 16px' }" shadow="never">
        <el-collapse style="border: unset" v-model="activeName">
          <el-collapse-item title="键名筛选器" :name="1">
            <el-table :data="uniqueArray(conditionObj.condition)" max-height="250" :span-method="objectSpanMethod"
              size="large">
              <el-table-column width="80">和</el-table-column>
              <el-table-column prop="key.key" label="键名" />
              <el-table-column prop="key.type" label="键类型">
                <template #default="{ row }">
                  {{ getMapValue(row) }}
                </template>
              </el-table-column>
              <el-table-column align="right" label="操作">
                <template #default="{ row }">
                  <el-space>
                    <el-button type="primary" link :circle="true" @click="onEdit(row)">
                      <template #icon>
                        <EditPen />
                      </template>
                    </el-button>
                    <el-button type="primary" link :circle="true" @click="onDel(row)" v-if="editStatus">
                      <template #icon>
                        <Delete />
                      </template>
                    </el-button>
                  </el-space>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" style="margin-top: 16px" v-if="editStatus"
              @click="openKeyFilterModal(OperationSige.ADD)">添加键名筛选器</el-button>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card :body-style="{ padding: '0 16px' }" shadow="never" style="margin-top: 16px">
        <el-collapse style="border: unset" v-model="filterCollapse">
          <el-collapse-item title="筛选器预览" :name="1">
            <div class="preview" v-html="getPreviewValue(conditionObj.condition) || '未指定筛选器'"></div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <!-- <el-card :body-style="{ padding: '0 16px' }" shadow="never" style="margin-top: 16px">
        <el-collapse style="border: unset" v-model="collapse">
          <el-collapse-item title="条件类型" :name="1">
            <el-form ref="formRef" :model="conditionObj.spec" label-position="top" :rules="rules">
              <el-form-item>
                <el-select v-model="conditionObj.spec.type" placeholder="条件类型" :disabled="!editStatus" size="large"
                  @change="changeSpecType">
                  <el-option v-for="option in specOptions" :key="option.value" :label="option.label"
                    :value="option.value" />
                </el-select>
              </el-form-item>
              <el-form-item required>
                <el-row :gutter="10" style="width: 100%">
                  <el-col :span="calcCol" v-if="showDynamicValue">
                    <el-space size="large" style="width: 100%">
                      <el-select v-model="conditionObj.spec.predicate.dynamicValue!.sourceType
                        " placeholder="动态源类型" @change="changeSourceType" :disabled="!editStatus" size="small">
                        <el-option v-for="option in dynamicValueOptions" :label="option.label" :value="option.value" />
                      </el-select>
                      <el-input v-model="conditionObj.spec.predicate.dynamicValue!.sourceAttribute" placeholder="源属性"
                        :disabled="!editStatus" />
                      <el-checkbox v-model="conditionObj.spec.predicate.dynamicValue!.inherit"
                        v-if="conditionObj.spec.predicate.dynamicValue!.sourceType && conditionObj.spec.predicate.dynamicValue!.sourceType !== DynamicValueSourceType.CURRENT_TENANT"
                        label="从所有者继承" :disabled="!editStatus" size="large" />
                    </el-space>
                  </el-col>
                  <el-col :span="calcCol" v-else>
                    <el-form-item prop="defaultValue">
                      <el-input v-model="conditionObj.spec.predicate.defaultValue" placeholder="持续时间值"
                        :disabled="!editStatus" type="number"
                        v-if="conditionObj.spec.type === AlarmConditionType.DURATION" :min="1" />
                      <el-input v-model="conditionObj.spec.predicate.defaultValue" placeholder="事件计数值必填"
                        :disabled="!editStatus" type="number"
                        v-if="conditionObj.spec.type === AlarmConditionType.REPEATING" :min="1" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="3" v-if="conditionObj.spec.type !== AlarmConditionType.SIMPLE">
                    <div class="dynamic-cion" @click="onChangeDynamicValue"
                      v-if="!showDynamicValue && conditionObj.spec.type">
                      <img src="./dynamic.svg" style="padding: 5px" />
                    </div>
                    <div class="close-cion" v-else-if="showDynamicValue && conditionObj.spec.type"
                      @click="onChangeDefaultValue">
                      <div>123</div>
                    </div>
                  </el-col>
                  <el-col :span="4" v-if="conditionObj.spec.type === AlarmConditionType.DURATION">
                    <el-form-item prop="unit">
                      <el-select v-model="conditionObj.spec.unit" :disabled="!editStatus" size="small">
                        <el-option v-for="option in timeUnitOption" :key="option.value" :label="option.label"
                          :value="option.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-card> -->
    </div>
    <KeyFilter ref="KeyFilterRef" @updateCondition="updateCondition" :operateType="operateType" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="onSave"
          :disabled="!editStatus">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Ref, provide, ref, unref, watch, computed } from "vue";
import {
  specOptions,
  keyTypeOptions,
  timeUnitOption,
  dynamicValueOptions,
} from "./Config";
import { EditPen, Delete } from "@element-plus/icons-vue";
import KeyFilter from "./KeyFilter.vue";
import {
  AlarmConditionType,
  AlarmCondition,
  OperationSige,
  KeyFilters,
  TimeUnit,
  DynamicValueSourceType,
  AlarmConditionSpec
} from "./type";

import { deepClone, getPreviewValue, uniqueArray } from "./utils";


interface SpanMethodProps {
  row: any;
  column: any;
  rowIndex: number;
  columnIndex: number;
}
const validateValue = (_rule: any, _v: any, callback: any) => {
  if (unref(conditionObj).spec.type !== AlarmConditionType.SIMPLE) {
    if (unref(conditionObj).spec.predicate.defaultValue) {
      callback()
      return
    }
    callback(new Error('值应在1到2147483647之间'))
  }
  callback()
}

const rules = {
  defaultValue: [
    {
      validator: validateValue,
      trigger: "change",
    },
  ],
  unit: [
    {
      required: true,
      message: "请填写键名",
      trigger: "change",
    },
  ],
};
const activeName = ref(1);
const filterCollapse = ref(1);
const collapse = ref(1);
const visible = ref(false);
const KeyFilterRef = ref();
const formRef = ref();
// 控制显示spec.predicate.dynamicValue,他们的值可以和spec.predicate.defaultValue一起保存
const showDynamicValue = ref(false);
const editStatus = ref(true);
provide("editStatus", editStatus);

const calcCol = computed(() => {
  if (conditionObj.value.spec.type === AlarmConditionType.REPEATING) {
    return 21;
  }
  return 17;
});

const conditionObj = ref<Required<AlarmCondition>>({
  condition: [],
  spec: {
    type: AlarmConditionType.SIMPLE,
    predicate: {
      defaultValue: "",
      dynamicValue: null,
    },
    unit: TimeUnit.SECONDS,
  },
});



// 传入键名筛选器的条件
const currentMatchConditions = ref<KeyFilters[]>([]);
const currentSelectConditions = ref<any>({});
// 打开键名筛选器的操作类型
const operateType = ref<OperationSige>(OperationSige.ADD);

provide("condition", currentMatchConditions);

const emit = defineEmits(["updateRuleCondition"]);

const props = withDefaults(defineProps<AlarmCondition>(), {
  condition: {
    condition: [],
    spec: {
      type: AlarmConditionType.SIMPLE,
      predicate: {
        defaultValue: "",
        dynamicValue: null,
      },
      unit: TimeUnit.SECONDS,
    },
  },
});

const objectSpanMethod = ({ rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 0) {
    if (rowIndex % 2 === 0) {
      return {
        rowspan: 2,
        colspan: 1,
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  }
};

watch(
  () => props.condition,
  (condition) => {
    conditionObj.value = deepClone(condition) as Required<AlarmCondition>;
    if (unref(conditionObj).spec.type == AlarmConditionType.SIMPLE) {
      conditionObj.value.spec = {
        type: AlarmConditionType.SIMPLE,
        predicate: {
          defaultValue: "",
          dynamicValue: null,
        },
        unit: TimeUnit.SECONDS,
      }
    }
  },
  { deep: true, immediate: true }
);

const changeSourceType = (valule: DynamicValueSourceType | string) => {
  if (!valule) {
    conditionObj.value.spec.predicate.dynamicValue!.sourceAttribute = "";
    conditionObj.value.spec.predicate.dynamicValue!.inherit = false;
  }
};

const changeSpecType = () => {
  unref(formRef)?.clearValidate('defaultValue')
}

const onChangeDynamicValue = () => {
  showDynamicValue.value = true;
  if (!conditionObj.value.spec.predicate.dynamicValue) {
    conditionObj.value.spec.predicate.dynamicValue = {
      inherit: false,
      sourceAttribute: "",
      sourceType: "",
    };
  }
};

const onChangeDefaultValue = () => {
  showDynamicValue.value = false;
};

const getMapValue = (row: any) => {
  const option = unref(keyTypeOptions).find((k) => k.value === row.key.type);
  if (option) return option.label;
  else return "";
};

const onEdit = (row: { key: { key: string } }) => {
  currentMatchConditions.value = unref(conditionObj).condition.filter(
    (item: any) => item.key.key === row.key.key
  );
  currentSelectConditions.value = row;
  openKeyFilterModal(OperationSige.EDIT);
};

const onDel = (row: { key: { key: any } }) => {
  unref(conditionObj).condition = unref(conditionObj).condition.filter(
    (k: any) => k.key.key !== row.key.key
  );
};

const updateCondition = (values: Ref<any[]>) => {
  if (unref(operateType) === OperationSige.EDIT) {
    const index = unref(conditionObj).condition.findIndex(
      (item: any) => item.key.key === unref(currentSelectConditions).key.key
    );
    unref(conditionObj).condition = unref(conditionObj).condition.filter(
      (item: any) => item.key.key !== unref(currentSelectConditions).key.key
    );

    unref(conditionObj).condition.splice(index, 0, ...values.value);
    return;
  }
  unref(conditionObj).condition.push(...values.value);
};

const openKeyFilterModal = (type: OperationSige) => {
  operateType.value = type;
  unref(KeyFilterRef).visible = true;
};

const onSave = () => {
  const newCondition = deepClone(unref(conditionObj))
  if (newCondition.spec.type === AlarmConditionType.SIMPLE) {
    newCondition.spec = { type: AlarmConditionType.SIMPLE } as AlarmConditionSpec
  }

  newCondition.condition.map(item => {
    delete item.value
  })
  emit("updateRuleCondition", newCondition);
  visible.value = false;
};

const open = () => {
  visible.value = true
}
defineExpose({
  visible,
  open
});
</script>

<style scoped>
:deep(.el-collapse-item__header) {
  border-bottom: unset;
}

.preview {
  min-height: 35px;
  padding: 8px 20px;
  border-radius: 5px;
  line-height: 35px;
  border: 1px solid #ccc;
  color: rgba(0, 0, 0, 0.65);
}

.dialog-content {
  padding: 24px 8px;
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

:deep(.el-space__item) {
  width: 100%;
}

.icon {
  cursor: pointer;
}

.dynamic-cion {
  width: 30px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  margin: 0 auto;
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
  margin: 0 auto;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
}

.close-cion :hover {
  background-color: #eceff1;
  border-radius: 50%;
}
</style>
