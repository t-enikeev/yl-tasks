/**
 * Базовый класс модуля хранилища
 */
class StoreModule {
  /**
   * @param store {Store} Ссылка на хранилище
   * @param name {String} Навзание модуля (ключ данных в state)
   */
  constructor(store, name) {
    this.services = store.services;
    this.store = store;
    this.name = name;

    this.api = this.services.getApi();
    this.socket = this.services.getSockets();
  }

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {};
  }

  /**
   * Текущее своё состояние
   * @return {*}
   */
  getState() {
    return this.store.getState()[this.name];
  }

  /**
   * Установка своего состояния
   * @param state {*}
   */
  setState(state) {
    this.store.setState({
      ...this.store.getState(),
      [this.name]: state,
    });
  }

  /**
   * Обновление состояния
   * @param patch
   */
  updateState(patch) {
    this.setState({
      ...this.getState(),
      ...patch,
    });
  }
}

export default StoreModule;
