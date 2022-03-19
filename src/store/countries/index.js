import StoreModule from "../module";

class CountriesStore extends StoreModule {
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

    const json = await this.api.GET(
      "/api/v1/countries?limit=*&fields=_id,title,code&sort=title.ru"
    );
    result.items = json.result.items;

    this.updateState(result);
  }
}

export default CountriesStore;
