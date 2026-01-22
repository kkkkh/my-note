import { resolve } from 'path';
import { loadConfigFromFile } from 'vite';
import { promises as fs } from 'fs';
import markdownit from 'markdown-it'
import { createContentLoader } from 'vitepress'

const md = markdownit()
const getIVInfo = (data, node)=>{
  const regexp = /([^\s].+\s*)\&I/g
  const res = [...data.matchAll(regexp)];
  return res.map((item,index) => {
    const title = item[1]
    const sTitle = title?.replaceAll(/[#\s]/g,"")?.replaceAll(/\//g ,"-")
    return md.render(`- ${index + 1} ${sTitle} [1](/my-note${node.link}#${sTitle})`)
  })
}

async function processTreeNode(node,index = 2) {
  if (node.link) {
    const path = /.md$/.test(node.link) ? `docs/${node.link}` : `docs/${node.link}/index.md`
      const filePath = resolve(process.cwd(), path); // 拼接文件完整路径
      // const filePath = path.join("", node.link); // 拼接文件完整路径
      try {
          const fileContent = await fs.readFile(filePath, 'utf-8'); // 异步读取文件内容
          // 在这里可以对 fileContent 进行处理，提取需要的信息
          const iv = getIVInfo(fileContent, node)
          node.iv = iv
      } catch (error) {
          console.error(`Error reading file ${filePath}: ${error.message}`);
          node.iv = []
      }
  }
  // 递归处理子节点
  if (node.items && node.items.length > 0) {
      node.items = await Promise.all(node.items.map(item => processTreeNode(item,index+1)));
  }
  const text = ` ${node.text}`
  const title = text.padStart(text.length + index, "#")
  // node.text =  title
  node.text =  md.render(title)

  return node;
}

async function processTreeData(treeData) {
  return await Promise.all(treeData.map((node) => processTreeNode(node)));
}

async function  articleTransformations(watchedFiles) {
  const articleIv = await Promise.all(watchedFiles.map(async(url) => {
    const fileContent = await fs.readFile(url, 'utf-8');
    const reg = /\/(name)\/index\.md$/
    const text = url.replace(reg, "$1")
    const link = url.replaceAll(/(docs|index\.md)/g, "") // 注意将index.md也去掉
    return getIVInfo(fileContent, {text, link})
  }));
  const articleNode = {
    "text": "<h2>应用</h2>\n",
    iv:articleIv
  }
  return articleNode;
}


export default {
  watch: ['../../article/tech/index/**/*.md'],
  async load(watchedFiles) {
    const configFilePath = resolve(process.cwd(), 'docs/.vitepress/config.mts');
    const loadedConfig = await loadConfigFromFile(
      { command: 'serve', mode: 'development' },
      configFilePath
    );
    const dir = loadedConfig?.config.themeConfig.sidebar["front-end"]
    // console.log(JSON.stringify(dir, null, 2))
    const updatedTreeData = await processTreeData(dir);
    // console.log(JSON.stringify(updatedTreeData, null, 2));
   const articleNode = await articleTransformations(watchedFiles)
    return [...updatedTreeData, articleNode]
  }
}

