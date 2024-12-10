import {
  stringOptions,
  numberOptions,
  complexOptions,
  dynamicValueOptions,
  specificTimeOption,
} from "./Config";
import {
  AlarmConditionType,
  AlarmCondition,
  ComplexOperation,
  Operation,
  EntityKeyValueType,
  AlarmScheduleType,
  AlarmSchedule
} from "./type";
import { unref } from "vue";
import dayjs from "dayjs";

export function deepClone<T>(target: T, ignoreFields?: string[]): T {
  if (target === null) {
    return target;
  }
  if (target instanceof Date) {
    return new Date(target.getTime()) as any;
  }
  if (target instanceof Array) {
    const cp = [] as any[];
    (target as any[]).forEach((v) => {
      cp.push(v);
    });
    return cp.map((n: any) => deepClone<any>(n)) as any;
  }
  if (typeof target === "object" && JSON.stringify(target) !== '{}') {
    const cp = { ...(target as { [key: string]: any }) } as {
      [key: string]: any;
    };
    Object.keys(cp).forEach((k) => {
      if (!ignoreFields || ignoreFields.indexOf(k) === -1) {
        cp[k] = deepClone<any>(cp[k]);
      }
    });
    return cp as T;
  }
  return target;
}

const operationOptions = [
  ...unref(stringOptions),
  ...unref(numberOptions),
  ...unref(complexOptions),
  ...unref(dynamicValueOptions),
];

/**
 * 组装条件值预览字符串
 */
export function getPreviewValue(condition: any[]) {
  let previewValue = "";
  if(!condition.length) return previewValue
  condition.forEach((item: any, index: number) => {
    const montageChar = index < condition.length - 1 ? "和" : "";
    // 动态值dynamicValue
    if (item.predicate.value && item.predicate.value.dynamicValue && !isEmptyObject(item.predicate.value.dynamicValue)) {
      previewValue += `${renderKeyHtml(item.key.key)} ${mapOperationValue(
        item.predicate.operation
      )} ${renderSourceHtml(
        mapOperationValue(item.predicate.value.dynamicValue.sourceType)
      )} . ${renderSourceHtml(
        item.predicate.value.dynamicValue.sourceAttribute
      )} ${montageChar} `;
    } else if (
      item.predicate.operation !== ComplexOperation.AND &&
      item.predicate.operation !== ComplexOperation.OR
    ) {
      previewValue += ` ${renderKeyHtml(item.key.key)} ${mapOperationValue(
        item.predicate.operation
      )} ${renderValueHtml(
        item.predicate.value.defaultValue,
        item.valueType
      )} ${montageChar} `;
    } else {
      previewValue += complexCondition(item.predicate.predicates, item);
    }
  });
  return previewValue;
}
//
const complexCondition = (predicates: any[], condition: any) => {
  console.log(condition,'condition')
  let complexValue = "";
  function recursion(predicates, item, operation, isOR) {
    const noComplex = predicates.filter(
      (k) =>
        k.operation !== ComplexOperation.AND &&
        k.operation !== ComplexOperation.OR
    );

    predicates.map(
      (
        k: {
          operation: Operation;
          value: {
            dynamicValue: { sourceType: Operation; sourceAttribute: string };
            defaultValue: string;
          };
        },
        i
      ) => {
        const endSige = i === noComplex.length - 1 ? ")" : "";
        if (
          k.operation !== ComplexOperation.AND &&
          k.operation !== ComplexOperation.OR
        ) {
          const startSige = i === 0 ? "( " : "";
          const orStartSige = isOR && i === 0 ? "( " : "";
          complexValue +=
            startSige +
            orStartSige +
            `${renderKeyHtml(item.key.key)} ${mapOperationValue(k.operation)} ${
              k.value.dynamicValue
                ? renderSourceHtml(
                    mapOperationValue(k.value.dynamicValue.sourceType)
                  ) +
                  " " +
                  ". " +
                  renderSourceHtml(k.value.dynamicValue.sourceAttribute)
                : renderValueHtml(k.value.defaultValue, item.valueType)
            } ${endSige} ${mapOperationValue(operation)} `;
        } else if (k.predicates) {
          recursion(
            k.predicates,
            item,
            k.operation,
            k.operation === ComplexOperation.OR ? true : false
          );
        }
        // 如果operation为OR,则需要把OR下面的predicates的尾部插入结束括号 )，
        // 前面已经插入了 ( 这里在倒数第三个位置插入，是因为最后连个字符是一个 (和 | 或)和空格
        if (isOR && i === predicates.length - 1) {
          const index = complexValue.length - 3;
          complexValue =
            complexValue.slice(0, index) + " ) " + complexValue.slice(index);
        }
      }
    );
  }
  recursion(predicates, condition, condition.predicate.operation,false);
  // 去除拼接时最后一个 (和 | 或) 空格
  complexValue = complexValue.slice(0, complexValue.length - 2);
  return ` ( ${complexValue}) `;
};

/**
 * 映射值value为对应的option的label
 */
const mapOperationValue = (value: Operation) => {
  const matchOption = operationOptions.find((k) => k.value === value);
  if (matchOption) return matchOption.label;
  else return value;
};

const renderSourceHtml = (value: string) => {
  return `<span class="value-key tb-dynamic-source">${value}</span>`;
};

const renderValueHtml = (value: string, valueType: EntityKeyValueType) => {
  return `<span class="value-key tb-filter-value">'${formatValue(
    value,
    valueType
  )}'</span>`;
};

const renderKeyHtml = (value: string) => {
  return `<span class="value-key">${value}</span>`;
};

/**
 * 格式化条件值
 */
const formatValue = (
  value: string | boolean,
  valueType: EntityKeyValueType
) => {
  if (typeof value === "boolean") {
    if (value) return "真";
    return "假";
  }
  if (valueType === EntityKeyValueType.DATE_TIME) {
    return dayjs(value).format("YYYY-MM-DD:HH:mm");
  }
  return value;
};

/**
 * 组装时间值预览字符串
 */
export const getPreviewTime = (schedule: null | AlarmSchedule) => {
  let timeStr = "";
  if (!schedule || isEmptyObject(schedule)) return timeStr;
  if (schedule.type === AlarmScheduleType.ANY_TIME) {
    timeStr = "始终启用";
  } else if (schedule.type === AlarmScheduleType.SPECIFIC_TIME) {
    schedule.daysOfWeek.forEach((k, i) => {
      const space = i < schedule.daysOfWeek.length - 1 ? "," : "";
      const match = unref(specificTimeOption).find(
        (option) => option.value === k
      );
      if (match) {
        timeStr += match.label + space;
      }
    });
    if (schedule.startsOn < schedule.endsOn) {
      timeStr += `<span class="timePreview"> ${convertTime(
        schedule.startsOn
      )}</span> - `;
      timeStr += `<span class="timePreview"> ${convertTime(
        schedule.endsOn
      )}</span>`;
    } else {
      timeStr += `<span class="timePreview">00:00 - ${convertTime(
        schedule.endsOn
      )}</span> 并且 `;
      timeStr += `<span class="timePreview"> ${convertTime(
        schedule.startsOn
      )}</span> - 23:59`;
    }
  } else {
    const mapDataPicker = mappingTimeLabel();
    const enabledItems = schedule.items.filter((k) => k.enabled);
    enabledItems.forEach((k, i) => {
      const space = i < enabledItems.length - 1 ? ", " : "";
      if (k.startsOn < k.endsOn) {
        timeStr += `${
          mapDataPicker[k.dayOfWeek]
        } <span class="timePreview">${convertTime(k.startsOn)}</span> -`;
        timeStr += `<span class="timePreview"> ${convertTime(
          k.endsOn
        )}</span> ${space}`;
      } else {
        timeStr += `${
          mapDataPicker[k.dayOfWeek]
        } <span class="timePreview">00:00 - ${convertTime(
          k.endsOn
        )}</span> 并且`;
        timeStr += `<span class="timePreview"> ${convertTime(
          k.startsOn
        )}</span> - 23:59 ${space}`;
      }
    });
  }
  return timeStr;
};

/**
 * 时间戳 + 当天00:00:00的时间戳
 */
const convertTime = (timestamp: number) => {
  return dayjs(dayjs().startOf("day").valueOf() + timestamp).format("HH:mm");
};

/**
 * 判断是下午还是上午
 */
const determineAMOrPM = (timestamp: number) => {
  const hour = dayjs(timestamp).hour();
  if (hour < 12) return "AM";
  else return "PM";
};

/**
 * 转换星期option wei {value:label}形式
 */
export const mappingTimeLabel = () => {
  return unref(specificTimeOption).reduce((acc, arr) => {
    acc[arr.value] = arr.label;
    return acc;
  }, {} as any);
};

/**
 * 数组根据key.key的值想同去重
 */
 export const uniqueArray = (array: any[]) => {
  if (!array.length) return [];
  return array.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.key.key === item.key.key)
  );
};


/**
 * 生成UUID
 */
export function generateUUID() {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}