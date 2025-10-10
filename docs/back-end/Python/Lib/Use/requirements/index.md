## requirements 相关
### pip freeze 生成 requirements.txt
```bash
pip freeze > requirements.txt
```
### pipreqs 配合 pip-tools 生成 requirements.txt
1、pipreqs 生成 requirements.in
- 扫描项目代码的 import 语句
- 自动生成依赖列表，不锁定版本
- 生成的文件类似 requirements.in 的顶级依赖列表
```bash
# --ignore 排除虚拟环境或测试目录；
# --force 覆盖已有文件；
# --savepath 指定保存路径。
pipreqs . --force --savepath requirements.in
pipreqs . --force --ignore venv,test,__pycache__ --savepath requirements.in
```
2、pip-tools 的特点：
- 接收顶级依赖列表（requirements.in）
- 自动解析所有子依赖
- 生成锁定版本的 requirements.txt
```bash
pip-compile requirements.in
```
