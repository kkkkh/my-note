import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'My Note',
  description: 'A Blog site',
  // lang: 'zh',
  base: '/my-note/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '前端', link: '/front-end' },
      { text: '后端', link: '/back-end' },
      { text: 'Linux', link: '/ops' },
      { text: '文档', link: '/tools' },
      { text: '读书', link: '/books' },
    ],
    sidebar: {
      '/front-end': [
        {
          text: 'Css',
          link: '/front-end/Css',
          items: [{ text: 'flex', link: '/front-end/Css/flex' }],
        },
        {
          text: 'JavaScript',
          link: '/front-end/JavaScript',
          items: [
            { text: 'js', link: '/front-end/JavaScript/Js' },
            { text: 'dom', link: '/front-end/JavaScript/Dom' },
            { text: 'bom', link: '/front-end/JavaScript/Bom' },
          ],
        },
        {
          text: 'TypeScript',
          link: '/front-end/TypeScript',
          items: [
            { text: 'ts', link: '/front-end/TypeScript/index' }],
        },
        {
          text: 'Vue',
          link: '/front-end/Vue',
          items: [
            { text: 'vue3', link: '/front-end/Vue/vue3' },
            { text: 'vue2', link: '/front-end/Vue/vue2' },
            { text: 'element-ui', link: '/front-end/Vue/element-ui' },
          ],
        },
        {
          text: 'React',
          link: '/front-end/React',
          items: [{ text: 'react', link: '/front-end/React/index' }],
        },
        {
          text: 'Plugin',
          link: '/front-end/Plugin',
          items: [
            { text: 'Lib', link: '/front-end/Plugin/Lib' },
            { text: 'vue plugin', link: '/front-end/Plugin/Vue' },
            { text: 'react plugin', link: '/front-end/Plugin/React' },
          ],
        },
        {
          text: '工程化',
          link: '/front-end/Engineering',
          items: [
            {
              text: '构建工具',
              link: '/front-end/Engineering/build-tools',
              items: [
                { text: 'vite', link: '/front-end/Engineering/build-tools/vite' },
                { text: 'esbuild', link: '/front-end/Engineering/build-tools/esbuild' },
              ],
            },
            {
              text: '包管理',
              link: '/front-end/Engineering/package-manage',
              items: [{ text: 'npm', link: '/front-end/Engineering/package-manage/npm' }],
            },
            {
              text: 'node管理',
              link: '/front-end/Engineering/node-manage',
            },
            {
              text: 'plugin',
              link: '/front-end/Engineering/plugin',
              items: [
                { text: 'vscode插件', link: '/front-end/Engineering/plugin/vscode' },
                { text: '浏览器插件', link: '/front-end/Engineering/plugin/brower' },
                { text: 'markdown', link: '/front-end/Engineering/plugin/markdown' },
              ],
            },
            {
              text: '版本管理',
              link: '/front-end/Engineering/version-manage',
              items: [
                { text: 'git', link: '/front-end/Engineering/version-manage/git' },
                { text: 'github', link: '/front-end/Engineering/version-manage/github' },
                { text: 'svn', link: '/front-end/Engineering/version-manage/svn' },
              ],
            },
          ],
        },
        {
          text: '其他端',
          link: '/front-end/OtherEnd',
          items: [
            { text: '小程序', link: '/front-end/OtherEnd/小程序' },
            { text: 'Electron', link: '/front-end/OtherEnd/Electron' }, 
          ],
        },
      ],
      '/ops': [
        {
          text: 'Command',
          link: '/ops/Command',
          items: [],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/kkkkh' }],
  },
})
