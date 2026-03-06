## Command
### base
#### start
```bash
whoami #用户名
hostname #主机名称
history #用于列出之前使用过的所有命令
Ctrl + R #用于查找使用过的命令
Ctrl + L #清除
Ctrl + D #退出
pwd #显示当前目录的路径
uname -a #### 查看linux版本
# windows sudo
runas
```
#### ls
```bash
ls -a #显式所有
ls -l #详细列表 total //千字节
ls -lh #文件大小适合阅读的显示展示
ls -lt #最近一次修改时间排序
```
#### cd
```bash
cd ~
cd #回到家目录
```
#### du
```bash
du #统计目录大小
du -h #文件大小适合阅读的形式展示
du -ha #显示文件和目录的大小
du -sh #当前目录总大小
```
#### 权限 chmod
```bash
ls -l a.txt
-rw-r--r--
-          rw-     r--     r--
# 第一部分 第二部分 第三部分 第四部分
# 文件属性 所有者 群组用户 其他用户
```
第一部分：
- 第一个短横表示这是一个普通文件
- d：英语 directory 的缩写，表示“目录”。就是说这是一个目录；
- l：英语 link 的缩写，表示“链接”。就是说这是一个链接；

其他部分：
- r：英语 read 的缩写，表示“读”。就是说可以读这个文件；
- w：英语 write 的缩写，表示“写”。就是说可以写这个文件，也就是可以修改；
- x：英语 execute 的缩写，表示“执行，运行”。就是说可以运行这个文件。

权限数： r 4 w 2 x 1
```txt
权限 数字 计算
—    0 = 0 + 0 + 0
r–    4 = 4 + 0 + 0
-w-   2 = 0 + 2 + 0
--x   1 = 0 + 0 + 1
rw-   6 = 4 + 2 + 0
-wx   3 = 0 + 2 + 1
r-x   5 = 4 + 0 + 1
rwx   7 = 4 + 2 + 1
```
```bash
chmod 640 renamed_file #修改文件权限
chmod -R 700 /home/oscar #修改目录下所有文件权限
#  640 分别表示：
# 文件的所有者有读和写的权限；
# 文件所在群组的其他用户具有读的权限；
# 除此之外的其他用户没有任何权限。
```
#### read
```bash
#!/bin/bash
read name
echo "Hello $name !"
# -> Oscar
# Hello Oscar
read firstname lastname
echo "Hello $firstname $lastname !"
# -> a b
# Hello a b
# -> a b c d e
# Hello a b c d e #$lastname 接住b c d e
# 显示提示信息
read -p 'Please enter your name : ' name 
echo "Hello $name !"
# 限制输入字符数
read -p 'Please enter your name (5 characters max) : ' -n 5 name
echo "Hello $name !"
# 限制输入时间（秒）
read -p 'Please enter your name (5 characters max) : ' -t 5 name
echo -e "/nHello $name !"
# 隐藏输入内容
read -p 'Please enter your password : ' -s password
```
#### corntab
```bash
# 创建
crontab -e
# 每天 10点10分
10 10 * * * 
#分钟 小时 一个月的哪一天 月份 星期几 需要执行的命令
m     h   dom           mon  dow   command
# 每个小时的 47 分
47 * * * * command
# 每个礼拜一的凌晨
0 0 * * 1 command
# 每个月的 1 ~ 15 日的 5 点 30 分
30 5 1-15 * * command
# 每个礼拜一，礼拜三，礼拜四的凌晨
0 0 * * 1,3,4 command
# 每 2 个小时的整点（0，2，4，6，等等）
0 */2 * * * command
# 每个礼拜一到礼拜五的每个 10 的倍数的分钟（0，10，20，30，等等）
*/10 * * * 1-5 command
# 显示
corntab -l
# 删除
corntab -r
```
#### rename 多文件批量改名
```bash
rename -n 's/Image\s/logon*1*/' \*
rename -n 'y/A-Z/a-z/' W*
rename 's/\(//' *
rename 's/\)//' *
rename 's/Image/logo/' *
rename 's/Imag/logo/' *
```
- rename -n 's/Image\s/logon*1*/' \*
  - -n 全部预览
  - s 的作用是指定我们使用第二个字符串替换第一个字符串
- rename -n 'y/A-Z/a-z/' W*
  - y 表示更改大小写
  - W* 带 W 字母前缀的文件

#### 查看端口
```bash
netstat -tanlp
netstat -apn | grep 80 # 查看 80 端口
```
#### tail 查看文件内容
```bash
tail -f -s 5 -n 100 ./logs
```
- -n, --lines=[+]NUM (文件的尾 100 行)
  - output the last NUM lines, instead of the last 10 or use -n +NUM to output starting with line NUM
-  -f, --follow[={name|descriptor}] (实时追踪文件的更新)
    -  output appended data as the file grows; an absent option argument means 'descriptor'
- -s, --sleep-interval=N 每隔 5 秒检查一次文件是否有更新
  - with -f, sleep for approximately N seconds (default 1.0) between iterations;
  - with inotify and --pid=P, check process P atleast once every N seconds
#### ntpdate 更新系统时间
```bash
sudo apt-get install -y ntpdate
dpkg-reconfigure tzdata #设置时区,时区选择'Asia/Shanghai'
sudo ntpdate -u ntp.aliyun.com
```
#### find & rm
```bash
# 进行多次删除
find / -type d -name "node_modules" -print -exec rm -rf {} +
find / -type d -name "dist" ! -path "*@*" -print -exec rm -rf {} +
```
#### cp
```bash
cp */**/*.pdf ./ # 一次性复制
```
#### scp
```bash
scp -r localfile.txt username@192.168.0.1:/home/username/
```
#### runas
```bash

```
#### yum（centos）
```bash
yum install ddd
yum remove ddd
```

### shell 脚本
#### 条件 if elif else
```bash
if [ $1 = "1" ]
then
  echo "Hello $1 "
elif [ $1 = "2" ]
then
  echo "hello $1"
else
  echo "hello no"
fi
```
#### func
```bash
devPush () {
    git checkout dev
    git pull
    git merge feature_v2.1.$version
    sleep 3
    echo "----push：dev,please confirm--------"
    read
    git push
}
devPush()
```
