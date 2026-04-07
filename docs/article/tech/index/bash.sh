find . -type f -path './????-??-??-*/index.md' | while read -r file; do
  # find .                : 从当前目录递归查找
  # -type f               : 只匹配文件
  # -path '...'           : 只匹配形如 ./2026-01-01-js-stream/index.md 的路径
  # |                     : 管道，把 find 的输出逐行传给 while
  # read -r file          : 每次读取一行路径，赋值给变量 file
  #
  # 例如这一轮：
  # file=./2026-01-01-js-stream/index.md

  dir=$(dirname "$file")
  # dirname：取文件所在目录
  # $(...)  ：命令替换，把命令执行结果赋值给变量
  #
  # 这一行后：
  # dir=./2026-01-01-js-stream

  name=$(basename "$dir")
  # basename：取路径最后一段
  #
  # 这一行后：
  # name=2026-01-01-js-stream

  year=${name%%-*}
  # ${var%%pattern}：从右往左删除“最长匹配”
  # -* 表示删除第一个 - 及其后面所有内容
  #
  # name=2026-01-01-js-stream
  # year=2026

  rest=${name#*-}
  # ${var#pattern}：从左往右删除“最短匹配”
  # *- 表示删除开头到第一个 - 为止
  #
  # name=2026-01-01-js-stream
  # rest=01-01-js-stream

  month=${rest%%-*}
  # 继续从 rest 中取月份
  # rest=01-01-js-stream
  # month=01

  tail=${rest#*-}
  # 再去掉 rest 里的第一个 - 前部分
  # rest=01-01-js-stream
  # tail=01-js-stream
  #
  # 这里 tail 保留了：日期 + 原 slug
  # 也就是最终目录名 01-js-stream

  mkdir -p "./$year/$month/$tail"
  # mkdir -p：创建目录
  # -p      ：父目录不存在就一并创建；已存在也不报错
  #
  # 这一行会创建：
  # ./2026/01/01-js-stream

  mv "$file" "./$year/$month/$tail/index.md"
  # mv：移动文件
  # 这里既改变了目录结构，又保留文件名 index.md 不变
  #
  # 这一行前：
  # ./2026-01-01-js-stream/index.md
  #
  # 这一行后：
  # ./2026/01/01-js-stream/index.md

  rmdir "$dir" 2>/dev/null
  # rmdir        ：删除空目录
  # 2>/dev/null  ：把错误输出丢弃，不显示报错
  #
  # 如果旧目录已经空了，就删除
  # 如果里面还有别的文件，删不掉，但不会影响脚本继续执行

done