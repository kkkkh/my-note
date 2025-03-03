// import fs from 'node:fs'
export default {
  // 相对路径
  // watch: ['../../../../../front-end/DesignPatterns/md/*.md'],
  // 根目录路径
  // watch: ['docs/front-end/javaScript/ES6/md/*.md'],
  // watch: ['docs/front-end/DesignPatterns/md/*.md'],
  watch: ['docs/back-end/Lang/NodeJs/Book/note/**/*.md'],
  load(watchedFiles) {
    // console.log(watchedFiles)
    const files = watchedFiles.sort((pre,next)=>{
      // console.log(pre.match(/(\d+)[、-]/))
      // console.log(next.match(/(\d+)[、-]/))
      const preNum = pre.match(/(\d+)[、-]?/)
      const nextNum = next.match(/(\d+)[、-]?/)
      // console.log("preNum",preNum)
      // console.log("nextNum",nextNum)
      if(preNum === null || nextNum===null)return 0
      return preNum[1] - nextNum[1]
    }).map(item => {
      // const path = item.match(/\/([^\/]+)$/)[1]
      // return  `<!--@include: ./md/${path}-->`.replaceAll(/\\/g,'/')
      return  `<!--@include: ${item}-->`.replaceAll(/\\/g,'/')
    })
    // fs.writeFileSync('./index.md',files.join("\n"))
    return files
  }
}
