function tokenize(text) {
  const tokens = [];
  const reg = /\w+|\s+|[^\w\s]+/g;
  let m;

  while ((m = reg.exec(text))) {
    const value = m[0];
    tokens.push({
      type: /\w+/.test(value) ? 'word' : 'other',
      value
    });
  }
  return tokens;
}

export function annotated(text, phrases) {
  const tokens = tokenize(text)
  const seen = new Set();
  const result = [];
  const maxLen = Math.max(...phrases.map(p => p.length));

  for (let i = 0; i < tokens.length; ) {
    if (tokens[i].type !== 'word') {
      result.push(tokens[i]);
      i++;
      continue;
    }

    let matched = false;

    // 从长到短匹配
    for (let len = maxLen; len > 0; len--) {
      /*
        为什么是 len * 2 - 1？
        假设词组长度 = 2：
        aaa␠bbb
        token 序列是：[word, space, word] → 3 个 token
      */
      const slice = tokens.slice(i, i + len * 2 - 1);
      const words = slice.filter(t => t.type === 'word').map(t => t.value);

      if (words.length !== len) continue;

      const key = words.join(' ');
      if (
        phrases.some(p => p.join(' ') === key) &&
        !seen.has(key)
      ) {
        // 捕获到，增加高亮
        seen.add(key);
        result.push({
          type: 'highlight',
          value: slice.map(t => t.value).join('')
        });
        i += slice.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // 没有捕获到
      result.push(tokens[i]);
      i++;
    }
  }

  return result;
}
