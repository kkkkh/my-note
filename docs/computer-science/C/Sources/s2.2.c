// #region pointer
#include <stdio.h>
#include "../Headers/s2.2.h"

int pointerMain(void)
{
    int *pointer1, *pointer2, *pointer3;
    int *myPointer = NULL;
    int age = 10;
    printf("变量 age 的地址是 : %p", &age); // &age ：表示变量的地址。

    //  这里的*是创建指针变量
    int *pointerOnAge = &age;
    printf("指针的大小是 %lu 字节\n", sizeof(void *)); //指针的大小是 8 字节
    // age的内存地址
    printf("%d\n", pointerOnAge);
    // 取得指针所指向的地址上的变量值。age的值
    printf("%d\n", *pointerOnAge);
    // pointerOnAge 的地址值
    printf("%d\n", &pointerOnAge);

  return 0;
}

int pointer1Main()
{
    int number = 5;

    // 第1种方式传值
    triplePointer(&number);  // 将 number 变量的地址传给函数 triplePointer

    printf("%d\n", number);  // 显示number的值。上面函数已经直接修改了 number 的值，因为函数知道 number 的内存地址

    return 0;
}
int pointer2Main()
{
    int number = 5;

    int *pointer = &number;  // pointer 里面储存的是 number 的地址值
    // 第二种方式传值
    triplePointer(pointer);  // 将 pointer（值是 number 的地址）传给函数

    printf("%d\n", *pointer);  // 用 *pointer 来显示 number 的值

    return 0;
}
void triplePointer(int *pointerOnNumber)
{
    *pointerOnNumber = *pointerOnNumber + 3;   // 将 pointerOnNumber 的值乘以 3
}

int pointerTimeMain()
{
    int hours = 0, minutes = 90;

    // 这一次我们传递了 hours 和 minutes 的地址
    transformMinutes(&hours, &minutes);

    // 这一次，数值如我们所愿改变了
    printf("%d 小时 : %d 分钟\n", hours, minutes);

    return 0;
}

void transformMinutes(int *hours, int *minutes)
{
    // 记得，不要忘了取值符号（*），这样你才可以改变变量的值，而不是它们的地址
    *hours = *minutes / 60;    // 90 / 60 = 1
    *minutes = *minutes % 60;    // 90 % 60 = 30
}
// #endregion pointer
