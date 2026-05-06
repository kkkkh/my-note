---
title: 后端开发思路
date: 2026-04-29
tags:
  - back-end
---
# 后端开发思路
## 1、思维转变
- 前端写页面
  - 组织ui
  - 组件复用
  - 状态管理
  - 交互逻辑
- 后端写接口和维护数据库和业务逻辑
  - 请求如何进入
  - 参数如何校验
  - 业务规则放在哪里
  - 依赖如何管理
  - 数据如何访问和操作
  - 异常如何处理

> 不能按照前端你的思维去套用后端的开发，否则职责不分，耦合异常，无法持续开发和维护
> 前端是“由界面驱动”，后端是“由业务用例驱动”

- 主要矛盾
  - 前端：组件 + 状态 + UI 复用
  - 后端：业务用例 + 数据流转 + 系统边界 + 长期维护

## 2、nodejs crud 问题
- 我们写一个nodejs crud服务后端，接请求、取参数、查数据库、返回结果，这只能说明接口能跑
- 企业级后端：代码如何分层，团队如何协作、业务逻辑如何组织、参数如何统一验证、异常如何统一处理、依赖如何组织、数据访问如何隔离
- 保证复杂业务下，代码不失控

## 3、后端基础分层

| 层            | 作用                           |
| ------------ | ---------------------------- |
| Controller   | 接收 HTTP 请求，调用 Service，不写复杂业务 |
| DTO / Schema | 定义接口入参、出参、校验规则               |
| Service      | 编排业务流程，承载业务规则                |
| Repository/models   | 封装数据访问                       |
| ORM / SQL    | 具体操作数据库                      |
| Database     | 实际数据存储                       |


| 库                   | 作用                            |
| ------------------- | ----------------------------- |
| routing-controllers | 路由、Controller、参数绑定            |
| class-transformer   | plain object 转 class instance |
| class-validator     | DTO 校验                        |
| typedi              | 依赖注入 / IoC 容器                 |
| reflect-metadata    | 装饰器元数据反射底座                    |

### 如何理解装饰器

```js
function Controller(prefix: string) {
  return function (target: Function) {
    Reflect.defineMetadata('prefix', prefix, target)
  }
}

@Controller('/users') // 本质上是一个函数调用。它把 /users 这个信息挂到了 UserController 上。
class UserController {}

// 等价于

class UserController {}

Controller('/users')(UserController)
```

> 用一种声明式写法，把框架需要的信息标记到类、方法、属性、参数上。

### DI 解决对象依赖装配问题
```js
// 没有依赖注入，依赖多了以后会非常混乱。
const repo = new UserRepo()
const service = new UserService(repo)
const controller = new UserController(service)

@Service()
class UserService {
  constructor(private userRepo: UserRepo) {}
}
```

### ORM
- 库列表
  - TypeORM
  - Sequelize
  - Mongoose
  - Prisma
  - MikroORM
  - Drizzle
- ORM 优点和缺点
  - 优点
    - 对象与表的映射
    - CRUD 简化
    - 类型提示
    - 迁移辅助
    - 减少手写 SQL
    - 团队统一写法
  - 缺点
    - SQL 不透明
    - 复杂查询绕
    - 性能不可控
    - 抽象层开销
    - 调优不直接

> ORM 解决的是维护性，不只是性能问题

## 4、Nest / nodejs 迷你 Nest 栈

| 能力 | 迷你 Nest 栈 | Nest |
| --- | --- | --- |
| 路由 | routing-controllers | Controller |
| 参数校验 | class-validator | Pipe / ValidationPipe |
| 对象转换 | class-transformer | Pipe / class-transformer |
| 依赖注入 | typedi | Provider / Nest IoC |
| 元数据反射 | reflect-metadata | reflect-metadata + 框架封装 |
| 数据访问 | ORM / SQL | ORM / SQL，不强绑定 |

> 迷你栈能搭出 Controller + DTO + Service + Repository；Nest 多的是完整工程体系和请求生命周期控制。

### Nest 多出的关键模块

| 模块 | 功能要点 | 解决问题 |
| --- | --- | --- |
| Module | 按业务组织 Controller / Provider | 大项目边界和依赖管理 |
| Provider | Service、Repo、Client 等统一托管 | 对象创建、依赖装配、生命周期 |
| Pipe | 参数转换、校验、标准化 | 入参不可信、DTO 校验分散 |
| Guard | 鉴权、权限、角色判断 | 请求能不能进入业务 |
| Interceptor | 日志、响应包装、耗时统计、缓存 | 请求前后通用逻辑复用 |
| Exception Filter | 统一异常捕获和响应格式 | 错误处理不分散 |
| Middleware | 请求进入路由前处理 | 日志、CORS、原始请求处理 |
| ConfigModule | 环境变量和配置管理 | 多环境配置混乱 |
| TestingModule | 模块化测试容器 | Service / Controller 更好测 |
| Lifecycle Hook | 启动、销毁、模块初始化钩子 | 连接池、任务、资源释放 |

### FastAPI / nodejs 迷你 Nest 栈

| FastAPI 栈           | TypeScript 迷你 Nest 栈                | 作用              |
| ------------------- | ----------------------------------- | --------------- |
| FastAPI / APIRouter | routing-controllers                 | 路由 / Controller |
| Pydantic            | class-transformer + class-validator | 转换 + 校验         |
| Depends             | typedi / Nest DI                    | 依赖注入            |
| Python 类型注解         | reflect-metadata                    | 运行时读取类型信息       |
| SQLAlchemy          | Prisma / TypeORM / Drizzle / 手写 SQL | ORM / 数据访问      |

- FastAPI 不强制 service 层，service 更多是工程约定。
- Nest 对 controller/service/module 的框架引导更强。

## 5、electron 本地数据库架构

> better-sqlite3 + WAL + Worker Thread + 手写 SQL 是一种偏硬核的本地数据库架构。

- 适用场景
  - Electron 桌面应用
  - 本地 SQLite 数据库
  - 高频本地读写
  - 不能阻塞主进程 / UI
  - 需要精细控制性能
  - 数据模型不特别复杂

- WAL
  - 解决
    - 读不阻塞写  
    - 写不阻塞读
    - 提升 SQLite 读写并发体验
  - 但 WAL 不解决：
    - 多个写线程真正并行写
    - 服务端高并发多写
    - 多实例分布式访问
  - 适用：多读、少写
  - 写
    - 单写 Worker
    - 写队列
    - 批量事务
    - 避免多个写线程硬抢锁

- better-sqlite3 + Worker
  - better-sqlite3 是同步 API：
  - 直接在 Electron 主进程执行慢 SQL 会阻塞事件循环
  - 所以用 Worker Thread：不阻塞 Electron 主进程不影响 UI

## 6、sqlite、postgresql 对比

-  PostgreSQL 更适合复杂服务端场景
-  请求密集、并发高、多用户同时写、数据量持续增长、复杂事务、多实例部署、连接池需求

## 7、AJV、微服务、BFF、网关

### AJV
- AJV
  - 不是后端框架，是 JSON Schema 校验引擎
  - Fastify 默认集成 AJV，适合 Schema first / OpenAPI / 接口契约

| 方向 | NestJS | Fastify + AJV |
| --- | --- | --- |
| 定位 | 企业级应用框架 | 高性能 HTTP 框架 |
| 特点 | 模块、DI、Controller、Service 规范强 | 轻量、快、Schema 标准化 |
| 适合 | 复杂业务系统、后台、团队协作 | API 服务、微服务、BFF、网关 |
| 风险 | 框架较重、抽象层多 | 工程规范需要自己约束 |

> NestJS 更主流，更利于复杂业务维护；Fastify 更轻，更适合高并发、轻逻辑、强契约接口。

### 服务形态

| 名称 | 核心职责 |
| --- | --- |
| 高性能 API 服务 | 对外/对内提供高并发、低延迟接口 |
| 微服务 | 按业务能力拆分，独立开发、部署、扩容 |
| BFF | Backend For Frontend，面向某个前端聚合和裁剪数据 |
| 网关 | 系统入口，做路由、鉴权、限流、日志、灰度 |

```text
Client
  -> Gateway
    -> NestJS user/order/admin service
    -> Fastify search/feed/bff service
```

- 一个产品可以同时有多个服务、多个框架
- NestJS 写主业务，Fastify 写高并发服务，是现实中常见形态
- 但不是接口慢就直接换 Fastify
  - 慢在数据库 / 外部接口 / 缓存缺失：换框架意义不大
  - 慢在框架层 / 校验序列化 / 请求处理，且 QPS 高：Fastify 才有价值
  - 模块职责独立、访问量大、需要单独扩容：适合拆成独立服务

### 网关暴露方式

- 小项目
  - Nginx 反向代理即可
- 企业项目
  - CDN / WAF / 负载均衡 / API Gateway / K8s Ingress / Service Mesh
- Kubernetes 中
  - 常通过 Ingress、Gateway API、Helm values 或平台控制台配置路由
  - 底层可能仍然是 Nginx Ingress Controller、Traefik、Envoy

> Nginx 更偏反向代理，API Gateway 更偏 API 治理；核心都是把不同路径、域名、版本的请求转发到不同服务。
