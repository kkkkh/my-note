// import { childArrIsSame } from './index.js'
const {childArrIsSame} = require('./index.js');

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
