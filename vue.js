import { proxy, isPlainObject } from './utils.js';
import { Watcher } from './watcher.js'
import observe from './observe.js'

export const getData = function (dataFn, vm) {
  try {
    return dataFn.call(vm, vm);
  } catch (error) {
    throw Error(`from getData : 传入的 data 有错`)
  }
}

class Vue {
  constructor(options) {

    this._data = options.data || {};

    this._watchers = []; // 存放观察者实例

    this.initData(this)
    this.touch()

    new Watcher(this, function (...args) {
      console.log('log from watcher', ...args);
    })
  }

  initData (vm) {

    let data = vm._data;
    // 处理 data 是函数的情况
    data = vm._data = typeof data === 'function'
      ? getData(data, this)
      : data || {};
    // 处理 data 不是一个 Object
    if (!isPlainObject(data)) {
      throw Error('data 不是一个对象')
    }

    // 代理层，使得能够直接通过this.xx来访问属性
    Object.keys(this._data).forEach(key => proxy(this, `_data`, key));

    /*
    * 响应式化，在这里只是设置了属性的 getter/setter ，
    * 如果没有 touch 属性，相当于没有进行依赖收集
    */
    observe(this._data) 
  }
  // 访问所有响应式数据，触发它们的 getter 以触发依赖收集
  touch () {
    Object.keys(this._data).forEach(key => {
      console.log(`来自 touch rendering \n -- ${this._data[key]}`);
    })
  }
}

const vm = new Vue({
  data: {
    a: '我是a1',
    b: '你好',
    c: '我不好',
    d: '你为什么不好？',
    e: '要你管'
  },
  render () {
    console.log('render from Vue');
  }
})

vm.a = '我是a2';
vm.a = '我是a3';