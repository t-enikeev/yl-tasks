import Store from "./store";
import * as modules from "./store/exports";
import API from "./api";
import Sockets from "./sockets";

class Services {
  getStore() {
    if (!this.store) {
      this.store = new Store(this, modules);
    }
    return this.store;
  }

  getApi() {
    if (!this.api) {
      this.api = new API(this);
    }
    return this.api;
  }
  getSockets() {
    if (!this.sockets) {
      this.sockets = new Sockets(this);
    }
    return this.sockets;
  }
}

export default Services;
