---
outline: deep
---
# python

## 文档
- [python 3.13 文档](https://docs.python.org/zh-cn/3.13/reference/index.html)
## 镜像源
- https://pypi.tuna.tsinghua.edu.cn/simple
```bash
RUN pip install --upgrade pip -i https://pypi.tuna.tsinghua.edu.cn/simple
pip install --no-cache-dir -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple --timeout 100
# 永久设置
RUN mkdir -p ~/.pip
echo "[global]\nindex-url=https://pypi.tuna.tsinghua.edu.cn/simple\ntrusted-host=pypi.tuna.tsinghua.edu.cn" > ~/.pip/pip.conf
```

## 其他资源
- [最近迫切应学的编程语言 python](https://www.jianshu.com/p/08ca8573e681)
- [tinygrad](https://github.com/tinygrad/tinygrad) 深度学习框架


