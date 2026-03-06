import { defineConfig } from 'vitepress'
import {fileURLToPath} from 'node:url'
import { withMermaid } from "vitepress-plugin-mermaid";

// import htmlString from './vite-plugin-html-string.js';

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  title: 'Odyssey Technology',
  description: 'A long and adventurous journey, an exploration of the unknown world and a discovery of self, full of challenges and hardships, but never giving up the belief of returning.',
  // description: 'A long and adventurous journey, an exploration of the unknown world and a discovery of self, full of challenges and hardships, but never giving up the belief of returning.',
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
    ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css' }],
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
      { text: '文章', link: '/article/' },
      { 
        text: '前端', 
        items: [
          { text: '基础语言' , link: '/front-end/Foundation',},
          { text: '框架' , link: '/front-end/Frame',},
          { text: '运行时' , link: '/front-end/Runtime',},
          { text: '库' , link: '/front-end/Lib',},
          { text: '工程化' , link: '/front-end/Engineering',},
          { text: '可视化' , link: '/front-end/Visual',},
          { text: '其他端' , link: '/front-end/OtherEnd',},
          { text: 'interview', link: '/interview/font-end/'},
          { text: 'playgroud', link: 'https://kkkkh.github.io/play/' },

        ]
      },
      { text: '技术',
        items: [
          { text: '计算机', link: '/computer-science' },
          { text: '后端', link: '/back-end' },
          { text: '运维', link: '/ops' },
          { text: 'web3', link: '/web3' },
          { text: 'AI', link: '/ai' },
          { text: 'HD', link: '/hd'},
        ]
      },
      { text: '文档', link: '/tools/' },
    ],
    sidebar: {
      'tools': [
        {
          text: '技术',
          link: '/tools/Tech',
          items: [
            { text: 'blog', link: '/tools/Tech/blog' },
            { text: '计算机', link: '/tools/Tech/computer-science' },
            { text: 'UI', link: '/tools/Tech/ui' },
            { text: '前端', link: '/tools/Tech/front-end' },
            { text: '后端', link: '/tools/Tech/back-end' },
            { text: 'Ops', link: '/tools/Tech/ops' },
            { text: 'AI', link: '/tools/Tech/ai' },
            { text: '其他工具', link: '/tools/Tech/other' },
          ],
        },
        {
          text: '其他',
          link: '/tools/Other',
          items: [
            { text: 'English', link: '/tools/Other/English/' },
            { text: 'book', link: '/tools/Other/book' },
            { text: 'community', link: '/tools/Other/community' },
            { text: 'business', link: '/tools/Other/business' },
          ],
        },
      ],
      'front-end/Foundation': [
        {
          text: 'Html',
          link: '/front-end/Foundation/Html/',
          items: [
            { text: 'html', link: '/front-end/Foundation/Html/html/' },
            { text: 'xml', link: '/front-end/Foundation/Html/xml/' },
          ],
        },
        {
          text: 'Css',
          link: '/front-end/Foundation/Css/',
          items: [
            {
              text: 'base',
              items: [
                {
                  text: 'layout',
                  link: '/front-end/Foundation/Css/base/layout/',
                },
                {
                  text: 'attr',
                  link: '/front-end/Foundation/Css/base/attr/',
                },
                { text: 'flex', link: '/front-end/Foundation/Css/base/flex/' },
                { text: 'grid', link: '/front-end/Foundation/Css/base/grid/' },
              ]
            },
            {
              text: '预处理',
              items:[
                { text: 'sass', link: '/front-end/Foundation/Css/preprocessor/sass/' },
              ]
            },
            {
              text: 'css 工程化',
              link: '/front-end/Foundation/Css/engineering/',
              items: [
                { text: 'css-modules', link: '/front-end/Foundation/Css/engineering/css-modules/' },
                { text: 'styled-components', link: '/front-end/Foundation/Css/engineering/styled-components/' },
                { text: 'tailwindcss', link: '/front-end/Foundation/Css/engineering/tailwindcss/' },
              ]
            }
          ],
        },
        {
          text: 'JavaScript',
          link: '/front-end/Foundation/front-end/JavaScript/',
          items: [
            { text: 'js', link: '/front-end/Foundation/front-end/JavaScript/Js/' },
            { text: 'dom', link: '/front-end/Foundation/front-end/JavaScript/Dom/' },
            { text: 'bom', link: '/front-end/Foundation/front-end/JavaScript/Bom/' },
            { text: 'webapi', link: '/front-end/Foundation/front-end/JavaScript/WebApi/' },
            { text: 'brower', link: '/front-end/Foundation/front-end/JavaScript/Browser/' },
          ],
        },
        {
          text: 'TypeScript',
          link: '/front-end/Foundation/TypeScript/',
          items: [
            { text: 'study', link: '/front-end/Foundation/TypeScript/' },
          ],
        },
        {
          text: '算法',
          link: '/front-end/Foundation/Algorithm/',
        },
      ],
      'front-end/Frame': [
        {
          text: '设计模式',
          link: '/front-end/Frame/DesignPatterns/',
        },
        {
          text: 'Vue',
          link: '/front-end/Frame/Vue/',
          items: [
            { text: 'vue3', link: '/front-end/Frame/Vue/vue3/' },
            { text: 'vue2', link: '/front-end/Frame/Vue/vue2/' },
            { text: 'vue-router', link: '/front-end/Frame/Vue/vue-router/' },
            { text: 'element-ui', link: '/front-end/Frame/Vue/element-ui/' },
          ],
        },
        {
          text: 'React',
          link: '/front-end/Frame/React/',
          items: [
            {
              text: 'react',
              items:[
                {
                  text: 'react base',link: '/front-end/Frame/React/react/',
                },
                {
                  text: 'react app',link: '/front-end/Frame/React/react/app.md',
                },
              ]
            },
            { text: 'react-router', link: '/front-end/Frame/React/react-router/' },
            { text: 'preact', link: '/front-end/Frame/React/preact/' },
            { text: 'nextjs', link: '/front-end/Frame/React/nextjs/' },
          ],
        },
        ],
        'front-end/Lib':[
            { text: 'js', link: '/front-end/Lib/Base/' },
            { text: 'vue', link: '/front-end/Lib/Vue/' },
            { text: 'react', link: '/front-end/Lib/React/' },
            { text: 'Vite', link: '/front-end/Lib/Vite/' },
            { text: 'ts', link: '/front-end/Lib/Ts/' },
            { text: 'git', link: '/front-end/Lib/Git/' },
        ],
        'front-end/Engineering':[
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
                {
                  text: 'vscode插件', link: '/front-end/Engineering/plugin/vscode/'
                },
                {
                  text: '浏览器插件', link: '/front-end/Engineering/plugin/brower/',
                  items:[
                    {text: 'plasmo', link: '/front-end/Engineering/plugin/brower/plasmo/',}
                  ]
                },
              ],
            },
            {
              text:'ssg',
              link: '/front-end/Engineering/ssg/',
              items: [
                { text: 'markdown', link: '/front-end/Engineering/ssg/markdown/' },
                { text: 'vitepress', link: '/front-end/Engineering/ssg/vitepress/' },
                { text: 'histoire', link: '/front-end/Engineering/ssg/histoire/' },
              ],
            },
            {
              text: '微前端',
              link: '/front-end/Engineering/micro-frontend/',
            },
          ],
        'front-end/Visual': [
            { text: '动画',
              link: '/front-end/Visual/animation/',
              items: [
                { text: 'flip', link: '/front-end/Visual/animation/flip/' },
              ],
             },
             {
              text: '框架',
              link: '/front-end/Visual/Frame/',
              items: [
                { text: 'echarts', link: '/front-end/Visual/Frame/echarts/' },
              ],
             },
          ],
        'front-end/Runtime':[
            {
              text: 'Browser',
              link: '/front-end/Runtime/Browser/'
            },
            {
              text: 'NodeJs',
              link: '/front-end/Runtime/NodeJs/',
              items: [
                { text: 'Base', link: '/front-end/Runtime/NodeJs/Base/' },
                { text: '《深入浅出nodejs》', link: '/front-end/Runtime/NodeJs/Book/' },
                { text: 'Fastify', link: '/front-end/Runtime/NodeJs/Fastify/' },
                { text: 'Module', items:
                  [
                    { text: '脚本', link: '/front-end/Runtime/NodeJs/Module/Script/' },
                    { text: 'crypto', link: '/front-end/Runtime/NodeJs/Module/Crypto/' },
                    { text: 'c++ addons', link: '/front-end/Runtime/NodeJs/Module/c++/' },
                  ]
                 },
              ]
            },
            {
              text: 'Http',
              link: '/front-end/Runtime/Http/',
              items: [
                { text: 'ajax', link: '/front-end/Runtime/Http/Ajax/' },
                { text: '状态码', link: '/front-end/Runtime/Http/StatusCode/' },
                { text: '缓存', link: '/front-end/Runtime/Http/Cache/' },
                { text: '安全', link: '/front-end/Runtime/Http/Safe/' },
                { text: 'Cdn', link: '/front-end/Runtime/Http/Cdn/' },
                { text: '抓包', link: '/front-end/Runtime/Http/PacketCapture/' },
              ],
            },
          ],
        '/front-end/OtherEnd/':[
          { text: '小程序', link: '/front-end/OtherEnd/小程序/' },
          { text: 'Electron', link: '/front-end/OtherEnd/Electron/' },
          { text: 'terminal', link: '/front-end/OtherEnd/terminal/' },
        ],
      'back-end': [
        {
          text: 'Python',
          link: '/back-end/Python/',
          items: [
            { text: '基础学习',
              items:[
                { text: '快速入门', link: '/back-end/Python/QuickStart/',},
                // { text: 'AI问答', link: '/back-end/Python/aiAsking/' },
              ]
            },
            { text: '应用',
              items:[
                { text: 'FastApi', link: '/back-end/Python/App/fastApi/' },
                { text: 'Alembic', link: '/back-end/Python/App/alembic',},
                { text: '代码示例', link: '/back-end/Python/App/code/' },
              ],
            },
            { text: 'Lib',
              items: [
                { text: '库列表', link: '/back-end/Python/Lib/List/index.md' },
                { text: '库实践', link: '/back-end/Python/Lib/Use/index.md' },
              ],
            },
          ],
        },
        {
          text: 'DB',
          link: '/back-end/DB/',
          items: [
            { text: 'SQL', link: '/back-end/DB/SQL/' },
            { text: 'SQLite', link: '/back-end/DB/SQLite/' },
            { text: 'MongoDB', link: '/back-end/DB/MongoDB/' },
            { text: 'DB tools', link: '/back-end/DB/Tools/' },
          ],
        },
      ],
      'ops':[
          {
            text: 'Linux',
            link: '/ops/Linux/',
            items: [
              {
                text: 'Command',
                link: '/ops/Linux/Command/',
                items: [],
              },
              {
                text: 'SSH',
                link: '/ops/Linux/SSH/',
                items: [],
              },
            ],
          },
          {
            text:'SSL/TLS',
            link: '/ops/SSL-TLS/',
          },
          {
            text: "Nginx",
            link: '/ops/Nginx/',
          },
          {
            text: "Docker",
            items: [
              {
                text: 'Base', link: '/ops/Docker/Base/',
              },
              {
                text: 'docker compose', link: '/ops/Docker/Compose/',
              },
              {
                text: 'App', link: '/ops/Docker/App/',
              }
            ]
          },
          {
            text: 'CI-CD',
            link: '/ops/CI-CD/',
            items: [
              {
                text: 'Drone', link: '/ops/CI-CD/Drone/',
                // items:[
                //   {text: 'Drone Base', link: '/ops/CI-CD/Drone/Base'},
                //   {text: 'Drone Use', link: '/ops/CI-CD/Drone/Use'},
                // ]
              },
              { text: 'Jenkins', link: '/ops/CI-CD/Jenkins/' },
              { text: 'github', link: '/ops/CI-CD/github/' },
            ],
          },
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
        },
        {
          text: '版本管理',
          link: '/computer-science/version-manage/',
          items: [
            { text: 'git', link: '/computer-science/version-manage/git/' },
            { text: 'svn', link: '/computer-science/version-manage/svn' },
          ],
        },
      ],
      'web3': [
        {
          text: 'ton',
          link: '/web3/ton/',
        },
      ],
      'ai': [
        {
          text: 'cursor',
          link: '/ai/cursor/',
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
