## Command
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
#### vim
- 三种模式：交互模式、插入模式、命令模式
##### 交互模式
- 0 移动到行首
- $ 移动到行末
##### 命令模式
- x 删除字符
- dd 删除行
- dw 删除单词
- d0 删除光标处到行首的所有字符
- d$ 删除光标处到行末的所有字符
- yy 复制
- p 粘贴 
  - 7p 粘贴 7 次
- r 替换一个字符
- R 一次性替换多个字符
- u 撤销
  - 4u 撤销四次修改
- control + r 取消撤销
- 跳转
    - 7G 跳转到第 7 行
    - 7 shift + g 同上
    - 7gg 同上
    - G/shift + g 跳转最后一行
    - gg 跳转到第一行
- / 查找 (从光标处向下)
    - n 查找下一个
    - N 查找上一个
- ? 查找（从光标处向上）
##### 插入模式
- :w 保存
- :w myFile
  - `"myFile" [New] 5L, 152C written`
  - "myFile"：刚才用 w 命令来保存的文件名。表示“我的文件”
  - [New]：new 是英语“新的”的意思，表示这个文件是新创建的
  - 5L：L 是 line 的首字母，是英语“行”的意思，因此 5L 表示文件中有 5 行
  - 152C：C 是 character 的首字母，是英语“字符”的意思，因此 152C 表示文件中有 152 个字符
  - written：英语“已经写入”的意思
- :q 退出
- :q! 作用是“强制退出，不保存修改”
- :wq 保存再退出
- :x 同上
- 替换
  - : s/旧字符串/新字符串 <font size=1>替换**光标**所在行的第一个匹配的旧字符串为新字符串</font>
  - : s/旧字符串/新字符串/g <font size=1>替换光标所在行的所有匹配的旧字符串为新字符串</font>
  - :#,# s/旧字符串/新字符串/g <font size=1>替换文件中第 # 行到第 # 行的所有匹配的旧字符串为新字符串</font>
  - :%s/旧字符串/新字符串/g <font size=1>替换所有匹配的旧字符串为新字符串</font>
- :r file.txt 合并file文件
- 分屏-略
##### vimrc配置
- cp /etc/vim/vimrc ~/.vimrc
- syntax on 语法高亮
- set background=dark 背景颜色
- set number 显示行号
- showcmd 显示当前命令
- ignorecase 查找是忽略大小写
- set mouse=a 支持鼠标

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
### scp
```bash
scp -r localfile.txt username@192.168.0.1:/home/username/
```
### 查看linux版本
```bash
uname -a
```
# 查看端口
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
#### runas
```bash
# windows sudo
runas
```
#### yum（centos）
```bash
yum install ddd
yum remove ddd
```
