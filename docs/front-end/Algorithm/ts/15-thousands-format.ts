/**
 * @description 千分位格式化
 */

/**
 * 千分位格式化（使用数组）
 * @param n number
 */
export function format1(n: number): string {
    n = Math.floor(n) // 只考虑整数

    const s = n.toString()
    const arr = s.split('').reverse()
    return arr.reduce((prev, val, index) => {
        if (index % 3 === 0) {
            if (prev) {
                return val + ',' + prev
            } else {
                return val
            }
        } else {
            return val + prev
        }
    }, '')
}

/**
 * 数字千分位格式化（字符串分析）
 * @param n number
 */
export function format2(n: number): string {
    n = Math.floor(n) // 只考虑整数

    let res = ''
    const s = n.toString()
    const length = s.length
    for (let i = length - 1; i >= 0; i--) {
        // 关键点：从后往前添加
        const j = length - i // j是动态的，length - i，实际上是倒着数第几个
        if (j % 3 === 0) {
            if (i === 0) { // 到达头部
                res = s[i] + res
            } else {
                res = ',' + s[i] + res
            }
        } else {
            res = s[i] + res
        }
    }

    return res
}

// // 功能测试
// const n = 10201004050
// console.info('format1', format1(n))
// console.info('format2', format2(n))
