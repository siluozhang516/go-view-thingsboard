import { ref } from "vue";
import { FormItem } from "../components/form.vue";
import thingsboard, { Observable } from "@thingsboard/core";
import { formatToOptions, isObject, debounce } from "../utils";

const {
  EntityType,
  AliasEntityType,
  AliasFilterType,
  DeviceService,
  AssetService,
  EntityViewService,
  UserService,
  QueueService,
  CustomerService,
  AssetProfileService,
  DeviceProfileService,
  PageLink,
} = thingsboard;


export type EntityDataKeys = Required<Pick<thingsboard.Datasource, 'dataKeys' | 'latestDataKeys'>>

 export const EntityTypeOption = [
  { label: "设备", value: EntityType.DEVICE },
  { label: "资产", value: EntityType.ASSET },
  { label: "实体视图", value: EntityType.ENTITY_VIEW },
  { label: "租户", value: EntityType.TENANT },
  { label: "客户", value: EntityType.CUSTOMER },
  { label: "用户", value: EntityType.USER },
  { label: "仪表板", value: EntityType.DASHBOARD },
  { label: "边缘", value: EntityType.EDGE },
  { label: "Queue statistics", value: EntityType.QUEUE_STATS },
];

export const AliasEntityTypeOption = [
  { label: "当前客户", value: AliasEntityType.CURRENT_CUSTOMER },
  { label: "当前租户", value: AliasEntityType.CURRENT_TENANT },
  { label: "当前用户", value: AliasEntityType.CURRENT_USER },
  { label: "当前用户所有者", value: AliasEntityType.CURRENT_USER_OWNER },
];

export const entityFilterOptions = [
  { label: "单个实体", value: AliasFilterType.singleEntity },
  { label: "实体列表", value: AliasFilterType.entityList },
  { label: "实体名称", value: AliasFilterType.entityName },
  { label: "实体类型", value: AliasFilterType.entityType },
  { label: "仪表板状态实体", value: AliasFilterType.stateEntity },
  { label: "资产类型", value: AliasFilterType.assetType },
  { label: "设备类型", value: AliasFilterType.deviceType },
  { label: "边缘类型", value: AliasFilterType.edgeType,disabled: true },
  { label: "实体视图类型", value: AliasFilterType.entityViewType,disabled: true },
  { label: "Api使用状态", value: AliasFilterType.apiUsageState,disabled: true },
  { label: "关联查询", value: AliasFilterType.relationsQuery,disabled: true },
  { label: "资产搜索查询", value: AliasFilterType.assetSearchQuery,disabled: true },
  { label: "设备搜索查询", value: AliasFilterType.deviceSearchQuery,disabled: true },
  { label: "边缘搜索查询", value: AliasFilterType.edgeSearchQuery,disabled: true },
  {
    label: "实体视图搜索查询",
    value: AliasFilterType.entityViewSearchQuery,
    disabled: true
  },
]

const getSubscription = (entityType, page): Observable<any> | null => {
  switch (entityType) {
    case EntityType.DEVICE:
      return DeviceService.getTenantDeviceInfos(page);
    case EntityType.ASSET:
      return AssetService.getTenantAssetInfos(page);
    case EntityType.ENTITY_VIEW:
      return EntityViewService.getTenantEntityViewInfos(page);
    case EntityType.CUSTOMER:
      return CustomerService.getCustomers(page);
    case EntityType.USER:
      return UserService.getUsers(page);
    case EntityType.QUEUE_STATS:
      return QueueService.getQueueStatistics(page);
    default:
      return null;
  }
};
export const formConfig = ref<FormItem[]>([
  {
    type: "el-input",
    label: "别名",
    prop: "alias",
    placeholder: "请输入别名",
    // validate: true,
    // rules: [{ required: true, message: "请输入别名", trigger: "blur" }],
  },
  {
    type: "el-select",
    label: "筛选器类型",
    prop: "type",
    placeholder: "请选择筛选器类型",
    validate: true,
    rules: [{ required: true, message: "请选择筛选器类型", trigger: "change" }],
    events: {
      change: () => ["entityType"],
    },
    options: entityFilterOptions,
  },
  {
    type: "el-input",
    label: "状态实体参数名称",
    prop: "stateEntityParamName",
    placeholder: "请填写状态实体参数名称",
    vIf: (form) => {
      return form.type === AliasFilterType.stateEntity;
    },
  },
  {
    type: "el-select",
    label: "类型",
    prop: "entityType",
    placeholder: "请选择类型",
    validate: true,
    rules: [{ required: true, message: "请选择类型", trigger: "change" }],
    events: {
      change: (v, form, { getFormConfigByProp, updateFormConfig }) => {
        const match = [...EntityTypeOption, ...AliasEntityTypeOption].find(
          (k) => k.value === v
        );
        if (match) {
          const config = getFormConfigByProp("id");
          if (config) {
            config.label = match.label;
            config.placeholder = `请选择${config.label}`;
            config.rules = [
              {
                required: true,
                message: config.placeholder,
                trigger: "change",
              },
            ];
            updateFormConfig(config);
            form.value.id = "";
          }
        }
      },
    },
    asyncOptions: {
      requestApi: (_ata, _formState, form) =>
        new Promise((resolve) => {
          const defaultType = [ "singleEntity","stateEntity"]
          if (defaultType.includes(form.value.type)) {
            resolve([...EntityTypeOption, ...AliasEntityTypeOption]);
          }
          resolve(EntityTypeOption);
        }),
    },
    vIf: (form) => {
      const defaultType = [
        AliasFilterType.singleEntity,
        AliasFilterType.entityList,
        AliasFilterType.entityType,
        AliasFilterType.stateEntity,
        AliasFilterType.entityName,
      ];
      return defaultType.includes(form.type);
    },
  },
  {
    type: "el-select",
    label: "设备",
    prop: "id",
    placeholder: "请选择设备",
    props: (_form, _type, { getFormConfigByProp, fetchSignAsyncOption }) => {
      return {
        remote: true,
        filterable: true,
        remoteMethod: debounce((query) => {
          fetchSignAsyncOption(getFormConfigByProp("id") as FormItem, query);
        }, 1000),
      };
    },
    validate: true,
    rules: [{ required: true, message: "请选择设备", trigger: "change" }],
    vIf: (form) => {
      return form.type === AliasFilterType.singleEntity;
    },
    asyncOptions: {
      requestApi: (data, _formState, form) =>
        new Promise((resolve, reject) => {
          const textSearch = isObject(data) ? null : data;
          const page = new PageLink(50, 0, textSearch);
          const subscription: Observable<any> | null = getSubscription(
            form.value.entityType,
            page
          );

          if (subscription) {
            subscription.subscribe(
              (res) => {
                resolve(formatToOptions(res.data));
              },
              () => reject([])
            );
          }
        }),
    },
  },
  {
    type: "el-select",
    label: "实体列表",
    prop: "entityList",
    placeholder: "请选择实体列表",
    validate: true,
    rules: [{ required: true, message: "请选择实体列表", trigger: "change" }],
    vIf: (form) => {
      return form.type === AliasFilterType.entityList;
    },
    props: (_form, _type, { getFormConfigByProp, fetchSignAsyncOption }) => {
      return {
        remote: true,
        multiple: true,
        filterable: true,
        remoteMethod: debounce((query) => {
          fetchSignAsyncOption(
            getFormConfigByProp("entityList") as FormItem,
            query
          );
        }, 1000),
      };
    },
    asyncOptions: {
      requestApi: (data, _formState, form) =>
        new Promise((resolve, reject) => {
          const textSearch = isObject(data) ? null : data;
          const page = new PageLink(50, 0, textSearch);
          const subscription: Observable<any> | null = getSubscription(
            form.value.entityType,
            page
          );

          if (subscription) {
            subscription.subscribe(
              (res) => {
                resolve(formatToOptions(res.data));
              },
              () => reject([])
            );
          }
        }),
    },
  },
  {
    type: "el-input",
    label: "名称开始于",
    prop: "entityNameFilter",
    placeholder: "请填写名称开始于",
    validate: true,
    rules: [{ required: true, message: "请填写名称开始于", trigger: "blur" }],
    vIf: (form) => {
      return form.type === AliasFilterType.entityName;
    },
  },
  {
    type: "el-select",
    label: "资产类型",
    prop: "assetTypes",
    placeholder: "请填写资产类型",
    validate: true,
    rules: [{ required: true, message: "请填写资产类型", trigger: "blur" }],
    vIf: (form) => {
      return form.type === AliasFilterType.assetType;
    },
    props:{
      multiple:true
    },
    asyncOptions: {
      requestApi: (data, _formState, form) =>
        new Promise((resolve, reject) => {
          const textSearch = isObject(data) ? null : data;
          const page = new PageLink(50, 0, textSearch);
          AssetProfileService.getAssetProfiles(page).subscribe(
            (res) => {
              resolve(formatToOptions(res.data,'name'));
            },
            () => reject([])
          );
        }),
    },
  },
  {
    type: "el-input",
    label: "资产名称以此开头",
    prop: "assetNameFilter",
    placeholder: "资产名称以此开头",
    vIf: (form) => {
      return form.type === AliasFilterType.assetType;
    },
  },
  {
    type: "el-select",
    label: "设备类型",
    prop: "deviceTypes",
    placeholder: "请填写设备类型",
    validate: true,
    rules: [{ required: true, message: "请填写设备类型", trigger: "blur" }],
    vIf: (form) => {
      return form.type === AliasFilterType.deviceType;
    },
    props:{
      multiple:true
    },
    asyncOptions: {
      requestApi: (data, _formState) =>
        new Promise((resolve, reject) => {
          const textSearch = isObject(data) ? null : data;
          const page = new PageLink(50, 0, textSearch);
          DeviceProfileService.getDeviceProfiles(page).subscribe(
            (res) => {
              resolve(formatToOptions(res.data,'name'));
            },
            () => reject([])
          );
        }),
    },
  },
  {
    type: "el-input",
    label: "设备名称以此开头",
    prop: "deviceNameFilter",
    placeholder: "设备名称以此开头",
    vIf: (form) => {
      return form.type === AliasFilterType.deviceType;
    },
  },
]);
