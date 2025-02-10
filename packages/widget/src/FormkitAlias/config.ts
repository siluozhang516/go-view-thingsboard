import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// @ts-ignore
import { plugin, defaultConfig } from "@formkit/vue";
// @ts-ignore
import {
  ElementPlusInputs,
  createOptionsLoaderPlugin,
} from "formkit-element-plus";
// @ts-ignore
import { zh } from "@formkit/i18n";

// 定义支持的组件类型
const SUPPORTED_COMPONENTS = [
  "el-checkbox-group",
  "el-select",
  "el-radio-group",
] as const;

interface Option {
  value: string | number;
  label: string;
}

type SupportedComponentType = (typeof SUPPORTED_COMPONENTS)[number];

function mappingOptionLablePlugin(node) {
  if (
    !node.context?.type ||
    !SUPPORTED_COMPONENTS.includes(node.context.type as SupportedComponentType)
  ) {
    return;
  }
  node.on("commit", ({ payload }) => {
    if (!node.context) return;
    const options = (node.context.options as Option[]) || [];
    const matchedOption = options.find((option) => option.value === payload);

    if (matchedOption) {
      node.context.valueLabel = matchedOption.label;
    }
  });
}

export function useFormkit(app) {
  app.use(ElementPlus).use(
    plugin,
    defaultConfig({
      locales: { zh },
      locale: "zh",
      plugins: [createOptionsLoaderPlugin(), mappingOptionLablePlugin],
      inputs: {
        ...ElementPlusInputs,
      },
    })
  );
}
