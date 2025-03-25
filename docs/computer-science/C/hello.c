/*
    预编译指令
    # 号是预编译指令开始的标志
    stdio.h库文件
*/
#include<stdio.h>
#include "a.h"
int main(void) {
    int number;
    /*
        printf 也是一个函数，定义在 stdio 库中
        特殊字符：第一个字符是反斜杠（\），第二个字符是一个数字或者一个字母。
        \n ：换行符 （作用类似按回车键）。
    */
    printf("input:\n"); //
    scanf("%d", &number);
    printHello();
    if((number > 1) && (number <= 100)) {
        printf("Small\n");
    } else if((number > 101) && (number <= 200)) {
        printf("Middle\n");
    } else {
        printf("Large\n");
    }



    // #region printf
    int numberOfDogs = 5;  // 一开始，你有5只狗
    printf("你有 %d 只狗\n", numberOfDogs);
    printf("**** 跑了一只狗 ****\n");
    numberOfDogs = 4;      // 刚跑了一只狗，只有4只了
    printf("啊呀，你只剩下 %d 只狗了\n", numberOfDogs);

    int numberOfCats = 6;
    printf("你有 %d 只狗，还有 %d 只猫\n", numberOfDogs, numberOfCats);
    // #endregion printf

    // #region scanf
    numberOfDogs = 0;
    scanf("%d", &numberOfDogs);
    // #endregion scanf


    int sum = 0; // 把钱数初始化为零

    printf("你身上有多少钱 ? ");
    scanf("%d", &sum);   // 请求用户输入钱数
    printf("你有 %d 块钱啊，那还不快快地交出来 !\n", sum);


    // #region operation
    // 加 +
    int result = 0;
    result = 4 + 6;
    printf("4 + 6 = %d", result);
    // 除 /
    result = 5 / 2;
    printf ("5 / 2 = %d", result);
    /*
    如果你想要得到浮点数的结果，需要运算的数本身是浮点数
    其实不需要两个数都是浮点数，一个是浮点数就够了，电脑会自动把另一个也认为是浮点数来做运算
    */
    result = 5.0 / 2.0;
    printf ("5 / 2 = %f", result);
    // 取模 %
    result = 5 % 2;
    printf ("5 % 2 = %d", result);

    // 变量运算
    result = 0;
    int number1 = 0, number2 = 0;
    // 请求用户输入number1和number2的值：
    printf("请输入数字1 : ");
    scanf("%d", &number1);
    printf("请输入数字2 : ");
    scanf("%d", &number2);
    // 做运算：
    result = number1 + number2;
    // 把运算结果显示在屏幕上 :
    printf ("%d + %d = %d\n", number1, number2, result);
    // #endregion operation
    /*
        大致就是表示函数结束了，并且返回 0 值。
        0 表示一切正常结束，其他的值表示异常
    */
    return 0;
}


