#include <stdio.h>
typedef struct Coordinate
{
    int x;
    int y;
} Coordinate;

// #region dynamicArray
static void test3(){

    int numFriends = 0, i = 0;
    int *ageFriends= NULL;  // 这个指针用来指示朋友年龄的数组
    // 询问用户有多少个朋友
    printf("请问您有多少朋友 ? ");

    scanf("%d", &numFriends);

    if (numFriends > 0)  // 至少得有一个朋友吧，不然也太惨了 :P
    {
        ageFriends = malloc(numFriends * sizeof(int));  // 为数组分配内存
        if (ageFriends== NULL)  // 检测分配是否成功
        {
            exit(0); // 分配不成功，退出程序
        }

        // 逐个询问朋友年龄
        for (i = 0 ; i < numFriends; i++)  {
            printf("第%d位朋友的年龄是 ? ", i + 1);
            scanf("%d", &ageFriends[i]);
        }

        // 逐个输出朋友的年龄
        printf("\n\n您的朋友的年龄如下 :\n");
        for (i = 0 ; i < numFriends; i++) {
            printf("%d 岁\n", ageFriends[i]);
        }

        // 释放 malloc 分配的内存空间，因为我们不再需要了
        free(ageFriends);
    }
}
// #endregion dynamicArray

static void test2(){
    int *memoryAllocated = NULL;  // 创建一个 int 型指针
    /*
        用 malloc 函数申请 0 字节内存会返回 NULL 指针吗？
        申请 0 字节内存，函数并不返回 NULL，而是返回一个正常的内存地址。
        但是你却无法使用这块大小为 0 的内存！
    */
    memoryAllocated = malloc(sizeof(int));  // malloc 函数将分配的地址赋值给我们的指针 memoryAllocated

    if (memoryAllocated == NULL)  // 如果分配内存失败
    {
        exit(0);  // 立即停止程序
    }
    printf("您几岁了 ? ");
    scanf("%d", memoryAllocated);
    printf("您已经 %d 岁了\n", *memoryAllocated);

    free(memoryAllocated);  // 我们不再需要这块内存了，释放之

}
static void test1(){
    // octet 是英语“字节”的意思，和 byte 类似
    printf("char : %d octets\n", sizeof(char)); // 1
    printf("int : %d octets\n", sizeof(int)); // 4
    printf("long : %d octets\n", sizeof(long)); // 4/8
    printf("double : %d octets\n", sizeof(double)); // 8


    printf("Coordinate 结构体的大小是 : %d 个字节\n", sizeof(Coordinate));

    Coordinate coordinate[100];
    printf("coordinate 的大小是 : %d 个字节\n", sizeof(coordinate));

}
void s2_8_main(void){
    test1();
}

