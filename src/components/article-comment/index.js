import React, { useCallback, useEffect, useState } from "react";
import { Comment, Avatar, Popconfirm } from "antd";
import propTypes from "prop-types";
import CommentEditor from "../comment-editor";
import "./style.css";

function ArticleComment({ data, handleReply, handleDelete, handleEdit, isAuthed }) {
  const [editorStatus, setEditorStatus] = useState(false);
  const [editorConfig, setEditorConfig] = useState({ format: "create", value: "" });

  const callbacks = {
    changeEditorStatus: useCallback(
      (value = "", format = "create") => {
        setEditorStatus(!editorStatus);
        if (value) {
          setEditorConfig({ value: value, format: format });
        } else {
          setEditorConfig({ format: format, value: "" });
        }
      },
      [editorConfig, editorStatus]
    ),

    onSubmitNewComment: useCallback(
      (e) => {
        handleReply(e.target.value, { _id: data._id, _type: data._type });
        setEditorStatus(!editorStatus);
      },
      [editorStatus]
    ),
    onEdit: useCallback(
      (e) => {
        handleEdit(data._id, e.target.value);
        setEditorStatus(!editorStatus);
      },
      [editorStatus]
    ),
    onDelete: useCallback(() => handleDelete(data._id), [data]),
  };

  const actions =
    data.isDeleted === false
      ? [
          [
            <button className={"CommentBtn"} onClick={callbacks.changeEditorStatus} key={1}>
              Ответить
            </button>,
            <button
              className={"CommentBtn"}
              onClick={() => {
                callbacks.changeEditorStatus(data.text, "edit");
              }}
              key={2}
            >
              Редактировать
            </button>,
            <Popconfirm
              placement="bottom"
              title={"Вы уверены что хотите удалить этот комментарий?"}
              onConfirm={callbacks.onDelete}
              okText="Да"
              cancelText="Отменить"
            >
              <button className={"CommentBtn"} key={3}>
                Удалить
              </button>
            </Popconfirm>,
            ,
          ],
        ]
      : [];

  const findDeeply = (item) => {
    if (item.isDeleted === true) {
      if (typeof item.children !== "undefined" && item.children.length > 0) {
        for (let i in item.children) {
          if (findDeeply(item.children[i])) {
            return true;
          }
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  if (data.isDeleted === true) {
    if (!findDeeply(data)) return null;
  }

  return (
    <div>
      <Comment
        actions={isAuthed ? actions : []}
        author={data.author.username}
        avatar={<Avatar src={data.author.profile?.avatar?.url} alt="user-avatar" />}
        content={<p>{data.text}</p>}
      >
        {editorStatus && (
          <CommentEditor
            changeEditorStatus={callbacks.changeEditorStatus}
            onSubmit={(value) => callbacks.onSubmitNewComment(value)}
            onEdit={(value) => callbacks.onEdit(value)}
            editorConfig={editorConfig}
            value={typeof editorConfig.value === "string" ? editorConfig.value : ""}
          />
        )}
        {data.children.map((commentData) => {
          return (
            <ArticleComment
              key={commentData.order}
              data={commentData}
              handleReply={handleReply}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              isAuthed={isAuthed}
            />
          );
        })}
      </Comment>
    </div>
  );
}
Comment.propTypes = {
  data: propTypes.object.isRequired,
  handleReply: propTypes.func,
  handleDelete: propTypes.func,
  handleEdit: propTypes.func,
};

export default ArticleComment;
