import { remove, parsePathToFunction, gData } from './utils.js'
import Dep from './dep.js'

/**
 * 用于更新视图
 * @export
 * @class Watcher
 */
export class Watcher {
  /**
   * Creates an instance of Watcher.
   * @param {Vue} vm Vue实例
   * @param {expression or Function} expOrFn 类似 obj.a 的表达式或者函数
   * @param {Function} cb
   * @memberof Watcher
   */
  constructor(vm, expOrFn, cb) {

    this.vm = vm;
    vm._watchers.push(this) // 将观察者存入_watchers

    this.cb = cb;
    this.id = gData.uid++;

    this.active = true; // 记录该观察者是否仍在活跃，在 teardown 之后为 false

    this.deps = [];
    this.newDeps = [];
    this.depIds = new Set();
    this.newDepIds = new Set();
    // 拿到能获取属性值的 getter，此 getter 接收 vm
    this.getter =
      typeof expOrFn === 'function'
        ? expOrFn
        : parsePathToFunction(expOrFn);

    if (!this.getter) {
      this.getter = function () { };
      throw Error(`无法监听 ${expOrFn}`)
    }

    this.value = this.get(); // 获取此属性的值
  }

  get () {

    pushTarget(this) // 将观察者实例存在 Dep.target 中，用以依赖收集

    const vm = this.vm;
    // IM 这里调用了属性的 getter ，完成依赖收集
    const value = this.getter.call(vm, vm)

    popTarget()

    return value;
  }
  // IM 可以记录有哪些依赖收集了自己
  addDep (dep) {
    const id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this) // 将自身加入依赖收集
      }
    }
  }

  // QU 暂时没搞懂 clearupDeps
  cleanupDeps () {
    /*移除所有观察者对象*/
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps;
    this.deps = this.newDeps; // 更新为新的依赖数组
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  update () {
    // 异步推送到观察者队列中，由调度者调用
    // queueWatcher(this)
    this.run()
  }

  run () { // 更新视图
    if (this.active) {
      const value = this.get()
      const oldValue = this.value;
      this.value = value;
      this.cb.call(this.vm, value, oldValue)
    }
  }

  evaluate () { // 获取观察者的值
    this.value = this.get();
  }
  // QU 搞懂两个 depend 方法到底做了什么，以及有什么用
  depend () { // 收集该观察者的所有dep依赖
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend()
    }
  }

  teardown () { // 将自身从所有依赖收集列表里删除
    if (this.active) {

      remove(this.vm._watchers, this) // 从观察者列表中删除自身

      let i = this.deps.length;
      while (i--) {
        this.deps[i].removeSub(this) // 从所有收集了自己的依赖列表里删除
      }
      this.active = false; // 不再活跃
    }
  }
}

// QU 暂时还没理解这个有什么用，除了 Dep.target = target 这一步外
Dep.target = null;
const targetStack = []
function pushTarget (target) {
  targetStack.push(target)
  Dep.target = target;
}
function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}

