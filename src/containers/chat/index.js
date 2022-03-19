import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../components/layout";
import Header from "../../containers/header";
import Spinner from "../../components/spinner";
import LayoutHeader from "../../components/layout-header";
import { Form, Button, Input, Upload, Alert } from "antd";
import useStore from "../../utils/use-store";
import useSelector from "../../utils/use-selector";
import ProfileForm from "../../components/profile-form";
import moment from "moment";
import useInit from "../../utils/use-init";
import CommentEditor from "../../components/comment-editor";
import { SendOutlined } from "@ant-design/icons";
import MessagesTable from "../../components/chat-table";
import "./styles.css";
import { v4 } from "uuid";
import ChatEditor from "../../components/chat-editor";
import ChatWrapper from "../../components/chat-wrapper";

function Chat() {
  const store = useStore();
  const scrollRef = useRef();

  const [messageInput, setMessageInput] = useState("");
  const [scroll, setScroll] = useState({ top: 0, bottom: 0, height: 0 });

  const select = useSelector((state) => ({
    user: state.session.user,
    messages: state.chat.messages,
    error: state.chat.error,
    isOnline: state.chat.isOnline,
    queueMessages: state.chat.queueMessages,
  }));
  const { profile, _id } = select.user;

  const callbacks = {
    pushMessage: useCallback(
      (e) => {
        e.preventDefault();
        store.chat.pushMessageInCache({
          _key: v4(),
          text: messageInput,
          author: {
            _id,
            username: select.user.username,
            profile: {
              name: profile.name,
              avatar: { url: profile.avatar.url, _id: profile.avatar._id },
            },
          },
        });
      },
      [messageInput, select.user]
    ),

    removeAlert: useCallback(() => store.chat.removeError(), [select]),
  };

  useEffect(async () => {
    if (select.isOnline === true) {
      if (!!select.queueMessages[0]) {
        const message = select.queueMessages[0];
        store.chat.send(message);
        setMessageInput("");
      }
    }
  }, [select.queueMessages]);

  useEffect(() => {
    if (scrollRef?.current) {
      if (scroll.bottom > scroll.height - 240) {
        scrollRef.current.lastChild?.scrollIntoView(false);
      }
    }
  }, [select.messages]);

  const render = {
    error: useMemo(() => {
      return (
        select.error && (
          <Alert
            message={"Something happened... Something horrible..."}
            description={select.error.message}
            type="error"
            closable
            onClose={callbacks.removeAlert}
          />
        )
      );
    }, [select.error]),
  };

  return (
    <ChatWrapper>
      {render.error}
      <MessagesTable
        messages={Object.values(select.messages)}
        userId={_id}
        setScroll={setScroll}
        scrollRef={scrollRef}
        loadOld={() => store.chat.getOldMessages()}
      />
      <ChatEditor
        pushMessage={callbacks.pushMessage}
        setMessageInput={setMessageInput}
        messageInput={messageInput}
      />
    </ChatWrapper>
  );
}

export default React.memo(Chat);
