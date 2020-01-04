import { hasOwn, def } from './utils.js'
import Dep from './dep.js'

const observe = (obj) => {

  let ob = null; // Observer 实例预留位

  // 如果这个对象上已经存在了 observer
  if (hasOwn(obj, '__ob__') && obj.__ob__ instanceof Observer) {
    ob = obj.__ob__;
  } else {
    ob = new Observer(obj)
  }

  return ob;
}

class Observer {
  /**
   * Creates an instance of Observer.
   * @param {Array or Object} obj 需要响应式化的对象
   * @memberof Observer
   */
  constructor(obj) {
    this.obj = obj;
    this.dep = new Dep() // QU 这个 this.dep 有什么用？

    def(obj, '__ob__', this) // 定义属性，将 observer 存在对象的 __ob__ 中

    if (obj instanceof Object) {
      this.walk(obj)
    } else if (Array.isArray(obj)) {

    }
  }
  /**
   * 将每个属性 getter/setter 化
   * @param {Object} obj
   * @memberof Observer
   */
  walk (obj) {
    Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
  }
}

/**
 * 响应式处理
 * @param {Object} obj
 * @param {String} key
 * @param {any} val
 * @returns void
 */
function defineReactive (obj, key, val) {

  // 依赖收集，收集的是 watcher 实例
  const dep = new Dep()

  // 取出该数据原本描述符
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) return; // 如果不可配置，则无法设置 getter/setter

  // 如果本身有 getter/setter 则取出来
  const getter = property && property.get;
  const setter = property && property.set;

  let value = getter ? getter.call(obj) : val; // 如果本身有 getter 则直接调用取值

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get () {
      if (Dep.target) { // 这个是在 Watcher 中定义了的
        dep.depend() // IM 反向收集
        dep.addSub(Dep.target) // 收集 watcher
      }
      return value;
    },
    set (newValue) {
      if (value === newValue) return; // 新旧值相同

      if (setter) { // 如果本身有 setter 则直接调用
        setter.call(obj, newValue)
      } else {
        value = newValue;
      }
      dep.notify() // 通知 watcher 数据更新了，应该更新视图了
    }
  })
}

export default observe;

