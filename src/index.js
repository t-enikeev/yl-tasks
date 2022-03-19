import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
import ServicesProvider from "./provider";
import Services from "./services";

const root = document.getElementById("app");

// Состояние приложения
const services = new Services();

// Сообщаем реакту что и куда рендерить.
ReactDOM.render(
  <ServicesProvider services={services}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ServicesProvider>,
  root
);
