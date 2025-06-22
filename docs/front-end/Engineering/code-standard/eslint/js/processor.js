module.exports = {
  processors: {
    ".md": {
      preprocess: (text, filename) => {
        return text.split("```javascript")
          .slice(1) // 去除第一个元素（Markdown 文件 JavaScript 代码块之前的部分）
          .map((section) => {
            const code = section.split("```")[0]; // 提取 JavaScript 代码
            return { text: code, filename: "temp.js" };
          });
      },
      postprocess: (messages, filename) => {
        return messages.flat(); // 将二维数组扁平化成一维数组
      },
    },
  },
};


