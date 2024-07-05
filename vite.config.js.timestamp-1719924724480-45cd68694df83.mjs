// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "file:///Users/edy/Desktop/saas-orange-ortho-ts-ssr/node_modules/.pnpm/vite@4.5.2_@types+node@20.14.9_sass@1.72.0_terser@5.29.2/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/edy/Desktop/saas-orange-ortho-ts-ssr/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@4.5.2_vue@3.4.21/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///Users/edy/Desktop/saas-orange-ortho-ts-ssr/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@4.5.2_vue@3.4.21/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///Users/edy/Desktop/saas-orange-ortho-ts-ssr/node_modules/.pnpm/unplugin-auto-import@0.16.7_rollup@2.79.1/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///Users/edy/Desktop/saas-orange-ortho-ts-ssr/node_modules/.pnpm/unplugin-vue-components@0.25.2_rollup@2.79.1_vue@3.4.21/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver, ArcoResolver } from "file:///Users/edy/Desktop/saas-orange-ortho-ts-ssr/node_modules/.pnpm/unplugin-vue-components@0.25.2_rollup@2.79.1_vue@3.4.21/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import UnoCSS from "file:///Users/edy/Desktop/saas-orange-ortho-ts-ssr/node_modules/.pnpm/unocss@0.58.6_postcss@8.4.38_rollup@2.79.1_vite@4.5.2/node_modules/unocss/dist/vite.mjs";
import { createSvgIconsPlugin } from "file:///Users/edy/Desktop/saas-orange-ortho-ts-ssr/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@4.5.2/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/Users/edy/Desktop/saas-orange-ortho-ts-ssr";
var __vite_injected_original_import_meta_url = "file:///Users/edy/Desktop/saas-orange-ortho-ts-ssr/vite.config.js";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    ssr: { noExternal: ["arco-design", "element-plus"] },
    build: {
      outDir: env.VITE_BUILD_FILE
      // 打包的默认路径
    },
    plugins: [
      vue({
        reactivityTransform: true
      }),
      vueJsx(),
      // arco配置项
      // vitePluginForArco({
      //   style: 'css',
      //   componentPrefix: 'arco'
      // }),
      // 可视化资源面板
      createSvgIconsPlugin({
        // 指定图标文件夹，绝对路径
        iconDirs: [path.join(__vite_injected_original_dirname, "src/assets/icons")]
      }),
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        imports: ["vue", "vue-router", "vuex"],
        eslintrc: {
          enabled: false,
          // Default `false`
          filepath: "./.eslintrc-auto-import.json",
          // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true
          // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
        dts: "./auto-imports.d.ts",
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      UnoCSS()
      // viteCompression()
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    server: {
      proxy: {
        "/prod-api": {
          target: "https://orangedev.aiorange.com:30001",
          changeOrigin: true
        },
        "/bonceph": {
          target: "https://testorthodontic.aiorange.com",
          changeOrigin: true
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@/var.scss' as *;`,
          javascriptEnabled: true
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZWR5L0Rlc2t0b3Avc2Fhcy1vcmFuZ2Utb3J0aG8tdHMtc3NyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZWR5L0Rlc2t0b3Avc2Fhcy1vcmFuZ2Utb3J0aG8tdHMtc3NyL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9lZHkvRGVza3RvcC9zYWFzLW9yYW5nZS1vcnRoby10cy1zc3Ivdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyLCBBcmNvUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJ1xuLy8gaW1wb3J0IHsgdml0ZVBsdWdpbkZvckFyY28gfSBmcm9tICdAYXJjby1wbHVnaW5zL3ZpdGUtdnVlJ1xuLy8gaW1wb3J0IGltcG9ydFRvQ0ROIGZyb20gJ3ZpdGUtcGx1Z2luLWNkbi1pbXBvcnQnXG4vLyBpbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcbi8vIHN2Z1x1NzdFMlx1OTFDRlx1NTZGRVx1NTE2OFx1NUM0MFx1OTE0RFx1N0Y2RVxuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG4vLyBcdTUzRUZcdTg5QzZcdTUzMTZcdThENDRcdTZFOTBcdTk3NjJcdTY3N0ZcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKVxuICByZXR1cm4ge1xuICAgIHNzcjogeyBub0V4dGVybmFsOiBbJ2FyY28tZGVzaWduJywgJ2VsZW1lbnQtcGx1cyddIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIG91dERpcjogZW52LlZJVEVfQlVJTERfRklMRSAvLyBcdTYyNTNcdTUzMDVcdTc2ODRcdTlFRDhcdThCQTRcdThERUZcdTVGODRcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSh7XG4gICAgICAgIHJlYWN0aXZpdHlUcmFuc2Zvcm06IHRydWVcbiAgICAgIH0pLFxuICAgICAgdnVlSnN4KCksXG4gICAgICAvLyBhcmNvXHU5MTREXHU3RjZFXHU5ODc5XG4gICAgICAvLyB2aXRlUGx1Z2luRm9yQXJjbyh7XG4gICAgICAvLyAgIHN0eWxlOiAnY3NzJyxcbiAgICAgIC8vICAgY29tcG9uZW50UHJlZml4OiAnYXJjbydcbiAgICAgIC8vIH0pLFxuICAgICAgLy8gXHU1M0VGXHU4OUM2XHU1MzE2XHU4RDQ0XHU2RTkwXHU5NzYyXHU2NzdGXG4gICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgICAgIC8vIFx1NjMwN1x1NUI5QVx1NTZGRVx1NjgwN1x1NjU4N1x1NEVGNlx1NTkzOVx1RkYwQ1x1N0VERFx1NUJGOVx1OERFRlx1NUY4NFxuICAgICAgICBpY29uRGlyczogW3BhdGguam9pbihfX2Rpcm5hbWUsICdzcmMvYXNzZXRzL2ljb25zJyldXG4gICAgICB9KSxcbiAgICAgIEF1dG9JbXBvcnQoe1xuICAgICAgICBpbmNsdWRlOiBbL1xcLlt0al1zeD8kLywgL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlLywgL1xcLm1kJC9dLFxuICAgICAgICBpbXBvcnRzOiBbJ3Z1ZScsICd2dWUtcm91dGVyJywgJ3Z1ZXgnXSxcbiAgICAgICAgZXNsaW50cmM6IHtcbiAgICAgICAgICBlbmFibGVkOiBmYWxzZSwgLy8gRGVmYXVsdCBgZmFsc2VgXG4gICAgICAgICAgZmlsZXBhdGg6ICcuLy5lc2xpbnRyYy1hdXRvLWltcG9ydC5qc29uJywgLy8gRGVmYXVsdCBgLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvbmBcbiAgICAgICAgICBnbG9iYWxzUHJvcFZhbHVlOiB0cnVlIC8vIERlZmF1bHQgYHRydWVgLCAodHJ1ZSB8IGZhbHNlIHwgJ3JlYWRvbmx5JyB8ICdyZWFkYWJsZScgfCAnd3JpdGFibGUnIHwgJ3dyaXRlYWJsZScpXG4gICAgICAgIH0sXG4gICAgICAgIGR0czogJy4vYXV0by1pbXBvcnRzLmQudHMnLFxuICAgICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldXG4gICAgICB9KSxcbiAgICAgIENvbXBvbmVudHMoe1xuICAgICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldXG4gICAgICB9KSxcbiAgICAgIFVub0NTUygpXG4gICAgICAvLyB2aXRlQ29tcHJlc3Npb24oKVxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcbiAgICAgIH1cbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgcHJveHk6IHtcbiAgICAgICAgJy9wcm9kLWFwaSc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwczovL29yYW5nZWRldi5haW9yYW5nZS5jb206MzAwMDEnLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnL2JvbmNlcGgnOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly90ZXN0b3J0aG9kb250aWMuYWlvcmFuZ2UuY29tJyxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEB1c2UgJ0AvdmFyLnNjc3MnIGFzICo7YCxcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVCxTQUFTLGVBQWUsV0FBVztBQUV0VixTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMscUJBQXFCLG9CQUFvQjtBQUNsRCxPQUFPLFlBQVk7QUFLbkIsU0FBUyw0QkFBNEI7QUFDckMsT0FBTyxVQUFVO0FBZGpCLElBQU0sbUNBQW1DO0FBQXFKLElBQU0sMkNBQTJDO0FBbUIvTyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxDQUFDO0FBQ3ZDLFNBQU87QUFBQSxJQUNMLEtBQUssRUFBRSxZQUFZLENBQUMsZUFBZSxjQUFjLEVBQUU7QUFBQSxJQUNuRCxPQUFPO0FBQUEsTUFDTCxRQUFRLElBQUk7QUFBQTtBQUFBLElBQ2Q7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLElBQUk7QUFBQSxRQUNGLHFCQUFxQjtBQUFBLE1BQ3ZCLENBQUM7QUFBQSxNQUNELE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU9QLHFCQUFxQjtBQUFBO0FBQUEsUUFFbkIsVUFBVSxDQUFDLEtBQUssS0FBSyxrQ0FBVyxrQkFBa0IsQ0FBQztBQUFBLE1BQ3JELENBQUM7QUFBQSxNQUNELFdBQVc7QUFBQSxRQUNULFNBQVMsQ0FBQyxjQUFjLFVBQVUsY0FBYyxPQUFPO0FBQUEsUUFDdkQsU0FBUyxDQUFDLE9BQU8sY0FBYyxNQUFNO0FBQUEsUUFDckMsVUFBVTtBQUFBLFVBQ1IsU0FBUztBQUFBO0FBQUEsVUFDVCxVQUFVO0FBQUE7QUFBQSxVQUNWLGtCQUFrQjtBQUFBO0FBQUEsUUFDcEI7QUFBQSxRQUNBLEtBQUs7QUFBQSxRQUNMLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLE1BQ25DLENBQUM7QUFBQSxNQUNELFdBQVc7QUFBQSxRQUNULFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLE1BQ25DLENBQUM7QUFBQSxNQUNELE9BQU87QUFBQTtBQUFBLElBRVQ7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsTUFDdEQ7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTCxhQUFhO0FBQUEsVUFDWCxRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsUUFDaEI7QUFBQSxRQUNBLFlBQVk7QUFBQSxVQUNWLFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxRQUNoQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixnQkFBZ0I7QUFBQSxVQUNoQixtQkFBbUI7QUFBQSxRQUNyQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
