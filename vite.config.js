import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver,ArcoResolver  } from 'unplugin-vue-components/resolvers'
import { vitePluginForArco } from '@arco-plugins/vite-vue'
// import importToCDN from 'vite-plugin-cdn-import'
// import viteCompression from 'vite-plugin-compression';
// svg矢量图全局配置
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// 可视化资源面板
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    build: {
      outDir: env.VITE_BUILD_FILE,// 打包的默认路径
    },
    base: 'system1-resource',
    plugins: [
      vue({
        reactivityTransform: true
      }),
      vueJsx(),
      // arco配置项
      vitePluginForArco({
        style: 'css',
        componentPrefix: 'arco'
      }),
      // 可视化资源面板
      visualizer({ open: false }),
      createSvgIconsPlugin({
        // 指定图标文件夹，绝对路径
        iconDirs: [path.join(__dirname, 'src/assets/icons')]
      }),
      AutoImport({
        resolvers: [ElementPlusResolver(),ArcoResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver(),ArcoResolver()],
      }),
      // viteCompression()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/prod-api': {
          target: 'http://orangetest.aiorange.com',
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
  }
})
