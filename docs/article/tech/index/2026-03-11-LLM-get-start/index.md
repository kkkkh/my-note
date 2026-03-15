---
title: LLM 应用开发入门
date: 2026-03-11
tags:
  - AI
  - LLM
---
# LLM 应用开发入门
## 1、基础概念
- 人工智能 -> 机器学习（算法，自己学习） -> 深度学习（人工神经网络）
### NLP
- NLP 自然语言处理(natural language processing，NLP)
- 是AI的一个子领域，专注于使计算机能够处理、解释和生成人类语言
- 现代 NLP 解决方案的基础是 ML 算法。
- NLP 的目标是让计算机能够处理自然语言文本。
- GPT 模型是 NLP 领域最新的模型类型

### GPT
- GPT 模型的基础是一种特定的神经网络架构，即 Transformer

- 处理文本
- 处理图像 ：LLM 采用的ViT（Vision Transformer，视觉 Transformer）这一专用架构

### Transformer
- N-gram基于前面的词预测下一词，上下文理解有限
- 早期RNN（循环网络神经）、LSTM（长短时记忆网络）处理较长文本时，忘记前文，上下文问题
- Transformer 注意力机制解决：关注相关性最高的词
  - 交叉注意力：找到最关键单词或者短语，不受距离限制
  - 自注意力：自主关注不同部分，单词之间的关系
  - 并行处理能力 + GPU
### 文本补全
LLM 接收提示词作为输入，并生成相应的文本，这个过程被称为文本补全(text completion)。
### 视觉整合
之前：卷积神经网络（CNN）
更强：ViT 模型
基本原理：Vision Transformer 先把图像切成小块（patch）并编码成向量，再加入位置信息，然后通过多层自注意力机制，让每个小块与所有其他小块反复“交流”和加权融合，从碎片中逐步重构出部件与整体结构，最终形成对整张图像的全局语义理解

### 历史
- 监督学习：在 GPT-1 出现之前，构建高性能 NLP 神经网络的常用方法是监督学习。这种学习技术使用大量的手动标记数据。
- GPT-1：GPT-1 的作者提出了一种新的学习过程，其中引入了无监督的预训练步骤。这个预训练步骤不需要标注数据，而是通过训练模型来预测下一个词元
- GPT-2：这是 GPT-1 的一个扩展版本，其参数量和训练数据集的规模大约是 GPT-1 的10 倍
- GPT-3：GPT-2 和 GPT-3 之间的主要区别在于模型的大小和用于训练的数据量。GPT-3 比 GPT-2 大得多，它有 1750 亿个参数，这使其能够捕捉更复杂的模式。
- InstructGPT：
  - InstructGPT 模型通过基于人类反馈的强化学习(reinforcement learning from human feedback，RLHF)进行优化
  - 更好地理解人类指令，同时提高生成内容的真实性，并减少有害或不恰当的输出。
- GPT-3 的新版本，新模型可以编辑文本或向文本中插入内容；
- ChatGPT：2022年11月，OpenAI 还推出了实验性对话工具 ChatGPT。该工具背后的模型是 GPT-3.5 的一个微调版本，名为 GPT-3.5 Turbo。
- GPT-4 是第一个能够同时接收文本和图像的多模态模型。
- 多模态：
  - 使用 DALL · E 生成图像
  - 语音识别与合成
  - 使用 Sora 进行视频生成
### 高级功能
- 插件(plug-in)：第三方服务集成到 ChatGPT 中，例如：数学计算
- 提示工程(prompt engineering)
- 检索增强生成(RAG)：添加知识库
- 微调(fine-tuning)：模型再训练
- GPTs：创建一个AI智能体(agent)，专门用于执行特定任务，在界面，不适合应用程序
- Assistants API：AI助理，集成到自己的应用
## 2、使用聊天补全
- 密钥管理
### 提示词
提示词就是发送给模型的输入文本，用于指示模型执行特定任务。

### 引入模型
- gpt-3.5-turbo
- gpt-4o
- gpt-4-turbo
### 参数
temperature 值越大，随机性越强，多样化（生成上）
top_p 默认1 只考虑top-p高质量词元，0.5总概率50%的词元（采用上）

temperature=0.1 top_p=0.1 保持一致
temperature=1 top_p=0.1 聊天机器人
temperature=1.2 top_p=0.5 创作
### 工具和函数
函数定义数据库查询，创建调用外部工具的聊天机器人
```py
# 示例函数
def find_product(sql_query):
    # 在此执行查询
    results = [
        {"name": "pen", "color": "blue", "price": 1.99},
        {"name": "pen", "color": "red", "price": 1.78},
    ]
    return results

function_find_product = {
    "name": "find_product",
    "description": "Get a list of products from a SQL query",
    "parameters": {
        "type": "object",
        "properties": {
            "sql_query": {
                "type": "string",
                "description": "A SQL query",
            }
        },
        "required": ["sql_query"],
    },
}
# 示例问题
user_question = "I need the top 2 products where the price is less \
than 2.00"

messages = [{"role": "user", "content": user_question}]
# 根据当前函数定义调用 chat.completions 端点
response = client.chat.completions.create（
    model="gpt-3.5-turbo-0613",
    messages=messages,
    tools=[{"type": "function", "function": function_find_product}]）
response_message = response.choices[0].message

# 将响应添加到 messages 中
messages.append(response_message)
```
### 其他文本补全

补全则使用一个单一的提示词：
```py
from openai import OpenAI
client = OpenAI()

# 调用 openai 库的completions 端点
response = client.completions.create（
    model="gpt-3.5-turbo-instruct",
    prompt="Hello World!"
）
# 输出响应
print(response.choices[0].text)
```
## 3、其他功能
### 嵌入
嵌入的一个典型应用场景是 RAG 系统
OpenAI 推出了三个嵌入模型。
text-embedding-ada-002 是在 2022年12月底推出的模型。
最近，OpenAI 推出了两个新模型：
一个更小、更便宜且高效的模型，名为 text-embedding-3-small；(推荐)
以及一个更大、更强但也更昂贵的模型，名为text-embedding-3-large。
```py
result = client.embeddings.create（
    model="text-embedding-ada-002",
    input="your input text"
）
```
### 审核
```py
from openai import OpenAI
client = OpenAI()

# 调用 openai 审核端点的text-moderation-latest 模型
response = client.moderations.create（
model="text-moderation-latest",
input="I want to kill my neighbor."
）
```
### 文本转语音
```py
from openai import OpenAI
client = OpenAI()

response = client.audio.speech.create（
    model="tts-1",
    voice="echo",
    input="I won't be home tonight. Could you please take the dog \
        for a walk?"
）
response.stream_to_file("speech.mp3")
```
### 语音转文本
```py
from openai import OpenAI
client = OpenAI()

transcript = client.audio.transcriptions.create（
    model="whisper-1",
    file=open("speech.mp3", "rb")
）
transcript.text
```
### 图像生成
```py
from openai import OpenAI
client = OpenAI()

response = client.images.generate（
    model="dall-e-3",
    prompt="An image with a cute spiny brittle star with distinct arms.",
    n=1,
    size="1024x1024",
    quality="hd"
）
```
## 4、案例
### 新闻生成
- 使用的是提示工程的能力
- 新闻实时 + 限定
### YouTube视频总结
- 得到文稿，转录或者读取视频帧
- 喂给gpt的api
### 《塞尔达传说》专家
- 前置
  - 意图识别服务：如果chatgpt无法回答，提取关键词返回
  - 信息检索服务
  - 响应服务：基于检索信息 + 用户提问，来回答
- 实现思路
  - 读取pdf，并分块
  - 创建嵌入向量
  - 现在我们需要将其存储在 Redis 中
  - 根据用户的查询内容生成嵌入向量
  - 使用 Redis 语法格式化查询（请参阅 GitHub 仓库以获取完整代码）​，并执行向量搜索：
### 语音助理
- 状态机：能回答 answer、更多信息 more、无法回答 other
- 预编排好：各种情况的prompts
### 组织文档
- 使用的是提示工程的能力，解析出文档的机构：标题、概括
### 情感分析
- 通过 logprobs，我们可以获取模型在生成每个词元时的置信度
- 使用数据对这个模型进行评估
## 5、高级策略
### 提示工程
- 角色
- 上下文
- 任务
- 逐步思考 Let's think step by step
- 实现少样本学习、单样本学习
- 迭代优化技术
  - 是指通过多次迭代不断改进初始提示词。
  - 在 Promptor 系统中，优化过程由以下三个智能体协同驱动。
  - • 审查者(reviewer)：评估提示词质量。
  - • 提问者(questioner)：识别改进空间，提出优化建议。
  - • 提示词生成者(prompt maker)：基于反馈生成优化后的提示词。

### 微调
- 微调后的模型本质上是从 OpenAI 提供的原始模型构建的新模型，模型的内部权重经过调整，以适应你的特定问题，从而提高新模型在与微调数据集里的示例类似的任务上的准确性。
- 微调依赖于高质量的数据集
- 如何操作
  - 上传文件
  ```py
    client.files.create（
      file=open("training.jsonl", "rb"),
      purpose="fine-tune"
  ）
  ```
  - 创建微调模型
    - 使用上传文件进行微调是一个简单直接的过程。
    - 方法 client.fine_tuning.jobs.create在 OpenAI 服务器上创建一个微调任务(job)，用于基于指定数据集优化特定模型。
  - 使用微调完的模型
    ```py
    client = OpenAI()
    completion = client.chat.completions.create（
        model="ft:gpt-3.5-turbo-0613:mycompany::8t0Mv0jv",
        messages=[
            {"role": "user", "content": "Veterinary, Rabat, small"}
        ]
    ）
    ```
- 案例
  - 法律文件分析：专业术语比较多
  - 代码：copilot
  - 电子邮件营销示例这样的动态领域
### RAG
- 用户查询预处理
  - • 生成类似的查询；
  - • 将用户的输入分解为几个查询；
  - • 生成更广泛的查询，以便搜索结果包含更多上下文。
- 知识库预处理
  - 按段落或者语句拆分
  - 小块搜索、命中后加前后文本
  - 添加元数据（标题）
- 改进搜索：KNM -> ANN
### 比较
- RAG 关注模型需要知道什么
- 微调 关注模型如何响应
- 先提示词
- 如果问题出在内容上，那么可以将 RAG 作为下一步的选择；
- 如果是风格和格式的问题，那么考虑微调。
