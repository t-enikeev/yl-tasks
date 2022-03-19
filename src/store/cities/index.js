import StoreModule from "../module";

class CitiesStore extends StoreModule {
  constructor(store, name) {
    super(store, name);
    this.api = this.services.getApi();
  }

  /**
   * Начальное состояние
   */
  initState() {
    return {
      waiting: true,
      items: [],
    };
  }

  async load() {
    const result = {
      waiting: false,
    };

    const json = await this.api.GET("/api/v1/cities");
    result.items = json.result.items;

    this.updateState(result);
  }
}

export default CitiesStore;
