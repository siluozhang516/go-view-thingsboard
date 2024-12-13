import thingsboard, { Observable } from "@thingsboard/core";
import { useFormKitNodeById } from "@formkit/vue";
import { debounce } from "../utils";
import { Check, Close } from "@element-plus/icons-vue";
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
  EntitySearchDirection,
  PageLink,
  TenantService,
  CONTAINS_TYPE,
  MANAGES_TYPE,
} = thingsboard;

export const entityFilterOptions = [
  { label: "单个实体", value: AliasFilterType.singleEntity },
  { label: "实体列表", value: AliasFilterType.entityList },
  { label: "实体名称", value: AliasFilterType.entityName },
  { label: "实体类型", value: AliasFilterType.entityType },
  { label: "仪表板状态实体", value: AliasFilterType.stateEntity },
  { label: "资产类型", value: AliasFilterType.assetType },
  { label: "设备类型", value: AliasFilterType.deviceType },
  // { label: "边缘类型", value: AliasFilterType.edgeType },
  {
    label: "实体视图类型",
    value: AliasFilterType.entityViewType,
  },
  // {
  //   label: "Api使用状态",
  //   value: AliasFilterType.apiUsageState,
  // },
  { label: "关联查询", value: AliasFilterType.relationsQuery },
  {
    label: "资产搜索查询",
    value: AliasFilterType.assetSearchQuery,
  },
  {
    label: "设备搜索查询",
    value: AliasFilterType.deviceSearchQuery,
  },
  {
    label: "边缘搜索查询",
    value: AliasFilterType.edgeSearchQuery,
  },
  {
    label: "实体视图搜索查询",
    value: AliasFilterType.entityViewSearchQuery,
  },
];

export const EntityTypeOption = [
  { label: "设备", value: EntityType.DEVICE },
  { label: "资产", value: EntityType.ASSET },
  { label: "实体视图", value: EntityType.ENTITY_VIEW },
  { label: "租户", value: EntityType.TENANT },
  { label: "客户", value: EntityType.CUSTOMER },
  { label: "用户", value: EntityType.USER },
  // { label: "仪表板", value: EntityType.DASHBOARD },
  // { label: "边缘", value: EntityType.EDGE },
  { label: "Queue statistics", value: EntityType.QUEUE_STATS },
];

export const AliasEntityTypeOption = [
  { label: "当前客户", value: AliasEntityType.CURRENT_CUSTOMER },
  { label: "当前租户", value: AliasEntityType.CURRENT_TENANT },
  { label: "当前用户", value: AliasEntityType.CURRENT_USER },
  { label: "当前用户所有者", value: AliasEntityType.CURRENT_USER_OWNER },
];

const relationTypes = [
  { label: CONTAINS_TYPE, value: CONTAINS_TYPE },
  { label: MANAGES_TYPE, value: MANAGES_TYPE },
];
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

const getSubscription = (
  entityType: thingsboard.EntityType | thingsboard.AliasEntityType,
  page: thingsboard.PageLink
): Observable<any> | null => {
  switch (entityType) {
    case EntityType.DEVICE:
      return DeviceService.getTenantDeviceInfos(page);
    case EntityType.ASSET:
      return AssetService.getTenantAssetInfos(page);
    case EntityType.ENTITY_VIEW:
      return EntityViewService.getTenantEntityViewInfos(page);
    case EntityType.TENANT:
      return TenantService.getTenant("");
    case EntityType.CUSTOMER:
      return CustomerService.getCustomers(page);
    case EntityType.USER:
      return UserService.getUsers(page);
    case EntityType.QUEUE_STATS:
      return QueueService.getQueueStatistics(page);
    case AliasEntityType.CURRENT_CUSTOMER:
      return CustomerService.getCustomers(page);
    default:
      return null;
  }
};

export const schema = [
  {
    $formkit: "el-input",
    name: "alias",
    label: "别名",
    placeholder: "别名",
  },
  {
    $formkit: "el-select",
    name: "type",
    label: "筛选器类型",
    placeholder: "筛选器类型",
    validation: "required",
    options: entityFilterOptions,
    id: "type",
  },
  {
    $formkit: "el-input",
    name: "stateEntityParamName",
    label: "状态实体参数名称",
    if: `$get(type).value === ${AliasFilterType.stateEntity}`,
    placeholder: "请填写状态实体参数名称",
    key: "stateEntityParamName",
  },
  {
    $formkit: "el-select",
    name: "entityType",
    label: "类型",
    placeholder: "请选择类型",
    validation: "required",
    options: entityFilterOptions,
    id: "entityType",
    if: `($get(type).value === ${AliasFilterType.singleEntity}) ||
   ($get(type).value === ${AliasFilterType.entityList}) ||
    ($get(type).value === ${AliasFilterType.entityType}) ||
    ($get(type).value === ${AliasFilterType.stateEntity}) ||
    ($get(type).value === ${AliasFilterType.entityName})
    `,
    optionsDepIds: ["type"],
    key: "entityType",
    optionsLoader: async(form: { type: string }) => {
      const defaultType = ["singleEntity", "stateEntity"];
      if (defaultType.includes(form.type)) {
        return [...EntityTypeOption, ...AliasEntityTypeOption];
      }
      return EntityTypeOption;
    },
  },

  {
    $formkit: "el-select",
    name: "id",
    label: "$get(entityType).valueLabel",
    placeholder: "$: '请选择' + $get(entityType).valueLabel",
    validation: "required",
    remote: true,
    id: "id",
    filterable: true,
    key: "id",
    if: `
    ($get(type).value === ${AliasFilterType.singleEntity}) &&
     ($get(entityType).value) &&
     ($get(entityType).value !==  ${AliasEntityType.CURRENT_TENANT}) &&
     ($get(entityType).value !==  ${AliasEntityType.CURRENT_USER}) &&
     ($get(entityType).value !==  ${AliasEntityType.CURRENT_USER_OWNER})
     `,
    remoteMethod: debounce((value: string) => {
      useFormKitNodeById("entityType", (node: any) => {
        useFormKitNodeById("id", async (nodeId: any) => {
          const options = await nodeId!.context!.optionsLoader(
            {
              entityType: node!.context.value,
            },
            value
          );
          nodeId!.context!.options = options;
        });
      });
    }, 1000),
    optionsDepIds: ["entityType"],
    optionsLoader: async (
      form: { entityType: any },
      value: string | undefined
    ) => {
      return await new Promise((resolve, reject) => {
        const textSearch = value ? value : undefined;
        const page = new PageLink(50, 0, textSearch);
        const subscription: Observable<any> | null = getSubscription(
          form.entityType,
          page
        );

        if (subscription) {
          subscription.subscribe(
            (res) => {
              resolve(formatToOptions(res.data));
            },
            () => reject([])
          );
        } else {
          resolve([]);
        }
      });
    },
  },

  {
    $formkit: "el-select",
    name: "entityList",
    label: "实体列表",
    placeholder: "请选择实体列表",
    validation: "required",
    remote: true,
    id: "entityList",
    filterable: true,
    multiple:true,
    key: "entityList",
    if: `$get(type).value === ${AliasFilterType.entityList}`,
    remoteMethod: debounce((value: string) => {
      useFormKitNodeById("entityType", (node: any) => {
        useFormKitNodeById("entityList", async (nodeId: any) => {
          const options = await nodeId!.context!.optionsLoader(
            {
              entityType: node!.context.value,
            },
            value
          );
          nodeId!.context!.options = options;
        });
      });
    }, 1000),
    optionsDepIds: ["entityType"],
    optionsLoader: async (
      form: { entityType: any },
      value: string | undefined
    ) => {
      return await new Promise((resolve, reject) => {
        const textSearch = value ? value : undefined;
        const page = new PageLink(50, 0, textSearch);
        const subscription: Observable<any> | null = getSubscription(
          form.entityType,
          page
        );

        if (subscription) {
          subscription.subscribe(
            (res) => {
              resolve(formatToOptions(res.data));
            },
            () => reject([])
          );
        } else {
          resolve([]);
        }
      });
    },
  },

  {
    $formkit: "el-input",
    name: "entityNameFilter",
    label: "名称开始于",
    if: `$get(type).value === ${AliasFilterType.entityName}`,
    placeholder: "请填写名称开始于",
    validation: "required",
    key: "entityNameFilter",
  },

  {
    $formkit: "el-select",
    name: "assetTypes",
    label: "资产类型",
    if: `$get(type).value === ${AliasFilterType.assetType}`,
    placeholder: "请填写名称开始于",
    validation: "required",
    multiple: true,
    key: "assetTypes",
    optionsLoader: async () => {
      return await new Promise((resolve, reject) => {
        const page = new PageLink(50, 0, undefined);
        AssetProfileService.getAssetProfiles(page).subscribe(
          (res) => {
            resolve(formatToOptions(res.data, "name"));
          },
          () => reject([])
        );
      });
    },
  },

  {
    $formkit: "el-input",
    name: "assetNameFilter",
    label: "资产名称以此开头",
    if: `$get(type).value === ${AliasFilterType.assetType}`,
    placeholder: "资产名称以此开头",
    key: "assetNameFilter",
  },

  {
    $formkit: "el-select",
    name: "deviceTypes",
    label: "设备类型",
    if: `$get(type).value === ${AliasFilterType.deviceType}`,
    placeholder: "请填写设备类型",
    validation: "required",
    multiple: true,
    key: "deviceTypes",
    optionsLoader: async () => {
      return await new Promise((resolve, reject) => {
        const page = new PageLink(50, 0, undefined);
        DeviceProfileService.getDeviceProfiles(page).subscribe(
          (res) => {
            resolve(formatToOptions(res.data, "name"));
          },
          () => reject([])
        );
      });
    },
  },

  {
    $formkit: "el-input",
    name: "deviceNameFilter",
    label: "名称前缀",
    if: `$get(type).value === ${AliasFilterType.deviceType}`,
    placeholder: "名称前缀",
    key: "deviceNameFilter",
  },

  {
    $formkit: "el-select",
    name: "entityViewTypes",
    label: "实体视图类型",
    if: `$get(type).value === ${AliasFilterType.entityViewType}`,
    placeholder: "请选择实体视图类型",
    validation: "required",
    multiple: true,
    key: "entityViewTypes",
    optionsLoader: async () => {
      return await new Promise((resolve, reject) => {
        EntityViewService.getEntityViewTypes().subscribe(
          (res) => {
            resolve(
              res.map((item) => ({ label: item.type, value: item.type }))
            );
          },
          () => reject([])
        );
      });
    },
  },
  {
    $formkit: "el-input",
    name: "entityViewNameFilter",
    label: "名称前缀",
    if: `$get(type).value === ${AliasFilterType.entityViewType}`,
    placeholder: "名称前缀",
    key: "entityViewNameFilter",
  },

  ////////////////关联查询//////////////////////

  {
    $el: "div",
    attrs: {
      style: {
        border: "1px solid rgba(0, 0, 0, .12)",
        padding: "16px",
        borderRadius: "6px",
      },
    },
    if: `$get(type).value === ${AliasFilterType.relationsQuery}`,
    children: [
      {
        $formkit: "el-switch",
        name: "rootStateEntity",
        label: "根实体",
        value: false,
        activeText: "使用仪表板状态实体作为根实体",
        id: "rootStateEntity_query",
        style: {
          margin: "8px 0",
        },
      },
      {
        $formkit: "el-input",
        name: "stateEntityParamName",
        label: "状态实体参数名称",
        placeholder: "状态实体参数名称",
        if: "$get(rootStateEntity_query).value",
      },
      {
        $cmp: "ElRow",
        props: {
          gutter: 24,
        },
        children: [
          {
            $cmp: "ElCol",
            props: {
              span: 12,
            },
            children: [
              {
                $formkit: "el-select",
                name: "entityType",
                label: "类型",
                id: "entityType_query",
                placeholder: "请选择类型",
                validation: "required",
                options: entityFilterOptions,
                key: "entityType_query",
                optionsLoader: () => {
                  return [...EntityTypeOption, ...AliasEntityTypeOption];
                },
              },
            ],
          },
          {
            $cmp: "ElCol",
            props: {
              span: 12,
            },
            children: [
              {
                $formkit: "el-select",
                name: "id",
                label: "$get(entityType_query).valueLabel",
                placeholder: "$: '请选择' + $get(entityType_query).valueLabel",
                validation: "required",
                remote: true,
                id: "id_query",
                filterable: true,
                key: "id_query",
                if: `
               ($get(entityType_query).value) &&
                ($get(entityType_query).value !==  ${AliasEntityType.CURRENT_TENANT}) &&
             ($get(entityType_query).value !==  ${AliasEntityType.CURRENT_USER}) &&
             ($get(entityType_query).value !==  ${AliasEntityType.CURRENT_USER_OWNER})`,
                remoteMethod: debounce((value: string) => {
                  useFormKitNodeById("entityType_query", (node: any) => {
                    useFormKitNodeById("id_query", async (nodeId: any) => {
                      const options = await nodeId!.context!.optionsLoader(
                        {
                          entityType: node!.context.value,
                        },
                        value
                      );
                      nodeId!.context!.options = options;
                    });
                  });
                }, 1000),
                optionsDepIds: ["entityType"],
                optionsLoader: async (
                  form: { entityType: any },
                  value: string | undefined
                ) => {
                  return await new Promise((resolve, reject) => {
                    const textSearch = value ? value : undefined;
                    const page = new PageLink(50, 0, textSearch);
                    const subscription: Observable<any> | null =
                      getSubscription(form.entityType, page);

                    if (subscription) {
                      subscription.subscribe(
                        (res) => {
                          resolve(formatToOptions(res.data));
                        },
                        () => reject([])
                      );
                    } else {
                      resolve([]);
                    }
                  });
                },
              },
            ],
          },
        ],
      },

      {
        $cmp: "ElRow",
        props: {
          gutter: 24,
        },
        children: [
          {
            $cmp: "ElCol",
            props: {
              span: 12,
            },
            children: [
              {
                $formkit: "el-select",
                name: "direction",
                label: "方向",
                value: EntitySearchDirection.FROM,
                options: [
                  { label: "从", value: EntitySearchDirection.FROM },
                  { label: "到", value: EntitySearchDirection.TO },
                ],
              },
            ],
          },
          {
            $cmp: "ElCol",
            props: {
              span: 12,
            },
            children: [
              {
                $formkit: "el-input-number",
                name: "maxLevel",
                label: "最大关联层级",
                id: "maxLevel_query",
                controlsPosition: "right",
                min: 1,
                value: 1,
                style: {
                  width: "100%",
                },
              },
            ],
          },
        ],
      },
      {
        $formkit: "el-switch",
        name: "fetchLastLevelOnly",
        value: false,
        activeText: "仅获取最后一级关联",
        if: `$get(maxLevel_query).value > 1`,
      },
    ],
  },
  {
    $el: "div",
    attrs: {
      style: {
        border: "1px solid rgba(0, 0, 0, .12)",
        padding: "16px 16px 0",
        borderRadius: "6px",
        marginTop: "18px",
      },
    },
    key: "relationsQuery_key",
    if: `$get(type).value === ${AliasFilterType.relationsQuery}`,
    children: [
      {
        $formkit: "el-array-table",
        name: "filters",
        label: `关联筛选器`,
        dynamic: true,
        upControl: false,
        downControl: false,
        insertControl: false,
        removeControl: true,
        addLabel: "添加筛选器",
        controlAttrs: {
          link: true,
          type: "primary",
          style: {
            width: "46px",
            height: "32px",
          },
        },
        columns: [
          {
            $formkit: "el-switch",
            name: "negate",
            label: `Not`,
            // activeIcon: Check,
            // inactiveIcon: Close,
            inlinePrompt: true,
            columnWidth: "100px",
            value: false,
            children: ["Not"],
          },
          {
            $formkit: "el-select",
            name: "relationType",
            label: `关联类型`,
            value: CONTAINS_TYPE,
            options: relationTypes,
          },
          {
            $formkit: "el-select",
            name: "entityTypes",
            label: "实体类型",
            value: "",
            multiple:true,
            options: [
              { label: "设备", value: EntityType.DEVICE },
              { label: "资产", value: EntityType.ASSET },
              { label: "实体视图", value: EntityType.ENTITY_VIEW },
              { label: "租户", value: EntityType.TENANT },
              { label: "客户", value: EntityType.CUSTOMER },
              { label: "用户", value: EntityType.USER },
            ],
          },
        ],
      },
    ],
  },

  ////////////////资产搜索查询、设备搜索查询、实体视图搜索查询///////////////////

  {
    $formkit: "el-switch",
    name: "rootStateEntity",
    label: "根实体",
    value: false,
    activeText: "使用仪表板状态实体作为根实体",
    id: "rootStateEntity_other",
    if: `
    ($get(type).value === ${AliasFilterType.assetSearchQuery}) ||
    ($get(type).value === ${AliasFilterType.deviceSearchQuery}) ||
    ($get(type).value === ${AliasFilterType.entityViewSearchQuery}) ||
    ($get(type).value === ${AliasFilterType.edgeSearchQuery})
    `,
  },
  {
    $formkit: "el-input",
    name: "stateEntityParamName",
    label: "状态实体参数名称",
    placeholder: "状态实体参数名称",
    if: "$get(rootStateEntity_other).value",
  },

  {
    $cmp: "ElRow",
    props: {
      gutter: 24,
    },
    if: `
    ($get(type).value === ${AliasFilterType.assetSearchQuery}) ||
    ($get(type).value === ${AliasFilterType.deviceSearchQuery}) ||
    ($get(type).value === ${AliasFilterType.entityViewSearchQuery}) ||
    ($get(type).value === ${AliasFilterType.edgeSearchQuery})
    `,
    children: [
      {
        $cmp: "ElCol",
        props: {
          span: 12,
        },
        children: [
          {
            $formkit: "el-select",
            name: "entityType",
            label: "类型",
            id: "entityType_other_query",
            placeholder: "请选择类型",
            validation: "required",
            options: entityFilterOptions,
            key: "entityType_other_query",
            // if: `
            // ($get(type).value === ${AliasFilterType.assetSearchQuery}) ||
            // ($get(type).value === ${AliasFilterType.deviceSearchQuery}) ||
            // ($get(type).value === ${AliasFilterType.entityViewSearchQuery}) ||
            // ($get(type).value === ${AliasFilterType.edgeSearchQuery})
            // `,
            optionsLoader: () => {
              return [...EntityTypeOption, ...AliasEntityTypeOption];
            },
          },
        ],
      },
      {
        $cmp: "ElCol",
        props: {
          span: 12,
        },
        children: [
          {
            $formkit: "el-select",
            name: "id",
            label: "$get(entityType_other_query).valueLabel",
            placeholder:
              "$: '请选择' + $get(entityType_other_query).valueLabel",
            validation: "required",
            remote: true,
            id: "id_asset_query",
            filterable: true,
            key: "id_asset_query",
            if: `($get(entityType_other_query).value) &&
                ($get(entityType_other_query).value !==  ${AliasEntityType.CURRENT_TENANT}) &&
                ($get(entityType_other_query).value !==  ${AliasEntityType.CURRENT_USER}) &&
                ($get(entityType_other_query).value !==  ${AliasEntityType.CURRENT_USER_OWNER})
            `,
            remoteMethod: debounce((value: string) => {
              useFormKitNodeById("entityType_other_query", (node: any) => {
                useFormKitNodeById("id_asset_query", async (nodeId: any) => {
                  const options = await nodeId!.context!.optionsLoader(
                    {
                      entityType: node!.context.value,
                    },
                    value
                  );
                  nodeId!.context!.options = options;
                });
              });
            }, 1000),
            optionsDepIds: ["entityType"],
            optionsLoader: async (
              form: { entityType: any },
              value: string | undefined
            ) => {
              return await new Promise((resolve, reject) => {
                const textSearch = value ? value : undefined;
                const page = new PageLink(50, 0, textSearch);
                const subscription: Observable<any> | null = getSubscription(
                  form.entityType,
                  page
                );

                if (subscription) {
                  subscription.subscribe(
                    (res) => {
                      resolve(formatToOptions(res.data));
                    },
                    () => reject([])
                  );
                } else {
                  resolve([]);
                }
              });
            },
          },
        ],
      },
    ],
  },
  {
    $formkit: "el-switch",
    name: "fetchLastLevelOnly",
    value: false,
    activeText: "仅获取最后一级关联",
    if: `
    ($get(type).value === ${AliasFilterType.assetSearchQuery}) ||
    ($get(type).value === ${AliasFilterType.deviceSearchQuery}) ||
    ($get(type).value === ${AliasFilterType.entityViewSearchQuery}) ||
    ($get(type).value === ${AliasFilterType.edgeSearchQuery})
    `,
  },

  {
    $cmp: "ElRow",
    props: {
      gutter: 24,
    },
    if: `
    ($get(type).value === ${AliasFilterType.assetSearchQuery}) ||
    ($get(type).value === ${AliasFilterType.deviceSearchQuery}) ||
    ($get(type).value === ${AliasFilterType.entityViewSearchQuery}) ||
    ($get(type).value === ${AliasFilterType.edgeSearchQuery})
    `,
    children: [
      {
        $cmp: "ElCol",
        props: {
          span: 12,
        },
        children: [
          {
            $formkit: "el-select",
            name: "direction",
            label: "方向",
            value: EntitySearchDirection.FROM,
            options: [
              { label: "从", value: EntitySearchDirection.FROM },
              { label: "到", value: EntitySearchDirection.TO },
            ],
          },
        ],
      },
      {
        $cmp: "ElCol",
        props: {
          span: 12,
        },
        children: [
          {
            $formkit: "el-input-number",
            name: "maxLevel",
            label: "最大关联层级",
            controlsPosition: "right",
            min: 1,
            value: 1,
            style: {
              width: "100%",
            },
          },
        ],
      },
    ],
  },
  {
    $formkit: "el-select",
    name: "relationType",
    label: "关联类型",
    value: "",
    placeholder: "请选择关联类型",
    key: "relationType_asset_query",
    if: `($get(type).value === ${AliasFilterType.assetSearchQuery}) ||
    ($get(type).value === ${AliasFilterType.deviceSearchQuery}) ||
    ($get(type).value === ${AliasFilterType.entityViewSearchQuery}) ||
    ($get(type).value === ${AliasFilterType.edgeSearchQuery})
    `,
    options: relationTypes,
  },
  {
    $formkit: "el-select",
    name: "assetTypes",
    label: "资产类型",
    placeholder: "请选择资产类型",
    validation: "required",
    key: "assetTypes_asset_query",
    multiple: true,
    if: `$get(type).value === ${AliasFilterType.assetSearchQuery}`,
    optionsLoader: async () => {
      return await new Promise((resolve, reject) => {
        const page = new PageLink(50, 0, undefined);
        AssetProfileService.getAssetProfiles(page).subscribe(
          (res) => {
            resolve(formatToOptions(res.data, "name"));
          },
          () => reject([])
        );
      });
    },
  },
  {
    $formkit: "el-select",
    name: "deviceTypes",
    label: "设备类型",
    placeholder: "请选择设备类型",
    validation: "required",
    key: "deviceTypes_asset_query",
    multiple: true,
    if: `$get(type).value === ${AliasFilterType.deviceSearchQuery}`,
    optionsLoader: async () => {
      return await new Promise((resolve, reject) => {
        const page = new PageLink(50, 0, undefined);
        DeviceProfileService.getDeviceProfiles(page).subscribe(
          (res) => {
            resolve(formatToOptions(res.data, "name"));
          },
          () => reject([])
        );
      });
    },
  },
  {
    $formkit: "el-select",
    name: "edgeTypes",
    label: "边缘类型",
    placeholder: "请选择边缘类型",
    validation: "required",
    key: "edgeTypes_asset_query",
    multiple: true,
    if: `$get(type).value === ${AliasFilterType.edgeSearchQuery}`,
    optionsLoader: async () => {
      return await new Promise((resolve, reject) => {
        EntityViewService.getEntityViewTypes().subscribe(
          (res) => {
            resolve(
              res.map((item) => ({ label: item.type, value: item.type }))
            );
          },
          () => reject([])
        );
      });
    },
  },
  {
    $formkit: "el-select",
    name: "entityViewTypes",
    label: "实体视图类型",
    placeholder: "请选择实体视图类型",
    validation: "required",
    key: "entityViewTypes_asset_query",
    multiple: true,
    if: `$get(type).value === ${AliasFilterType.entityViewSearchQuery}`,
    optionsLoader: async () => {
      return await new Promise((resolve, reject) => {
        EntityViewService.getEntityViewTypes().subscribe(
          (res) => {
            resolve(
              res.map((item) => ({ label: item.type, value: item.type }))
            );
          },
          () => reject([])
        );
      });
    },
  },
];
