/*
    预编译指令
    # 号是预编译指令开始的标志
    stdio.h库文件
*/
#include <stdio.h>
#include "./Headers/s1.h"
#include "./Headers/s1g.h"
#include "./Headers/s2.h"
/*
    int main(int argc, char *argv[])
    char *argv[]一个指向字符串的指针数组
    数组中的每个元素 argv[i] 都是一个 char * 类型的指针
*/
int main(int argc, char *argv[]) {
    // s1
    // s1Main();
    // s1g
    // guessNumber();
    // s2.1
    // staticMain();
    // s2.2
    // pMain();
    // s2.3
    // arrayMain();
    // s2.4
    // stringMain();
    // s2.6
    // s2_6_main();
    // s2.7
    // s2_7_main();
    // s2.8
    s2_8_main();
    /*
        大致就是表示函数结束了，并且返回 0 值。
        0 表示一切正常结束，其他的值表示异常
    */
    return 0;
}


