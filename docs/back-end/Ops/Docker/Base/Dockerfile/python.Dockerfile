FROM python:3.11-slim AS api-builder
WORKDIR /app

# RUN apt-get update && \
#     apt-get install -y build-essential gcc && \
#     rm -rf /var/lib/apt/lists/*

# RUN yum update -y && \
#     yum groupinstall -y "Development Tools" && \
#     yum install -y gcc && \
#     yum clean all

COPY requirements.txt ./
RUN pip install --upgrade pip -i https://pypi.tuna.tsinghua.edu.cn/simple \
    && pip install --no-cache-dir -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple --timeout 100 
# 如果没加 --no-cache-dir，pip 会在 /root/.cache/pip 里留下很多缓存

RUN pip install uvicorn -i https://pypi.tuna.tsinghua.edu.cn/simple

COPY . ./

FROM python:3.11-slim AS api-runner

WORKDIR /app

COPY --from=api-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=api-builder /app /app
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
