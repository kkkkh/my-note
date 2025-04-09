// #region static
#include <stdio.h>
int increment();

int staticMain(void)
{
    printf("%d\n", increment());
    printf("%d\n", increment());
    printf("%d\n", increment());
    printf("%d\n", increment());
    return 0;
}

int increment()
{
    static int number = 0;
    number++;
    return number;
}
// #endregion static
