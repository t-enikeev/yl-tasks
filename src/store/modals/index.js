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

class ModalsStore extends StoreModule {
  /**
   * Начальное состояние
   */
  initState() {
    return {
      items: {},
      params: {
        modals: [],
      },
    };
  }

  async initParams(params) {
    const urlParams = qs.parse(window.location.search, QS_OPTIONS.parse) || {};
    let validParams = {};
    if (urlParams.modals) validParams.modals = urlParams.modals || "";

    const prevParams = Object.fromEntries(
      window.location.search
        .slice(1)
        .split("&")
        .map((value) => value.split("="))
    );

    const newParams = {
      ...prevParams,
      ...this.initState().params,
      ...validParams,
      ...params,
    };
    const items = typeof newParams.modals === "string" ? [newParams.modals] : [...newParams.modals];

    items.map((name) => this.open(name));
  }

  async open(name, params) {
    const prevParams = Object.fromEntries(
      window.location.search
        .slice(1)
        .split("&")
        .map((value) => value.split("="))
    );
    const newParams = {
      ...prevParams,
      modals: !prevParams.modals?.includes(name) ? [prevParams.modals, name] : [prevParams.modals],
    };

    let queryString = qs.stringify(newParams, QS_OPTIONS.stringify);
    const url = window.location.pathname + queryString + window.location.hash;
    window.history.replaceState({}, "", url);

    return new Promise((resolve) =>
      this.updateState({
        items: {
          ...this.getState().items,
          [Date.now()]: {
            name,
            params,
            resolve,
            show: true,
            result: null,
          },
        },
      })
    );
  }

  async close(id, result) {
    const state = this.getState();
    const modalName = state.items[id].name;
    if (state.items[id].resolve) {
      state.items[id].resolve(result);
    }
    this.updateState({
      items: {
        ...state.items,
        [id]: { ...state.items[id], show: false, result: result, resolve: null },
      },
    });
    const prevParams = Object.fromEntries(
      window.location.search
        .slice(1)
        .split("&")
        .map((value) => value.split("="))
    );

    const items =
      typeof prevParams.modals === "string"
        ? [...prevParams.modals.split(",")]
        : [...prevParams.modals];
    const newParams = {
      ...prevParams,
      modals: items.filter((name) => name !== modalName),
    };

    let queryString = qs.stringify(newParams, QS_OPTIONS.stringify);
    const url = window.location.pathname + queryString + window.location.hash;
    window.history.replaceState({}, "", url);
  }
}

export default ModalsStore;
