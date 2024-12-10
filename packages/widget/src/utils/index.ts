import { ElMessage } from "element-plus";
import dayjs, { ManipulateType } from "dayjs";

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * 判断是否是对象
 * @param {*} obj
 * @returns
 */
export function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === "undefined") {
    return Object.prototype.toString.call(arg) === "[object Array]";
  }
  return Array.isArray(arg);
}

/**
 * 提示信息
 * @param {*} response
 */
export const resMessage = (
  response: { code: number; msg: string },
  msg?: string,
  code?: any
) => {
  const status = response.code === 200 ? true : false;
  ElMessage({
    message: msg ? msg : status ? response.msg : "操作失败",
    type: code ? code : status ? "success" : "error",
  });
  return status;
};

/**
 * tb实体数据转opions
 * @param data
 * @returns
 */
export const formatToOptions = (data: any[], valueFormat?: string) => {
  return data.map((item) => ({
    label: item.name,
    value: valueFormat ? item[valueFormat] : item.id.id,
  }));
};

/**
 * 判断空对象
 * @param obj
 * @returns
 */
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * 防抖函数工厂
 * @param {Function} func - 需要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {boolean} [immediate=false] - 是否立即执行函数
 * @returns {Function} - 防抖后的函数
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function (...args) {
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

/**
 *
 * @param count
 * @param unit
 * @returns
 */
export const getTimestamp = (
  count: number,
  unit: ManipulateType = "minute"
) => {
  return dayjs().subtract(count, unit);
};

/**
 *
 * @param count
 * @param unit
 * @returns
 */
export const calcMillisecond = (
  count: number,
  unit: ManipulateType = "second"
) => {
  if (unit === "second") return Number(count) * 1000;
  if (unit === "minute") return Number(count) * 60 * 1000;
  if (unit === "hour") return Number(count) * 60 * 60 * 1000;
  if (unit === "day") return Number(count) * 60 * 60 * 24 * 1000;
};

/**
 *
 * @returns
 */
export const getCurrentTimestamp = () => {
  return dayjs().valueOf();
};

/**
 * 计算当前月份的天数
 * @returns
 */
export const calcDayCountByMonth = () => {
  const startOfMonth = dayjs().startOf("month");
  // 获取当前月份的最后一天
  const endOfMonth = dayjs().endOf("month");
  // 计算天数
  return endOfMonth.diff(startOfMonth, "days") + 1;
};

/**
 * 当前季度总天数
 * @returns
 */
export const calcDayCountByQuarter = () => {
  // 获取当前日期
  const currentDate = dayjs();

  // 获取当前月份
  const month = currentDate.month(); // month() 返回的是从 0 开始的月份，0 = 1 月, 1 = 2 月, ..., 11 = 12 月

  // 计算当前季度的起始月份
  let startMonth;
  if (month >= 0 && month <= 2) {
    startMonth = 0; // 第一季度：1月-3月
  } else if (month >= 3 && month <= 5) {
    startMonth = 3; // 第二季度：4月-6月
  } else if (month >= 6 && month <= 8) {
    startMonth = 6; // 第三季度：7月-9月
  } else {
    startMonth = 9; // 第四季度：10月-12月
  }

  // 计算季度的起始日期和结束日期
  const startOfQuarter = currentDate.month(startMonth).startOf("month");
  const endOfQuarter = startOfQuarter
    .clone()
    .add(3, "month")
    .subtract(1, "day");

  // 计算季度总天数
  return endOfQuarter.diff(startOfQuarter, "day") + 1; // 包括起始日
};
/**
 * 当前半年总天数
 * @returns
 */
export const calcDayCountByHalfYear = () => {
  // 获取当前日期
  const currentDate = dayjs();

  // 获取当前月份
  const month = currentDate.month(); // month() 返回的是从 0 开始的月份，0 = 1 月, 1 = 2 月, ..., 11 = 12 月

  // 计算当前半年的起始月份
  let startMonth;
  let endMonth;
  if (month >= 0 && month <= 5) {
    startMonth = 0; // 前半年：1月-6月
    endMonth = 5; // 结束月份为 6月（5 表示 6月）
  } else {
    startMonth = 6; // 后半年：7月-12月
    endMonth = 11; // 结束月份为 12月（11 表示 12月）
  }

  // 计算半年的起始日期和结束日期
  const startOfHalfYear = currentDate.month(startMonth).startOf("month");
  const endOfHalfYear = currentDate.month(endMonth).endOf("month");

  // 计算半年的总天数
  return endOfHalfYear.diff(startOfHalfYear, "day") + 1; // 包括起始日
};
/**
 * 当前本年总天数
 * @returns
 */
export const calcDayCountByYear = () => {
  // 获取当前日期
  const currentDate = dayjs();

  // 获取今年的开始日期（1 月 1 日）
  const startOfYear = currentDate.startOf("year"); // 获取今年 1 月 1 日

  // 获取今年的结束日期（12 月 31 日）
  const endOfYear = currentDate.endOf("year"); // 获取今年 12 月 31 日

  // 计算今年的总天数
  return endOfYear.diff(startOfYear, "day") + 1; // 包括起始日
};

/**
 * 获取当前unit的开始时间戳
 * @param unit
 * @returns
 */
export const getCurrenttimestamp = (unit: dayjs.OpUnitType) => {
  return dayjs().startOf(unit).valueOf();
};

/**
 *获取当前单位截止时间戳
 * @param count
 * @param unit
 * @returns
 */
export const getUnitEndtimestamp = (
  count: number,
  unit: dayjs.ManipulateType
) => {
  return dayjs().subtract(count, unit).endOf(unit).valueOf();
};

/**
 * 获取当前半年的开始时间戳
 * @returns
 */
export const getCurrentTimestampByHalfYear = () => {
  // 获取当前月份
  const month = dayjs().month(); // 获取当前月份，0 表示 1 月，1 表示 2 月，...，11 表示 12 月

  // 判断当前半年是上半年还是下半年
  let startOfHalfYear;
  if (month >= 0 && month <= 5) {
    // 上半年 (1月-6月)
    startOfHalfYear = dayjs().month(0).startOf("month"); // 1月1日 00:00:00
  } else {
    // 下半年 (7月-12月)
    startOfHalfYear = dayjs().month(6).startOf("month"); // 7月1日 00:00:00
  }
  // 获取该时间的时间戳（毫秒级）
  return startOfHalfYear.valueOf();
};
/**
 * 获取当前季度的开始时间戳
 * @returns
 */
export const getCurrentTimestampByQuarter = () => {
  // 获取当前月份
  const month = dayjs().month(); // 获取当前月份，0 表示 1 月，1 表示 2 月，...，11 表示 12 月

  // 判断当前季度是 Q1，Q2，Q3，Q4
  let startOfQuarter;
  if (month >= 0 && month <= 2) {
    // 第一季度 (1月-3月)
    startOfQuarter = dayjs().month(0).startOf("month"); // 1月1日 00:00:00
  } else if (month >= 3 && month <= 5) {
    // 第二季度 (4月-6月)
    startOfQuarter = dayjs().month(3).startOf("month"); // 4月1日 00:00:00
  } else if (month >= 6 && month <= 8) {
    // 第三季度 (7月-9月)
    startOfQuarter = dayjs().month(6).startOf("month"); // 7月1日 00:00:00
  } else {
    // 第四季度 (10月-12月)
    startOfQuarter = dayjs().month(9).startOf("month"); // 10月1日 00:00:00
  }

  // 获取该时间的时间戳（毫秒级）
  return startOfQuarter.valueOf();
};

/**
 * 获取上一个季度00:00:00时间戳
 * @returns
 */
export const getLastQuarterTimestamp = () => {
  const month = dayjs().month(); // 获取当前月份，0 表示 1 月，1 表示 2 月，...，11 表示 12 月
  // 判断上个季度的起始月份
  let startOfLastQuarter;
  if (month >= 0 && month <= 2) {
    // 当前是 Q1（1月-3月），上个季度是 Q4（10月-12月）
    startOfLastQuarter = dayjs().month(9).startOf("month"); // 10月1日 00:00:00
  } else if (month >= 3 && month <= 5) {
    // 当前是 Q2（4月-6月），上个季度是 Q1（1月-3月）
    startOfLastQuarter = dayjs().month(0).startOf("month"); // 1月1日 00:00:00
  } else if (month >= 6 && month <= 8) {
    // 当前是 Q3（7月-9月），上个季度是 Q2（4月-6月）
    startOfLastQuarter = dayjs().month(3).startOf("month"); // 4月1日 00:00:00
  } else {
    // 当前是 Q4（10月-12月），上个季度是 Q3（7月-9月）
    startOfLastQuarter = dayjs().month(6).startOf("month"); // 7月1日 00:00:00
  }

  // 获取该时间的时间戳（毫秒级）
  return startOfLastQuarter.valueOf();
};
/**
 * 获取上半年00:00:00时间戳
 * @returns
 */
export const getLastHalfYearTimestamp = () => {
  const currentMonth = dayjs().month(); // 获取当前月份（0-11）

  // 如果当前月份是1月，返回去年的下半年
  if (currentMonth === 0) {
    return dayjs()
      .subtract(1, "year")
      .month(6)
      .startOf("day")
      .local()
      .valueOf(); // 去年7月1日 00:00:00
  }
  // 如果当前月份在 2 月到 6 月之间，返回当前年份的 1 月 1 日 00:00:00
  return dayjs().startOf("year").valueOf(); // 当前年份的 1月1日 00:00:00
};

/**
 * 获取上季度截止时间戳
 * @returns
 */
export const getEndOfLastQuarter = () => {
  const currentMonth = dayjs().month(); // 获取当前月份（0-11）
  let lastQuarterEndMonth;

  if (currentMonth >= 3 && currentMonth <= 5) {
    lastQuarterEndMonth = 2; // 上季度是第一季度，结束月份是 3 月
  } else if (currentMonth >= 6 && currentMonth <= 8) {
    lastQuarterEndMonth = 5; // 上季度是第二季度，结束月份是 6 月
  } else if (currentMonth >= 9 && currentMonth <= 11) {
    lastQuarterEndMonth = 8; // 上季度是第三季度，结束月份是 9 月
  } else {
    lastQuarterEndMonth = 11; // 上季度是第四季度，结束月份是 12 月
  }

  // 获取上季度最后一天的日期
  return dayjs().month(lastQuarterEndMonth).endOf("month").valueOf();
};

/**
 * 获取前半年的截止时间
 * @returns
 */
export const lastDayOfPreviousHalfYear = () => {
  const currentMonth = dayjs().month(); // 获取当前月份（0-11）

  // 如果当前月份在1月到6月之间，则前半年是去年下半年（7月到12月）
  if (currentMonth < 6) {
    return dayjs().subtract(1, "year").month(5).endOf("month").valueOf(); // 去年6月的最后一天
  }
  // 如果当前月份在7月到12月之间，则前半年是今年上半年（1月到6月）
  return dayjs().month(5).endOf("month").valueOf();
};

// 获取当前季度的最后一天
export const lastDayOfCurrentQuarter = () => {
  const currentMonth = dayjs().month(); // 获取当前月份（0-11）
  let lastMonthOfQuarter;

  // 根据当前月份判断所属的季度
  if (currentMonth >= 0 && currentMonth <= 2) {
    // 第一季度，结束是3月
    lastMonthOfQuarter = 2;
  } else if (currentMonth >= 3 && currentMonth <= 5) {
    // 第二季度，结束是6月
    lastMonthOfQuarter = 5;
  } else if (currentMonth >= 6 && currentMonth <= 8) {
    // 第三季度，结束是9月
    lastMonthOfQuarter = 8;
  } else {
    // 第四季度，结束是12月
    lastMonthOfQuarter = 11;
  }

  // 获取该季度最后一个月的最后一天
  return dayjs().month(lastMonthOfQuarter).endOf("month").valueOf();
};

// 获取当前半年的截止日期
export const lastDayOfCurrentHalfYear = () => {
  const currentMonth = dayjs().month(); // 获取当前月份（0-11）
  // 如果当前月份在1月到6月之间，则当前半年是上半年（1月到6月）
  if (currentMonth < 6) {
    return dayjs().month(5).endOf("month").valueOf(); // 6月的最后一天
  }
  // 如果当前月份在7月到12月之间，则当前半年是下半年（7月到12月）
  return dayjs().month(11).endOf("month").valueOf(); // 12月的最后一天
};

export enum TimeRange {
  YESTERDAY = "YESTERDAY",
  BEFORE_YESTERDAY = "BEFORE_YESTERDAY",
  LAST_MONTH = "LAST_MONTH",
  LAST_QUARTER = "LAST_QUARTER",
  LAST_HALF_YEAR = "LAST_HALF_YEAR",
  LAST_YEAR = "LAST_YEAR",
  CURRENT_HOUR = "CURRENT_HOUR",
  CURRENT_DAY = "CURRENT_DAY",
  CURRENT_WEEK = "CURRENT_WEEK",
  CURRENT_MONTH = "CURRENT_MONTH",
  CURRENT_QUARTER = "CURRENT_QUARTER",
  CURRENT_HALF_YEAR = "CURRENT_HALF_YEAR",
  CURRENT_YEAR = "CURRENT_YEAR",
}

/**
 * 历史结束时间
 * @param type
 * @returns
 */
export const getEndTimeMs = (type: TimeRange) => {
  let fixedTimewindow: { startTimeMs: number; endTimeMs: number } | null = null;
  switch (type) {
    case TimeRange.YESTERDAY:
      fixedTimewindow = {
        startTimeMs: dayjs().subtract(1, "day").startOf("day").valueOf(),
        endTimeMs: getUnitEndtimestamp(1, "day") + 1,
      };
      break;

    case TimeRange.BEFORE_YESTERDAY:
      fixedTimewindow = {
        startTimeMs: dayjs().subtract(2, "day").startOf("day").valueOf(),
        endTimeMs: getUnitEndtimestamp(2, "day") + 1,
      };
      break;

    case TimeRange.LAST_MONTH:
      fixedTimewindow = {
        startTimeMs: dayjs().subtract(1, "month").startOf("month").valueOf(),
        endTimeMs: getUnitEndtimestamp(1, "month") + 1,
      };
      break;

    case TimeRange.LAST_QUARTER:
      fixedTimewindow = {
        startTimeMs: getLastQuarterTimestamp(),
        endTimeMs: getEndOfLastQuarter() + 1,
      };
      break;

    case TimeRange.LAST_HALF_YEAR:
      fixedTimewindow = {
        startTimeMs: getLastHalfYearTimestamp(),
        endTimeMs: lastDayOfPreviousHalfYear() + 1,
      };
      console.log(fixedTimewindow, "fixedTimewindow");
      break;

    case TimeRange.LAST_YEAR:
      fixedTimewindow = {
        startTimeMs: dayjs().subtract(1, "year").startOf("year").valueOf(),
        endTimeMs: getUnitEndtimestamp(1, "year"),
      };
      break;

    case TimeRange.CURRENT_HOUR:
      fixedTimewindow = {
        startTimeMs: getCurrenttimestamp("hour"),
        endTimeMs: getCurrenttimestamp("hour") + 60 * 60 * 1000,
      };
      break;

    case TimeRange.CURRENT_DAY:
      fixedTimewindow = {
        startTimeMs: getCurrenttimestamp("day"),
        endTimeMs: getCurrenttimestamp("day") + 86400000,
      };
      break;

    case TimeRange.CURRENT_WEEK:
      fixedTimewindow = {
        startTimeMs: getCurrenttimestamp("week"),
        endTimeMs: getCurrenttimestamp("week") + 86400000 * 7,
      };
      break;

    case TimeRange.CURRENT_MONTH:
      fixedTimewindow = {
        startTimeMs: getCurrenttimestamp("month"),
        endTimeMs: dayjs().endOf("month").valueOf() + 1,
      };
      break;

    case TimeRange.CURRENT_QUARTER:
      fixedTimewindow = {
        startTimeMs: getCurrentTimestampByQuarter(),
        endTimeMs: lastDayOfCurrentQuarter() + 1,
      };
      break;

    case TimeRange.CURRENT_HALF_YEAR:
      fixedTimewindow = {
        startTimeMs: getCurrentTimestampByHalfYear(),
        endTimeMs: lastDayOfCurrentHalfYear() + 1,
      };
      break;

    case TimeRange.CURRENT_YEAR:
      fixedTimewindow = {
        startTimeMs: getCurrenttimestamp("year"),
        endTimeMs: dayjs().endOf("year").valueOf() + 1,
      };
      break;
  }
  return fixedTimewindow;
};

export const formatTime = (timestamp: number | string) => {
  return dayjs(Number(timestamp)).format("YYYY-MM-DD HH:mm:ss");
};
