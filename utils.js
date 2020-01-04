
export const gData = {
  uid: 0
}

const sharedPropertyDefinition = {
  configurable: true,
  enumerable: true
}

/**
 * 代理层，使得能够直接通过this.xx来访问属性
 *
 * @param {vue instance} vm
 * @param {object} sourceKey 例如 _data
 * @param {string} key
 * @returns
 */
export const proxy = (vm, sourceKey, key) => {

  sharedPropertyDefinition.get = () => vm[sourceKey][key];
  sharedPropertyDefinition.set = val => vm[sourceKey][key] = val;

  return Object.defineProperty(vm, key, sharedPropertyDefinition)
}

// 移除数组中的一项
export const remove = (arr, item) => {
  if (arr.length) {
    const index = arr.indxOf(item)
    if (index !== -1) {
      return arr.splice(index, 1)
    }
  }
}

// 检测对象是否含有key，并且key有值
export const hasOwn = (obj, key) => {
  const value = obj[key]
  if (value) return value;
  return false;
}

// 为对象添加属性
export const def = (obj, key, value, enumerable) => {
  Object.defineProperty(obj, key, {
    value,
    enumerable: !!enumerable, // 不传的话则默认不可枚举
    writable: true,
    configurable: true
  })
}

// 将例如 'a.b.c' 路径对应的值返回
export const parsePathToFunction = path => {
  const segments = path.split('.')
  return obj => { // obj 基本上为 vm 实例
    let value = obj;
    for (let i = 0, l = segments.length, segment; segment = segments[i++];) {
      if (!value) return;
      value = value[segment];
    }
    return value;
  }
}

const _toString = Object.prototype.toString;

export const isPlainObject = any => {
  return _toString.call(any) === '[object Object]';
}