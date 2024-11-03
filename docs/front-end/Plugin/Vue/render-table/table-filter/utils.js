import { isEmpty, isUndefOrNull } from '@transsion/utils'
import Big from 'big.js'
import { formatDate, parseDate, toDate } from 'element-ui/lib/utils/date-util'

import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT, DEFAULT_TIME_FORMAT } from './constants'

/**
 * 获取默认值格式
 *
 * @param valueType {FilterValueType} - 筛选值类型
 *
 * @returns {string}
 */
export function getDefaultValueFormat(valueType = 'string') {
  switch (valueType) {
    case 'date': {
      return DEFAULT_DATE_FORMAT
    }
    case 'time': {
      return DEFAULT_TIME_FORMAT
    }
    case 'datetime': {
      return DEFAULT_DATETIME_FORMAT
    }
    default: {
      return ''
    }
  }
}

/**
 * 获取筛选的默认条件类型
 *
 * @param filterType {FilterValueType} - 筛选内容类型
 *
 * @returns {FilterCondition}
 */
export function getDefaultFilterCondition(filterType = 'string') {
  switch (filterType) {
    case 'date': {
      return 'eq'
    }
    case 'time': {
      return 'eq'
    }
    case 'datetime': {
      return 'eq'
    }
    case 'number': {
      return 'eq'
    }
    default: {
      return 'eq'
    }
  }
}

/**
 * 获取筛选内容的默认值
 *
 * @param filterType {FilterValueType} - 筛选类型
 * @param valueFormat {string} - 值的格式
 * @returns
 */
export function getDefaultFilterValue(filterType, valueFormat) {
  switch (filterType) {
    case 'date': {
      return formatDate(new Date(), valueFormat ?? DEFAULT_DATE_FORMAT)
    }
    case 'time': {
      return formatDate(new Date(), valueFormat ?? DEFAULT_TIME_FORMAT)
    }
    case 'datetime': {
      return formatDate(new Date(), valueFormat ?? DEFAULT_DATETIME_FORMAT)
    }
    case 'number': {
      return 0
    }
    default: {
      return ''
    }
  }
}

/**
 * 获取筛选内容的默认值（数组）
 *
 * @param filterType {FilterValueType} - 筛选类型
 * @param _valueFormat {string} - 值的格式
 * @returns
 */
export function getDefaultFilterValues(filterType) {
  switch (filterType) {
    case 'date':
    case 'datetime': {
      return []
    }
    default: {
      return []
    }
  }
}

/**
 * 校验筛选条件
 *
 * @param condition {FilterCondition} - 筛选条件
 * @param value {FilterValue} - 筛选值
 * @param values {FilterValues} - 筛选值（数组）
 * @returns
 */
export function validateFilterData(filterData) {
  let isValid

  switch (filterData.condition) {
    case 'isEmpty':
    case 'isNotEmpty': {
      isValid = true
      break
    }
    case 'in':
    case 'between': {
      isValid = !!filterData.values?.length && filterData.values.every((v) => !isEmpty(v))
      break
    }
    default: {
      isValid = !isEmpty(filterData.value)
      break
    }
  }

  return isValid
}

/**
 * 判断日期是否相等
 *
 * @param date1 {string} - 日期字符串
 * @param date2 {string} - 日期字符串
 * @param valueFormat {string} - 日期格式
 *
 * @returns {boolean}
 */
export function isDateEquel(date1, date2, valueFormat) {
  if (isUndefOrNull(date1) || isUndefOrNull(date2)) {
    return false
  }
  const d1 = typeof date1 === 'string' ? parseDate(date1, valueFormat) : toDate(date1)
  const d2 = typeof date2 === 'string' ? parseDate(date2, valueFormat) : toDate(date2)

  if (d1 === null || d2 === null) {
    return false
  }

  return d1.getTime() === d2.getTime()
}

/**
 * 判断日期是否在指定日期之前
 *
 * @param date {string} - 日期字符串
 * @param target {string} - 目标日期字符串
 * @param valueFormat {string} - 日期格式
 *
 * @returns {boolean}
 */
export function isDateBefore(date, target, valueFormat) {
  if (isUndefOrNull(date) || isUndefOrNull(target)) {
    return false
  }
  const d1 = typeof date1 === 'string' ? parseDate(date, valueFormat) : toDate(date)
  const d2 = typeof date2 === 'string' ? parseDate(target, valueFormat) : toDate(target)

  if (d1 === null || d2 === null) {
    return false
  }

  return d1.getTime() < d2.getTime()
}

/**
 * 判断日期是否在指定日期之前或相等
 *
 * @param date {string} - 日期字符串
 * @param target {string} - 目标日期字符串
 * @param valueFormat {string} - 日期格式
 *
 * @returns {boolean}
 */
export function isDateBeforeOrEqual(date, target, valueFormat) {
  if (isUndefOrNull(date) || isUndefOrNull(target)) {
    return false
  }

  const d1 = typeof date1 === 'string' ? parseDate(date, valueFormat) : toDate(date)
  const d2 = typeof date2 === 'string' ? parseDate(target, valueFormat) : toDate(target)

  if (d1 === null || d2 === null) {
    return false
  }

  return d1.getTime() <= d2.getTime()
}

/**
 * 判断日期是否在指定日期之后
 *
 * @param date {string} - 日期字符串
 * @param target {string} - 目标日期字符串
 * @param valueFormat {string} - 日期格式
 *
 * @returns {boolean}
 */
export function isDateAfter(date, target, valueFormat) {
  if (isUndefOrNull(date) || isUndefOrNull(target)) {
    return false
  }

  const d1 = typeof date1 === 'string' ? parseDate(date, valueFormat) : toDate(date)
  const d2 = typeof date2 === 'string' ? parseDate(target, valueFormat) : toDate(target)

  if (d1 === null || d2 === null) {
    return false
  }

  return d1.getTime() > d2.getTime()
}

/**
 * 判断日期是否在指定日期之后或相等
 *
 * @param date {string} - 日期字符串
 * @param target {string} - 目标日期字符串
 * @param valueFormat {string} - 日期格式
 *
 * @returns {boolean}
 */
export function isDateAfterOrEqual(date, target, valueFormat) {
  if (isUndefOrNull(date) || isUndefOrNull(target)) {
    return false
  }
  const d1 = typeof date1 === 'string' ? parseDate(date, valueFormat) : toDate(date)
  const d2 = typeof date2 === 'string' ? parseDate(target, valueFormat) : toDate(target)

  if (d1 === null || d2 === null) {
    return false
  }

  return d1.getTime() >= d2.getTime()
}

/**
 * 判断日期是否在指定范围内
 *
 * @param date {string} - 日期字符串
 * @param start {string} - 开始日期字符串
 * @param end {string} - 结束日期字符串
 * @param valueFormat {string} - 日期格式
 * @param inclusivity {string} - 包含性
 *
 * @returns {boolean}
 */
export function isDateBetween(
  date,
  start,
  end,
  valueFormat = DEFAULT_DATE_FORMAT,
  inclusivity = '(]'
) {
  if (!['()', '[]', '(]', '[)'].includes(inclusivity)) {
    throw new Error('Inclusivity parameter must be one of (), [], (], [)')
  }

  if (isUndefOrNull(date) || isUndefOrNull(start) || isUndefOrNull(end)) {
    return false
  }
  const isBeforeEqual = inclusivity.startsWith('[')
  const isAfterEqual = inclusivity[1] === ']'

  return (
    (isBeforeEqual
      ? isDateAfterOrEqual(date, start, valueFormat)
      : isDateAfter(date, start, valueFormat)) &&
    (isAfterEqual
      ? isDateBeforeOrEqual(date, end, valueFormat)
      : isDateBefore(date, end, valueFormat))
  )
}

/**
 * 判断数字是否相得
 *
 * @param n1 {number | string} - 数字
 * @param n2 {number | string} - 数字
 *
 * @returns {boolean}
 */
export function isNumberEquel(n1, n2) {
  if (isUndefOrNull(n1) || isUndefOrNull(n2)) {
    return false
  }
  let res

  try {
    res = new Big(n1).eq(n2)
  } catch {
    res = false
  }

  return res
}

/**
 * 判断数字是否小于目标数字
 *
 * @param n {number | string} - 数字
 * @param target {number | string} - 数字
 *
 * @returns {boolean}
 */
export function isNumberLessThan(n, target) {
  if (isUndefOrNull(n) || isUndefOrNull(target)) {
    return false
  }
  let res

  try {
    res = new Big(n).lt(target)
  } catch {
    res = false
  }

  return res
}

/**
 * 判断数字是否小于或等于目标数字
 *
 * @param n {number | string} - 数字
 * @param target {number | string} - 数字
 *
 * @returns {boolean}
 */
export function isNumberLessThanOrEqual(n, target) {
  if (isUndefOrNull(n) || isUndefOrNull(target)) {
    return false
  }

  let res

  try {
    res = new Big(n).lte(target)
  } catch {
    res = false
  }

  return res
}

/**
 * 判断数字是否大于目标数字
 *
 * @param n {number | string} - 数字
 * @param target {number | string} - 数字
 *
 * @returns {boolean}
 */
export function isNumberGreaterThan(n, target) {
  if (isUndefOrNull(n) || isUndefOrNull(target)) {
    return false
  }
  let res

  try {
    res = new Big(n).gt(target)
  } catch {
    res = false
  }

  return res
}

/**
 * 判断数字是否大于或等于目标数字
 *
 * @param n {number | string} - 数字
 * @param target {number | string} - 数字
 *
 * @returns {boolean}
 */
export function isNumberGreaterThanOrEqual(n, target) {
  if (isUndefOrNull(n) || isUndefOrNull(target)) {
    return false
  }
  let res

  try {
    res = new Big(n).gte(target)
  } catch {
    res = false
  }

  return res
}

/**
 * 判断数字是否在指定范围内
 *
 * @param value {number | string} - 数字
 * @param start {number | string} - 开始数字
 * @param end {number | string} - 结束数字
 * @param inclusivity {string} - 包含性
 *
 * @returns {boolean}
 */
export function isNumberBetween(value, start, end, inclusivity = '(]') {
  if (!['()', '[]', '(]', '[)'].includes(inclusivity)) {
    throw new Error('Inclusivity parameter must be one of (), [], (], [)')
  }

  if (isUndefOrNull(value) || isUndefOrNull(start) || isUndefOrNull(end)) {
    return false
  }
  const isBeforeEqual = inclusivity.startsWith('[')
  const isAfterEqual = inclusivity[1] === ']'

  return (
    (isBeforeEqual
      ? isNumberGreaterThanOrEqual(value, start)
      : isNumberGreaterThan(value, start)) &&
    (isAfterEqual ? isNumberLessThanOrEqual(value, end) : isNumberLessThan(value, end))
  )
}
