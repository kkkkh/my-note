import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Note",
  description: "A Blog site",
  // lang: 'zh',
  base:'/my-note/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '前端', link: '/front-end' },
      { text: '后端', link: '/back-end' },
      { text: 'Linux', link: '/ops' },
      { text: '文档', link: '/tools' },
      { text: 'web3', link: '/web3' },
      // { text: '读书', link: '/books' },
    ],
    sidebar: {
      '/web3':[
        {
          text: 'Ton',
          link: '/web3/Ton',
          items: [
            { text: 'TownSquare', link: '/web3/Ton/TownSquare' },
          ]
        },],
      '/front-end':
        [
          {
            text: 'Css',
            link: '/front-end/Css',
            items: [
              { text: 'flex', link: '/front-end/Css/flex' },
            ]
          },{
            text: 'Js',
            link: '/front-end/Js',
            items: [
              { text: 'bom', link: '/front-end/Js/Bom' },
            ]
          },{
            text: 'Vue',
            link: '/front-end/Engineering',
            items: [
              { text: 'vue2', link: '/front-end/Vue/vue2' },
              { text: 'element-ui', link: '/front-end/Vue/element-ui' },
              { text: 'vue-plugin', link: '/front-end/Vue/vue-plugin' },
            ]
          },
          {
            text: '工程化',
            link: '/front-end/Engineering',
            items: [
              { text: 'vite', link: '/front-end/Engineering/vite' },
              { text: 'git', link: '/front-end/Engineering/git' },
            ]
          }
        ],
      '/ops':[
        {
          text: 'Command',
          link: '/ops/Command',
          items: [
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kkkkh' }
    ]
  }
})
