import React, { createRef } from "react";
import PropTypes from "prop-types";
import "./style.css";
import useClickOutside from "../../utils/use-click-outside";

function LayoutModal(props) {
  const modalRef = props.closeOnClickOutside ? createRef() : null;
  if (modalRef) useClickOutside(modalRef, props.onClose);

  return (
    <div className="LayoutModal">
      <div className="LayoutModal__frame" ref={props.closeOnClickOutside ? modalRef : null}>
        <div className="LayoutModal__head">
          <h1 className="LayoutModal__title">{props.title}</h1>
          <button className="LayoutModal__close" onClick={props.onClose}>
            Закрыть
          </button>
        </div>
        <div className="LayoutModal__content">{props.children}</div>
      </div>
    </div>
  );
}

LayoutModal.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

LayoutModal.defaultProps = {
  title: "Модалка",
  onClose: () => {},
};

export default React.memo(LayoutModal);
