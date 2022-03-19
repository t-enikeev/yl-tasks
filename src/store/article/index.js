import StoreModule from "../module";
import { findInTreeAndAddChild, findInTreeAndPatch } from "../../utils/transform-tree";

class ArticleStore extends StoreModule {
  constructor(store, name) {
    super(store, name);
    this.api = this.services.getApi();
  }
  /**
   * Начальное состояние
   */
  initState() {
    return {
      data: {},
      waiting: true,
      comments: [],
    };
  }

  /**
   * Загрузка списка товаров
   */
  async load(id) {
    this.updateState({
      waiting: true,
      data: {},
    });

    try {
      const json = await this.api.GET(
        `/api/v1/articles/${id}?fields=*,maidIn(title,code),category(title)`
      );
      if (json.error) throw new Error(json.error);

      this.updateState({
        data: json.result,
        waiting: false,
      });
    } catch (e) {
      this.updateState({
        data: {},
        waiting: false,
      });
    }
  }
  async loadComments(id) {
    try {
      const url = `/api/v1/comments?fields=*,author(_id, username,profile(avatar(_id, url))),isDeleted(true)&limit=*&search[parent]=${id}`;
      const { result, error } = await this.api.GET(url);
      if (result) this.updateState({ comments: [...result.items] });
      if (error) console.error(e);
    } catch (e) {
      console.error(e);
    }
  }

  async addComment(authorId, text, parent) {
    try {
      const { result, error } = await this.api.POST(
        `/api/v1/comments?fields=*,author(_id, username, profile(avatar(_id, url)))`,
        {
          body: JSON.stringify({ id: authorId, text: text, parent: { ...parent } }),
        }
      );
      if (result) {
        const comments = this.getState().comments;
        const updatedComments = [...comments, result];
        this.updateState({ comments: updatedComments });
      }
      if (error) console.warn(error);
    } catch (e) {
      console.error(e);
    }
  }
  async editComment(id, text) {
    try {
      const { result, error } = await this.api.PUT(
        `/api/v1/comments/${id}?fields=*,author(_id, username, profile(avatar(_id, url)))`,
        {
          body: JSON.stringify({ text: text }),
        }
      );
      if (result) {
        const comments = this.getState().comments;
        const updatedComments = comments.map((item) => (item._id !== id ? item : result));

        this.updateState({ comments: [...updatedComments] });
      }
      if (error) console.warn(error);
    } catch (e) {
      console.error(e);
    }
  }

  async removeComment(id) {
    try {
      const { result, error } = await this.api.DELETE(`/api/v1/comments/${id}`);
      if (result) {
        const comments = this.getState().comments;
        this.editComment(id, "");
        const updatedComments = comments.map((item) =>
          item._id !== id ? item : { ...item, text: "", isDeleted: true }
        );

        this.updateState({ comments: updatedComments });
      }
      if (error) console.warn(error);
    } catch (e) {
      console.error(e);
    }
  }
}

export default ArticleStore;
