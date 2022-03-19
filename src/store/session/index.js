import { result } from "lodash";
import StoreModule from "../module";

const ACCESS_TOKEN = "token";

class SessionStore extends StoreModule {
  constructor(store, name) {
    super(store, name);
    this.api = this.services.getApi();
  }

  /**
   * Начальное состояние
   */
  initState() {
    return {
      user: {},
      error: {},
      waiting: true,
    };
  }
  // Отправляем данные с формыЮ получаем и сохраняем токен
  /**
   * Загрузка списка товаров
   */
  async login(data) {
    this.updateState({ error: {}, waiting: true });

    // ?fields=*,profile(*,avatar(*))

    try {
      const json = await this.api.POST(`/api/v1/users/sign?fields=*,profile(*,avatar(_id, url))`, {
        body: JSON.stringify(data),
      });
      console.log(json.result);
      if (json.result) {
        this.api.setToken(json.result.token);
        localStorage.setItem(ACCESS_TOKEN, json.result.token);

        this.updateState({
          user: json.result.user,
          waiting: false,
        });
      }

      if (json.error) this.updateState({ ...json, waiting: false });
    } catch (e) {
      this.updateState({ error: e, waiting: false });
    }
  }
  async logout() {
    this.updateState({
      error: {},
      waiting: true,
    });

    let result = {
      waiting: false,
      error: "",
    };

    try {
      const json = await this.api.DELETE(`/api/v1/users/sign`);

      if (json.error) {
        result.waiting = false;
        result.waiting = null;
      } else {
        window.localStorage.removeItem(ACCESS_TOKEN);
        this.api.setToken("");
        result.user = null;
      }
    } catch (e) {
      result.waiting = false;
    }
    this.updateState(result);
  }

  async loginWithToken() {
    if (localStorage.getItem("token")) {
      try {
        this.api.setToken(localStorage.getItem(ACCESS_TOKEN));

        const json = await this.api.GET(`/api/v1/users/self?fields=*,profile(*,avatar(*))`, {});

        if (json.error) throw new Error(json.error);

        this.updateState({
          user: json.result,
          waiting: false,
        });
      } catch (e) {
        this.updateState({
          user: {},
          error: e,
          waiting: false,
        });
        console.log(e);
      }
    } else {
      this.updateState({
        user: {},
        waiting: false,
      });
    }
  }
  async updateProfile({ profile }) {
    const id = this.getState().user._id;
    this.updateState({ waiting: true });

    let normalizedData = {};
    for (let elem in profile) {
      if (profile[elem] !== false && profile[elem] !== undefined) {
        normalizedData = { ...normalizedData, [elem]: profile[elem] };
      }
    }
    try {
      const { result, error } = await this.api.PUT(
        `/api/v1/users/${id}?fields=*,profile(*,avatar(*))`,
        {
          body: JSON.stringify({ profile: normalizedData }),
        }
      );
      if (result) {
        this.updateState({
          user: result,
          waiting: false,
        });
      } else if (error) {
        this.updateState({
          error: error,
          waiting: false,
        });
      }
    } catch (e) {}
  }

  // async getImageUrl() {
  //   const id = this.getState().user.profile.avatar._id;
  //   try {
  //     const json = await this.api.GET(`/api/v1/files/${id}`);
  //     if (json.result) {
  //       const { url } = json.result;
  //       const user = this.getState().user;
  //       if (url) {
  //         this.updateState({
  //           user: {
  //             ...user,
  //             profile: { ...user.profile, avatar: { ["url"]: url, ...user.profile.avatar } },
  //           },
  //         });
  //       }
  //     } else {
  //       console.error(json.error);
  //     }
  //   } catch (e) {}
  // }
}

export default SessionStore;
