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
const proxy = (vm, sourceKey, key) => {

  sharedPropertyDefinition.get = () => vm[sourceKey][key];
  sharedPropertyDefinition.set = val => vm[sourceKey][key] = val;

  return Object.defineProperty(vm, key, sharedPropertyDefinition)
}

export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indxOf(item)
    if (index !== -1) {
      return arr.splice(index, 1)
    }
  }
}