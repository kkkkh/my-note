# ssh
## ssh 基础
### 命令行 
```bash
# 查看版本
ssh -V
# 生成ssh-key（生成对应多个）
# 当出现提示：
# Enter passphrase (empty for no passphrase):
# 直接 按回车，不输入任何内容（两次回车）。
# 这样生成的密钥将没有密码保护。
ssh-keygen -t rsa -b 2048 -C "email@example.com" -f ~/.ssh/gitlab/id_rsa
# ssh-add
# 1、这个命令不是用来永久性的记住你所使用的私钥的
# 2、实际上，它的作用只是把你指定的私钥添加到ssh-agent 所管理的一个 session 当中（ssh-agent 的高速缓存中）
ssh-add ~/.ssh/gitlab/id_rsa # 添加
ssh-add -d ~/.ssh/id_xxx.pub # 删除
ssh-add -l # 查看ssh-agent中的密钥
# ssh-agent是一个用于存储私钥的临时性的 session 服务
ps -e | grep ssh-agent # 检查 SSH Agent 是否已启动
#无密码登录
ssh-copy-id -i ~/.ssh/id_rsa.pub 用户名字@192.168.x.xxx #公钥复制到远程
# 登录
ssh -p 22 zhanghaotian@10.10.200.35
# 测试 
ssh -T git@github.com #测试 SSH 连接是否正常
```
### ~/.ssh
```bash
# 进入ssh
cd ~/.ssh //当前路径
# 公钥不同的路径
~/.ssh/id_rsa.pub
~/root/.ssh/id_rsa.pub
```
### config
```bash
# touch ~/.ssh/config
# config文件管理多个ssh-key
Host github.com
HostName github.com
User git
UseKeychain yes #允许 SSH agent 使用 Keychain 存储你的 SSH 密钥密码。
AddKeysToAgent yes #自动将密钥添加到 SSH agent。
IdentityFile ~/.ssh/id_rsa_github #指定你的私钥文件路径。
```

### known_hosts
- known_hosts 文件是 SSH 协议中一个重要的安全机制，用于验证远程主机的身份，防止中间人攻击，并确保你正在连接到你信任的服务器
- 第一次 clone 会将 host 添置到 known_hosts 文件

## 实际问题
### 修改 服务器 ssh 登录端口
```ini
# vim /etc/ssh/sshd_config
Port 33
systemctl restart sshd
```
### REMOTE HOST IDENTIFICATION HAS CHANGED

- 第一次使用 SSH 连接时，会生成一个认证，储存在客户端的 known_hosts 中
- 由于服务器重新安装系统了，所以会出现以上错误
- 解决办法：ssh-keygen -R 服务器端的 ip 地址

### Permission denied (publickey). fatal: Could not read from remote repository.
- 需要把专用密钥添加到 ssh-agent 的高速缓存中
- 注意：执行路径（/usr/bin/ssh-add 、home/）
```bash
# 临时添加
ssh-add ~/.ssh/id_rsa
eval `ssh-agent`
ssh-add -l
```

### mac os 每次开机hou，git push 都没有权限
提示：
Load key "/Users/usename/.ssh/id_rsa": Permission denied
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.

解决思路1：Keychain Access
```bash
# ~/.ssh/config 要配置 
AddKeysToAgent yes
# Keychain Access（钥匙串访问）访问权限问题: Keychain Access中没有搜索到id_rsa
ssh-add -K ~/.ssh/id_rsa_github #就找到了
```

解决思路2：使用 launchd 配置 SSH Agent 自动启动
launchd 是 macOS 的系统级服务管理框架，可以用来配置 SSH agent 在开机时自动启动。
```bash
touch ~/Library/LaunchAgents/com.openssh.ssh-agent.plist # 内容为下边xml
vim ~/Library/LaunchAgents/com.openssh.ssh-agent.plist
mkdir -p /tmp/ssh-username
launchctl load ~/Library/LaunchAgents/com.openssh.ssh-agent.plist
export SSH_AUTH_SOCK=/tmp/ssh-username/agent.sock #在 ~/.bash_profile 或 ~/.zshrc 中添加
source ~/.bash_profile
source ~/.zshrc
```
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.openssh.ssh-agent</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/ssh-agent</string>
        <string>-l</string>
    </array>
    <key>Sockets</key>
    <dict>
        <key>SSH_AUTH_SOCK</key>
        <dict>
            <key>Path</key>
            <string>/tmp/ssh-username/agent.sock</string>
            <key>SockFamily</key>
            <string>Unix</string>
            <key>SockProtocol</key>
            <string>Stream</string>
        </dict>
    </dict>
    <key>EnvironmentVariables</key>
    <dict>
        <key>SSH_AUTH_SOCK</key>
        <string>/tmp/ssh-username/agent.sock</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```
