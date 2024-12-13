import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// @ts-ignore
import { plugin, defaultConfig } from "@formkit/vue";
// @ts-ignore
import { ElementPlusInputs,createOptionsLoaderPlugin } from "formkit-element-plus";
// @ts-ignore
import { zh } from "@formkit/i18n";

export function useFormkit(app) {
  app.use(ElementPlus).use(
    plugin,
    defaultConfig({
      locales: { zh },
      locale: "zh",
      plugins: [
        createOptionsLoaderPlugin(),
        (node) => {
          if (
            node.context?.type === "el-checkbox-group" ||
            node.context?.type === "el-select" ||
            node.context?.type === "el-radio-group"
          ) {
            node.on("commit", ({ payload }) => {
              if (node.context) {
                node.context.valueLabel = (node.context?.options || []).find(
                  (ele) => ele.value === payload
                )?.label;
              }
            });
          }
        },
      ],
      inputs: {
        ...ElementPlusInputs,
      },
    })
  );
}
