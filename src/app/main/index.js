import React from "react";
import Layout from "../../components/layout";
import useStore from "../../utils/use-store";
import Header from "../../containers/header";
import CatalogFilter from "../../containers/catalog-filter";
import CatalogList from "../../containers/catalog-list";
import useInit from "../../utils/use-init";
import LayoutHeader from "../../components/layout-header";

function Main() {
  const store = useStore();

  // Загрузка тестовых данных при первом рендере
  useInit(
    async () => {
      await store.modals.initParams();
      await store.catalog.initParams();
      await store.basket.initParams();
    },
    [],
    { backForward: true }
  );

  return (
    <Layout
      head={
        <LayoutHeader>
          <h1>Магазин</h1>
        </LayoutHeader>
      }
    >
      <Header />
      <CatalogFilter />
      <CatalogList />
    </Layout>
  );
}

export default React.memo(Main);
