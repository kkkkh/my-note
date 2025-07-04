/**
 * @description 对称数 test
 */

import { findPalindromeNumbers1, findPalindromeNumbers2, findPalindromeNumbers3 } from './13-palindrome-number'

describe('对称数', () => {
    it('正常情况', () => {
        const numbers = findPalindromeNumbers3(200)
        console.log(numbers)
        expect(numbers.length).toBe(28)
    })
    it('max 小于等于 0', () => {
        const numbers = findPalindromeNumbers3(0)
        expect(numbers).toEqual([])
    })
})
