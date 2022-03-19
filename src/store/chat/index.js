import StoreModule from "../module";
import { v4 } from "uuid";
import config from "../../config";

class ChatStore extends StoreModule {
  constructor(store, name) {
    super(store, name);
  }
  /**
   * Начальное состояние
   */
  initState() {
    return {
      messages: {},
      isOnline: false,
      error: null,
      queueMessages: [],
    };
  }

  async init() {
    this.socket.init(config.chat.url);

    this.socket.onMessage((e) => {
      const data = JSON.parse(e.data);
      const state = this.getState();
      const result = {};

      switch (data.method) {
        case "auth":
          {
            if (data.payload.result === true) this.getLastMessages();
            const arrMessages = Object.values(this.getState().messages);
            if (arrMessages.length > 0) {
              const lastMessageDate = arrMessages[arrMessages.length - 1].dateCreate;
              this.getLastMessages(lastMessageDate);
            }
          }
          break;
        case "last":
          {
            const obj = {
              ...data.payload.items.reduce((acc, item) => {
                //Если такое сообщение уже есть отсеиваем его
                return { ...acc, [item._key]: { ...item, confirmation: true } };
              }, {}),
            };

            result.messages = { ...state.messages, ...obj };
          }
          break;
        case "old":
          {
            const obj = {
              ...data.payload.items.reduce((acc, item) => {
                //Если такое сообщение уже есть отсеиваем его
                return { ...acc, [item._key]: { ...item, confirmation: true } };
              }, {}),
            };

            result.messages = { ...obj, ...state.messages };
          }
          break;
        case "post":
          {
            const queue = this.getState().queueMessages;
            if (!!queue[0]) {
              if (queue[0]._key === data.payload._key) {
                result.messages = {
                  ...state.messages,
                  [data.payload._key]: { ...data.payload, confirmation: true },
                };
                const slicedMessages = queue.slice(1);
                this.setSlicedCache(slicedMessages);
              }
            }
          }
          break;
        case "clear":
          {
          }
          break;
      }

      result.isOnline = true;
      result.error = null;

      this.updateState(result);
    });

    this.socket.onClose((e) => {
      if (e.wasClean) {
        console.log("Соединение закрыто");
        this.updateState({ isOnline: false });
      } else {
        this.init("ws://example.front.ylab.io/chat");
        console.log("Обрыв соединения. Подключение...");
      }
    });

    this.socket.onError((e) => {
      this.updateState({ error: { ...e, message: "Произошел обрыв соединения" }, isOnline: false });
    });

    this.socket.onOpen(async (e) => {
      console.log("Opening...", e);
      await this.socket.send({
        method: "auth",
        payload: {
          token: this.api.token,
        },
      });

      this.updateState({ isOnline: true, error: null });
    });
  }

  pushMessageInCache(data) {
    this.updateState({ queueMessages: [...this.getState().queueMessages, data] });
  }

  setSlicedCache(data) {
    this.updateState({ queueMessages: [...data] });
  }

  getLastMessages(fromDate) {
    this.socket.send({
      method: "last",
      payload: fromDate ? { fromDate: fromDate } : {},
    });
  }

  getOldMessages() {
    const idOfOldest = Object.values(this.getState().messages)[0]._id;
    this.socket.send({
      method: "old",
      payload: {
        fromId: idOfOldest,
      },
    });

    // fromDate не обязателен, если не указан то загрузятся 10 самых свежих.
    // Если указан, то все свежие начиная с даты.
  }

  async send(data) {
    const result = {};
    if (this.getState().isOnline === true) {
      this.socket.send({
        method: "post",
        payload: {
          ...data,
        },
      });
    } else {
      result.queueMessages = [...this.getState().queueMessages, data];
    }

    result.messages = {
      ...this.getState().messages,
      [data._key]: { ...data, confirmation: false },
    };

    this.updateState(result);
  }

  removeError() {
    this.updateState({ error: null });
  }
}

export default ChatStore;
