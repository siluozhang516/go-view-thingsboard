// import { nodeResolve } from "@rollup/plugin-node-resolve";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript2 from "rollup-plugin-typescript2";
// import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";
import workerLoader from "rollup-plugin-web-worker-loader";
import builtins from "rollup-plugin-node-builtins";
import analyze from "rollup-plugin-analyzer";
import alias from "@rollup/plugin-alias";

let isDev = false;
let isWx = false;
switch (process.env.ENV) {
  case "development":
    isDev = true;
    isWx = false;
    break;
  case "production":
    isDev = false;
    isWx = false;
    break;
  case "development_wx":
    isDev = true;
    isWx = true;
    break;
  case "production_wx":
    isDev = false;
    isWx = true;
    break;
  default:
    break;
}

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: false,
    },
    {
      file: pkg.module,
      format: "esm",
      sourcemap: false,
    },
    {
      file: pkg.browser,
      format: "umd",
      name: "Ucthings",
      sourcemap: false,
    },
  ],
  plugins: [
    builtins(),
    // 这个插件是有执行顺序的
    nodeResolve({
      extensions: [".ts", ".js"],
      mainFields: ["browser", "module", "main"],
    }),
    commonjs(),

    workerLoader({
      extensions: [".ts", ".js"],
    }),
    typescript2({
      typescript: require("typescript"),
      // tsconfig:'./tsconfig.json',
    }),
    json(),
    !isDev && terser(),
    !isDev &&
      analyze({
        limit: 10,
      }),
    alias({
      entries: [
        {find:'moment',replacement:'moment-mini'},
        // {find:'@',replacement:path.resolve(__dirname, './src/packages/')},
        // {find:'@core',replacement:path.resolve(__dirname, './src/packages/core/')},
        // {find:'@shared',replacement:path.resolve(__dirname, './src/packages/shared/')},
      ],
    }),
    {
      name: "rollup-moment-minify-plugin",
      options: (options) => {
        options.plugins = [
          alias({
            entries: {
              moment: "moment-mini",
            },
          }),
          ...(options.plugins || []),
        ];
        return options;
      },
      transform: (code, id) => {
        if (id.includes("latest.json")) {
          return `
            export var version = "2021e";
            export var zones = [
                    "Asia/Shanghai|CST CDT|-80 -90|01010101010101010101010101010|-23uw0 18n0 OjB0 Rz0 11d0 1wL0 A10 8HX0 1G10 Tz0 1ip0 1jX0 1cN0 11b0 1oN0 aL0 1tU30 Rb0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0|23e6"
            ];
            export var links = [
                    "Asia/Shanghai|Asia/Chongqing",
                    "Asia/Shanghai|Asia/Chungking",
                    "Asia/Shanghai|Asia/Harbin",
                    "Asia/Shanghai|PRC"
            ];
            export var countries = [
                    "CN|Asia/Shanghai Asia/Urumqi"
            ];
            export default {
                    version: version,
                    zones: zones,
                    links: links,
                    countries: countries
            };
          `;
        }
      },
    },
    isWx && {
      name: "rollup-wx-plugin",
      async resolveId(source, importer, options) {
        if (source.includes("moment")) {
          // console.log(source, importer);
        }
      },
      transform: (code, id) => {
        if (id.includes("pouchdb-md5")) {
          return code.replace(/self/g, "uni");
        }

        if(id.includes("globals")) {
          return code
            .replace(/wx/g, "uni");
        }

        if(id.includes("imageManager")) {
          return code
            .replace(/window\.XMLHttpRequest/g, "false");
        }

        if (!id.includes("node_modules") && !id.includes("tbApi")) {
          return code
            .replace(/localStorage\.setItem/g, "uni.setStorageSync")
            .replace(/localStorage\.getItem/g, "uni.getStorageSync");
        }

        if (id.includes("tbApi")) {
          return code
            .replace(/wx\.setStorageSync/g, "uni.setStorageSync")
            .replace(/wx\.getStorageSync/g, "uni.getStorageSync")
            .replace(/wx\./g, "uni.")
            .replace(/window\.XMLHttpRequest/g, "false")
            .replace(/\!config\.WebSocketCtor \&\& wx/g, "true");
        }

        if (id.includes("sql.js")) {
          return code
            .replace(/new WebAssembly.RuntimeError/g, "console.error")
            .replace(/WebAssembly/g, "WXWebAssembly");
        }

        // 解决rxdb中使用到TextEncoder，而小程序中原生没有
        if (id.includes("rxdb\\dist\\es\\util.js")) {
          return `${code}

          class TextEncoder {
            encode(inputString) {
              var patchedU8Array = Array;
              // 0xc0 => 0b11000000; 0xff => 0b11111111; 0xc0-0xff => 0b11xxxxxx
              // 0x80 => 0b10000000; 0xbf => 0b10111111; 0x80-0xbf => 0b10xxxxxx
              var encodedString = inputString === void 0 ? "" : ("" + inputString), len=encodedString.length|0;
              var result=new patchedU8Array((len << 1) + 8|0), tmpResult;
              var i=0, pos=0, point=0, nextcode=0;
              var upgradededArraySize=false; // normal arrays are auto-expanding
              for (i=0; i<len; i=i+1|0, pos=pos+1|0) {
                point = encodedString.charCodeAt(i)|0;
                if (point <= 0x007f) {
                  result[pos] = point;
                } else if (point <= 0x07ff) {
                  result[pos] = (0x6<<5)|(point>>6);
                  result[pos=pos+1|0] = (0x2<<6)|(point&0x3f);
                } else {
                  widenCheck: {
                    if (0xD800 <= point) {
                      if (point <= 0xDBFF) {
                        nextcode = encodedString.charCodeAt(i=i+1|0)|0; // defaults to 0 when NaN, causing null replacement character

                        if (0xDC00 <= nextcode && nextcode <= 0xDFFF) {
                          //point = ((point - 0xD800)<<10) + nextcode - 0xDC00 + 0x10000|0;
                          point = (point<<10) + nextcode - 0x35fdc00|0;
                          if (point > 0xffff) {
                            result[pos] = (0x1e/*0b11110*/<<3) | (point>>18);
                            result[pos=pos+1|0] = (0x2/*0b10*/<<6) | ((point>>12)&0x3f/*0b00111111*/);
                            result[pos=pos+1|0] = (0x2/*0b10*/<<6) | ((point>>6)&0x3f/*0b00111111*/);
                            result[pos=pos+1|0] = (0x2/*0b10*/<<6) | (point&0x3f/*0b00111111*/);
                            continue;
                          }
                          break widenCheck;
                        }
                        point = 65533/*0b1111111111111101*/;//return '\xEF\xBF\xBD';//fromCharCode(0xef, 0xbf, 0xbd);
                      } else if (point <= 0xDFFF) {
                        point = 65533/*0b1111111111111101*/;//return '\xEF\xBF\xBD';//fromCharCode(0xef, 0xbf, 0xbd);
                      }
                    }
                    if (!upgradededArraySize && (i << 1) < pos && (i << 1) < (pos - 7|0)) {
                      upgradededArraySize = true;
                      tmpResult = new patchedU8Array(len * 3);
                      tmpResult.set( result );
                      result = tmpResult;
                    }
                  }
                  result[pos] = (0xe/*0b1110*/<<4) | (point>>12);
                  result[pos=pos+1|0] =(0x2/*0b10*/<<6) | ((point>>6)&0x3f/*0b00111111*/);
                  result[pos=pos+1|0] =(0x2/*0b10*/<<6) | (point&0x3f/*0b00111111*/);
                }
              }
              return result.slice(0, pos);
            }
          }
          `;
        }
      },
    },
  ],
};
