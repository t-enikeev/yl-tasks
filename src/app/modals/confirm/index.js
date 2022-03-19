import React, { createRef, useCallback } from "react";
import LayoutModal from "../../../components/layout-modal";
import useSelector from "../../../utils/use-selector";
import useStore from "../../../utils/use-store";

function Confirm({ id, params }) {
  const store = useStore();
  const modalRef = createRef();
  const select = useSelector((state) => ({
    modals: state.modals.items,
  }));
  const callbacks = {
    handleClose: useCallback(() => store.modals.close(id, { status: false }), [select]),
    handleSuccess: useCallback(() => {
      store.modals.close(id, { status: true });
    }, [select]),
  };

  return (
    <LayoutModal title={"Подтверждение"} onClose={callbacks.handleClose} closeOnClickOutside={true}>
      <div style={{ textAlign: "center" }}>
        <h3>Нажмите да если да и нет если нет</h3>
        <button onClick={callbacks.handleSuccess}>Да</button>
      </div>
    </LayoutModal>
  );
}

export default React.memo(Confirm);
