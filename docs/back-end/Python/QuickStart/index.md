

<!--@include: @/submodule/play-Python/README.md-->


## 查看代码
- 1
:::details 查看代码 input
<<< @/submodule/play-Python/src/1-input.py
:::

:::details 查看代码 number
<<< @/submodule/play-Python/src/2-number.py
:::

- 2
:::details 查看代码 list
<<< @/submodule/play-Python/src/3-1list.py
:::
:::details 查看代码 list_sort
<<< @/submodule/play-Python/src/3-2list_sort.py
:::
:::details 查看代码 list_other
<<< @/submodule/play-Python/src/3-3list_other.py
:::
:::details 查看代码 deep_copy
<<< @/submodule/play-Python/src/3-4deep_copy.py
:::
:::details 查看代码 tuple
<<< @/submodule/play-Python/src/3-5tuple.py
:::
:::details 查看代码 set
<<< @/submodule/play-Python/src/3-6set.py
:::
- 3
:::details 查看代码 string
<<< @/submodule/play-Python/src/4-string.py
:::
- 4
:::details 查看代码 dict
<<< @/submodule/play-Python/src/5-dict.py
:::
- 5
:::details 查看代码 loop
<<< @/submodule/play-Python/src/6-loop.py
:::
- 6
:::details 查看代码 def
<<< @/submodule/play-Python/src/7-def.py
:::
- 7
:::details 查看代码 module
<<< @/submodule/play-Python/src/8-module.py
:::
- 8
:::details 查看代码 program
<<< @/submodule/play-Python/src/9program/script1.py
<<< @/submodule/play-Python/src/9program/opts.py
<<< @/submodule/play-Python/src/9program/script2.py
<<< @/submodule/play-Python/src/9program/replace.py
<<< @/submodule/play-Python/src/9program/script4.py
<<< @/submodule/play-Python/src/9program/script5.py
<<< @/submodule/play-Python/src/9program/script6.py
<<< @/submodule/play-Python/src/9program/n2w.py
:::
- 9
:::details 查看代码 file_os
<<< @/submodule/play-Python/src/10file_os.py
:::
- 10
:::details 查看代码 file
<<< @/submodule/play-Python/src/11file.py
:::
- 12
:::details 查看代码 error
<<< @/submodule/play-Python/src/12error.py
:::

## Python AI 问答
<script setup>
import { data as posts } from '../aiAsking//index.data.mts'
import Content from '@/components/Content.vue'
</script>

<Content :posts="posts" />
