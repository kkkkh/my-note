#include<stdio.h>
#include<stdlib.h>
#include<time.h>

int multipleTwo(int number)
{
    return 2 * number;
}
void guessNumber(void) {
    /*
        产生伪随机数序列
        time(NULL) 参数为空（NULL），函数将只通过返回值返回现在的日历时间
        利用系统时间来改变系统的种子值，
        srand(time(NULL))，可以为 rand 函数提供不同的种子值
    */
    int a = multipleTwo(100);
    printf("a is %d\n", a);

    int mysteryNumber = 0, guessNumber = 0;
    const int MAX = 100, MIN = 1;
    // 生成随机数
    srand(time(NULL));
    mysteryNumber = (rand() % (MAX - MIN + 1)) + MIN;
    /* 程序的循环部分， 如果用户没猜中数字，就一直进行循环 */
    do
    {
        // 请求用户输入所猜数字
        printf("这个数字是什么 ? ");
        scanf("%d", &guessNumber);
        // 比较用户输入的数字和神秘数字
        if (mysteryNumber > guessNumber)
            printf("猜小了 !\n\n");
        else if (mysteryNumber < guessNumber)
            printf("猜大了 !\n\n");
        else
            printf ("太棒了，你猜到了这个神秘数字 !!\n\n");
    } while (guessNumber != mysteryNumber);

    // return 0;
}
