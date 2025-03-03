import { defineConfig } from 'vitepress'
import {fileURLToPath} from 'node:url'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'My Note',
  description: 'A Blog site',
  // lang: 'zh',
  base: '/my-note/',
  vite: {
    resolve: {
      alias: [
        { find: '@', replacement: fileURLToPath(new URL('../../docs', import.meta.url))},
      ]
    },
  },
  head: [
    // ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css' }],
    // ['link', { rel: 'stylesheet', href: 'https://unpkg.com/highlightjs-copy/dist/highlightjs-copy.min.css' }],
    // ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '前端', link: '/front-end' },
      { text: '后端', link: '/back-end' },
      { text: '运维', link: '/ops' },
      { text: '文档', link: '/tools/front-end' },
      { text: '文章', link: '/article' },
    ],
    sidebar: {
      '/article': [
        {
          text: '算法',
          link: '/article/algorithm/',
          items: [
            { text: 'js', link: '/article/algorithm/js/index.md' },
          ],
        },
      ],
      '/tools': [
        {
          text: 'blog',
          link: '/tools/blog',
        },
        {
          text: 'UI',
          link: '/tools/ui',
        },
        {
          text: '前端',
          link: '/tools/front-end',
        },
        {
          text: '后端',
          link: '/tools/back-end',
        },
        {
          text: '测试',
          link: '/tools/test',
        },
        {
          text: 'Ops',
          link: '/tools/ops',
        },
        {
          text: '其他工具',
          link: '/tools/other',
        },
        {
          text: '软件安装',
          link: '/tools/software',
        },
        {
          text: '业务',
          link: '/tools/business',
        },
      ],
      '/front-end': [
        {
          text: 'Html',
          link: '/front-end/Html/',
          items: [
            { text: 'html', link: '/front-end/Html/' },
          ],
        },
        {
          text: 'Css',
          link: '/front-end/Css/',
          items: [
            { text: 'base', link: '/front-end/Css/base/' },
            { text: 'flex', link: '/front-end/Css/flex/' },
            { text: 'sass', link: '/front-end/Css/sass/' },
          ],
        },
        {
          text: 'JavaScript',
          link: '/front-end/JavaScript/',
          items: [
            { text: 'js', link: '/front-end/JavaScript/Js/' },
            { text: 'dom', link: '/front-end/JavaScript/Dom/' },
            { text: 'bom', link: '/front-end/JavaScript/Bom/' },
            { text: 'webapi', link: '/front-end/JavaScript/WebApi/' },
            { text: 'brower', link: '/front-end/JavaScript/Browser/' },
            // { text: 'es', link: '/front-end/JavaScript/ES6/' },
          ],
        },
        {
          text: 'TypeScript',
          link: '/front-end/TypeScript/',
          items: [
            { text: 'ts', link: '/front-end/TypeScript/' }],
        },
        {
          text: 'Vue',
          link: '/front-end/Vue/',
          items: [
            { text: 'vue3', link: '/front-end/Vue/vue3/' },
            { text: 'vue2', link: '/front-end/Vue/vue2/' },
            { text: 'element-ui', link: '/front-end/Vue/element-ui/' },
          ],
        },
        {
          text: 'React',
          link: '/front-end/React/',
          items: [
            { text: 'react', link: '/front-end/React/' },
            { text: 'preact', link: '/front-end/React/Preact/' }
          ],
        },
        {
          text: 'Plugin',
          link: '/front-end/Plugin/',
          items: [
            { text: 'Lib', link: '/front-end/Plugin/Lib/' },
            { text: 'vue plugin', link: '/front-end/Plugin/Vue/' },
            { text: 'react plugin', link: '/front-end/Plugin/React/' },
            { text: 'Vite plugin', link: '/front-end/Plugin/Vite/' },
            { text: 'Ts plugin', link: '/front-end/Plugin/Ts/' },
            { text: 'git', link: '/front-end/Plugin/Git/' },
          ],
        },
        {
          text: '工程化',
          link: '/front-end/Engineering/',
          items: [
            {
              text: '构建工具',
              link: '/front-end/Engineering/build-tools/',
              items: [
                { text: 'vite', link: '/front-end/Engineering/build-tools/vite/' },
                { text: 'vite app', link: '/front-end/Engineering/build-tools/vite/app.md' },
                { text: 'esbuild', link: '/front-end/Engineering/build-tools/esbuild/' },
              ],
            },
            {
              text: '包管理',
              link: '/front-end/Engineering/package-manage/',
              items: [
                { text: 'npm', link: '/front-end/Engineering/package-manage/npm/' },
                { text: 'pnpm', link: '/front-end/Engineering/package-manage/pnpm/' }
              ],
            },
            {
              text: 'node管理',
              link: '/front-end/Engineering/node-manage/',
            },
            {
              text: '代码规范',
              link: '/front-end/Engineering/code-standard/',
              items: [
                { text: 'eslint', link: '/front-end/Engineering/code-standard/eslint/' },
              ],
            },
            {
              text: 'plugin',
              link: '/front-end/Engineering/plugin/',
              items: [
                { text: 'vscode插件', link: '/front-end/Engineering/plugin/vscode/' },
                { text: '浏览器插件', link: '/front-end/Engineering/plugin/brower/' },
                { text: 'markdown', link: '/front-end/Engineering/plugin/markdown/' },
              ],
            },
            {
              text: '版本管理',
              link: '/front-end/Engineering/version-manage/',
              items: [
                { text: 'git', link: '/front-end/Engineering/version-manage/git/' },
                { text: 'github', link: '/front-end/Engineering/version-manage/github/' },
                // { text: 'svn', link: '/front-end/Engineering/version-manage/svn' },
              ],
            },
            {
              text: '微前端',
              link: '/front-end/Engineering/micro-frontend/',
            },
          ],
        },
        {
          text: '其他端',
          link: '/front-end/OtherEnd/',
          items: [
            { text: '小程序', link: '/front-end/OtherEnd/小程序/' },
            { text: 'Electron', link: '/front-end/OtherEnd/Electron/' },
            { text: '终端', link: '/front-end/OtherEnd/terminal/' },

          ],
        },
        {
          text: 'Http',
          link: '/front-end/Http/',
          items: [
            { text: 'ajax', link: '/front-end/Http/Ajax/' },
            { text: '抓包', link: '/front-end/Http/PacketCapture/' },
          ],
        },
        {
          text: '设计模式',
          link: '/front-end/DesignPatterns/',
        },
      ],
      '/back-end': [
        {
          text: 'Lang',
          link: '/back-end/Lang/',
          items: [
            {
              text: 'NodeJs',
              link: '/back-end/Lang/NodeJs/',
              items: [
                { text: 'Base', link: '/back-end/Lang/NodeJs/Base/' },
                { text: 'Book', items: [
                  { text: '深入浅出nodejs', link: '/back-end/Lang/NodeJs/Book/note/' },
                ]},
                { text: '脚本', link: '/back-end/Lang/NodeJs/Script/' },
                { text: 'Module', items:
                  [{ text: 'crypto', link: '/back-end/Lang/NodeJs/Module/Crypto/' },]
                 },
              ]
            },
          ],
        },
      ],
      '/ops': [
        {
          text: 'Command',
          link: '/ops/Command/',
          items: [],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/kkkkh' }],
  },
  markdown: {
  // Markdown 配置选项 參考：https://github.com/vuejs/vitepress/blob/main/src/node/markdown/markdown.ts
  // lineNumbers: true,  // 如果希望代码块显示行号
    config: (md) => {
      // console.log( md.renderer.rules)
      // 自定义 Markdown-It 插件
      // md.use(require('markdown-it-emoji'))  // 示例：添加 emoji 支持
    }
  },
})
