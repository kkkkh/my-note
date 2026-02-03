import { createContentLoader } from 'vitepress'

interface Post {
  title: string
  url: string
  date: {
    time: number
    string: string
  }
  excerpt: string | undefined
}

declare const data: Post[]
export { data }
export default (url:string) => createContentLoader(url, {
  excerpt: true,
  transform(raw): Post[] {
    // console.log(raw)
    const dateFmt = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    return raw
      .filter(item => item.frontmatter.title && !item.frontmatter.filter)
      .map(({ url, frontmatter, excerpt }) => ({
        title: frontmatter.title,
        url,
        excerpt,
        date: formatDate(frontmatter.date),
        dateTime: dateFmt.format(new Date(frontmatter.date)),
        tags: frontmatter.tags || []
      }))
      .sort((a, b) =>  b.date.time - a.date.time)
  }
})

function formatDate(raw: string): Post['date'] {
  const date = new Date(raw)
  date.setUTCHours(12)
  return {
    time: +date,
    string: date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }
}
