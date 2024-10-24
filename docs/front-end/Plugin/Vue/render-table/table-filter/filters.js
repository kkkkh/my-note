import { isEmpty } from '@transsion/utils'

import {
  getDefaultValueFormat,
  isDateAfter,
  isDateAfterOrEqual,
  isDateBefore,
  isDateBeforeOrEqual,
  isDateBetween,
  isDateEquel,
  isNumberBetween,
  isNumberEquel,
  isNumberGreaterThan,
  isNumberGreaterThanOrEqual,
  isNumberLessThan,
  isNumberLessThanOrEqual,
} from './utils'

/**
 * 过滤字符串类型的值
 *
 * @param n {FilterValue | undefined} - 字符串
 * @param filterData {FilterData} - 过滤数据
 *
 * @returns {boolean}
 */
export function filterStringValue(n, filterData) {
  switch (filterData.condition) {
    case 'eq': {
      // return (!isEmpty(n) && filterData.values?.some((item) => String(item) === String(n))) ?? false

      return (!isEmpty(n) && String(filterData.value) === String(n)) ?? false
    }
    case 'include': {
      return !isEmpty(n) && String(n).includes(String(filterData.value))
    }
    case 'isEmpty': {
      return isEmpty(n)
    }
    case 'isNotEmpty': {
      return !isEmpty(n)
    }
    case 'in': {
      return !isEmpty(n) && filterData.values.includes(String(n))
    }
    default:
  }

  return false
}

/**
 * 过滤数字类型的值
 *
 * @param n {FilterValue | undefined} - 数字
 * @param filterData {FilterData} - 过滤数据
 *
 * @returns {boolean}
 */
export function filterNumberValue(n, filterData) {
  switch (filterData.condition) {
    case 'eq': {
      return filterData.values?.some((item) => isNumberEquel(n, item)) ?? false
    }
    case 'lt': {
      return isNumberLessThan(n, filterData.value)
    }
    case 'le': {
      return isNumberLessThanOrEqual(n, filterData.value)
    }
    case 'gt': {
      return isNumberGreaterThan(filterData.value, n)
    }
    case 'ge': {
      return isNumberGreaterThanOrEqual(filterData.value, n)
    }
    case 'between': {
      const [start, end] = filterData.values ?? []

      return isNumberBetween(n, start, end, '(]')
    }
    case 'isEmpty': {
      return isEmpty(n)
    }
    case 'isNotEmpty': {
      return !isEmpty(n)
    }
    default:
  }

  return false
}

/**
 * 过滤日期/时间类型的值
 *
 * @param n {FilterValue | undefined} - 日期/时间
 * @param filterData {FilterData} - 过滤数据
 * @param valueType {FilterValueType} - 值类型
 * @returns
 */
export function filterDateValue(n, filterData, valueType = 'date') {
  const valueFormat = getDefaultValueFormat(filterData.valueType ?? valueType)

  switch (filterData.condition) {
    case 'eq': {
      return filterData.values?.some((item) => isDateEquel(n, item, valueFormat)) ?? false
    }
    case 'lt': {
      return isDateBefore(n, filterData.value, valueFormat)
    }
    case 'le': {
      return isDateBeforeOrEqual(n, filterData.value, valueFormat)
    }
    case 'gt': {
      return isDateAfter(n, filterData.value, valueFormat)
    }
    case 'ge': {
      return isDateAfterOrEqual(n, filterData.value, valueFormat)
    }
    case 'between': {
      const [start, end] = filterData.values ?? []

      return isDateBetween(n, start, end, valueFormat, '(]')
    }
    default:
  }

  return false
}

/**
 * 过滤值
 *
 * @param n {FilterValueType | undefined} - 值
 * @param filterData {FilterData} - 过滤数据
 *
 * @returns {boolean}
 */
export function filterValue(n, filterData) {
  switch (filterData.valueType) {
    case 'string': {
      return filterStringValue(n, filterData)
    }
    case 'number': {
      return filterNumberValue(n, filterData)
    }
    case 'date':
    case 'time':
    case 'datetime': {
      return filterDateValue(n, filterData, filterData.valueType)
    }
    default:
  }

  return false
}
