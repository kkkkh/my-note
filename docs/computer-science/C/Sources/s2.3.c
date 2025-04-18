// #region array
#include <stdio.h>
void display(int *array, int arraySize);

static void test1()
{
    int array[4];
    array[0] = 10;
    array[1] = 12;
    array[2] = 3;
    array[3] = 7;
    // 你只写 array，那就是一个指针，是指向数组首元素的首地址的一个指针
    printf("%d\n", array);
    // 获得数组的首元素的值；
    printf("%d\n", *array);
    // 第2个元素的值；
    printf("%d\n", *(array + 1));
    // 打印每一个值
    int array1[4] = {0, 0, 0, 0}, i = 0;
    for (i = 0 ; i < 4 ; i++)
    {
        printf("%d\n", array1[i]);
    }
}
static void test2(){
    int array[4] = {10, 15, 3};
    // 显示数组内容
    display(array, 4);
}
int arrayMain()
{
    test1();
    test2();
    return 0;
}

//  void display(int array[], int arraySize)
 void display(int *array, int arraySize)
{
    int i;
    for (i = 0 ; i < arraySize ; i++)
    {
        printf("%d\n", array[i]);
    }
}
// #endregion array
