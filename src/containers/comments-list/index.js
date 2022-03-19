import React from "react";
import { Divider, List } from "antd";
import ArticleComment from "../../components/article-comment";
import { Comment } from "antd";
import propTypes from "prop-types";
import "./style.css";
import useStore from "../../utils/use-store";
import { makeTree } from "../../utils/transform-tree";
import CommentEditor from "../../components/comment-editor";

function CommentsList({ comments, handleReply, handleDelete, handleEdit, article, isAuthed }) {
  const commentsTree = makeTree(comments);

  return (
    <div className={"CommentList"}>
      {isAuthed ? (
        <CommentEditor
          onSubmit={(e) => {
            handleReply(e.target.value, { _id: article._id, _type: "article" });
          }}
        />
      ) : (
        <h4>Авторизуйтесь чтобы оставлять комментарии</h4>
      )}
      <List>
        {commentsTree.map((comment) => {
          return (
            <ArticleComment
              key={comment.order}
              data={comment}
              handleReply={handleReply}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              isAuthed={isAuthed}
            />
          );
        })}
      </List>
    </div>
  );
}
CommentsList.propTypes = {
  comments: propTypes.array.isRequired,
  handleReply: propTypes.func,
  handleDelete: propTypes.func,
};

export default CommentsList;
