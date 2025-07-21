import { defineConfig } from 'vitepress'
import {fileURLToPath} from 'node:url'
import { withMermaid } from "vitepress-plugin-mermaid";

// import htmlString from './vite-plugin-html-string.js';

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  title: 'Odyssey Technology',
  description: 'A long and adventurous journey, an exploration of the unknown world and a discovery of self, full of challenges and hardships, but never giving up the belief of returning.',
  // lang: 'zh',
  base: '/my-note/',
  srcDir: '.',
  vite: {
    resolve: {
      alias: [
        // 对 <<< @/**/** 代码片段引入没有影响
        { find: /^@\//, replacement: fileURLToPath(new URL('../../docs/', import.meta.url))},
        { find: /^@play\//, replacement: fileURLToPath(new URL('../../docs/submodule/play/packages/', import.meta.url))},
        // { find: '~', replacement: fileURLToPath(new URL('../../docs/submodule/play/packages', import.meta.url).href)},
      ]
    },
    plugins: [
      // htmlString(),
    ],
  },
  head: [
    ['link', { rel: 'stylesheet', href: 'viewerjs/dist/viewer.css' }],
    // ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css' }],
    // ['link', { rel: 'stylesheet', href: 'https://unpkg.com/highlightjs-copy/dist/highlightjs-copy.min.css' }],
    // ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js' }]
  ],
  themeConfig: {
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    outline:{
      level:'deep',
      label: "目录"
    },
    editLink: {
      pattern: 'https://github.com/kkkkh/my-note/blob/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '技术',
        items: [
          { text: '计算机', link: '/computer-science' },
          { text: '前端', link: '/front-end' },
          { text: '后端', link: '/back-end' },
          { text: 'web3', link: '/web3' },
          { text: 'AI', link: '/ai' },
        ]
      },
      { text: '文档', items:[
        { text: 'tool', link: '/tools/blog' },
        { text: 'play', link: 'https://kkkkh.github.io/play/' },
      ] },
      { text: '文章', link: '/article/' },
    ],
    sidebar: {
      'article': [
        {
          text: '技术',
          link: '/article/tech/',
        },
        {
          text: '面试',
          link: '/article/interview/',
          items: [
            { text: '前端', link: '/article/interview/font-end/' },
          ]
        },
        {
          text: '感想',
          link: '/article/thoughts/',
        },
      ],
      'tools': [
        {
          text: 'blog',
          link: '/tools/blog',
        },
        {
          text: 'book',
          link: '/tools/book',
        },
        {
          text: 'ai',
          link: '/tools/ai',
        },
        {
          text: '计算机',
          link: '/tools/computer-science',
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
      'front-end': [
        {
          text: 'Html',
          link: '/front-end/Html/',
          items: [
            { text: 'html', link: '/front-end/Html/html/' },
            { text: 'xml', link: '/front-end/Html/xml/' },
          ],
        },
        {
          text: 'Css',
          link: '/front-end/Css/',
          items: [
            { text: 'base', link: '/front-end/Css/base/' },
            { text: 'flex', link: '/front-end/Css/flex/' },
            { text: 'css-modules', link: '/front-end/Css/css-modules/' },
            { text: 'styled-components', link: '/front-end/Css/styled-components/' },
            { text: 'sass', link: '/front-end/Css/sass/' },
            { text: 'tailwindcss', link: '/front-end/Css/tailwindcss/' },
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
            { text: 'react', link: '/front-end/React/react/' },
            { text: 'react-router', link: '/front-end/React/react-router/' },
            { text: 'preact', link: '/front-end/React/preact/' },
            { text: 'next', link: '/front-end/React/next/' },
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
                { text: 'esbuild', link: '/front-end/Engineering/build-tools/esbuild/' },
                { text: 'rollup', link: '/front-end/Engineering/build-tools/rollup/' },
                { text: 'webpack', link: '/front-end/Engineering/build-tools/webpack/' },
              ],
            },
            {
              text: '包管理',
              link: '/front-end/Engineering/package-manage/',
              items: [
                { text: 'npm', link: '/front-end/Engineering/package-manage/npm/' },
                { text: 'pnpm', link: '/front-end/Engineering/package-manage/pnpm/' },
                { text: 'yarn', link: '/front-end/Engineering/package-manage/yarn/' },
                { text: 'package.json', link: '/front-end/Engineering/package-manage/package.json/' },
              ],
            },
            {
              text: '代码规范',
              link: '/front-end/Engineering/code-standard/',
              items: [
                { text: 'eslint', link: '/front-end/Engineering/code-standard/eslint/' },
                { text: 'prettier', link: '/front-end/Engineering/code-standard/prettier/' },
                { text: 'stylelint', link: '/front-end/Engineering/code-standard/stylelint/' },
                { text: 'typescript-eslint', link: '/front-end/Engineering/code-standard/typescript-eslint/' },
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
                { text: 'svn', link: '/front-end/Engineering/version-manage/svn' },
              ],
            },
            {
              text:'ssg',
              link: '/front-end/Engineering/ssg/',
              items: [
                { text: 'vitepress', link: '/front-end/Engineering/ssg/vitepress/' },
              ],
            },
            {
              text: '微前端',
              link: '/front-end/Engineering/micro-frontend/',
            },
          ],
        },
        {
          text: '可视化',
          link: '/front-end/Visual/',
          items: [
            { text: '动画',
              link: '/front-end/Visual/animation/',
              items: [
                { text: 'flip', link: '/front-end/Visual/animation/flip/' },
              ],
             },
             {
              text: '框架',
              link: '/front-end/Visual/frame/',
              items: [
                { text: 'echarts', link: '/front-end/Visual/frame/echarts/' },
              ],
             },
          ],
        },
        {
          text: '其他端',
          link: '/front-end/OtherEnd/',
          items: [
            { text: '小程序', link: '/front-end/OtherEnd/小程序/' },
            { text: 'Electron', link: '/front-end/OtherEnd/Electron/' },
            { text: 'terminal', link: '/front-end/OtherEnd/terminal/' },
          ],
        },
        {
          text: 'Http',
          link: '/front-end/Http/',
          items: [
            { text: 'ajax', link: '/front-end/Http/Ajax/' },
            { text: '状态码', link: '/front-end/Http/StatusCode/' },
            { text: '缓存', link: '/front-end/Http/Cache/' },
            { text: '安全', link: '/front-end/Http/Safe/' },
            { text: 'Cdn', link: '/front-end/Http/Cdn/' },
            { text: '抓包', link: '/front-end/Http/PacketCapture/' },
          ],
        },
        {
          text: '设计模式',
          link: '/front-end/DesignPatterns/',
        },
        {
          text: '算法',
          link: '/front-end/Algorithm/',
        },
        {
          text: '应用',
          link: '/front-end/Application/',
          items: [
            { text: '常用算法', link: '/front-end/Application/algorithm/'},
            { text: '分片',
              items: [
                { text: '分片上传', link: '/front-end/Application/sharding/upload'  },
                { text: '分片下载', link: '/front-end/Application/sharding/download'  },
              ]
            },
            { text: '竞态', link: '/front-end/Application/race/' },
            { text: '任务队列', link: '/front-end/Application/taskQueue/' },
          ]
        },
      ],
      'back-end': [
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
                  [
                    { text: 'crypto', link: '/back-end/Lang/NodeJs/Module/Crypto/' },
                    { text: 'c++ addons', link: '/back-end/Lang/NodeJs/Module/c++/' },
                  ]
                 },
              ]
            },
          ],
        },{
          text: 'Ops',
          link: '/back-end/Ops/',
          items:[
            {
              text: 'Command',
              link: '/back-end/Ops/Command/',
              items: [],
            },
            {
              text: 'SSH',
              link: '/back-end/Ops/SSH/',
              items: [],
            },
            {
              text: 'CI-CD',
              link: '/back-end/Ops/CI/CD/',
              items: [
                { text: 'github', link: '/back-end/Ops/CI-CD/github/' },
              ],
            },
          ],
        }
      ],
      'computer-science':[
        {
          text: '汇编语言',
          link: '/computer-science/Assembly/',
          items: [],
        },
        {
          text: 'c语言',
          link: '/computer-science/C/',
          items: [],
        },
        {
          text: 'c++',
          link: '/computer-science/C++/',
          items: [],
        },
        {
          text: '操作系统',
          link: '/computer-science/Os/',
          items: [
            {
              text: 'windows',
              link: '/computer-science/Os/windows/',
            },
            {
              text: 'mac',
              link: '/computer-science/Os/mac/',
            }
          ],
        }
      ],
      'web3': [
        {
          text: 'ton',
          link: '/web3/ton/',
        },
      ],
      'ai': [
        {
          text: 'code',
          link: '/ai/code/',
          items: [],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/kkkkh' }],
  },
  markdown: {
  // theme: 'synthwave-84',
  // Markdown 配置选项 參考：https://github.com/vuejs/vitepress/blob/main/src/node/markdown/markdown.ts
  // lineNumbers: true,  // 如果希望代码块显示行号
    toc: { level: [1, 2] },
    config: (md) => {
      // debugger
      // console.log(md)
      // md.use((res)=>{
      //   console.log(res)
      // })
      // console.log( md.renderer.rules)
      // 自定义 Markdown-It 插件
      // md.use(require('markdown-it-emoji'))  // 示例：添加 emoji 支持
    }
  },
}))
