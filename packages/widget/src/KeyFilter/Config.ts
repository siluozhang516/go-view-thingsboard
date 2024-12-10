import { ref } from "vue";
import {
  AlarmSeverityUI,
  EntityKeyType,
  EntityKeyValueType,
  AlarmScheduleType,
  DynamicValueSourceType,
  AlarmConditionType,
  StringOperation,
  NumericOperation,
  BooleanOperation,
  ComplexOperation,
  TimeUnit
} from "./type";

export const options = ref([
  {
    value: AlarmSeverityUI.CRITICAL,
    label: "危险",
    disabled: false,
  },
  {
    value: AlarmSeverityUI.MAJOR,
    label: "重要",
    disabled: false,
  },
  {
    value: AlarmSeverityUI.MINOR,
    label: "次要",
    disabled: false,
  },
  {
    value: AlarmSeverityUI.WARNING,
    label: "警告",
    disabled: false,
  },
  {
    value: AlarmSeverityUI.INDETERMINATE,
    label: "不确定",
    disabled: false,
  },
]);

export const keyTypeOptions = ref([
  {
    value: EntityKeyType.ENTITY_FIELD,
    label: "实体",
  },
  {
    value: EntityKeyType.ATTRIBUTE,
    label: "属性",
  },
  {
    value: EntityKeyType.CLIENT_ATTRIBUTE,
    label: "客户端属性",
  },
  {
    value: EntityKeyType.SERVER_ATTRIBUTE,
    label: "服务端属性",
  },
  {
    value: EntityKeyType.SHARED_ATTRIBUTE,
    label: "共享属性",
  },
  {
    value: EntityKeyType.TIME_SERIES,
    label: "时间序列",
  },
  {
    value: EntityKeyType.CONSTANT,
    label: "常量",
  },
]);

export const valueTypeOptions = ref([
  {
    value: EntityKeyValueType.STRING,
    label: "字符串",
  },
  {
    value: EntityKeyValueType.NUMERIC,
    label: "数字",
  },
  {
    value: EntityKeyValueType.BOOLEAN,
    label: "布尔值",
  },
  {
    value: EntityKeyValueType.DATE_TIME,
    label: "日期时间",
  },
]);

export const scheduleTypeOptions = ref([
  {
    value: AlarmScheduleType.ANY_TIME,
    label: "始终启用",
  },
  {
    value: AlarmScheduleType.SPECIFIC_TIME,
    label: "定时启用",
  },
  {
    value: AlarmScheduleType.CUSTOM,
    label: "自定义启用",
  },
]);

export const dynamicValueOptions = ref([
  {
    value: "",
    label: "无动态值",
  },
  {
    value: DynamicValueSourceType.CURRENT_TENANT,
    label: "当前租户",
  },
  {
    value: DynamicValueSourceType.CURRENT_CUSTOMER,
    label: "当前客户",
  },
  {
    value: DynamicValueSourceType.CURRENT_DEVICE,
    label: "当前设备",
  },
]);

export const specOptions = ref([
  {
    value: AlarmConditionType.SIMPLE,
    label: "简单",
  },
  {
    value: AlarmConditionType.DURATION,
    label: "持续时间",
  },
  {
    value: AlarmConditionType.REPEATING,
    label: "重复",
  },
]);

////////////////字符串//////////////////
export const stringOptions = ref([
  {
    value: StringOperation.EQUAL,
    label: "等于",
  },
  {
    value: StringOperation.NOT_EQUAL,
    label: "不等于",
  },
  {
    value: StringOperation.STARTS_WITH,
    label: "开始于",
  },
  {
    value: StringOperation.ENDS_WITH,
    label: "结束于",
  },
  {
    value: StringOperation.CONTAINS,
    label: "包含",
  },
  {
    value: StringOperation.NOT_CONTAINS,
    label: "不包含",
  },
  {
    value: StringOperation.IN,
    label: "存在",
  },
  {
    value: StringOperation.NOT_IN,
    label: "不存在",
  },
]);
//////////////////数字、时间//////////////////
export const numberOptions = ref([
  {
    value: NumericOperation.EQUAL,
    label: "等于",
  },
  {
    value: NumericOperation.NOT_EQUAL,
    label: "不等于",
  },
  {
    value: NumericOperation.GREATER,
    label: "大于",
  },
  {
    value: NumericOperation.LESS,
    label: "小于",
  },
  {
    value: NumericOperation.GREATER_OR_EQUAL,
    label: "大于或等于",
  },
  {
    value: NumericOperation.LESS_OR_EQUAL,
    label: "小于或等于",
  },
]);

///////////////布尔值/////////////
export const booleanOptions = ref([
  {
    value: BooleanOperation.EQUAL,
    label: "等于",
  },
  {
    value: BooleanOperation.NOT_EQUAL,
    label: "不等于",
  },
]);

////////////操作///////////////
export const complexOptions = ref([
  {
    value: ComplexOperation.AND,
    label: "和",
  },
  {
    value: ComplexOperation.OR,
    label: "或",
  },
]);

export const timeUnitOption = ref([
  {
    value: TimeUnit.SECONDS,
    label: "秒",
  },
  {
    value: TimeUnit.MINUTES,
    label: "分钟",
  },
  {
    value: TimeUnit.HOURS,
    label: "小时",
  },
  {
    value: TimeUnit.DAYS,
    label: "天",
  },
]);

export const specificTimeOption = ref([
  {
    value: 1,
    label: "星期一",
  },
  {
    value: 2,
    label: "星期二",
  },
  {
    value: 3,
    label: "星期三",
  },
  {
    value: 4,
    label: "星期四",
  },
  {
    value: 5,
    label: "星期五",
  },
  {
    value: 6,
    label: "星期六",
  },
  {
    value: 7,
    label: "星期日",
  },
]);

interface Option{
  label:string;
  value:string
}
export const relationTypeoptions = ref<Option[]>([])
