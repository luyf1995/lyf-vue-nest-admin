export const Local = {
  set<T>(sKey: string, val: T) {
    window.localStorage.setItem(sKey, JSON.stringify(val))
  },
  get(sKey: string) {
    const json = window.localStorage.getItem(sKey)
    return (json && JSON.parse(json)) || ''
  },
  remove(sKey: string) {
    window.localStorage.removeItem(sKey)
  },
  clear() {
    window.localStorage.clear()
  }
}

export const Session = {
  set<T>(sKey: string, val: T) {
    window.sessionStorage.setItem(sKey, JSON.stringify(val))
  },
  get(sKey: string) {
    const json = window.sessionStorage.getItem(sKey)
    return (json && JSON.parse(json)) || ''
  },
  remove(sKey: string) {
    window.sessionStorage.removeItem(sKey)
  },
  clear() {
    window.sessionStorage.clear()
  }
}
