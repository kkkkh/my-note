# App
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
