import React, { useCallback, useEffect } from "react";
import Layout from "../../components/layout";
import useStore from "../../utils/use-store";
import useSelector from "../../utils/use-selector";
import { useParams } from "react-router-dom";
import Spinner from "../../components/spinner";
import ArticleCard from "../../components/article-card";
import Header from "../../containers/header";
import useInit from "../../utils/use-init";
import LayoutHeader from "../../components/layout-header";
import { makeTree } from "../../utils/transform-tree";
import CommentsList from "../../containers/comments-list";
import { Divider } from "antd";

function Article() {
  const store = useStore();
  // Параметры из пути
  const params = useParams();

  // Начальная загрузка

  const select = useSelector((state) => ({
    article: state.article.data,
    comments: state.article.comments,
    waiting: state.article.waiting,
    session: state.session,
  }));

  useInit(async () => {
    await store.article.load(params.id);
  }, []);
  useEffect(async () => {
    await store.article.loadComments(params.id);
  }, []);

  const callbacks = {
    addToBasket: useCallback((_id) => store.basket.add(_id), [store]),
    handleReply: useCallback(
      (text, parent) => {
        store.article.addComment(select.session?.user?._id, text, parent);
      },
      [select.session?.user?._id]
    ),
    handleEdit: useCallback(
      (id, text) => store.article.editComment(id, text),
      [select.session?.user?._id]
    ),
    handleDelete: useCallback((id) => store.article.removeComment(id), []),
  };
  console.log("in Article", select.comments);

  return (
    <Layout
      head={
        <LayoutHeader>
          <h1>{select.article.title}</h1>
        </LayoutHeader>
      }
    >
      <Header />

      <Spinner active={select.waiting}>
        <ArticleCard article={select.article} onAdd={callbacks.addToBasket} />
      </Spinner>
      <Divider />
      <CommentsList
        article={select.article}
        comments={select.comments}
        handleReply={callbacks.handleReply}
        handleDelete={callbacks.handleDelete}
        handleEdit={callbacks.handleEdit}
        isAuthed={!!select.session?.user?._id}
      />
    </Layout>
  );
}

export default React.memo(Article);
