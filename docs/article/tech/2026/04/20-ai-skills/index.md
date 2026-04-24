---
title: 【AI编程】工作流能力 - AI skills
date: 2026-04-20
tags:
  - AI
---
# 【AI编程】工作流能力 - AI skills
[skills](https://skills.sh/)
## skills 结构
- 目前 skills
  - cursor
  - 围绕需求/方案/变更/归档，做一个有阶段感的改造流程。
    - explore：先调研、看现状、理清上下文
    - propose：提出方案
    - apply：落地修改
    - archive：收尾归档、沉淀结果
  - ./cursor/commands
    - opsx-explore.md
    - opsx-propose.md
    - opsx-apply.md
    - opsx-archive.md
  - .cursor/skills
    - openspec-explore/SKILL.md
    - openspec-propose/SKILL.md
    - openspec-apply-change/SKILL.md
    - openspec-archive-change/SKILL.md
  - .claude/skills 更偏 通用工具层
- 缺少开发执行型 skills 这一层
  - 读仓库
  - 读老模块
  - 改前风险检查
  - 改后验证
  - 类型加固
  - PR review
- 任务链：
  - 认知层：repo-map-reader、legacy-module-reader
  - 质量层：safe-refactor-checker、change-validation、pr-review-helper
  - 框架层：React/Vue/Next/Nuxt 专项
  - 扩展层：从 skills.sh 引公共 skill
## skills 性质
- Rules 是常驻的
- Skills 是按需动态加载的
  - 所以 skill 不是装完就每轮都进上下文。
  - 关键任务最好：手动点名 skill、或用 /skill-name、或明确在提示词中要求使用某个 skill
## skills 安装
```bash
# 安装 skills 到 ./agents/skills/find-skills
npx skills add https://github.com/vercel-labs/skills --skill find-skills

# 安裝 skills 到 ./claude/skills/find-skills
npx skills add https://github.com/vercel-labs/skills --skill find-skills -a claude-code

# 列出所有 skills
npx skills list
# find-skills .\.agents\skills\find-skills
#   Agents: Antigravity, Codex, Cursor, Gemini CLI, GitHub Copilot +1 more
# skill-creator .\.agents\skills\skill-creator
#   Agents: Antigravity, Codex, Cursor, Gemini CLI, GitHub Copilot    
# vue2 .\.agents\skills\vue2
#   Agents: Antigravity, Codex, Cursor, Gemini CLI, GitHub Copilot 

# 列出所有 cursor skills
npx skills list -a cursor
# find-skills .\.agents\skills\find-skills
#   Agents: Cursor, Claude Code
# skill-creator .\.agents\skills\skill-creator
#   Agents: Cursor
# vue2 .\.agents\skills\vue2
#   Agents: Cursor
# 列出所有 claude-code skills

npx skills list -a claude-code
# find-skills .\.agents\skills\find-skills
#   Agents: Claude Code
# skill-creator .\.agents\skills\skill-creator
#   Agents: not linked
# vue2 .\.agents\skills\vue2
#   Agents: not linked
```
## 参考
- [10万人都在用的 top10 skills，我帮你试了](https://juejin.cn/post/7604757482005053503?searchId=2026042011285802A5651F18645D63EB57)

## 继续探索
- [claude code](https://code.claude.com/docs/zh-CN/overview)
- [ofox](https://ofox.ai/zh/docs)