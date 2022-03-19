class Sockets {
  /**
   *
   * @param services {Services}
   */
  constructor(services) {
    this.services = services;
    this.sockets = null;
  }

  async init(url) {
    console.log("Initialize websocket...");
    this.sockets = new WebSocket(url);
  }

  async onOpen(func) {
    if (func) {
      this.sockets.onopen = func;
    }
  }

  async onMessage(func) {
    if (func) {
      this.sockets.onmessage = func;
    } else {
      this.sockets.onmessage = (e) => e.data;
    }
  }

  async onError(func) {
    if (func) {
      this.sockets.onerror = func;
    }
  }
  async onClose(func) {
    console.log("Connection closing!");
    if (func) {
      this.sockets.onclose = func;
    }
  }

  async send(data) {
    this.sockets.send(JSON.stringify(data));
  }

  async close(code = 1000, reason) {
    this.sockets.close(code, reason);
  }
}

export default Sockets;
