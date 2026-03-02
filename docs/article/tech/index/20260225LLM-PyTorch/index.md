---
title: LLM-PyTorch
date: 2026-02-25
---
# LLM-PyTorch
## LLM 大语言模型
- 大语言模型 （人工智能模型）
- 人工智能（人类智能水平计算机系统） -> 机器学习 （专注学习算法的开发和改进）-> 深度学习（多层神经网络的机器学习）
- 机器学习：使计算机能够从数据中学习，并在没有被明确编程的情况下进行预测或决策
- 深度：指的是人工神经元或节点的多个隐藏层，这些层使它们能够对数据中的复杂非线性关系进行建模。
- 典型机器学习：预测建模工作流（监督学习）
  - 对训练数据集进行训练，训练好的模型对新观测数据进行预测
  - 例如：对垃圾邮箱和非垃圾邮箱进行标签甄别
## pytorch
### 三大核心组件
  - 张量库：扩展了NumPy基于数组的编程功能，增加了GPU加速特性，从而实现了CPU和GPU之间的无缝计算切换；
  - 自动微分引擎autograd：它能够自动计算张量操作的梯度，从而简化反向传播和模型优化；
  - 深度学习库：它提供了模块化、灵活且高效的构建块（包括预训练模型、损失函数和优化器）；
### 准备工作
  - 安装pytorch
    ```bash
    pip install torch==2.4.0
    ```
  - 简单测试

    <<< @/submodule/play-Python/LLM/torch/tensor.py#pre
## 理解张量
张量是一种数据容器：存储多维数据，其中每个维度表示一个不同的特征
### 标量、向量、矩阵和张量
- 标量是零维张量（例如，仅一个数值）`​2`
- 向量是一维张量 `[1 2 3]`
- 矩阵是二维张量
  `[ 1  4 ]
   [ 2  5 ]
   [ 3  6 ]`
- 对于更高维的张量没有特定的术语，因此通常将三维张量称为“3D张量”​
- 
<<< @/submodule/play-Python/LLM/torch/tensor.py#tensor

### 张量形状

<<< @/submodule/play-Python/LLM/torch/tensor.py#shape

### 改变形状

<<< @/submodule/play-Python/LLM/torch/tensor.py#reshape

### 转置张量

<<< @/submodule/play-Python/LLM/torch/tensor.py#T

### 矩阵相乘

<<< @/submodule/play-Python/LLM/torch/tensor.py#matmul

- 如何理解

  > A.matmul(B)：用 A 的每一行，去和 B 的每一列做点积

  ```Plain
  textA = tensor2d (2×3)
  [ 1  2  3 ]
  [ 4  5  6 ]
  ```
  ```Plain
  textA.T (3×2)
  [ 1  4 ]
  [ 2  5 ]
  [ 3  6 ]
  ```
  ```Plain
  text(m × n) @ (n × k) → (m × k)
  ```
  ```Plain
  text(2 × 3) @ (3 × 2) → (2 × 2)
  ✔ 中间维度 3 对齐
  ✔ 结果是 2×2
  ```
  - 🔹 第 (0,0) 个元素（A 的第 0 行 · A.T 的第 0 列）
  ```Plain
  text[1, 2, 3] · [1, 2, 3]= 1*1 + 2*2 + 3*3= 1 + 4 + 9= 14
  ```
  - 🔹 第 (0,1) 个元素
  ```Plain
  text[1, 2, 3] · [4, 5, 6]= 1*4 + 2*5 + 3*6= 4 + 10 + 18= 32
  ```
  - 🔹 第 (1,0) 个元素
  ```Plain
  text[4, 5, 6] · [1, 2, 3]= 4*1 + 5*2 + 6*3= 4 + 10 + 18= 32
  ```
  - 🔹 第 (1,1) 个元素
  ```Plain
  text[4, 5, 6] · [4, 5, 6]= 4*4 + 5*5 + 6*6= 16 + 25 + 36= 77
  ```
  - ✅ 拼成最终矩阵
  ```Plain
  text[ 14  32 ][ 32  77 ]
  ```
## 自动微分引擎
### 计算图
- 计算图列出了计算神经网络输出所需的计算顺序
- 我们需要用它来计算反向传播所需的梯度，这是神经网络的主要训练算法
### 简单逻辑回归分类器的前向传播（预测步骤）​
- 逻辑回归的前向传播作为一个计算图;
- PyTorch在后台构建了这样一个计算图，我们可以利用它来计算损失函数相对于模型参数（这里是w1和b）的梯度，在计算图中计算损失梯度的最常见方法是从右向左应用链式法则，这也称为“反向模型自动求导”或“反向传播”;
- 偏导数，它测量的是一个函数相对于其中一个变量变化的速率。
- 梯度是一个向量，包含了一个多变量函数（输入变量超过一个的函数）的所有偏导数。
- PyTorch的autograd引擎在后台通过跟踪在张量上执行的每个操作来构建计算图。然后，通过调用grad函数，可以计算损失相对于模型参数w1的梯度

## 实现多层网络
### 神经网络

<<< @/submodule/play-Python/LLM/torch/index.py#NeuralNetwork

### 神经网络测试

<<< @/submodule/play-Python/LLM/torch/index.py#NeuralNetworkTest


### 数据集和数据加载器

<<< @/submodule/play-Python/LLM/torch/index.py#data

### 训练
<<< @/submodule/play-Python/LLM/torch/index.py#epoch

### 保存和加载模型
<<< @/submodule/play-Python/LLM/torch/index.py#save-load

## GPU
### 多GPU
- DDP：PyTorch的分布式数据并行(DistributedDataParallel, DDP)策略
- 模型副本独立保存，训练时同步
### 启动模式
- 自己用 mp.spawn 启动多进程；
  - 单机多卡最常见；
  - 运行方式通常是：python DDP-script.py（或你手动 CUDA_VISIBLE_DEVICES=0,1 python ... 控制可见 GPU）

:::details 查看代码 DDP-script.py
<<< @/submodule/play-Python/LLM/torch/DDP-script.py
:::

- torchrun
  - “由外部启动器（torchrun / deepspeed / SLURM 等）先把多进程启动好，
  - 你的脚本只负责读取环境变量并执行对应 rank 的那一份工作”
  - 运行方式：torchrun --nproc_per_node=2 DDP-script.py 或多机：torchrun --nnodes=2 --node_rank=0/1 ...

:::details 查看代码 DDP-script-torchrun.py
<<< @/submodule/play-Python/LLM/torch/DDP-script-torchrun.py
:::
