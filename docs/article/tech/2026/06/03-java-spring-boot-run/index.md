---
title: 【Java】本地环境探索：在 Cursor 里跑通 Spring Boot 微服务
date: 2026-06-03
tags:
  - back-end
  - java
  - spring-boot
---

# Java 本地环境探索：在 Cursor 里跑通 Spring Boot 微服务

本文记录一个典型 **Spring Boot + Maven + Nacos** 微服务，从零到本地 **F5 能启动** 的过程。涉及 JDK、私服、配置中心与中间件；若你熟悉 npm / `.env`，文中会用对照表辅助理解。

下文用 **`demo-svc`** 代称该服务（原仓库中的业务基础模块）。

---

## 先建立预期：本地跑起来长什么样

这不是「双击 `main` 就能跑」的单体项目。服务启动前至少要满足三件事：

1. **能编译** —— Maven 从内网私服拉依赖（≈ `npm install`）。
2. **能读到配置** —— 运行时以 **本机 Nacos** 为准（≈ 可读可改的云端 `.env`）。
3. **能连上依赖** —— MySQL、Redis 等在启动阶段就要连通；连不上往往**直接退出**，不像部分前端 dev server 还能先打开页面。

最后落地的是常见的 **「混合本地」**，不是把整套环境都搬到电脑上：

| 组件 | 跑在哪 | 作用 |
|------|--------|------|
| **Nacos** | 本机 `:8848` | 配置中心；**自己**用本机 MySQL 存元数据 |
| **demo-svc** | 本机 `:8082` | 业务服务 |
| **业务 MySQL** | **远端 / 测试库**（Nacos 里那份配置） | 业务数据，本地没搬库 |
| **Redis** | 本机 `:6379` | 缓存、分布式锁（Redisson） |

一句话：

**JDK17 + Maven → 本机 Nacos（连本机 MySQL）→ 导入测试环境 Nacos 配置（业务库仍指向远端）→ 本机 Redis → `local` profile + F5。**

```text
  [Maven 编译]
       ↓
  [本机 Nacos :8848] ←── 本机 MySQL（nacos 库）
       │ 拉取 demo-svc.yml
       ↓
  [Spring Boot :8082] ──→ 本机 Redis
       │
       └──→ 远端业务 MySQL（Nacos 配置里的 datasource）
```

---

## 概念对照：先认仓库

| 常见前端工具链 | 本类 Java 微服务 |
|----------------|------------------|
| `package.json` | `pom.xml`（声明要哪些依赖） |
| `~/.npmrc` / 项目 `.npmrc` | `~/.m2/settings.xml`（从哪下、用什么账号） |
| `npm install` | `mvn clean install` |
| `npm run dev` | `mvn spring-boot:run` 或 Cursor **F5** |
| `.env` / `.env.development` | `application*.yml` + **Nacos 里的 yml** |
| `NODE_ENV` / mode | **profile**（`local`、`loc` 等，见第三步专节） |
| 入口文件 | `Application` 主类（包名以你仓库为准） |

服务端口在 `application.yml` 里常见为 **8082**（以实际配置为准）。

配置加载顺序可以记成：

```text
bootstrap.yml（最先：用哪个 profile、连哪个 Nacos）
    → application.yml（通用）
    → Nacos 拉下来的 demo-svc.yml（local 时）
    → application-{profile}.yml（若还有）
```

在 Cursor 里写 Java，需要安装 **Extension Pack for Java**；想断点调试需要 **`.vscode/launch.json`**（文末会给示例）。

**F5 报 `not a valid java project` 时**（终端 `mvn` 已能 install），多半是 IDE 还没把 Maven 工程导入完，可按顺序试：

1. 安装 **Extension Pack for Java**，重启 Cursor。
2. `Ctrl+Shift+P` → **`Java: Clean Java Language Server Workspace`** → 选重启。
3. **`Java: Import Java Projects`**，等右下角 **Loading / Importing** 结束（首次可能数分钟）。
4. 输出面板选 **Language Support for Java** / **Maven for Java** 看是否在解析 `pom.xml`。
5. 日志里 **Gradle 版本下载失败** 可忽略（Maven 项目不用 Gradle）。
6. 索引 `.m2/repository` 的 **Searching…** 是在建索引，不是重新下载依赖。

`Application` 里注解无红线、`main` 旁出现 Run/Debug 后，再按 F5。

---

## 第一步：先让 `mvn install` 成功

### JDK 17

与团队对齐 **Java 17**。装好后**重启终端和 Cursor**，确认：

```bash
java -version
# 期望：17.x
```

Cursor 里可执行 `Java: Configure Java Runtime`，语言服务与终端保持一致。

**装完仍是 Java 11？** Windows 上系统 Path 里常有 **Oracle `javapath`**，优先级高于你刚设的 `JAVA_HOME`。处理完环境变量后务必 **完全退出 Cursor 和所有终端再开**，并自查：

```bash
java -version
where java        # Windows
echo $JAVA_HOME   # Git Bash
```

`where java` 应指向你安装的 JDK 17 目录，而不是 `Program Files\Common Files\Oracle\Java\javapath`。

### Maven 3.9.9

```bash
mvn -version
# 期望：Apache Maven 3.9.x
```

### `settings.xml` 放在哪

团队提供的模板放在：

```text
C:\Users\<你的用户名>\.m2\settings.xml
```

这是 **整台机器所有 Maven 项目共用** 的用户配置，不是某个微服务仓库里的文件。

#### 和 `.npmrc` 像不像？

**像，而且值得用这个类比记。** 同事给你 `settings.xml`，≈ 给你一份配好的 **私有源 + 登录方式**（用户级 `.npmrc`），clone 仓库之后还要在自己机器上放好，否则装依赖会失败。

| | `~/.m2/settings.xml`（Maven） | `~/.npmrc`（npm） |
|--|-------------------------------|-------------------|
| 管什么 | 从哪个仓库下 jar、用什么账号 | 从哪个 registry 下包、用什么 token |
| 和项目文件关系 | **不替代** `pom.xml`（≈ `package.json`） | **不替代** `package.json` |
| 典型位置 | 用户目录，多项目共用 | `~/.npmrc` 用户级；项目根也常放一份 |
| 私服地址 | `<mirror>` / `<repository>` 的 `<url>` | `registry=https://...` |
| 认证 | `<server>` 的 username/password | `_authToken` 等 |

Maven 这边**多几样** npm 里不常单独配的：`localRepository`（缓存目录）、JDK `profile`、以及 Maven 3.8+ 对 **HTTP 仓库的拦截**。所以不是「改一行 registry 就行」，后面五类都要对一下。

模板往往按**他人电脑**写的，拷到 `%USERPROFILE%\.m2\settings.xml` 后，建议逐项核对下面五类（只改路径/版本/镜像，**账号密码勿提交到公开仓库**）。

#### 1）`localRepository`：依赖缓存放哪

Maven 下载的 jar 不会放在项目里的 `node_modules`，而是进**本地仓库目录**。

模板里常见类似：

```xml
<!-- 他人机器上的路径，你这台往往不存在 -->
<localRepository>D:\Develop\Environment\apache-maven-3.9.9\repository</localRepository>
```

应改成你本机已有（或默认）的目录，例如 Windows：

```xml
<localRepository>C:\Users\<你的用户名>\.m2\repository</localRepository>
```

不写时默认也是 `~/.m2/repository`。  
**为什么要改**：路径错了，Maven 会去空目录重新下一遍，或找不到已经下好的 `com.company.*` 私有包，表现为「明明下过还要再下」甚至路径相关报错。

#### 2）JDK profile：与团队统一 Java 17

模板里常有默认 **JDK 1.8** 的 profile。本机已是 17 时，应改成激活 17，例如：

```xml
<profile>
  <id>jdk17</id>
  <activation>
    <activeByDefault>true</activeByDefault>
    <jdk>17</jdk>
  </activation>
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>
</profile>
```

**作用**：Maven 在部分插件、编译参数上按 JDK 版本做默认行为；与终端里 `java -version` 都是 17 保持一致。

#### 3）`<mirror>` + `<repository>`：把请求指到**你能访问**的地址

`pom.xml` 里声明的仓库 id 和 URL 例如（注意仍可能是 `http://`）：

```xml
<repositories>
  <repository>
    <id>private-group</id>
    <url>http://maven.company.internal/repository/private-group/</url>
  </repository>
  <repository>
    <id>alimaven</id>
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
  </repository>
</repositories>
```

在外网 / 办公 WiFi 下，`http://10.x.x.x:8081` 这类**内网 IP 私服**常常 ping 不通。`settings.xml` 里用 **mirror** 做「劫持」：pom 说要去 A 地址，Maven 实际改去 B 地址。

典型两条（示意，`<id>` 需与后面 `<server>` 对应）：

```xml
<mirror>
  <id>nexus-public</id>
  <url>https://maven.company.internal/repository/private-group/</url>
  <mirrorOf>private</mirrorOf>
</mirror>

<mirror>
  <id>alimaven</id>
  <url>https://maven.aliyun.com/repository/public/</url>
  <mirrorOf>central</mirrorOf>
</mirror>
```

profile 里 `<repository>` 的 `<url>` 也建议写成 **HTTPS** 的同一域名，与 mirror 对齐。  
**不是只改一个域名就结束**：mirror、`repository`、`server` 的 **id 要成对**，否则认证或镜像匹配不上。

```bash
mvn help:effective-settings
mvn help:effective-pom -Dverbose | head -n 80   # 可选
```

#### 4）Maven 3.8+ 的 HTTP 拦截：`<blocked>false</blocked>`

Maven 3.8 起内置 **`maven-default-http-blocker`**，会拦所有 `http://` 远程仓库。未处理时常见报错：

```text
Blocked mirror for repositories ... maven-default-http-blocker (http://0.0.0.0/)
```

在 `settings.xml` 的 `<mirrors>` 里**覆盖**该规则：

```xml
<mirror>
  <id>maven-default-http-blocker</id>
  <mirrorOf>external:http:*</mirrorOf>
  <name>Disable Maven 3.8+ default HTTP blocker</name>
  <url>http://0.0.0.0/</url>
  <blocked>false</blocked>
</mirror>
```

同时把 mirror 的 URL 改成 **https://** 更稳妥。

#### 5）`<server>`：私服账号（id 必须对上）

```xml
<server>
  <id>nexus-public</id>
  <username>你的私服账号</username>
  <password>你的私服密码</password>
</server>
```

缺了会 401/403；id 写错则「配了密码但没用到」。

---

**三层合在一起才等于「能 install」**：

```text
pom 要去拉 com.company:framework-bom ...
  → ① HTTP 拦截是否放行？
  → ② mirror 是否指到你能打开的 HTTPS 私服（而不是内网 IP）？
  → ③ server 是否带了对应 id 的账号？
  → BUILD SUCCESS
```

### 人在公司，Maven 仍拉不动私服？

能连办公 WiFi、能上网，不等于能访问 **Maven 私服所在的网段**。常见情况是：本机 IP 在 **办公网**（如 `10.214.x`），私服或 Nexus 在 **业务/研发网**（如 `10.250.x`），中间路由或防火墙未打通，`ping` 内网 IP 全超时，`mvn` 照样失败。

这和「没连 VPN」类似，但更容易误判为「我已经在公司了」。可改用 **HTTPS 域名镜像**（在 `settings.xml` 里配，见上文 mirror 一节），或用 PowerShell 测端口（比 ping 可靠）：

```powershell
Test-NetConnection maven.company.internal -Port 443
Test-NetConnection 10.x.x.x -Port 8081
```

`TcpTestSucceeded : True` 再执行 `mvn clean install`。Java 版本对了、settings 也放了，若仍卡在下载父 POM，先查 **网络是否进得了私服网段**，而不是反复改代码。

### 编译

在项目根目录：

```bash
cd <你的服务目录>
mvn clean install -DskipTests
```

看到 **BUILD SUCCESS** 才算过关。  
此时很容易误以为「依赖都下来了，服务一定能跑」——后面会证明，**编译通过 ≠ 运行成功**。

---

## 第二步：我走错的「本地」——`loc`

仓库里 `bootstrap.yml` 会配很多套环境。新人最容易踩的坑是：把 **`loc`** 当成「在我电脑上启动」。

`loc` 实际连的是**远端测试环境**那一套，例如（结构示意，地址已泛化）：

```yaml
spring:
  config:
    activate:
      on-profile: loc
  cloud:
    nacos:
      discovery-enabled: true
      config-enabled: false
      server-addr: nacos-dev.internal.example.com:31300
      namespace: app
```

注意 **`config-enabled: false`**：业务配置主要在 Git 的 `application-loc.yml`，里面是测试环境的 MySQL、Redis 等。

按这套启动时：

- 日志里 `UnknownHostException`、JDBC 连不上；
- yml 里主机名显示 **`xxxx`**，填不出真实地址；
- 办公网段与业务网段不通时，连测试库、私服都会失败（见上文「Maven 仍拉不动私服」）。

**关于配置文件里的 `xxxx`**：有时是 **Git 提交前故意脱敏**；有时你在 Cursor 里问 AI，编辑器还会对主机名、密码做 **隐私替换**，你和 AI 看到的都是 `xxxx`，并不是「文件坏了」。这类情况不要死磕改 `application-loc.yml`，应走 **`local` + 本机 Nacos 导入完整配置**。

也曾和同事确认：对方**本地其实也没跑起来**，平时多是 **改代码 → 部署到测试环境再验证**。聊完仍卡在 `loc` 上，但至少明白：**默认这条路和「本机闭环」不是一回事。**

---

## 第三步：对齐真正的「本地」——`local` + 本机 Nacos

后来又问到能本地跑通的同学，说法才对上：

- 在本机起一个 **Nacos**（`standalone`，端口 **8848**）；
- 把测试环境 Nacos 里的 **`demo-svc` 配置导出，再导入本机**；
- 启动时用 **`local` profile**，从本机 Nacos **拉配置**。

`bootstrap.yml` 里早有对应块（节选）：

```yaml
spring:
  config:
    activate:
      on-profile: local
  cloud:
    nacos:
      discovery-enabled: true
      config-enabled: true
      server-addr: localhost:8848
      namespace: app
```

和 `loc` 对比：

| | `loc` | `local`（最终用的） |
|--|--------|------------------------|
| Nacos 地址 | 远程 `…:31300` | `localhost:8848` |
| 业务配置从哪来 | 主要在 `application-loc.yml` | **本机 Nacos** 拉取 |
| `config-enabled` | `false` | `true` |

**不是把 `loc` 修通，而是换了一条 profile。**

### Profile 到底是什么？

**Profile** 就是 Spring Boot 里的 **「环境标签」**：告诉程序「这次按哪一套环境来跑」。名字（`local`、`loc`、`dev`）是团队自己约定的，没有全球统一含义。

| 前端习惯 | Spring |
|----------|--------|
| `NODE_ENV=development` | `spring.profiles.active=local` |
| `.env.development` | `application-loc.yml` 等 `application-{profile}.yml` |
| 按 mode 切换配置 | 按 profile 激活 `bootstrap.yml` 里对应段落 |

**三处常见写法，不要混：**

1. **默认激活谁** —— `bootstrap.yml` 顶部：

```yaml
spring:
  profiles:
    active: local
```

2. **某套环境专用配置** —— 同一文件里用 `---` 分段，并注明只对哪个 profile 生效：

```yaml
spring:
  config:
    activate:
      on-profile: local
  cloud:
    nacos:
      server-addr: localhost:8848
      config-enabled: true
```

只有 `active` 里包含 `local` 时，这一段才会参与合并。

3. **启动时强制指定**（优先级往往更高）—— 调试时在 `launch.json` 里：

```text
-Dspring.profiles.active=local
```

或终端：

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

所以会出现：**文件里写了 `active: local`，但 F5 仍像在用 `loc`** —— 多半是 IDE 启动参数没带上，或带成了别的 profile。看启动日志里的 **`The following profiles are active: local`**（或类似一行）最靠谱。

**和文件名的关系**：`application-loc.yml` 里的 `loc` 是 **文件名后缀**，通常要在 `active` 包含 `loc` 时才会加载；`bootstrap` 里的 `on-profile: loc` 是 **同文件内的环境段**。都叫 `loc`，都是在说「loc 这一套」，只是写法不同。

**本文路线记一句**：`local` → 本机 Nacos `8848` + 从 Nacos 拉 `demo-svc.yml`；`loc` → 远程 Nacos + 主要靠 Git 里的 `application-loc.yml`。换 profile = 换一整套连接与配置来源，不是改同一个 profile 里某一个 IP。

---

## 第四步：动手——本机只搬 Nacos，没有搬业务库

既然配置在 Nacos，就把 Nacos 搬到本机。要分清 **两套配置、两个 MySQL**。

### 4.1 给 Nacos 自己准备 MySQL

1. 本机安装 **MySQL**。
2. 建库并导入 **`nacos.sql`**（给 **Nacos 进程**用，库名一般是 `nacos`）。

   **用 DataGrip（或同类工具）可三步完成**：

   - **连本机 MySQL**：Host `127.0.0.1`，Port `3306`，用户/密码与你本机一致（新建连接时测一下连通）。
   - **建库**：执行 `CREATE DATABASE nacos DEFAULT CHARACTER SET utf8mb4;`（库名须与下面 `application.properties` 里一致）。
   - **跑脚本**：打开下载的 `nacos.sql`，选中 `nacos` 库作为当前库，执行整份脚本；在表列表里能看到 `config_info` 等表即成功。

   命令行等价：`mysql -u root -p nacos < nacos.sql`。

3. 改 Nacos 安装目录 **`conf/application.properties`**，例如：

```properties
spring.datasource.platform=mysql
db.num=1
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user.0=root
db.password.0=<你的本机密码>
```

这是 **Nacos 软件** 的配置，和项目仓库里的 `application-loc.yml` **不是同一个文件**。

4. 启动 Nacos（注意拼写 **standalone**）：

```bash
cd <nacos解压目录>/bin
startup.cmd -m standalone
```

浏览器打开 `http://localhost:8848/nacos`（默认账号见你所用版本说明）。

### 4.2 在 Nacos 里导入业务配置——业务库仍是远端

从测试环境 Nacos **导出**配置，再 **导入**本机。导错一项，服务会连错 Nacos、读不到 yml 或仍用旧地址。导入后对照 **`bootstrap.yml` 里 `local` 段** 核对（你仓库里的 namespace / prefix 以实际为准，不要照抄博客里的示例名）：

| 核对项 | 说明 |
|--------|------|
| **Namespace** | 与 `spring.cloud.nacos.namespace` 一致（常见为业务约定的名字，如 `mom`） |
| **Data ID** | 一般为 `{prefix}.{file-extension}`，例如 `prefix: demo-svc` + `file-extension: yml` → **`demo-svc.yml`** |
| **Group** | 与 `bootstrap` 里一致，常见 **`DEFAULT_GROUP`** |
| **内容** | 从测试环境 **整份导出**再导入，避免只拷几行 |

在控制台 **配置管理 → 配置列表** 里应能看到上述 Data ID；没有则 Spring Boot 起不来或仍用 Git 里的 `loc` 配置。

当前做法里：**数据源（datasource）仍指向远端 / 测试 MySQL**。本地没有复制整套业务库，读写的是**远端库**（需 VPN 或内网可达）。

- **本地搬的是「配置中心」**，不是「数据库服务器」。
- Nacos 在本地，但配置里的 JDBC 仍可以是测试网地址——即 **混合本地**。

改连接、开关 → **本机 Nacos 控制台**；不必再改 Git 里脱敏的 `application-loc.yml`。

### 4.3 本机 Redis——给业务服务用，不是给 Nacos

安装 **Redis**（Windows 常见为系统服务，端口 **6379**）：

```bash
redis-cli ping
# 期望：PONG
```

**Redis 不给 Nacos 用**。它是给 **demo-svc** 用的：缓存、**Redisson 分布式锁** 等，启动时常要连上。

若 Nacos 配置里 Redis 为 `localhost:6379`，与本机安装对齐；若仍是内网地址，在 **Nacos 控制台**改 `spring.data.redis.host`。

可以这样理解：

- **远端 MySQL**：数据仍在测试环境；
- **本机 Redis**：缓存和锁放在本机，少依赖内网 Redis。

### 4.4 谁连谁（收束）

| 组件 | 配置在哪 | 连什么 |
|------|----------|--------|
| Nacos 进程 | `nacos/conf/application.properties` | 本机 MySQL，`nacos` 库 |
| demo-svc | 本机 Nacos 里的 yml | **远端**业务 MySQL + **本机** Redis |
| `application-loc.yml` | Git | `loc` 路线；**local 路线可不再改** |

---

## 第五步：F5 启动——`launch.json` 必须带上 `local`

`bootstrap.yml` 里写 `active: local` **有时仍不够**。调试时 **`launch.json` 的 `vmArgs`** 要带：

```text
-Dspring.profiles.active=local
```

示例（主类、项目名按你仓库修改）：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "Demo Service (local + Nacos)",
      "request": "launch",
      "mainClass": "com.example.demo.Application",
      "projectName": "demo-svc",
      "vmArgs": "-Dspring.profiles.active=local -Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8"
    }
  ]
}
```

其中 **`-Dfile.encoding=UTF-8`** 与 **`-Dsun.jnu.encoding=UTF-8`** 主要解决 **Windows 控制台与日志中文乱码**（JVM 默认编码与项目 UTF-8 不一致时）。与 profile 无关，但本地调试建议保留。

曾遇到：**Nacos 里业务配置不用动，只改 IDE 启动参数** 才正常。

确认 F5 走对：日志里 profile 为 **`local`**，连 **`localhost:8848`** 而非远程 `31300`。

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

**不要**用 `javac Application.java && java Application` 启动 Spring Boot。

### `mvn` 和 `java` 启动，本质区别是什么？

本质只有一件事：**谁负责把「主类 + 全部依赖 jar + JVM 参数 + Spring 配置」拼成一条能启动进程的命令」**。

JVM 真正执行的永远是类似：

```text
java [JVM 参数] -cp <classpath> 主类名 [程序参数]
```

或（依赖已打进包时）：

```text
java [JVM 参数] -jar 可执行.jar
```

**classpath** = 你的 `.class` + 所有依赖 jar。Spring Boot 微服务常有几百个 jar，手工拼 classpath 不现实。  
所以不是「mvn 和 java 两套运行时」，而是：**裸 `java` 要你自备 classpath；`mvn` / IDE 是启动器，在后台替你算好 classpath 再调 `java`**。

| 方式 | 本质角色 |
|------|----------|
| `javac A.java && java A` | classpath 几乎只有当前目录，**没有** `pom.xml` 里的依赖 → 对 Spring Boot **行不通** |
| `mvn spring-boot:run` | Maven 读 `pom.xml` → 编译 → 插件拼 classpath 和 JVM 参数 → **替你执行** `java ...` |
| `mvn package` 后 `java -jar target/*.jar` | 构建时把依赖封进 jar，运行时 classpath **已在包里** |
| Cursor **F5** | IDE 根据已导入的 Maven 工程算 classpath → **替你执行** `java ...`（可挂调试器） |

和 npm 对照：`node index.js` 像裸 `java`；`mvn spring-boot:run` / F5 像 **`npm run dev`**（脚本帮你设环境、依赖、再启动），不是同一层级。

**和本项目的分工**：

- `mvn install`：解决依赖有没有、能否编译——**还没**长期占用进程。
- `mvn spring-boot:run` / F5：在 classpath 就绪后，带上 `local` 等参数起服务——还要 Nacos、Redis、库可达。
- 换启动方式（mvn 或 F5）**解决不了** profile 错、连不上库；只解决 **谁帮你调用 JVM**。
- 若终端里 `mvn` 能跑、F5 报 `not a valid java project`：往往是 **同一条 classpath 链路，Maven 已通，IDE 还没导入完工程**。

日常习惯：**断点调试用 F5**；IDE 未就绪或快速起一次可用 **`mvn spring-boot:run`**。

---

## 怎样算成功

- 启动日志有 **启动完成** 类字样；
- `http://localhost:8082/actuator/health` 返回 UP；
- 本机 Nacos 服务列表有注册（若开了 discovery）。

日常：**改代码 → F5**；改环境参数 → **本机 Nacos**；改 Nacos 自身库 → **Nacos 的 application.properties**。

注意：可能操作的是**测试库真实数据**，需遵守内网规范。

---

## 踩坑速查

| 现象 | 常见原因 | 处理 |
|------|----------|------|
| `mvn` 依赖下载失败 | 私服不可达 / 无 settings | VPN 或 HTTPS 镜像 + `settings.xml` |
| `Blocked mirror` / HTTP | Maven 3.8+ 默认策略 | settings 放行 + HTTPS |
| `UnknownHost` / JDBC 失败 | 还在 `loc` 或脱敏地址 | `local` + 本机 Nacos 配置 |
| Nacos 起不来 | 未改 Nacos 自身数据源 | `application.properties` + `nacos.sql` |
| 业务 Redis 连不上 | 未装 Redis 或 Nacos 里仍是远程 host | 本机 Redis + Nacos 改 redis 段 |
| 业务 MySQL 连不上 | 远端库不可达 | VPN/内网 |
| F5 仍连远程 Nacos | 只改了 bootstrap | `launch.json` 加 `spring.profiles.active=local` |
| Nacos 显示 cluster | 启动参数拼写 | `standalone` |
| `java -version` 仍是 11 | 系统 `javapath` 优先 | 改 `JAVA_HOME`/Path，重启终端，`where java` 自查 |
| F5：`not a valid java project` | Maven 工程未导入 | 装 Java 扩展、Clean Workspace、等 Import 完成 |
| Nacos 已起但服务读不到配置 | Data ID / Namespace / Group 不一致 | 对照 `bootstrap` 的 `prefix`、namespace 导入 |
| 私服 IP ping 不通但在公司 | 办公网 ≠ 业务网 | HTTPS 镜像或 VPN/路由 |

---

## 附录

### 五处配置别混（总表）

改错文件等于白忙活。本地 `local` 路线下可记这张表：

| 位置 | 谁读 | 典型改什么 |
|------|------|------------|
| **`pom.xml`**（项目仓库） | Maven 编译 | 依赖、插件；一般不写私服密码 |
| **`~/.m2/settings.xml`** | Maven 全机 | 私服镜像、HTTP 放行、账号、`localRepository` |
| **`bootstrap.yml`**（项目仓库） | Spring 启动早期 | **profile**、连哪个 Nacos、`prefix` / namespace |
| **`nacos/conf/application.properties`** | **Nacos 进程** | Nacos 自己的 MySQL（`nacos` 库） |
| **Nacos 控制台里的业务 yml** | **Spring 运行时**（`config-enabled: true`） | 数据源、Redis、Mongo/Kafka 等业务地址 |

`application-loc.yml` 在 Git 里主要服务 **`loc`** 路线；**`local` + 本机 Nacos` 成功后，业务参数以 Nacos 控制台为准。**

### jar 和 npm 包

jar ≈ Maven 依赖；`mvn install` 下载到 `~/.m2/repository`（全机共享）。

### `settings.xml` 和 `.npmrc`

用户级 **`settings.xml` ≈ `~/.npmrc`**；**`pom.xml` ≈ `package.json`**。拷贝 `settings.xml` 后要改的五项，见上文 **「第一步 → `settings.xml` 放在哪」** 中的 1）`localRepository`、2）JDK profile、3）mirror/repository、4）HTTP 拦截、5）`<server>` 账号。

### 为什么 Java 服务启动更「严格」

启动时就要建数据源、Redis 客户端等，连不上往往**整个进程退出**。

### Profile 是什么（附录索引）

见上文 **「第三步 → Profile 到底是什么？」**。

### `mvn` 与 `java`（附录索引）

见上文 **「第五步 → mvn 和 java 启动，本质区别是什么？」**。

### 命令清单

```bash
java -version
mvn -version
mvn clean install -DskipTests
mvn spring-boot:run -Dspring-boot.run.profiles=local
cd <nacos>/bin && startup.cmd -m standalone
redis-cli ping
curl http://localhost:8082/actuator/health
```

---

## 写在最后

本质是：**配置入口和部分中间件在本地（Nacos + Redis），业务数据仍用测试库（远端）**。很多 Java 微服务团队都允许这种 dev 形态。

若 `loc` 反复起不来，先分清：是要连**远端测试网**，还是要走 **`local` + 本机 Nacos**。对齐之后，才能把编译成功和运行成功接在一起。
