/**
 * 校验是否是外部链接
 * @param {String} path
 * @return {Boolean}
 */
export function isExternal(path: any) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
