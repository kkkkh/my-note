# Fastify
## @fastify/mongodb
- 是 Fastify 框架的一个插件，用来连接 MongoDB，并提供数据库的操作接口。
- 它本质上是一个数据库驱动工具，类似于 MongoDB 的官方驱动
- 它并不算一个传统意义上的 ORM，因为 ORM（如 Sequelize、Mongoose 等）通常是用来
- 在关系型数据库中实现对象与数据库表之间的映射
## ajv
- 是一个用于验证 JavaScript 对象的工具，基于 JSON Schema 进行数据校验
- 它的作用是确保传入的数据符合某个预定义的格式、类型或结构。
## ORM
- ORM
  - 它通过将对象（通常是类实例）与数据库表进行映射，简化了数据库操作的过程。
  - ORM 主要用于处理关系型数据的模式，能够自动将对象的属性和表的字段进行一一映射，从而实现对象与数据库之间的相互转换。
- NoSQL
  - NoSQL 数据库通常不需要传统意义上的 ORM
  - 没有表的概念：
    - NoSQL 数据库如 MongoDB 使用集合（Collection）而不是表。
    - 每个文档是一个 JSON 对象，数据结构较为灵活，通常没有固定的模式（Schema）。
  - 没有外键和关系：
    - 关系型数据库的 ORM 需要处理表之间的关系（如一对多、多对多等），
    - 而 NoSQL 数据库则更强调数据的独立性和灵活性，通常不涉及复杂的关系管理。
  - 尽管没有传统的 ORM，NoSQL 数据库中仍然有类似的工具，这些工具帮助开发者以对象的方式进行数据建模，
  - 但它们的实现方式与关系型数据库的 ORM 不完全相同。
## Mongoose
- Mongoose (MongoDB)：
  - 虽然 MongoDB 是 NoSQL 数据库，
  - Mongoose 提供了一种面向对象的数据建模方式，使得开发者能够定义“模型”和“文档”之间的映射，并且通过对象的方式与数据库交互。
  - Mongoose 类似于 ORM，但它并不处理Mongoose关系（因为 MongoDB 本身不强调关系），而是更多地帮助开发者规范数据结构和操作。
## Schema
- 是数据的结构化描述，通常包括字段的类型、关系、约束和验证规则
- 在 ORM（如 Mongoose、Sequelize、TypeORM 等）中，Schema 是定义数据模型的地方
- AJV 是一个用于 JSON 数据验证的库，它也使用 Schema 来描述数据的结构和验证规则
- 在关系型数据库（如 MySQL、PostgreSQL 等）中，Schema 通常指的是数据库中的表结构，包括表名、字段名称、字段类型、约束（如主键、外键、唯一性等）
## 开发实践
### @fastify/mongodb 对比 Mongoose
- @fastify/mongodb
  - 手动编写查询语句
  - 无数据模型，字段和值通过代码手动管理
  - 需要手动处理数据验证和类型转换
- Mongoose
  - 使用 Mongoose 模型，简化数据库操作与查询
  - 使用 Schema 定义模型，自动验证数据结构
  - Mongoose 自动处理数据验证、类型转换等（自带内建验证机制）
  - Mongoose 提供更强的查询、聚合和关联操作功能
  - 提供丰富的功能，例如中间件、钩子、虚拟字段等
- 关联查询：
  - @fastify/mongodb 不提供内建的关联查询功能，你需要手动进行多次查询或使用聚合管道进行关联操作。这意味着，使用 @fastify/mongodb 可能会让代码变得更加冗长和复杂，尤其是涉及多个集合（表）之间的查询时。
  - Mongoose 支持 关联查询（如 populate()）来处理 MongoDB 中的引用（ObjectId）。你可以通过 Mongoose 快速实现关联查询和嵌套文档操作。
### mongoose 在@fastify/mongodb基础上连接数据库

<<< ./mongoose.js{11}

- db.s.url 是 Fastify 插件 @fastify/mongodb 提供的 MongoDB 客户端实例
- （通常是 fastify.mongo.client）中的 url 属性，它存储了 MongoDB 连接字符串（与第一种方式中的 URI 是一样的）。
- 因为 db.s.url 本质上是连接 MongoDB 的 URI，因此 mongoose.connect(db.s.url, {...}) 是在使用相同的连接字符串进行连接。
- 它们是通过相同的 MongoDB URI 创建连接，且在 Mongoose 中，如果在同一实例中调用 mongoose.connect() 多次，它会自动管理连接并且只会创建一个连接。

### migrate-mongo
- 官方推荐，MongoDB迁移工具，使用 JS 文件定义升级/降级脚本
