import React, { useCallback, useMemo } from "react";
import useSelector from "../../utils/use-selector";
import useStore from "../../utils/use-store";
import Select from "../../components/select";
import LayoutTools from "../../components/layout-tools";
import Input from "../../components/input";
import { Checkbox } from "antd";

function CatalogFilter() {
  const store = useStore();

  const select = useSelector((state) => ({
    sort: state.catalog.params.sort,
    query: state.catalog.params.query,
    favorite: state.catalog.params.favorite,
    userId: state.session.user?._id,
  }));

  // Опции для полей
  const options = {
    sort: useMemo(
      () => [
        { value: "key", title: "По коду" },
        { value: "title.ru", title: "По именованию" },
        { value: "-price", title: "Сначала дорогие" },
        { value: "edition", title: "Древние" },
      ],
      []
    ),
  };

  const callbacks = {
    onSort: useCallback((sort) => store.catalog.setParams({ sort }), [store]),
    onSearch: useCallback((query) => store.catalog.setParams({ query, page: 1 }), [store]),
    onReset: useCallback(() => store.catalog.resetParams(), [store]),
    onChangeFavorites: useCallback(
      (e) => store.catalog.selectFavorites(e.target.checked, select.userId),
      [select.userId]
    ),
  };
  return (
    <LayoutTools>
      <Input onChange={callbacks.onSearch} value={select.query} placeholder={"Поиск"} theme="big" />
      <label>Сортировка:</label>
      <Select onChange={callbacks.onSort} value={select.sort} options={options.sort} />
      <Checkbox onChange={callbacks.onChangeFavorites} defaultChecked={select.favorite}>
        Избранное
      </Checkbox>
      <button onClick={callbacks.onReset}>Сбросить</button>
    </LayoutTools>
  );
}

export default React.memo(CatalogFilter);
