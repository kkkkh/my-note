import { getColumnFilterValueType } from '../base-table/utils'

const sortNumber = (dataA, dataB, order) => {
  // 数字比大小
  return order === 'asc' ? dataA - dataB : dataB - dataA
}
const sortString = (dataA, dataB, order) => {
  // 字符串比大小
  return order === 'asc' ? dataA.localeCompare(dataB) : dataB.localeCompare(dataA)
}

const sortDateTime = (dataA, dataB, order) => {
  // 日期比较大小
  return order === 'asc' ? new Date(dataA) - new Date(dataB) : new Date(dataB) - new Date(dataA)
}

export const sortValue = (a, b, val) => {
  const dataA = a[val.field]
  const dataB = b[val.field]
  const order = val.order
  const valueType = getColumnFilterValueType(val.column)

  switch (valueType) {
    case 'string': {
      return sortString(String(dataA), String(dataB), order)
    }
    case 'number': {
      return sortNumber(dataA, dataB, order)
    }
    case 'date':
    case 'time':
    case 'datetime': {
      return sortDateTime(dataA, dataB, order)
    }
    default: {
      return 0
    }
  }
}
