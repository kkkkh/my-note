---
title: linux 常见问题
date: 2025-10-31 13:00
tags:
  - Ops
  - linux
---
# Linux 常见问题

## apt 安装软件失败
```bash
sudo apt update
apt install sqlite3
# Err:1 http://mirrors.cloud.aliyuncs.com/ubuntu jammy-updates/main amd64 sqlite3 amd64 3.37.2-2ubuntu0.4 404 Not Found [IP: xx]
# E: Failed to fetch http://mirrors.cloud.aliyuncs.com/ubuntu/pool/main/s/sqlite3/sqlite3_3.37.2-2ubuntu0.4_amd64.deb 404 Not Found [IP: xx]
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
## redis 警告
```bash
# WARNING Memory overcommit must be enabled! Without it, a background save or replication may fail under low memory condition.
# Redis 建议在 Linux 系统中启用 内存过量分配（vm.overcommit_memory = 1），否则在内存紧张时可能执行 RDB/AOF 持久化失败，或者复制/持久化操作异常。
sysctl vm.overcommit_memory=1
# 或者在 /etc/sysctl.conf 中加：
vm.overcommit_memory = 1
```
## cpus 数量
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
## 服务器内存不够
- OOM 代表 Out of Memory（内存耗尽）
  - 当你的程序或容器需要的内存超过了机器或容器可以提供的内存时
  - 操作系统的 OOM Killer（内存溢出杀手）会启动
  - 强行终止某些进程来释放内存，防止系统崩溃
### 1、先限制 Node 堆内存
  ```bash
  # 注意这里看起来“给更少内存”有点反直觉，但在 2GB 机器 上，这样反而常常更稳
  # 因为它避免 Node 把整台机器挤爆，导致被 Linux 直接 OOM kill
  # Node 官方对 2GB 机器给出的示例也是 1536MB
  ENV NODE_OPTIONS="--max-old-space-size=1536"
  ENV NODE_OPTIONS="--max-old-space-size=1024"
  ```
### 2、给服务器加 swap
- Swap 是 Linux 操作系统中的一个虚拟内存机制，用于在物理内存（RAM）不足时，临时将部分数据从内存转移到磁盘上。
- 这样，系统可以通过使用硬盘空间来缓解内存不足的问题，避免系统崩溃。
- 换句话说，Swap 可以用来扩展系统的可用内存。
```bash
# 创建一个 2GB 的 Swap 文件
sudo fallocate -l 2G /swapfile
# 设置文件权限
sudo chmod 600 /swapfile
# 设置 Swap 文件
sudo mkswap /swapfile
# 启用 Swap
sudo swapon /swapfile
# 查看内存使用情况
free -h
```
- 永久启用 Swap：
```bash
# 编辑 /etc/fstab 文件
sudo nano /etc/fstab
# 在文件末尾添加以下一行
/swapfile none swap sw 0 0
```
### 3、安装阶段关闭不必要并发
- 减轻 pnpm install 的瞬时压力
```bash
RUN pnpm install --frozen-lockfile --child-concurrency=1 --registry=https://registry.npmmirror.com
```
### 4、构建机和运行机分离
