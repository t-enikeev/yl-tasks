import React from "react";
import propTypes from "prop-types";
import "./styles.css";
import numberFormat from "../../utils/number-format";
import { Link } from "react-router-dom";
import Icon, { HeartOutlined, HeartFilled } from "@ant-design/icons";

function Item({ item, onAdd, link, addFavorite, removeFavorite, isFavorite }) {
  return (
    <div className="Item">
      <div className="Item__number">{item._key}</div>
      <div className="Item__title">
        <Link to={link}>{item.title}</Link>
      </div>
      <div className="Item__right">
        <div className="Item__price">{numberFormat(item.price)} ₽</div>
        <button onClick={() => onAdd(item._id)}>Добавить</button>
        {isFavorite ? (
          <button className="Item__favorite" onClick={() => removeFavorite(item._id)}>
            <HeartFilled style={{ color: "red" }} />
          </button>
        ) : (
          <button className="Item__favorite" onClick={() => addFavorite(item._id)}>
            <HeartOutlined />
          </button>
        )}
      </div>
    </div>
  );
}

Item.propTypes = {
  item: propTypes.object.isRequired,
  onAdd: propTypes.func,
  addFavorite: propTypes.func,
  removeFavorite: propTypes.func,
  link: propTypes.string,
};

Item.defaultProps = {
  onAdd: () => {},
  link: "",
};

export default React.memo(Item);
