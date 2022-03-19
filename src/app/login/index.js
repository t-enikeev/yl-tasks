import React, { useCallback, useState } from "react";
import Layout from "../../components/layout";
import useStore from "../../utils/use-store";
import useSelector from "../../utils/use-selector";
import Header from "../../containers/header";
import { Form, Input, Checkbox, Button } from "antd";
import LayoutHeader from "../../components/layout-header";

function Login() {
  const store = useStore();

  const select = useSelector((state) => ({ session: state.session }));

  const callbacks = {
    onFinish: useCallback((values) => {
      store.session.login(values);
    }, []),
    onFinishFailed: useCallback((errorInfo) => {
      console.log("Failed:", errorInfo);
    }, []),
  };

  const render = {
    loginError: () => {
      const message = select.session.error.message;
      const errors = select.session.error.data.issues;

      return (
        <div>
          <h5>{message}</h5>
          {errors.map((error) => (
            <span>{error.message}</span>
          ))}
        </div>
      );
    },
    head: () => (
      <LayoutHeader>
        <h1>Авторизация</h1>
      </LayoutHeader>
    ),
  };

  return (
    <Layout head={render.head()}>
      <Header />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Form
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={callbacks.onFinish}
          onFinishFailed={callbacks.onFinishFailed}
        >
          {Object.keys(select.session.error).length !== 0 && render.loginError()}

          <Form.Item
            label="Логин"
            name="login"
            rules={[{ required: true, message: "Введите логин!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: "Введите пароль!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Запомнить меня</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
}

export default React.memo(Login);
