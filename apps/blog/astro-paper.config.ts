import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://blog.zhtk.top/",
    title: "Virtual Roaming",
    // title: "Virtual Roaming",
    description:
      "Imperfect, but always thinking, reflecting, and creating. \n Technical notes and content worth keeping.",
    author: "kkkkh",
    profile: "https://github.com/kkkkh",
    ogImage: "default-og.jpg",
    lang: "zh-cn",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 10,
    perIndex: 6,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/kkkkh/my-note/edit/main/docs/article/tech/",
    },
    search: "pagefind",
  },
  socials: [{ name: "github", url: "https://github.com/kkkkh" }],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
