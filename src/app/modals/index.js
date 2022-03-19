import React, { useCallback } from "react";
import * as modals from "./export.js";
import useSelector from "../../utils/use-selector";
import useStore from "../../utils/use-store";
// import useServices from "@src/utils/hooks/use-services";

function Modals() {
  const store = useStore();
  const select = useSelector((state) => ({
    modals: state.modals,
  }));

  console.log("M", select.modals);

  const callbacks = {
    /**
     * Выбор компонента окна, если нужно показывать
     * @returns {null|*}
     */

    getModal: useCallback(() => {
      const modalsArr = [];
      if (!!select.modals.items) {
        for (let i in select.modals.items) {
          console.log("select.modals.items", select.modals.items);
          const modal = select.modals.items[i];
          if (!!modal.show) {
            const Component = modals[modal.name];
            if (Component) {
              const props = { ...modal, id: i };
              modalsArr.push(<Component key={modal.name} {...props} />);
            }
          }
        }
      }

      return !!modalsArr ? modalsArr : null;
    }, [select]),
  };

  return callbacks.getModal();
}

export default React.memo(Modals);
