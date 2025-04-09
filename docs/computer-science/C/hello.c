/*
    预编译指令
    # 号是预编译指令开始的标志
    stdio.h库文件
*/
#include <stdio.h>
#include "./Headers/s1g.h"
#include "./Headers/s2.1.h"
#include "./Headers/s1.h"

int main(void) {
    // 基础
    int number;
    /*
        printf 也是一个函数，定义在 stdio 库中
        特殊字符：第一个字符是反斜杠（\），第二个字符是一个数字或者一个字母。
        \n ：换行符 （作用类似按回车键）。
    */
    printf("input:\n"); //
    scanf("%d", &number);
    if((number > 1) && (number <= 100)) {
        printf("Small\n");
    } else if((number > 101) && (number <= 200)) {
        printf("Middle\n");
    } else {
        printf("Large\n");
    }

    // s1
    s1Main();
    // s1g
    guessNumber();
    // s2.1
    staticMain();
    /*
        大致就是表示函数结束了，并且返回 0 值。
        0 表示一切正常结束，其他的值表示异常
    */
    return 0;
}


