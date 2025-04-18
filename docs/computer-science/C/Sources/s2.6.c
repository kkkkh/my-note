#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// #region struct
// 两种方式
// 1
typedef struct Coordinate Coor;
// Coor 是创建的别名
// Coor 相当于 struct Coordinate
struct Coordinate
{
    int x;  // 横坐标
    int y;  // 纵坐标
};

// 2
typedef struct Person
{
    char firstName[100]; // 名
    // char *lastName;   // 姓
    char lastName[100];  // 姓
    char address[1000];  // 地址

    int age;  // 年龄
    int boy;  // 性别，布尔值 : 1 = boy（表示“男孩”）, 0 = girl（表示“女孩”）
} Per;
void initializeCoordinate(Coor *point);  // 函数原型
static void test1() {
    // 1、struct
    // Coor
    Coor point = {0,0}; //与数组的初始化很类似
    point.x = 10;
    point.y = 20;
    Coor *myPoint = &point;
    myPoint->y = 30;
    // Per
    Per user = {"", "", "", 0, 0};
    printf("你姓什么 ? ");
    // user.lastName = (char*)malloc(100 * sizeof(char)); //先分配内存
    scanf("%s", user.lastName);
    printf("你名叫什么 ? ");
    scanf("%s", user.firstName);
    printf("原来你的名字是 %s%s，失敬失敬\n", user.lastName, user.firstName);
    // 2、创建结构体数组
    Per players[2] = {
        {"Ming", "Xiao", "", 0, 0},  // players[0] 的初始值
        {"Hong", "Da", "", 0, 0}   // players[1] 的初始值
    };
    // players[1].lastName = "xiaoming"; // 会报错，使用strcpy替代
    strcpy(players[1].lastName, "xiaoming");
    printf("players[1].lastName= %s \n",players[1].lastName);

    // 3、结构体指针
    Coor *point1 = NULL, *point2 = NULL;
    initializeCoordinate(&point);
    // initializeCoordinate(point1);
}
// #endregion struct
// #region union
typedef union CoderHub1
{
  // 变量
  char character;
  int memberNumber;
  double rate;
} CoderHub1;

typedef struct CoderHub2
{
  char character;  // 大小是 1 个字节,第一个 char 变量对齐了第二个 int 变量的空间，也变成了 4
  int memberNumber;  // 大小是 4 个字节
  double rate;  // 大小是 8 个字节
} CoderHub2;
static void test2() {
  // 4、union
  // union 的大小等于其中最大（sizeof() 得到的值最大）的那个变量的大小
  // union 适合用在很多相同类型的变量集，但是某一时刻只需用到其中一个的情况，比较节省空间
  CoderHub1 coderHub1;
  // struct 的大小是其中所有变量大小的总和
  CoderHub2 coderHub2;
  printf("此 union 的大小是 %lu 个字节\n", sizeof(coderHub1)); // 此 union 的大小是 8 个字节
  printf("此 struct 的大小是 %lu 个字节\n", sizeof(coderHub2)); // 此 struct 的大小是 16 个字节
}
// #endregion union
// #region enum
typedef enum Shape Shape;
enum Shape   // shape 表示“身材、体型”
{
    // 但是 enum 的成员都是常量，而不是变量
    THIN = 20,   // thin 表示“瘦”
    MEDIUM,   // medium 表示“中等” // 21
    FAT   // fat 表示“胖” // 22
};
static void test3() {
  // 5、enum
  Shape shape = THIN;
  printf("THIN = %d\n", shape);
  shape = MEDIUM;
  printf("MEDIUM = %d\n", shape);
  shape = FAT;
  printf("FAT = %d\n", shape);
}
// #endregion enum
int s2_6_main(void)
{
    test1();
    test2();
    test3();
    return 0;
}

void initializeCoordinate(Coor *point) {
    (*point).x = 0; //. 号的优先级是高于 * 号的。
    point->x = 0; // 与 上边相同，这个符号，只能用在指针上面。
    (*point).y = 0;
    point->y = 0;
}
