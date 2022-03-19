import React, { useCallback, useMemo } from "react";
import Menu from "../../components/menu";
import BasketSimple from "../../components/basket-simple";
import LayoutSides from "../../components/layout-sides";
import useSelector from "../../utils/use-selector";
import useStore from "../../utils/use-store";
import propTypes from "prop-types";

function Header({ extraOptions }) {
  const select = useSelector((state) => ({
    amount: state.basket.amount,
    sum: state.basket.sum,
  }));

  const options = {
    menuItems: useMemo(
      () => [
        { key: 1, title: "Главная", link: "/" },
        { key: 2, title: "Чат", link: "/private/chat" },
      ],
      []
    ),

    ...extraOptions,
  };

  const store = useStore();

  const callbacks = {
    openModal: useCallback(() => store.modals.open("basket"), [store]),
  };

  return (
    <LayoutSides
      left={<Menu items={options.menuItems} />}
      right={<BasketSimple onOpen={callbacks.openModal} amount={select.amount} sum={select.sum} />}
    />
  );
}

Header.defaultProps = {
  extraOptions: propTypes.array,
};

export default React.memo(Header);
