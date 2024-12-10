export enum AlarmSeverityUI {
  CRITICAL = "CRITICAL",
  MAJOR = "MAJOR",
  MINOR = "MINOR",
  WARNING = "WARNING",
  INDETERMINATE = "INDETERMINATE",
}

export enum EntityKeyType {
  ATTRIBUTE = 'ATTRIBUTE',
  CLIENT_ATTRIBUTE = 'CLIENT_ATTRIBUTE',
  SHARED_ATTRIBUTE = 'SHARED_ATTRIBUTE',
  SERVER_ATTRIBUTE = 'SERVER_ATTRIBUTE',
  TIME_SERIES = 'TIME_SERIES',
  ENTITY_FIELD = 'ENTITY_FIELD',
  ALARM_FIELD = 'ALARM_FIELD',
  CONSTANT = 'CONSTANT',
  COUNT = 'COUNT'
}

export enum EntityKeyValueType {
  STRING = "STRING",
  NUMERIC = "NUMERIC",
  BOOLEAN = "BOOLEAN",
  DATE_TIME = "DATE_TIME",
}

export enum AlarmScheduleType {
  ANY_TIME = "ANY_TIME",
  SPECIFIC_TIME = "SPECIFIC_TIME",
  CUSTOM = "CUSTOM",
}

export enum DynamicValueSourceType {
  CURRENT_TENANT = "CURRENT_TENANT",
  CURRENT_CUSTOMER = "CURRENT_CUSTOMER",
  CURRENT_DEVICE = "CURRENT_DEVICE",
}

export enum StringOperation {
  EQUAL = "EQUAL",
  NOT_EQUAL = "NOT_EQUAL",
  STARTS_WITH = "STARTS_WITH",
  ENDS_WITH = "ENDS_WITH",
  CONTAINS = "CONTAINS",
  NOT_CONTAINS = "NOT_CONTAINS",
  IN = "IN",
  NOT_IN = "NOT_IN",
}

export enum NumericOperation {
  EQUAL = "EQUAL",
  NOT_EQUAL = "NOT_EQUAL",
  GREATER = "GREATER",
  LESS = "LESS",
  GREATER_OR_EQUAL = "GREATER_OR_EQUAL",
  LESS_OR_EQUAL = "LESS_OR_EQUAL",
}

export enum BooleanOperation {
  EQUAL = "EQUAL",
  NOT_EQUAL = "NOT_EQUAL",
}

export enum ComplexOperation {
  AND = "AND",
  OR = "OR",
}

export const enum AlarmConditionType {
  SIMPLE = "SIMPLE",
  DURATION = "DURATION",
  REPEATING = "REPEATING",
}
export const enum TimeUnit {
  SECONDS = "SECONDS",
  MINUTES = "MINUTES",
  HOURS = "HOURS",
  DAYS = "DAYS",
}

export const enum OperationSige {
  ADD = "ADD",
  EDIT = "EDIT",
}

export const enum RuleType {
  CLEARRULE = "CLEARRULE",
  CREATERULES = "CREATERULES",
}

export type Operation =
  | ComplexOperation
  | BooleanOperation
  | NumericOperation
  | StringOperation
  | DynamicValueSourceType;

export interface KeyFilters {
  key: EntityKey;
  valueType: EntityKeyValueType;
  value?: string | number | boolean;
  predicate: any;
}

export interface EntityKey {
  type: EntityKeyType;
  key: string;
}
export interface AlarmConditionSpec {
  type?: AlarmConditionType;
  unit?: TimeUnit;
  predicate: {
    defaultValue: string;
    dynamicValue: {
      sourceAttribute: string;
      sourceType: string;
      inherit:boolean;
    } | null;
    userValue?: null | string;
  };
}
export interface AlarmCondition {
  condition: Array<KeyFilters> | any;
  spec?: AlarmConditionSpec;
}

//////////////Condition//////////////////////
export interface ConditionProps {
  editStatus: boolean;
  type?: RuleType;
  rule: any;
}
export interface Rule {
  key?: AlarmSeverityUI;
  alarmDetails?: string;
  condition: AlarmCondition;
  dashboardId: any;
  schedule?: AlarmSchedule | null;
}

export interface AlarmSchedule {
  dynamicValue?: {
    sourceAttribute: string;
    sourceType: string;
  };
  type: AlarmScheduleType;
  timezone?: string;
  daysOfWeek: number[];
  startsOn?: number;
  endsOn?: number;
  items?: CustomTimeSchedulerItem[];
}

export interface CustomTimeSchedulerItem {
  enabled: boolean;
  dayOfWeek: number;
  startsOn: number;
  endsOn: number;
}

export interface DeviceProfileAlarm {
  id: string;
  alarmType: string;
  createRules: { [severity: string]: Rule } | null;
  clearRule?: Rule | null;
  propagate?: boolean;
  propagateToOwner?: boolean;
  propagateToTenant?: boolean;
  propagateRelationTypes?: Array<string> | null;
}
