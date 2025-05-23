
# Java
## jdk
- [最新安装地址](https://www.oracle.com/java/technologies/downloads/)
- [历史版本](https://www.oracle.com/java/technologies/downloads/archive/)
- [adoptium 安装](https://adoptium.net/zh-CN/temurin/releases/)
- 配置环境变量
```bash
export JAVA_HOME=/c/Program\ Files/Java/jdk-11
export PATH=$PATH:$JAVA_HOME/bin
```
## 命令行
```bash
# Java 编译器，用于将 .java 源代码文件编译成 Java 字节码 .class 文件。
# 把人类可读的 Java 源代码翻译成 JVM 能够执行的字节码。
javac -version
# Java 运行时命令，用于运行已经编译好的 Java 字节码程序。
# 启动 Java 虚拟机（JVM），加载 .class 文件中的字节码，并执行程序
java -version
```
```bash
where java 
# C:\Program Files\Common Files\Oracle\Java\javapath\java.exe
# 这个路径是一个 “代理路径”，它是 Oracle 安装 Java 时放置的一个“快捷路径”或者“符号链接”，Windows 系统用它来指向你实际安装的 Java 运行时（JRE 或 JDK）的位置。
# export JAVA_HOME=/c/Program\ Files/Java/jdk-11是实际的安装路径
```

## jsp
- 当 JSP 项目包含 .java 源文件时，需要编译并与 JSP 文件一起打包成 .war 包，再部署到 Tomcat 里就可以提供服务了。
- Java 的技术生态是极为丰富的，可以借助第三方开源库（或闭源库）实现很多功能。JSP 项目中也常会引入很多这样的依赖。在最早期，这些依赖是通过拷贝 .jar包到项目中引入的。
- 当依赖项增多，依赖关系变得复杂后，Java 引入了 Maven 工具。Maven 其中一项职能就是定义、管理依赖。
- 在项目构建时，Maven 会从中心仓库里下载预编译好的 log4j 作为项目依赖。JS 项目的 package.json 有类似的作用
