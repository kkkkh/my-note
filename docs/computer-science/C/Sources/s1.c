#include <stdio.h>
#include <math.h>

static int test1(void){
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

}
int s1Main(void)
{
    test1();
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

    // #region printfAndScanf
    int sum = 0; // 把钱数初始化为零
    printf("你身上有多少钱 ? ");
    scanf("%d", &sum);   // 请求用户输入钱数
    printf("你有 %d 块钱啊，那还不快快地交出来 !\n", sum);
    // #endregion printfAndScanf

    // #region operation
    // 1、基础运算
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

    // 2、变量运算
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

    // 3、缩写
    int number = 0;
    number++;
    number--;
    // 其他
    number = 2;
    number += 4;  // number 变为 6
    number -= 3;  // number 变为 3
    number *= 5;  // number 变为 15
    number /= 3;  // number 变为 5
    number %= 3;  // number 变为 2（因为 5 = 1 * 3 + 2）
    // #endregion operation

    // #region math
    // 数学库
    // fabs 绝对值
    double absolute = 0;
    number = -29;
    absolute = fabs(number);   // absolute 的值变为 29
    printf("absolute is %f",absolute);
    // ceil 向上取整
    double above = 0;
    number = 34.81;
    above = ceil(number);  // above 的值变为 35
    // floor 向下取整
    double below = 0;
    number = 45.63;
    below = floor(number);   // below 的值变为 45
    // pow 数字乘方
    double powResult = 0;
    number = 2;
    powResult = pow(number, 4);  // result 的值变为 16（2 ^ 4 = 16）
    // sqrt 平方根
    double sqrtResult = 0;
    number = 100;
    sqrtResult = sqrt(number);  // result 的值变为 10

    // #endregion math
    // #region condition
    int age = 10;
    switch (age)
    {
        case 2:
        case 6:
            printf("小朋友，你好 !");
            break;
        case 12:
            printf("少年，你好 !");
            break;
        case 16:
            printf("青少年，你好 !");
            break;
        case 18:
            printf("成年人，你好 !");
            break;
        case 67:
            printf("爷爷，你好 !");
            break;
        default:
            printf("对你的年龄我还没有对应的问候方式。");
            break;
    }
    int adult = 1;
    age = (adult) ? 18 : 17;
    // #endregion condition
    // #region loop
    int counter = 0;
    while (counter < 10) {
        printf("变量的值是 %d\n", counter);
        counter++;
    }
    // do...while 循环是先执行循环体的指令，再做条件判断，所以 do...while 的指令至少会被执行一次。
    counter = 0;
    do {
        printf("你好 !\n");
        counter++;
    } while (counter < 10);

    for (counter = 0 ; counter < 10 ; counter++) {
        printf("for 你好 !\n");
    };
    // #endregion loop
    return 0;
}

