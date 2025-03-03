export default {
  // 相对路径
  // watch: ['../../../../../front-end/DesignPatterns/md/*.md'],
  // 根目录路径
  // watch: ['docs/front-end/javaScript/ES6/md/*.md'],
  watch: ['docs/front-end/DesignPatterns/md/*.md'],
  // watch: ['docs/back-end/Lang/NodeJs/Book/note/**/*.md'],
  load(watchedFiles) {
    const files = watchedFiles.sort((pre,next)=>{
      const preNum = pre.match(/(\d+)[、-]?/)
      const nextNum = next.match(/(\d+)[、-]?/)
      if(preNum === null || nextNum===null)return 0
      return preNum[1] - nextNum[1]
    })
    // .map(item => {
    // // 相对路径 => ./md/${文件名}
    //   const path = item.match(/\/([^\/]+)$/)[1]
    //   return  `<!--@include: ./md/${path}-->`.replaceAll(/\\/g,'/')
    // })
    .map(item => {
    // 根路径 => ./md/${文件名}
      const path = item.replace("docs","@")
      return  `<!--@include: ${path}-->`.replaceAll(/\\/g,'/')
    })
    return files
  },
}
