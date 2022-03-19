import React, { useCallback, useEffect, useState } from "react";
import Layout from "../../components/layout";
import Header from "../../containers/header";
import Spinner from "../../components/spinner";
import LayoutHeader from "../../components/layout-header";
import { Form, Button, Input, Upload } from "antd";
import useStore from "../../utils/use-store";
import useSelector from "../../utils/use-selector";
import ProfileForm from "../../components/profile-form";
import moment from "moment";
import useInit from "../../utils/use-init";
import Chat from "../../containers/chat";

function ChatPage() {
  const store = useStore();

  useInit(async () => {
    store.chat.init();
  });

  const render = {
    LayoutHead: (
      <LayoutHeader>
        <h1>{"Чат"}</h1>
      </LayoutHeader>
    ),
  };

  return (
    <Layout head={render.LayoutHead}>
      <Header />
      <Chat />
    </Layout>
  );
}

export default React.memo(ChatPage);
