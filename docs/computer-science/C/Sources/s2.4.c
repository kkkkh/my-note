#include <stdio.h>
#include <string.h>

static void test1()
{
    char letter = 'A';

    printf("%d\n", letter); //ASCII 表 65
    printf("%c\n", letter);
}
static void test2(){
    char string[6];  // 六个 char 构成的数组，为了储存：H-e-l-l-o + \0
    string[0] = 'H';
    string[1] = 'e';
    string[2] = 'l';
    string[3] = 'l';
    string[4] = 'o';
    string[5] = '\0';
    printf("%s\n", string);
}

// #region character1
static void test3(){
    // 两种方式 （本质是 数组和指针的区别）
    // 只能用于初始化
    // 不能再用这种方式来给整个数组赋值了
    // 一个字符数组，里面的字符串是储存在内存的变量区，是在栈上，所以可以修改每个字符的内容，但是不可以通过数组名整体修改
    char string[] = "Hello";  // 字符数组的长度会被自动计算
    // string = "nihao";   // --> 出错！
    string[0] = 'j';   // --> 可以！
    printf("%s\n", string);
    // 用 char * 来声明的字符串
    // 整个重新赋值
    // 不可以单独修改某个字符
    // 为什么？
    // stringPointer 里面只是存放了一个地址，这个地址上存放的字符串是常量字符串。这个常量字符串存放在内存的静态区，不可以更改。
    char *str = "Hello, World!";
    printf("%s\n", str);
    str = "nihao";   // --> 可以！
    // str[1] = 'a'; // --> 出错！
    printf("%s\n", str);
}

static void test4(){
    char name[100];
    printf("请问您叫什么名字 ? ");
    scanf("%s", name);
    printf("您好, %s, 很高兴认识您!\n", name);
}
// #endregion character1

// #region character2
static void test5(){
    // 1、字符串长度
    // size_t strlen(const char* string);
    // size_t 是一个特殊的类型，它意味着函数返回一个对应大小的数目。
    // 不是像 int，char，long，double 之类的基本类型，而是一个被“创造”出来的类型。
    char string[] = "Hello";
    int stringLength = 0;
    stringLength = strlen(string);
    printf("字符串 %s 中有 %d 个字符\n", string, stringLength);
    // 2、字符串复制
    // char* strcpy(char* targetString, const char* stringToCopy);
    char copy[100] = {0};
    strcpy(copy, string);  // 我们把 string 复制到 copy 中
    printf("string 是 %s\n", string);
    printf("copy 是 %s\n", copy);
    // 3、字符串连接
    // char* strcat(char* string1, const char* string2);
    /* 我们创建了两个字符串，字符数组 string1 需要足够长，因为我们要将 string2 的内容接到其后 */
    char string1[100] = "Hello ", string2[] = "Oscar!";
    strcat(string1, string2);
    printf("string1 是 %s\n", string1);
    printf("string2 始终是 %s\n", string2);
    // 4、字符串比较
    // int strcmp(const char* string1, const char* string2);
    char string11[] = "Text of test", string22[] = "Text of test";

    if (strcmp(string11, string22) == 0) // 如果两个字符串相等
    {
        printf("两个字符串相等\n");
    }
    else
    {
        printf("两个字符串不相等\n");
    }
    // 5、向一个字符串写入
    // char* sprintf(char* string, const char* format, ...);
    char string3[100];
    int age = 18;
    sprintf(string3, "你 %d 岁了", age);// 这里只写入
    printf("%s\n", string3);
    // 6、strstr（在字符串中查找一个子串）
    char* strstr(const char* string, const char* substring);
    char string4[] = "Hello, World!";
    char* result1 = strstr(string4, "World");
    printf("子串 'World' 在字符串 %s 中的位置是 %s\n", string4, result1);
    // 7、strchr（在字符串里查找一个字符）
    // char* strchr(const char* string, int character);
    char string5[] = "Hello, World!";
    char* result2 = strchr(string5, 'o');
    printf("字符 'o' 在字符串 %s 中的位置是 %s\n", string5, result2);
    // result2 - string5: 这是指针减法运算。在 C 语言中，当两个指针指向同一个数组的元素时，它们可以进行减法运算。
    // result2: char* 类型的指针，指向 string5 字符串中字符 'o' 第一次出现的位置。
    // string5: char[] 类型的字符数组，存储了字符串 "Hello, World!"。在表达式中，string5 会被隐式转换为 char* 类型的指针，指向数组的首元素（即字符 'H'）。
    int index2 = result2 - string5;
    printf("字符 'o' 在字符串 '%s' 中的索引是: %d\n", string5, index2);
}
// #endregion character2
// 字符串输入输出
int stringMain()
{
    test1();
    test2();
    test3();
    test4();
    test5();
    return 0;
}

