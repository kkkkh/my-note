# 将 YYYY-MM-DD-slug/index.md 重组为 YYYY/MM/DD-slug/index.md
# 例如：2026-01-01-js-stream/index.md -> 2026/01/01-js-stream/index.md

find . -type f -path './????-??-??-*/index.md' | while read -r file; do
  # find .：从当前目录递归查找；-type f：只找文件；-path：只匹配 ./2026-01-01-js-stream/index.md 这种路径
  # | while read -r file：把 find 的结果一行一行读出来赋给变量 file；-r 表示不把反斜杠当转义
  # 本轮示例：file=./2026-01-01-js-stream/index.md

  dir=$(dirname "$file")          # dirname 取“文件所在目录”；$(...) 是命令替换，把命令结果赋值给变量；此时 dir=./2026-01-01-js-stream
  name=$(basename "$dir")         # basename 取路径最后一段；此时 name=2026-01-01-js-stream

  year=${name%%-*}                # ${var%%pattern}：从右往左删“最长匹配”；name=2026-01-01-js-stream -> year=2026
  rest=${name#*-}                 # ${var#pattern}：从左往右删“最短匹配”；name=2026-01-01-js-stream -> rest=01-01-js-stream
  month=${rest%%-*}               # 再从 rest 里取第一个 - 前的部分；rest=01-01-js-stream -> month=01
  tail=${rest#*-}                 # 再从 rest 里去掉第一个 - 前的部分；rest=01-01-js-stream -> tail=01-js-stream

  mkdir -p "./$year/$month/$tail" # mkdir -p：递归创建目录，已存在也不报错；这里创建 ./2026/01/01-js-stream
  mv "$file" "./$year/$month/$tail/index.md"
  # mv：移动文件；这里不是改文件名，而是把旧文件
  # ./2026-01-01-js-stream/index.md
  # 移到新位置
  # ./2026/01/01-js-stream/index.md

  rmdir "$dir" 2>/dev/null        # rmdir 只删除空目录；2>/dev/null 表示忽略错误输出，避免目录非空时报错打断脚本
done