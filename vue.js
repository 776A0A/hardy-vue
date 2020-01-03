import { proxy } from './utils.js';
import { observe, Watcher } from './observer.js'

class Vue {
  constructor(options) {
    this._data = options.data;

    // 响应式化
    observe(this._data)

    new Watcher(this, function (...args) {
      console.log(...args);
    })

    this.init()
  }

  init () {
    this.render()
    this._proxyData()
  }

  // 代理层，使得能够直接通过this.xx来访问属性
  _proxyData () {
    Object.keys(this._data).forEach(key => proxy(this, `_data`, key))
  }

  render () {
    Object.keys(this._data).forEach(key => {
      console.log(`来自touch rendering \n -- ${this._data[key]}`);
    })
  }
}

const vm = new Vue({
  data: {
    a: '我是a1'
  },
  render () {
    console.log('render from Vue');
  }
})

vm.a = '我是a2';
vm.a = '我是a2';