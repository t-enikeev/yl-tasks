import StoreModule from "../module";
import qs from "qs";

const QS_OPTIONS = {
  stringify: {
    addQueryPrefix: true,
    arrayFormat: "comma",
    encode: false,
  },
  parse: {
    ignoreQueryPrefix: true,
    comma: true,
  },
};

class CatalogStore extends StoreModule {
  constructor(store, name) {
    super(store, name);
    this.api = this.services.getApi();
  }
  /**
   * Начальное состояние
   */
  initState() {
    return {
      items: [],
      count: 0,
      params: {
        page: 1,
        limit: 10,
        sort: "key",
        query: "",
        favorite: false,
      },
      waiting: true,
      favorites: [],
    };
  }

  /**
   * Инициализация параметров.
   * Восстановление из query string адреса
   * @param params
   * @return {Promise<void>}
   */
  async initParams(params = {}) {
    // Параметры из URl. Их нужно валидирвать, приводить типы и брать толкьо нужные
    const urlParams = qs.parse(window.location.search, QS_OPTIONS.parse) || {};
    console.log("params catalog", urlParams);

    let validParams = {};
    if (urlParams.page) validParams.page = Number(urlParams.page) || 1;
    if (urlParams.limit) validParams.limit = Number(urlParams.limit) || 10;
    if (urlParams.sort) validParams.sort = urlParams.sort;
    if (urlParams.query) validParams.query = urlParams.query;
    if (urlParams.favorite) validParams.favorite = urlParams.favorite !== "false";
    // Итоговые параметры из начальных, из URL и из переданных явно
    const prevParams = Object.fromEntries(
      window.location.search
        .slice(1)
        .split("&")
        .map((value) => value.split("="))
    );

    const newParams = { ...prevParams, ...this.initState().params, ...validParams, ...params };
    // Установка параметров и подгрузка данных
    await this.setParams(newParams, true);
  }

  /**
   * Сброс параметров к начальным
   * @param params
   * @return {Promise<void>}
   */
  async resetParams(params = {}) {
    // Итоговые параметры из начальных, из URL и из переданных явно
    const newParams = { ...this.initState().params, ...params };
    // Установк параметров и подгрузка данных
    await this.setParams(newParams);
  }

  /**
   * Загрузка списка товаров
   */
  async setParams(params = {}, historyReplace = false) {
    const newParams = { ...this.getState().params, ...params };

    this.setState({
      ...this.getState(),
      params: newParams,
      waiting: true,
    });

    const skip = (newParams.page - 1) * newParams.limit;
    const json = await this.api.GET(
      `/api/v1/articles?limit=${newParams.limit}&skip=${skip}&fields=items(*),count&sort=${newParams.sort}&search[query]=${newParams.query}&search[favorite]=${newParams.favorite}`
    );
    const catalogItems = json.result?.items;
    this.setState({
      ...this.getState(),
      items: catalogItems,
      count: json.result.count,
      favorites: [
        ...this.getState().favorites,
        ...catalogItems
          .filter((item) => {
            if (item.isFavorite === true) {
              return item._id;
            }
          })
          .map((item) => item._id),
      ],
      waiting: false,
    });

    // Запоминаем параметры в URL
    let queryString = qs.stringify(newParams, QS_OPTIONS.stringify);
    const url = window.location.pathname + queryString + window.location.hash;
    if (historyReplace) {
      window.history.replaceState({}, "", url);
    } else {
      window.history.pushState({}, "", url);
    }
  }

  async addFavorite(id, userId = null) {
    this.updateState({
      favorites: [...this.getState().favorites, id],
    });
    if (userId) {
      const json = await this.api.PUT(`/api/v1/articles/${id}/favorite`);
    } else {
      const favoritesIds = localStorage.getItem("favorites");
      // if (!favoritesIds.includes(id)) {
      localStorage.setItem("favorites", [favoritesIds, id]);

      // }
    }
  }
  async removeFavorite(id, userId = null) {
    const filteredState = this.getState().favorites.filter((itemId) => itemId !== id);
    this.updateState({
      favorites: [...filteredState],
    });

    if (userId) {
      const json = await this.api.DELETE(`/api/v1/articles/${id}/favorite`);
    } else {
      const favoritesIds = localStorage
        .getItem("favorites")
        .split(",")
        .filter((itemId) => itemId !== id);
      localStorage.setItem("favorites", [favoritesIds]);
    }
  }

  async syncFavorites(userId) {
    const favoritesArr = localStorage.getItem("favorites")
      ? localStorage
          .getItem("favorites")
          .split(",")
          .filter((item) => item)
      : [];
    if (favoritesArr.length > 0) {
      if (userId) {
        try {
          const { result, error } = await this.api.GET(
            `/api/v1/articles?search[ids]=${favoritesArr.join("|")}`
          );
          result.items.map(async (article) => {
            await this.addFavorite(article._id, userId);
          });
          localStorage.removeItem("favorites");
        } catch (e) {
          console.error(e);
        }
      } else {
        const favoritesArr = localStorage.getItem("favorites")
          ? localStorage
              .getItem("favorites")
              .split(",")
              .filter((item) => item)
          : [];

        this.updateState({
          favorites: [...favoritesArr],
        });
      }
    }
  }

  cleanFavorites() {
    this.updateState({ favorites: [] });
  }

  async selectFavorites(isChecked, userId = null) {
    if (isChecked) {
      if (userId) {
        try {
          this.setParams({ favorite: isChecked, page: 1 });
          const { result, error } = await this.api.GET(`/api/v1/articles?search[favorite]=true`);
          if (result) this.updateState({ items: result.items });
          if (error) console.warn(error);
        } catch (e) {
          console.error(e);
        }
      } else {
        const favorites = this.getState().favorites;
        const json = await this.api.GET(`/api/v1/articles?search[ids]=${favorites.join("|")}`);
        this.updateState({ items: json.result.items, count: json.result.items.length });
      }
    } else {
      if (userId) {
        this.setParams({ favorite: isChecked, page: 1 });
      } else {
        const json = this.setParams();
        this.updateState({ items: json.result?.items });
      }
    }
  }
}

export default CatalogStore;
