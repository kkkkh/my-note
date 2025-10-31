# Linux

## 自建服务器
- [参考](https://chat.deepseek.com/a/chat/s/8040a69a-d4ba-49f6-819b-8089090c9b4c)

## 常见问题
### apt 安装软件失败
```bash
sudo apt update
apt install sqlite3
# Err:1 http://mirrors.cloud.aliyuncs.com/ubuntu jammy-updates/main amd64 sqlite3 amd64 3.37.2-2ubuntu0.4 404 Not Found [IP: 100.100.2.148 80]
# E: Failed to fetch http://mirrors.cloud.aliyuncs.com/ubuntu/pool/main/s/sqlite3/sqlite3_3.37.2-2ubuntu0.4_amd64.deb 404 Not Found [IP: 100.100.2.148 80]
# E: Unable to fetch some archives, maybe run apt-get update or try with --fix-missing?
# ----------------------------------------------------------------------------------- #
sudo apt update --fix-missing
# --fix-missing Reading package lists... Done
# E: Could not get lock /var/lib/apt/lists/lock. It is held by process 1543146 (apt-get)
# N: Be aware that removing the lock file is not a solution and may break your system.
# E: Unable to lock directory /var/lib/apt/lists/
#
# apt 正在被另一个进程占用（进程号 1543146），所以 apt update 无法获取锁
# 另一个 apt 或 apt-get 正在运行（例如自动更新或你之前的命令还没完成）。
# 上次 apt 异常退出，锁文件没释放。
# ----------------------------------------------------------------------------------- #
sudo kill -9 1543146
# 再重复之前的 修复、安装
```
### redis 警告
```bash
# WARNING Memory overcommit must be enabled! Without it, a background save or replication may fail under low memory condition.
# Redis 建议在 Linux 系统中启用 内存过量分配（vm.overcommit_memory = 1），否则在内存紧张时可能执行 RDB/AOF 持久化失败，或者复制/持久化操作异常。
sysctl vm.overcommit_memory=1
# 或者在 /etc/sysctl.conf 中加：
vm.overcommit_memory = 1
```
### cpus 数量
| 字段                   | 含义                         |
| -------------------- | -------------------------- |
| `Socket(s)`          | 物理 CPU 颗数                  |
| `Core(s) per socket` | 每颗 CPU 的核心数                |
| `Thread(s) per core` | 每核心的线程数（超线程，一般 2）          |
| `CPU(s)`             | 总线程数（逻辑 CPU 数 = 核心数 × 线程数） |
```bash
# 查看逻辑 CPU 数量（线程数）
nproc
# 查看物理 CPU 颗数
grep "physical id" /proc/cpuinfo | sort -u | wc -l
# 查看每颗 CPU 的核心数
grep "core id" /proc/cpuinfo | sort -u | wc -l
# 综合查看 CPU 信息
lscpu
# Socket(s):           1
# Core(s) per socket:  4
# Thread(s) per core:  2
# CPU(s):              8
# ---------------------------------------------------- #
# Socket(s) = 物理 CPU 数
# Core(s) per socket = 每颗 CPU 的核心数
# Thread(s) per core = 超线程（一般为 2）
# CPU(s) = 最终逻辑 CPU 数 = Socket × Core × Thread
# ---------------------------------------------------- #
# 物理核心 = 1 × 4 = 4
# 逻辑 CPU = 4 × 2 = 8
查看 CPU 型号
cat /proc/cpuinfo | grep "model name" | uniq
```
