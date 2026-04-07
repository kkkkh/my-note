// #region for-await
// for循环中 await 继发执行
async function callMethodsSequentially(methods: (() => boolean | Promise<boolean>)[]) {
  for (const method of methods) {
    const result = await Promise.resolve(method()); // 确保同步和异步方法都能被正确处理
    if (result === false) {
      return false;
    }
  }
  return true;
}
// #endregion for-await

// #region promise-all
async function callMethodsSequentiallyPromiseAll(methods: (() => boolean | Promise<boolean>)[]) {
  const results = await Promise.all(methods.map(method =>
    Promise.resolve(method())
  ));

  for (const result of results) {
    if (result === false) {
      return false;
    }
  }

  return true;
}
// #endregion promise-all

// #region reduce-await
async function callMethodsSequentiallReduce(methods: (() => boolean | Promise<boolean>)[]) {
  let finalResult = true

  await methods.reduce(async (promise, method) => {
    await promise
    if (!finalResult) {
      return
    }
    const result = await method()

    if (result === false) {
      finalResult = false
    }
  }, Promise.resolve())

  return finalResult
}
// #endregion reduce-await

// #region generator-yield-while
// 生成器处理 yield 继发处理 while循环
async function callMethodsSequentiallyGeneratorYieldWhile(methods: (() => boolean | Promise<boolean>)[]) {
  function* methodGenerator() {
    for (const method of methods) {
      const result = yield method();
      if (result === false) {
        return false;
      }
    }
    return true;
  }

  const generator = methodGenerator();
  let result = generator.next();

  while (!result.done) {
    const promise = Promise.resolve(result.value);
    const resolvedResult = await promise;
    result = generator.next(resolvedResult);
  }

  return result.value;
}
// #endregion generator-yield-while

// #region generator-yield-recursive
// 生成器处理 yield 继发处理 递归函数
export async function callMethodsSequentiallyGeneratorYieldRecursive(methods: (() => boolean | Promise<boolean>)[]) {
  function* methodGenerator(): Generator<boolean | Promise<boolean>, boolean, boolean> {
    for (const method of methods) {
      const result: boolean | Promise<boolean> = yield method();
      if (result === false) {
        return false;
      }
    }
    return true;
  }

  const generator = methodGenerator();
  let result = generator.next();

  async function processNext(): Promise<boolean> {
    if (result.done) {
      return result.value;
    }

    const promise = Promise.resolve(result.value);
    const resolvedResult: boolean = await promise;
    result = generator.next(resolvedResult);
    return processNext();
  }

  return processNext();
}
// #endregion generator-yield-recursive
