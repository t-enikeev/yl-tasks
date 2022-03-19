import React, { useMemo } from "react";
import { Avatar } from "antd";

import "./style.css";
import moment from "moment";
import { CheckCircleOutlined, CheckOutlined } from "@ant-design/icons";

const ChatMessage = ({ data, userId }) => {
  const { _id, text, author, dateCreate, confirmation } = data;
  const time = new Date(data.timestamp);
  const outline = data.author._id === userId ? "Outcoming" : "Incoming";
  // moment(data.timestamp).format("HH:MM:ss DD-MM-YYYY");

  const render = {
    sendingStatus: () => (
      <div className={"ChatMessage__status"}>
        {data.confirmation ? <CheckCircleOutlined /> : <CheckOutlined />}
      </div>
    ),
  };

  return (
    <div className={`ChatMessage`}>
      <Avatar src={author.profile?.avatar?.url} alt="user-avatar" />
      <div className={`ChatMessage__content ${outline}`}>
        <div className={"ChatMessage__header"}>
          <div className="left">
            <span className={"ChatMessage__username"}>{author.profile?.name}</span>
          </div>
          <div className="right">
            <span className={"ChatMessage__createdAt"}>
              {moment(dateCreate).format("HH:mm:ss DD-MM-YYYY")}
            </span>
          </div>
        </div>
        <p className={"ChatMessage__text"}>{text}</p>
        {data.author._id === userId && render.sendingStatus()}
      </div>
    </div>
  );
};

export default React.memo(ChatMessage);
