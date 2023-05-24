export default class SocketService {
  // socket 连接url
  url: string = ''
  // socket 实例
  instance!: WebSocket
  // 消息接收回调
  callback: (e: Event) => void
  // 是否用户手动关闭连接
  userClose: boolean = false
  // 是否正在重连
  isReconnect: boolean = false

  constructor(url: string, callback: (e: Event) => void) {
    this.url = url
    this.callback = callback
    this.connect()
  }
  /**
   * 创建连接
   */
  connect() {
    try {
      this.userClose = false
      this.instance = new WebSocket(this.url)
      this.initEventHandle()
    } catch (e) {
      console.log(e)
    }
  }
  /**
   * 回调事件初始化
   */
  initEventHandle() {
    const _this = this
    // 连接成功
    this.instance.onopen = function () {
      console.log('websocket 连接成功')
    }
    // 关闭链接
    this.instance.onclose = function () {
      if (!_this.userClose) {
        // 非用户手动关闭
        _this.reconnect()
      }
    }
    // 连接失败
    this.instance.onerror = function () {
      if (!_this.userClose) {
        // 非用户手动关闭
        _this.reconnect()
      }
    }
    // 消息接收
    this.instance.onmessage = function (e) {
      _this.callback(e)
    }
  }
  /**
   * 重新连接
   */
  reconnect() {
    this.close()
    const _this = this
    if (this.isReconnect) {
      return
    }
    this.isReconnect = true
    setTimeout(function () {
      _this.connect()
      _this.isReconnect = false
    }, 3000)
  }
  /**
   * 发送消息
   * @param {Object} message
   */
  sendMessage<T>(message: T) {
    this.instance.send(JSON.stringify(message))
  }
  /**
   * 关闭连接
   */
  close() {
    if (this.instance) {
      this.userClose = true
      this.instance.close()
    }
  }
}
