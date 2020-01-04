import { gData } from './utils.js'

// 存放观察者，watcher
class Dep {
  constructor() {
    this.subs = [];
    this.id = gData.uid++;
  }
  // sub = watcher
  addSub (sub) {
    this.subs.push(sub)
  }

  removeSub (sub) {
    remove(this.subs, sub)
  }
  // 依赖收集，当存在 Dep.target 时添加观察者
  depend () {
    /*
    /* // IM 反向收集，观察者记录有哪些依赖收集了自己
    /* 如果后面观察者要从依赖列表里删除自身，这部操作就会有用
    */
    if (Dep.target) Dep.target.addDep(this)
  }

  notify (...args) {
    const subs = this.subs.slice();
    for (let i = 0, sub; sub = subs[i++];) {
      sub.update(...args)
    }
  }
}

export default Dep;