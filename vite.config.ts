import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver, ArcoResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'
import { vitePluginForArco } from '@arco-plugins/vite-vue'
// import importToCDN from 'vite-plugin-cdn-import'
// import viteCompression from 'vite-plugin-compression';
// svg矢量图全局配置
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// 可视化资源面板

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    build: {
      outDir: env.VITE_BUILD_FILE // 打包的默认路径
    },
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
      createSvgIconsPlugin({
        // 指定图标文件夹，绝对路径
        iconDirs: [path.join(__dirname, 'src/assets/icons')]
      }),
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        imports: ['vue', 'vue-router', 'vuex'],
        eslintrc: {
          enabled: false, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
        dts: './auto-imports.d.ts',
        resolvers: [ElementPlusResolver(), ArcoResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver(), ArcoResolver()]
      }),
      UnoCSS()
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
          target: 'https://orangedev.aiorange.com',
          changeOrigin: true
        },
        '/bonceph': {
          target: 'https://testorthodontic.aiorange.com',
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
