export default class MultiLineQueue {
  constructor(concurrentLines = 2) {
    this.concurrentLines = concurrentLines;
    this.lines = Array.from({ length: concurrentLines }, () => ({
      queue: [],
      running: false,
    }));
  }

  // 单个任务添加
  addTask(task) {
    if (typeof task !== 'function') {
      throw new Error('任务必须是返回Promise的函数');
    }

    let lineIndex = this._getShortestLineIndex();

    return new Promise((resolve, reject) => {
      const runTask = () => {
        this.lines[lineIndex].running = true;
        task()
          .then((res) => {
            resolve(res);
            this._next(lineIndex);
          })
          .catch((err) => {
            reject(err);
            this._next(lineIndex);
          });
      };

      if (!this.lines[lineIndex].running) {
        runTask();
      } else {
        this.lines[lineIndex].queue.push(runTask);
      }
    });
  }

  // 批量任务添加，tasks数组为返回Promise的函数数组，返回所有任务的Promise数组
  addTasks(tasks) {
    if (!Array.isArray(tasks)) {
      throw new Error('批量任务参数必须是数组');
    }
    return tasks.map((task) => this.addTask(task));
  }

  // 获取当前任务最少的队列索引，用于负载均衡分配任务
  _getShortestLineIndex() {
    let minIndex = 0;
    let minLength =
      this.lines[0].queue.length + (this.lines[0].running ? 1 : 0);

    for (let i = 1; i < this.concurrentLines; i++) {
      const currLength =
        this.lines[i].queue.length + (this.lines[i].running ? 1 : 0);
      if (currLength < minLength) {
        minLength = currLength;
        minIndex = i;
      }
    }
    return minIndex;
  }

  _next(lineIndex) {
    if (this.lines[lineIndex].queue.length > 0) {
      const nextTask = this.lines[lineIndex].queue.shift();
      nextTask();
    } else {
      this.lines[lineIndex].running = false;
    }
  }
}
