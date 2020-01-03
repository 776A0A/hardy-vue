import { remove } from './utils.js'

function defineReactive (obj, key, value) {

  // 依赖收集
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get () {
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return value;
    },
    set (val) {
      if (value === val) return;
      dep.notify(value, val)
      value = val;
    }
  })
}

export function observe (obj) {
  Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
}

export class Dep {
  constructor() {
    this.subs = []
  }
  // sub = watcher
  addSub (sub) {
    this.subs.push(sub)
  }

  removeSub (sub) {
    remove(this.subs, sub)
  }

  notify (...args) {
    const subs = this.subs.slice();
    for (let i = 0, sub; sub = subs[i++];) {
      sub.update(...args)
    }
  }
}

export class Watcher {
  constructor(vm, cb) {

    this.vm = vm, this.cb = cb;

    Dep.target = this;

  }

  update (...args) {
    this.cb.call(this.vm, ...args)
  }
}