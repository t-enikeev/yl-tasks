import React, { createRef, useState } from "react";
import ChatMessage from "../chat-message";
import "./style.css";

const MessagesTable = ({ messages, userId, loadOld, setScroll, scrollRef }) => {
  const handleScroll = (e) => {
    setScroll({
      top: e.target.scrollTop,
      bottom: e.target.scrollTop + e.target.clientHeight,
      height: e.target.scrollHeight,
    });

    // if (e.target.scrollTop + e.target.clientHeight > e.target.scrollHeight - 180) {
    //   console.log("scroll");
    // }

    if (e.target.scrollTop < 300) {
      loadOld();
      e.target.scrollBy(0, 0);
    }
  };

  return (
    <div className="ChatTable" onScroll={handleScroll} ref={scrollRef}>
      {messages.map((message) => (
        <ChatMessage key={message._key} data={message} userId={userId} />
      ))}
    </div>
  );
};

export default React.memo(MessagesTable);
