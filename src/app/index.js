import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./main";
import Basket from "./modals/basket";
import useSelector from "../utils/use-selector";
import Article from "./article";
import Login from "./login";
import useInit from "../utils/use-init";
import useStore from "../utils/use-store";
import Protected from "../containers/protected";
import Modals from "./modals";
/**
 * Приложение
 */
function App() {
  const store = useStore();

  const select = useSelector((state) => ({
    name: state.modals.name,
    userId: state.session.user?._id,
  }));

  useInit(async () => {
    await store.session.loginWithToken();
  }, []);
  useEffect(async () => {
    await store.catalog.syncFavorites(select.userId);
  }, [select.userId]);

  return (
    <>
      <Routes>
        <Route path={""} element={<Main />} />
        <Route path={"/articles/:id"} element={<Article />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/private/*"} element={<Protected />} />
      </Routes>
      {/*{select.name === "basket" && <Basket />}*/}
      <Modals />
    </>
  );
}

export default React.memo(App);
