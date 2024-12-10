import { ref, h, unref } from "vue";
import { ElSelect, ElOption } from "element-plus";
import thingsboard from "@thingsboard/core";

const { DataKeyType } = thingsboard;

export enum TimeseriesEnum {
  LATEST = "latest",
  TIMESERIES = thingsboard.DataKeyType.timeseries,
}

const timeseriesType = [
  { label: "时间序列", value: TimeseriesEnum.TIMESERIES },
  { label: "最新", value: TimeseriesEnum.LATEST },
];

const keyTypeOption = [
  { label: "属性", value: DataKeyType.attribute },
  { label: "时间序列", value: DataKeyType.timeseries },
];

export function useColumns(keyOptions, attrOptions) {
  const dataList = ref<any[]>([]);

  const columns = ref([
    {
      label: "键",
      prop: "name",
      cellRenderer: ({ row }) => {
        return h(
          ElSelect,
          {
            modelValue: row.name,
            placeholder: "请选择键",
            filterable: true,
            allowCreate: true,
            multiple: true,
            multipleLimit: 1,
            onChange: (v) => {
              row.name = v;
              row.keyType = unref(attrOptions)[v] || "";
              if (row.keyType == DataKeyType.timeseries) {
                row.type = DataKeyType.timeseries;
                return
              }
              row.type = ''
            },
          },
          () => unref(keyOptions)
        );
      },
    },
    {
      label: "键类型",
      prop: "keyType",
      cellRenderer: ({ row }) => {
        return h(
          ElSelect,
          {
            modelValue: row.keyType,
            placeholder: "请选择键",
            onChange: (v) => {
              row.keyType = v;
              if (v == DataKeyType.timeseries) {
                row.type = DataKeyType.timeseries;
                return
              }
              row.type = ''
            },
          },
          () =>
            keyTypeOption.map((item) =>
              h(ElOption, {
                key: item.value,
                label: item.label,
                value: item.value,
              })
            )
        );
      },
    },
    {
      label: "来源",
      prop: "type",
      cellRenderer: ({ row }) => {
        return row.keyType === DataKeyType.timeseries
          ? h(
              ElSelect,
              {
                modelValue: row.type,
                placeholder: "请选择来源类型",
                onChange: (v) => {
                  row.type = v;
                },
              },
              () =>
                timeseriesType.map((item) =>
                  h(ElOption, {
                    key: item.value,
                    label: item.label,
                    value: item.value,
                  })
                )
            )
          : "";
      },
    },
    {
      label: "操作",
      fixed: "right",
      width: 90,
      slot: "operation",
    },
  ]);

  function onAdd() {
    dataList.value.push({
      id: dataList.value.length + 1,
      name: [],
      keyType: "",
      type: "",
    });
  }

  function onDel(row) {
    const index = dataList.value.indexOf(row);
    if (index !== -1) dataList.value.splice(index, 1);
  }

  return {
    columns,
    dataList,
    onAdd,
    onDel,
  };
}
