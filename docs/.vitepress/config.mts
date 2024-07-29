import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Note",
  description: "A Blog site",
  // lang: 'zh',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: '前端', link: '/front-end' },
      { text: '后端', link: '/back-end' }
    ],
    sidebar: {
      '/front-end':
        [
          {
            text: '工程化',
            link: '/front-end/engineering',
            items: [
              { text: 'vite', link: '/front-end/engineering/vite' },
            ]
          }
        ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kkkkh' }
    ]
  }
})
