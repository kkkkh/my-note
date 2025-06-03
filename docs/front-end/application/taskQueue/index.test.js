// multiLineQueue.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import MultiLineQueue from './index.js'; // 根据实际路径调整

// 工具函数，创建异步任务，返回Promise，执行时延时resolve带id
function createAsyncTask(id, duration, shouldFail = false) {
  return () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) reject(new Error('Failed ' + id));
        else resolve(id);
      }, duration);
    });
}

describe('MultiLineQueue', () => {
  let queue;

  beforeEach(() => {
    queue = new MultiLineQueue(3); // 每个测试用例新建实例，3条并发线
  });

  it('单个任务执行', async () => {
    const result = await queue.addTask(createAsyncTask(1, 50));
    expect(result).toBe(1);
  });

  it('多个任务串行执行 (单线)', async () => {
    queue = new MultiLineQueue(1); // 单线程
    const results = [];
    results.push(await queue.addTask(createAsyncTask(1, 30)));
    results.push(await queue.addTask(createAsyncTask(2, 30)));
    results.push(await queue.addTask(createAsyncTask(3, 30)));
    expect(results).toEqual([1, 2, 3]);
  });

  it('多个任务多线并发执行', async () => {
    const tasks = [1, 2, 3, 4, 5].map((id) => queue.addTask(createAsyncTask(id, 50)));
    const results = await Promise.all(tasks);
    expect(results.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('支持批量添加任务', async () => {
    const batch = [1, 2, 3, 4].map((id) => createAsyncTask(id, 30));
    const promises = queue.addTasks(batch);
    const results = await Promise.all(promises);
    expect(results).toEqual([1, 2, 3, 4]);
  });

  it('支持多次批量追加任务', async () => {
    const batch1 = [1, 2, 3].map((id) => createAsyncTask(id, 20));
    const batch2 = [4, 5, 6].map((id) => createAsyncTask(id, 20));
    const promises1 = queue.addTasks(batch1);
    const promises2 = queue.addTasks(batch2);
    const results1 = await Promise.all(promises1);
    const results2 = await Promise.all(promises2);
    expect(results1).toEqual([1, 2, 3]);
    expect(results2).toEqual([4, 5, 6]);
  });
  it('批量任务中部分失败，所有任务结果均可获得', async () => {
    const tasks = [
      createAsyncTask(1, 30),           // 成功
      createAsyncTask(2, 30, true),     // 失败
      createAsyncTask(3, 10),           // 成功
      createAsyncTask(4, 20, true),     // 失败
      createAsyncTask(5, 15),           // 成功
    ];

    // 批量添加任务，获得promise数组
    const promises = queue.addTasks(tasks);

    // 用allSettled收集所有结果
    const results = await Promise.allSettled(promises);

    expect(results).toHaveLength(tasks.length);

    expect(results[0].status).toBe('fulfilled');
    expect(results[0].value).toBe(1);

    expect(results[1].status).toBe('rejected');
    expect(results[1].reason).toBeInstanceOf(Error);
    expect(results[1].reason.message).toBe('Failed 2');

    expect(results[2].status).toBe('fulfilled');
    expect(results[2].value).toBe(3);

    expect(results[3].status).toBe('rejected');
    expect(results[3].reason.message).toBe('Failed 4');

    expect(results[4].status).toBe('fulfilled');
    expect(results[4].value).toBe(5);
  });
  it('大批量任务测试（1000条任务）', async () => {
    const bigBatch = Array.from({ length: 1000 }, (_, i) =>
      createAsyncTask(i + 1, 5)
    );
    const promises = queue.addTasks(bigBatch);
    const results = await Promise.all(promises);
    expect(results.length).toBe(1000);
    // 简单验证序号是否完整
    expect(results[0]).toBe(1);
    expect(results[999]).toBe(1000);
  });
});
