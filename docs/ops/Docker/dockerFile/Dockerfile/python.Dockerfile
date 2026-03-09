FROM python:3.11-slim AS api-builder
WORKDIR /app

#需要编译 C 扩展的包（如 numpy、pandas、cryptography 等）：
# builder 阶段安装 build tools

# RUN apt-get update && \
#     apt-get install -y build-essential gcc && \
#     rm -rf /var/lib/apt/lists/*

# RUN yum update -y && \
#     yum groupinstall -y "Development Tools" && \
#     yum install -y gcc && \
#     yum clean all

COPY requirements.txt ./
# 如果没加 --no-cache-dir，pip 会在 /root/.cache/pip 里留下很多缓存
# --no-cache-dir 会 禁止 pip 在容器中缓存下载的 wheel / tar.gz，减少层大小
# 如果去掉 --no-cache-dir，pip 会把下载的包放到 /root/.cache/pip 中，这样 Docker 层缓存可以复用，
# 如果 requirements.txt 没变，下次构建该层会命中缓存，不会重新下载。
RUN pip install --upgrade pip -i https://pypi.tuna.tsinghua.edu.cn/simple \
    && pip install --no-cache-dir -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple --timeout 100 


RUN pip install uvicorn -i https://pypi.tuna.tsinghua.edu.cn/simple

COPY . ./

FROM python:3.11-slim AS api-runner

WORKDIR /app
# 就把 builder 阶段已经安装好的依赖，拷贝到 runner 镜像里
COPY --from=api-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=api-builder /app /app
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
