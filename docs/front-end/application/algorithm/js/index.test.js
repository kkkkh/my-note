import { expect, test } from 'vitest'
import {childArrIsSame,hasDuplicates} from './index.js'

test('childArrIsSame true', () => {
  const arr = [
    [3, 1, 4],
    [2, 3, 1],
    [1, 2, 3],
  ]
  expect(childArrIsSame(arr)).toEqual([])
})

test('childArrIsSame false', () => {
  const arr = [
    [1, 2, 3],
    [2, 3, 1],
    [1, 2, 3],
  ]
  expect(childArrIsSame(arr)).toEqual(arr[0].sort())
})

test('hasDuplicates false', () => {
  const arr = ['a', 'b', 'c', 'd']
  expect(hasDuplicates(arr)).toEqual(false)
})

test('hasDuplicates true', () => {
  const arr = ['a', 'b', 'c', 'd', 'a']
  expect(hasDuplicates(arr)).toEqual(true)
})
