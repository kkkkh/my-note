---
outline: deep
---
# python
## 文档
- [python 3.13 文档](https://docs.python.org/zh-cn/3.13/reference/index.html)
- [pypi 仓库地址](https://pypi.org/)
## 常见问题
### Microsoft Store Python
- 问题：
  - Python 是从 Microsoft Store 安装的
  - `C:\Users\user_name\AppData\Local\Microsoft\WindowsApps`
  - python.exe 只是一个 快捷方式，指向 Store 的 Python 运行环境。
  - 它不会像普通 Python 那样自动创建 Scripts 文件夹。
  - 包管理和可执行工具（如 pipreqs、poetry、pip-tools）可能无法正常使用。
  - 所以直接 pipreqs 报找不到，python -m pipreqs 报错，也是正常的。
- 解决：
  - [python 官网下载](https://www.python.org/downloads/windows/)
  - 安装时勾选：“Add Python to PATH” “Install launcher for all users”
  - `C:\Users\user_name\AppData\Local\Programs\Python\Python311\python.exe`
  - 设置环境变量，并删除Microsoft Store path配置 `C:\Users\<用户名>\AppData\Local\Microsoft\WindowsApps`
    ```bash
    C:\Users\<用户名>\AppData\Local\Programs\Python\Python311\
    C:\Users\<用户名>\AppData\Local\Programs\Python\Python311\Scripts\
    ```
## 资源
### 镜像源
- https://pypi.tuna.tsinghua.edu.cn/simple
```bash
RUN pip install --upgrade pip -i https://pypi.tuna.tsinghua.edu.cn/simple
pip install --no-cache-dir -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple --timeout 100
# 永久设置
RUN mkdir -p ~/.pip
echo "[global]\nindex-url=https://pypi.tuna.tsinghua.edu.cn/simple\ntrusted-host=pypi.tuna.tsinghua.edu.cn" > ~/.pip/pip.conf
```
### 词典
- 免费资源
  - 网上确实有很多免费可用的英汉词典文件
  - .dict, .ifo, .idx for StarDict
  - .mdx for MDict
  - 这些是 词典数据文件
  - [stardict-4](https://sourceforge.net/projects/stardict-4/)
  - [字典资源](http://download.huzheng.org/dict.org/)
    - stardict-langdao-ce-2.4.2.tar.bz2   （朗道英汉词典）
    - stardict-oxford-gb-2.4.2.tar.bz2    （牛津）
    - stardict-cdict-en-zh-2.4.2.tar.bz2  （英汉）
- 翻译
  - [百度翻译 开发者中心](https://fanyi-api.baidu.com/manage/developer) 获取密钥和APP ID
  - [通用文本翻译API-接入文档](https://api.fanyi.baidu.com/doc/21)
### 音视频
- 动画
  - [toonboom](https://www.toonboom.com/products/harmony)
## 其他资源
- [最近迫切应学的编程语言 python](https://www.jianshu.com/p/08ca8573e681)
- [tinygrad](https://github.com/tinygrad/tinygrad) 深度学习框架


