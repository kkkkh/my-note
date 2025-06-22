/**
 * 计算青蛙跳上 n 级台阶的总方式数 (优化空间复杂度)
 *
 * @param {number} n 台阶数
 * @returns {number} 总方式数
 */
export function frogJump1(n:number) {
    if (n <= 1) {
      return 1;
    }

    let a = 1; // dp[0]：跳上 0 级台阶的跳法数
    let b = 1; // dp[1]：跳上 1 级台阶的跳法数
    let result = 0; // 用于保存 dp[i]

    for (let i = 2; i <= n; i++) {
      result = a + b; // dp[i] = dp[i-1] + dp[i-2]
      a = b; // 更新 dp[i-2] 为 dp[i-1]
      b = result; // 更新 dp[i-1] 为 dp[i]
    }

    return result; // 返回 dp[n]
  }
export function frogJump2(n:number) {
    if (n <= 1) {
      return 1;
    }

    const dp = new Array(n + 1);
    dp[0] = 1;
    dp[1] = 1;

    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
  }
