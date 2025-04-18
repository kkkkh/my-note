#include <stdio.h>
#define MAX_SIZE 1000  // 数组的最大尺寸 1000


static void write (FILE *file){
    int age = 20;
    // 此函数用于在文件中一次写入一个字符。
    fputc('A', file);  // 写入字符 A
    //  fputs 每次写入一个字符串。
    fputs("你好，朋友。\n最近怎么样？", file);
    // 这个字符串是可以由我们来格式化的
    fprintf(file, "使用者年龄是 %d 岁\n", age);
}

static void fgetcTest (FILE *file){
    // fgetc
    // 循环读取，每次一个字符
    int currentCharacter = 0;
    do
    {
        currentCharacter = fgetc(file);  // 读取一个字符
        printf("%c", currentCharacter);  // 显示读取到的字符
    } while (currentCharacter != EOF);  // 我们继续，直到 fgetc 返回 EOF（表示“文件结束”）为止
}

static void fgetsTest(FILE *file){
    // fgets
    // 这个函数每次最多读取一行，因为它遇到第一个 '\n'（换行符）会结束读取。
    // 所以如果我们想要读取多行，需要用循环。
    char string[MAX_SIZE] = "";  // 尺寸为 MAX_SIZE 的数组，初始为空
    // fgets(string, MAX_SIZE, file);  // 我们读取最多 MAX_SIZE 个字符的字符串，将其存储在 string 中
    while (fgets(string, MAX_SIZE, file) != NULL)
    printf("%s\n", string);  // 显示字符串
}
static void fscanfTest(FILE *file){
    int score[3] = {0};  // 包含 3 个最佳得分的数组
    fscanf(file, "%d %d %d", &score[0], &score[1], &score[2]);
    printf("最佳得分是 : %d, %d 和 %d\n", score[0], score[1], score[2]);
}
static void read(FILE *file){

    // fgetcTest(file);
    // fgetsTest(file);
    fscanfTest(file);
}

static void move(FILE *file){
    long position = 0;
    position = ftell(file);
    printf("文件游标位置: %ld\n", position);
    // SEEK_SET ：文件开始处。SET 表示“设置”。
    fseek(file, 10, SEEK_SET);
    position = ftell(file);
    printf("文件游标位置: %ld\n", position);
    // SEEK_CUR ：游标当前所在位置。CUR 是 current（表示“当前”）的缩写。
    fseek(file, 5, SEEK_CUR);
    position = ftell(file);
    printf("文件游标位置: %ld\n", position);
    // SEEK_END ：文件末尾。END 表示“结尾”。
    fseek(file, 0, SEEK_END);
    position = ftell(file);
    printf("文件游标位置: %ld\n", position);
    rewind(file);   // 将文件游标位置重置到文件开始处
    position = ftell(file);
    printf("文件游标位置: %ld\n", position);
    int res = rename("test.txt", "renamed_test.txt");
    if(res == 0){
        printf("rename 成功");
    }else{
        printf("rename 失败");
    }
    // remove("renamed_test.txt");
}
int s2_7_main(void)
{
    FILE* file = NULL;
    /*
        test.txt 文件内容
        12 12 A你好，朋友。
        最近怎么样？使用者年龄是 20 岁
    */

    file = fopen("test.txt", "r+"); // 打开文件
    if (file != NULL)
    {
        write(file);
        read(file);
        move(file);
        /*
        函数的返回值（int）有两种情况：
            0 ：当关闭操作成功时。
            EOF（是 End Of File 的缩写，表示“文件结束”。一般等于 -1）：如果关闭失败。
        */
        fclose(file);

    }
    else
    {
        // 显示一个错误提示信息
        printf("无法打开 test.txt 文件\n");
    }
    return 0;
}
