function tokenize(text) {
  return text.split(/(\b)/);
}

export const annotated = (text, keywords)=>{
  const seen = new Set();
  const tokens = tokenize(text);
  const res = tokens.map(token => {
    if (keywords.has(token) && !seen.has(token)) {
      seen.add(token);
      return { type: 'highlight', value: token };
    }
    return { type: 'text', value: token };
  });
  return res
}

// const keywords = new Set(['aaa', 'bbb']); // 要高亮的词
// console.log(annotated('aaa bbb ccc ddd',keywords))
