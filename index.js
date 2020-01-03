let uid = 0;
let callbacks = [];
let pending = false;

// 响应式化
function defineReactive(obj, key, value) {

  const dep = new Dep()

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() {
      dep.addSub(Dep.target)
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      value = newValue;
      dep.notify(newValue)
    }
  })
}

// 包装函数，循环调用defineReactive
function observer(obj) {
  if (!obj || typeof obj !== 'object') return;
  Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
}

// 依赖收集，收集watcher
class Dep {
  constructor() {
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  notify(...args) {
    this.subs.forEach(sub => {
      sub.update(...args)
    })
  }
}

// 更新视图
class Watcher {
  constructor() {
    this.id = ++uid;
  }

  update() {
    console.log('watch' + this.id + ' update');
    queueWatcher(this);
  }

  run() {
    console.log('watch' + this.id + '视图更新啦～');
  }
}

Dep.target = null;

class Vue {
  constructor(options) {
    this._data = options.data;

    observer(this._data)

    new Watcher();

    console.log('rendering', this._data.test);
  }
}

// 筛选watcher，不执行重复的watcher
function queueWatcher(watcher) {
  const id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    queue.push(watcher);

    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

// 向回调队列里推入回掉函数
function nextTick(cb) {
  callbacks.push(cb);
  // 当不为挂起状态时执行回调队列
  if (!pending) {
    pending = true;
    setTimeout(flushCallbacks, 0);
  }
}

// 执行回掉函数并清空回调队列
function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

let has = {}; // map，用于映射watcher，以致不重复执行同一watcher
let queue = []; // watcher 队列
let waiting = false;


function flushSchedulerQueue() {
  let watcher, id;

  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    id = watcher.id;
    has[id] = null; // 清除对应的watcher
    watcher.run();
  }

  waiting = false;
}



(function () {
  let watch1 = new Watcher();
  let watch2 = new Watcher();

  watch1.update();
  watch1.update();
  watch2.update();
})();

// 代理，使得能够直接使用this.xx访问data中的属性
const proxy = function (data) {
  const _this = this;
  Object.keys(data).forEach(key => {
    Object.defineProperty(_this, key, {
      enumerable: true,
      configurable: true,
      get: function proxyGetter() {
        return _this._data[key];
      },
      set: function proxySetter(value) {
        _this._data[key] = value;
      }
    })
  })
}