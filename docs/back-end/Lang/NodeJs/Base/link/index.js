// const fs = require('fs').promises;
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function createHardLinkFile() {
  // 关键点：硬链接本质是一个名字，其实不受路径的影响
  // await fs.link('./test/test.txt', './test2/hardlink.txt'); // 创建硬链接
  const targetPath = path.resolve(__dirname, 'test', 'test.txt')
  const hardlinkPath = path.resolve(__dirname, 'test1', 'hardlink.txt')
  await fs.mkdir(path.dirname(hardlinkPath), { recursive: true })
  await fs.link(targetPath, hardlinkPath)
  console.log('创建完成')
}

createHardLinkFile().catch(console.error)

async function createSoftLinkDir() {
  const targetPath = path.resolve(__dirname, 'test')
  const symlinkPath = path.resolve(__dirname, 'test3softlink')
  let relativeTarget = path.relative(path.dirname(symlinkPath), targetPath)
  console.log('soft link target relative path:', relativeTarget)
  await fs.symlink(relativeTarget, symlinkPath, 'dir')
  console.log('创建完成')
}

createSoftLinkDir().catch(console.error)

async function createSoftLinkFile() {
  const targetPath = path.resolve(__dirname, 'test', 'test.txt')
  const symlinkPath = path.resolve(__dirname, 'test2', 'softlink.txt')
  // 关键点：targetPath 是相当于 symlinkPath的
  let relativeTarget = path.relative(path.dirname(symlinkPath), targetPath)
  relativeTarget = relativeTarget.split(path.sep).join('/')
  console.log('soft link target relative path:', relativeTarget)
  await fs.mkdir(path.dirname(symlinkPath), { recursive: true })
  await fs.symlink(relativeTarget, symlinkPath, 'file')
  // await fs.symlink('./test/test.txt', './test2/test.txt', 'file') // 创建的软连接打开异常
  console.log('创建完成')
}

createSoftLinkFile().catch(console.error)


