/**
 * await 包装函数
 * @return {Array} 包装结果的数组
 * @param promise {Promise} promise对象
 * */
export const awaitTo = <T>(promise: any) => {
  return promise.then((result: T) => [null, result]).catch((error: any) => [error, null])
}

/**
 * 简易版本的深拷贝
 * @param {Object} source
 * @return {Object}
 */
export function deepClone(source: any) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments')
  }
  const targetObj: any = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 获取url上的参数
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url: string) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj: Record<string | number, any> = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * 防抖
 * @param {Function} func
 * @param {Number} time
 * @param {Boolean} immediate
 * @return {*}
 */
export function debounce(func: () => void, time: number, immediate: boolean = false) {
  let timer: number | null = null
  return (...args: any) => {
    if (timer) clearInterval(timer)
    if (immediate) {
      if (!timer) func.apply(this, args)
      timer = window.setTimeout(() => {
        timer = null
      }, time)
    } else {
      timer = window.setTimeout(() => {
        func.apply(this, args)
      }, time)
    }
  }
}

/**
 * 时间格式化
 * @param {Date} date
 * @param {String} format
 * @param {Boolean} immediate
 * @return {*}
 */
export function formatDate(date: Date | string, format: string) {
  if (!date) return
  if (!format) format = 'yyyy-MM-dd'
  switch (typeof date) {
    case 'string':
      date = new Date(date.replace(/-/, '/'))
      break
    case 'number':
      date = new Date(date)
      break
  }
  if (!(date instanceof Date)) return
  let dict: any = {
    yyyy: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    H: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    MM: ('' + (date.getMonth() + 101)).substr(1),
    dd: ('' + (date.getDate() + 100)).substr(1),
    HH: ('' + (date.getHours() + 100)).substr(1),
    mm: ('' + (date.getMinutes() + 100)).substr(1),
    ss: ('' + (date.getSeconds() + 100)).substr(1)
  }
  return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
    return dict[arguments[0]]
  })
}

/**
 * 将一维数组转化成树状解构
 * @param {Array} data list数据
 * @param {String} id 主键ID
 * @param {String} parentId 上级ID
 * @param {String} childrenKey 子list数据的key
 */

export function arrayToTree(data: any[], id = 'id', parentId = 'parentId', childrenKey = 'children') {
  let res = []
  let temp: any = {}
  for (let i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (let k = 0; k < data.length; k++) {
    if (temp[data[k][parentId]] && data[k][id] !== data[k][parentId]) {
      if (!temp[data[k][parentId]][childrenKey]) {
        temp[data[k][parentId]][childrenKey] = []
      }
      if (!temp[data[k][parentId]]['_level']) {
        temp[data[k][parentId]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][parentId]]._level + 1
      temp[data[k][parentId]][childrenKey].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}
