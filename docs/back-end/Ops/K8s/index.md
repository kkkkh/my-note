
# K8s

## Kubernetes
- Kubernetes 是一个容器编排平台，核心目标是：
  - 自动调度容器到合适的节点；
  - 提供高可用（当某个容器挂掉时自动重启）；
  - 支持水平扩缩容；
  - 管理跨节点的网络、存储、配置等。
- Kubernetes 管理的不一定是 Docker 容器，
- 它可以管理 任何符合 OCI 容器标准的容器运行时（如 containerd、CRI-O）
