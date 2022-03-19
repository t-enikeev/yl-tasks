import React, { useCallback } from "react";
import List from "../../../components/list";
import BasketTotal from "../../../components/basket-total";
import LayoutModal from "../../../components/layout-modal";
import ItemBasket from "../../../components/item-basket";
import useSelector from "../../../utils/use-selector";
import useStore from "../../../utils/use-store";
import "./style.css";

function Basket(props) {
  const select = useSelector((state) => ({
    items: state.basket.items,
    sum: state.basket.sum,
    amount: state.basket.amount,
  }));

  const store = useStore();

  const callbacks = {
    closeModal: useCallback(() => store.modals.close(props.id), []),
    requestConfirm: useCallback(async () => {
      const { status } = await store.modals.open("confirm", { props });
      if (status === true) {
        store.basket.removeAll();
      }
    }, []),
  };

  const renders = {
    itemBasket: useCallback((item) => {
      return (
        <ItemBasket item={item} link={`/articles/${item._id}`} onLink={callbacks.closeModal} />
      );
    }, []),
  };

  return (
    <LayoutModal title={"Корзина"} onClose={callbacks.closeModal}>
      <List items={select.items} renderItem={renders.itemBasket} />
      <BasketTotal amount={select.amount} sum={select.sum} />
      <button className={"delete-btn"} onClick={callbacks.requestConfirm}>
        Удалить все
      </button>
    </LayoutModal>
  );
}

export default React.memo(Basket);
