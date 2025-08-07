import fs from 'fs'
// const fs = require('fs')
/**
 * 此脚本用于普通表格改造为漏斗表格
 * 将查询条件 转换为 漏斗的查询条件
 */
try {
  const data = await fs.promises.readFile(
    'D:/WorkSpace/****/index.vue',
    'utf8'
  )
  const reg = /<([\w-]+)\n?\s*[\w"'=]*\n?\s*v-model=["']\w*[Ff]orm\.(\w+)/g
  const types = [
    { condition: 'include', value: ['input'], valueType: 'string' },
    { condition: 'eq', value: ['select', 'TrDict'], valueType: 'string' },
    { condition: 'between', value: ['date'], valueType: 'datetime' },
  ]
  // console.log([...data.matchAll(reg)].length)
  const filtersArr = [...data.matchAll(reg)].map((item) => {
    const type = item[1]
    console.log(type)
    const filed = item[2]
    console.log(filed)
    const { condition, valueType } = types.find((typeItem) => {
      return typeItem.value.find((valueItem) =>
        type.toLowerCase().includes(valueItem.toLowerCase())
      )
    }) ?? {
      condition: 'noKey',
      valueType: 'noValue',
    }
    return [filed, { condition, valueType }]
  })
  const filters = Object.fromEntries(filtersArr)
  console.log({ filters })
} catch (err) {
  console.error('Error:', err)
}
