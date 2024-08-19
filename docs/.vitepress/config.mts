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
    ],
    sidebar: {
      '/front-end':
        [
          {
            text: 'Css',
            link: '/front-end/Css',
            items: [
              { text: 'flex', link: '/front-end/Css/flex' },
            ]
          },
          {
            text: '工程化',
            link: '/front-end/Engineering',
            items: [
              { text: 'vite', link: '/front-end/Engineering/vite' },
            ]
          }
        ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kkkkh' }
    ]
  }
})
